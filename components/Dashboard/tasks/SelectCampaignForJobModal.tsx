"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { campaignApi, parseCampaignId } from "@/lib/data/campaigns";
import { projectProposalsApi } from "@/lib/data/projectProposals";
import type { Campaign } from "@/types/campaigns/campaignTypes";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { canSeeCampaignOnDashboardForActor } from "@/lib/campaignPermissions";
import {
  decodeJwtPayload,
  getAccountTypeFromPayload,
  getEmailFromPayload,
  getUserIdStringFromPayload,
} from "@/lib/jwtPayload";
import { CreateCampaignModal } from "@/components/Dashboard/Campaigns/CreateCampaignModal";

export interface SelectCampaignForJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (campaign: Campaign) => void;
}

export function SelectCampaignForJobModal({
  open,
  onOpenChange,
  onSelect,
}: SelectCampaignForJobModalProps) {
  const [createCampaignOpen, setCreateCampaignOpen] = React.useState(false);
  const { user, token } = useAuth();
  const effectiveToken =
    token ?? (typeof window !== "undefined" ? localStorage.getItem("token") : null);
  const tokenPayload = React.useMemo(
    () => decodeJwtPayload(effectiveToken),
    [effectiveToken]
  );
  const currentUserId = String(user?.id ?? getUserIdStringFromPayload(tokenPayload) ?? "");
  const currentUserEmail = String(user?.email ?? getEmailFromPayload(tokenPayload) ?? "").toLowerCase();

  const campaignActor = useMemo(
    () => ({
      userId: currentUserId.trim(),
      emailLower: currentUserEmail.trim().toLowerCase(),
    }),
    [currentUserId, currentUserEmail]
  );

  const accountType = useMemo(() => {
    const u = user as { accountType?: string; account?: { accountType?: string } } | null;
    const direct = u?.accountType ?? u?.account?.accountType;
    if (direct) return String(direct).trim();
    return getAccountTypeFromPayload(tokenPayload);
  }, [user, tokenPayload]);
  const isCreatorAccount = accountType.toLowerCase() === "creator";

  const { data: mySentProposals = [], isLoading: proposalsLoading } = useQuery({
    queryKey: ["my-showcase-proposals"],
    queryFn: () => projectProposalsApi.getMine(),
    enabled: open && !isCreatorAccount,
    staleTime: 0,
    refetchOnMount: true,
  });

  const acceptedProposalCampaignIds = useMemo(() => {
    const ids = new Set<number>();
    if (isCreatorAccount) return ids;
    for (const p of mySentProposals) {
      if (String(p.status ?? "").toLowerCase() !== "accepted") continue;
      if (!p.project?.id) continue;
      const raw = p.project.campaign_id ?? p.project.campaignId;
      if (raw == null) continue;
      const cid = Number(raw);
      if (Number.isFinite(cid) && cid > 0) ids.add(Math.floor(cid));
    }
    return ids;
  }, [mySentProposals, isCreatorAccount]);

  // Same source + visibility rules as `CampaignList`: GET all campaigns, then filter client-side.
  const { data, isLoading: campaignsLoading, isError } = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => campaignApi.getAll(),
    enabled: open,
    staleTime: 0,
  });

  const listLoading = campaignsLoading || (open && !isCreatorAccount && proposalsLoading);

  const campaigns = useMemo(() => {
    const raw = ((data ?? []) as Campaign[]).filter((c) => parseCampaignId(c.id) != null);
    return raw.filter((c) =>
      canSeeCampaignOnDashboardForActor(c, campaignActor, {
        isCreatorAccount,
        acceptedProposalCampaignIds,
      })
    );
  }, [data, campaignActor, isCreatorAccount, acceptedProposalCampaignIds]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className={cn(
            "max-w-[calc(100vw-2rem)] sm:max-w-xl max-h-[90dvh] overflow-hidden flex flex-col gap-0 p-0 sm:gap-0",
            "rounded-xl border-border bg-card"
          )}
          aria-describedby={undefined}
        >
          <div className="flex min-h-14 shrink-0 items-center gap-3 border-b border-border px-4 py-3 sm:px-5">
            <DialogTitle className="m-0 min-w-0 flex-1 text-left text-base font-semibold leading-snug text-foreground sm:text-lg">
              Select your campaign
            </DialogTitle>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-9 shrink-0 px-3 text-xs"
              onClick={() => setCreateCampaignOpen(true)}
            >
              Add campaign
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5 space-y-4">
            {listLoading && (
              <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading your campaigns…
              </div>
            )}

            {isError && !listLoading && (
              <p className="text-sm text-destructive">
                Unable to load your campaigns. Sign in and try again, or check your connection.
              </p>
            )}

            {!listLoading && !isError && campaigns.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {isCreatorAccount ? (
                    <>
                      No campaigns match your account (owner or team member). Create a campaign, or ask the campaign
                      owner to add you to a team, then try again.
                    </>
                  ) : (
                    <>
                      No campaigns are linked to an accepted collaboration proposal yet. The showcase project must be
                      linked to a campaign, and your proposal must be accepted, before it appears here.
                    </>
                  )}
                </p>
                <Button
                  type="button"
                  size="sm"
                  className="h-9 px-4 text-xs"
                  onClick={() => setCreateCampaignOpen(true)}
                >
                  Create campaign
                </Button>
              </div>
            )}

            {!listLoading &&
              !isError &&
              campaigns.length > 0 && (
                <ul className="space-y-3">
                  {campaigns.map((c) => (
                    <li
                      key={parseCampaignId(c.id) ?? c.title}
                      className="rounded-lg border border-border bg-card/80 px-3 py-3 sm:px-4 sm:py-3 flex flex-col gap-1.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground line-clamp-1">
                            {c.title}
                          </p>
                          {c.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                              {c.description}
                            </p>
                          )}
                        </div>
                        {typeof c.budget !== "undefined" && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            Budget: {String(c.budget)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-1.5">
                        <span className="text-[11px] text-muted-foreground uppercase tracking-wide">
                          {(c.active ?? true) ? "Active" : "Inactive"}
                        </span>
                        <Button
                          size="sm"
                          className="h-8 px-3 text-xs"
                          onClick={() => {
                            const cid = parseCampaignId(c.id);
                            if (cid == null) return;
                            onSelect({ ...c, id: cid });
                            onOpenChange(false);
                          }}
                        >
                          Use this campaign
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
          </div>
        </DialogContent>
      </Dialog>

      <CreateCampaignModal
        open={createCampaignOpen}
        onOpenChange={setCreateCampaignOpen}
        redirectOnSuccess={false}
        onCreated={(created) => {
          const cid = parseCampaignId(created?.id);
          if (cid == null) return;
          const campaign: Campaign = {
            id: cid,
            title: String(created?.title ?? "Campaign"),
          } as Campaign;
          onSelect(campaign);
          setCreateCampaignOpen(false);
          onOpenChange(false);
        }}
      />
    </>
  );
}
