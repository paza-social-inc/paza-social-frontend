import { format } from "date-fns";
import type { CreatorProfile } from "@/components/Dashboard/showcase/CreatorProfileModal";
import { mockCreatorProfile } from "@/components/Dashboard/showcase/showcaseData";
import type { Project, ProjectCreatorProfileRef, ProjectCreatorRef } from "@/types/projects/projectTypes";

const PLACEHOLDER_AVATAR =
  "https://images.unsplash.com/photo-1680899010894-e9838a5e70ea?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=327";

function isHttpUrl(s: string | undefined | null): boolean {
  if (!s || typeof s !== "string") return false;
  return /^https?:\/\//i.test(s.trim());
}

function socialProfileUrl(platform: string, raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  if (isHttpUrl(t)) return t;
  const p = t.replace(/^@/, "");
  switch (platform) {
    case "Instagram":
      return `https://instagram.com/${p}`;
    case "TikTok":
      return `https://www.tiktok.com/@${p}`;
    case "X / Twitter":
      return `https://twitter.com/${p}`;
    case "YouTube":
      return `https://www.youtube.com/@${p}`;
    case "LinkedIn":
      return `https://www.linkedin.com/in/${p}`;
    case "Facebook":
      return `https://www.facebook.com/${p}`;
    default:
      return `https://${t.replace(/^\/+/, "")}`;
  }
}

/**
 * Map social fields from creator_profiles into Platform stats cards for the profile modal.
 */
function buildPlatformStatsFromProfile(
  cp: ProjectCreatorProfileRef | null | undefined
): NonNullable<CreatorProfile["platformStats"]> {
  if (!cp) return [];
  const rows: NonNullable<CreatorProfile["platformStats"]> = [];
  const desc = cp.followers?.trim()
    ? `Audience / reach: ${cp.followers.trim()}`
    : "Social profile";

  const add = (platform: string, link: string | null | undefined) => {
    const raw = link?.trim();
    if (!raw) return;
    const url = socialProfileUrl(platform, raw);
    if (!url) return;
    rows.push({ platform, description: desc, link: url });
  };

  add("Instagram", cp.instagram);
  add("TikTok", cp.tiktok);
  add("X / Twitter", cp.twitter);
  add("YouTube", cp.youtube);
  add("LinkedIn", cp.linkedin);
  add("Facebook", cp.facebook);

  return rows.slice(0, 6).map((r, i) => ({ ...r, highlighted: i === 0 && rows.length > 0 }));
}

type CreatorWithExtras = ProjectCreatorRef & {
  createdAt?: string | Date;
  creatorProfile?: ProjectCreatorProfileRef | null;
  showcaseStats?: { projectsTotal?: number };
};

/**
 * Builds the full `CreatorProfile` for the showcase modal and sidebar from
 * `GET /api/creator-projects/:id` (creator + creatorProfile + showcaseStats + project media).
 */
