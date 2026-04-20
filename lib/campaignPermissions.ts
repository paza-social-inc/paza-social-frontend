import type { Campaign } from "@/types/campaigns/campaignTypes";

export type CampaignActor = {
  /** Logged-in user id as string (e.g. from user.id or JWT userId). */
  userId: string;
  /** Lowercase email for matching createdby. */
  emailLower: string;
};

function idsEquivalent(a: string, b: string): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  const na = Number(a);
  const nb = Number(b);
  return Number.isFinite(na) && Number.isFinite(nb) && na === nb;
}

/**
 * Same rules everywhere: list (edit/delete), task/job campaign picker, etc.
 * Matches backend getCampaignsForOwner intent (owner id, email, or creator FK).
 */
export function canManageCampaign(campaign: Campaign, actor: CampaignActor): boolean {
  const currentUserId = String(actor.userId ?? "").trim();
  const currentUserEmail = String(actor.emailLower ?? "").trim().toLowerCase();
  /** Allow email-only match (e.g. JWT decoded for email but id missing briefly). */
  if (!currentUserId && !currentUserEmail) return false;

  const createdBy = campaign.createdby;
  const creatorId =
    campaign.creatorId ?? campaign.creator?.id;

  const createdByStr = String(createdBy ?? "").trim();
  const createdByNormalized = createdByStr.toLowerCase();

  const creatorIdStr = creatorId != null ? String(creatorId).trim() : "";

  return (
    (currentUserEmail !== "" && createdByNormalized === currentUserEmail) ||
    (currentUserId !== "" &&
      (idsEquivalent(createdByStr, currentUserId) ||
        idsEquivalent(creatorIdStr, currentUserId)))
  );
}

/**
 * True if the user appears on any campaign team (e.g. after an accepted showcase invite/proposal sync).
 * Used so collaborators see the campaign in the list even when they are not the owner/creator FK.
 */
export function isUserOnCampaignTeam(campaign: Campaign, actor: CampaignActor): boolean {
  const email = String(actor.emailLower ?? "").trim().toLowerCase();
  if (!email) return false;
  for (const team of campaign.teams ?? []) {
    for (const m of team.members ?? []) {
      const me = String(m.email ?? "").trim().toLowerCase();
      if (me && me === email) return true;
    }
  }
  return false;
}

/** Owner/manager OR roster member — campaigns list should always surface these (bypass facet filters). */
export function canSeeCampaignInMyList(campaign: Campaign, actor: CampaignActor): boolean {
  return canManageCampaign(campaign, actor) || isUserOnCampaignTeam(campaign, actor);
}