export function buildCreatorProfileFromProject(project: Project): CreatorProfile {
  const base = mockCreatorProfile as CreatorProfile;
  const c = project.creator as CreatorWithExtras | undefined;
  if (!c?.id) {
    return { ...base };
  }

  const cp = c.creatorProfile ?? null;
  const name =
    [c.firstName, c.lastName].filter(Boolean).join(" ").trim() ||
    (c.email ? c.email.split("@")[0] : "") ||
    base.name;

  const profession =
    cp?.main?.trim() ||
    cp?.creatorname?.trim() ||
    cp?.category?.trim() ||
    "Creator";

  const reach = cp?.followers?.trim()
    ? `Reach: ${cp.followers.trim()}`
    : base.reach;

  const avatarUrl =
    (cp?.avatar && isHttpUrl(cp.avatar) ? cp.avatar.trim() : null) || PLACEHOLDER_AVATAR;

  const aboutLong = (cp?.about?.trim() || base.aboutLong) ?? "";

  const media = (project.mediaUrls ?? []).filter((u) => isHttpUrl(u));
  const coverImageUrl =
    (cp?.preview && isHttpUrl(cp.preview) ? cp.preview.trim() : undefined) ||
    media[0] ||
    base.coverImageUrl;

  const website =
    (cp?.profileUrl && isHttpUrl(cp.profileUrl) ? cp.profileUrl.trim() : undefined) || base.website;

  const galleryImages =
    media.length > 0
      ? media.slice(0, 6)
      : cp?.preview && isHttpUrl(cp.preview)
        ? [cp.preview.trim()]
        : base.galleryImages ?? [];

  const total = c.showcaseStats?.projectsTotal ?? 0;
  const projectsInProgress = total;
  const projectsFinished = 0;

  let joinDate = base.joinDate ?? "";
  if (c.createdAt) {
    try {
      joinDate = format(new Date(c.createdAt), "dd.MM.yyyy");
    } catch {
      joinDate = base.joinDate ?? "";
    }
  }

  const platformStats = buildPlatformStatsFromProfile(cp);
  const city = c.city?.trim();

  return {
    ...base,
    id: String(c.id),
    name,
    profession,
    reach,
    location: city || base.location,
    avatarUrl,
    about: aboutLong.length > 320 ? `${aboutLong.slice(0, 320)}…` : aboutLong || base.about,
    aboutLong: aboutLong || base.aboutLong,
    coverImageUrl,
    website,
    projectsFinished,
    projectsInProgress,
    joinDate,
    galleryImages,
    platformStats: platformStats.length > 0 ? platformStats : base.platformStats ?? [],

    // ── Previously dropped by the showcase pipeline (backend DTO used to
    // whitelist only ~15 legacy fields; now that it forwards everything,
    // pass it through here so the modal can render it). ──────────────────
    originStoryTags: cp?.originStoryTags ?? undefined,
    toneEmotional: cp?.toneEmotional ?? undefined,
    toneProfessional: cp?.toneProfessional ?? undefined,
    toneCultural: cp?.toneCultural ?? undefined,
    toneLifestyle: cp?.toneLifestyle ?? undefined,
    availabilityType: cp?.availabilityType ?? undefined,
    personalityTags: cp?.personalityTags ?? undefined,
    preferredCommunication: cp?.preferredCommunication ?? undefined,
    engagementType: cp?.engagementType ?? undefined,
    deliverables: cp?.deliverables ?? undefined,
    equipmentAndSoftware: cp?.equipmentAndSoftware ?? undefined,
    skillLevel: cp?.skillLevel ?? undefined,
    creatorType: cp?.creatorType ?? undefined,
    domainShards: cp?.domainShards ?? undefined,
    assetClassPrimary: cp?.assetClassPrimary ?? undefined,
    valueProp: cp?.valueProp ?? undefined,
    whatPeopleComeTo: cp?.whatPeopleComeTo ?? undefined,
    audienceDescription: cp?.audienceDescription ?? undefined,
    languages: cp?.languages ?? undefined,
    genderMale: cp?.genderMale ?? undefined,
    genderFemale: cp?.genderFemale ?? undefined,
    locales: cp?.locales ?? undefined,
    dailyRoutineText: cp?.dailyRoutineText ?? undefined,
    dailyCarryText: cp?.dailyCarryText ?? undefined,
    nostalgicProductsText: cp?.nostalgicProductsText ?? undefined,
    dreamBrandCollaboration: cp?.dreamBrandCollaboration ?? undefined,
    alwaysRecommend: cp?.alwaysRecommend ?? undefined,
    collabMindedPeople: cp?.collabMindedPeople ?? undefined,
    dreamCollaborator: cp?.dreamCollaborator ?? undefined,
    meaningfulProject: cp?.meaningfulProject ?? undefined,
    primaryVerticals: cp?.primaryVerticals ?? undefined,
  };
}
