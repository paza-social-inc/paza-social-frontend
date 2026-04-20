"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { campaignApi, parseCampaignId } from "@/lib/data/campaigns";
import type { Campaign } from "@/types/campaigns/campaignTypes";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { canManageCampaign } from "@/lib/campaignPermissions";
import { decodeJwtPayload, getEmailFromPayload, getUserIdStringFromPayload } from "@/lib/jwtPayload";
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

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["campaigns", "for-job", "mine", currentUserId, currentUserEmail],
    queryFn: async () => {
      try {
        return await campaignApi.getMine();
      } catch {
        const collected: Campaign[] = [];
        if (currentUserId) {
          const byId = await campaignApi.getByUser(currentUserId);
          collected.push(...byId);
        }
        if (currentUserEmail) {
          const byEmail = await campaignApi.getByUser(currentUserEmail);
          collected.push(...byEmail);
        }
        const seen = new Set<number>();
        return collected.filter((c) => {
          const cid = parseCampaignId(c.id);
          if (cid == null) return false;
          if (seen.has(cid)) return false;
          seen.add(cid);
          return true;
        });
      }
    },
    enabled: open,
    staleTime: 0,
  });

  React.useEffect(() => {
    if (open) void refetch();
  }, [open, refetch]);

  const campaigns = useMemo(() => {
    const raw = ((data ?? []) as Campaign[]).filter((c) => parseCampaignId(c.id) != null);
    // Match campaign list: only campaigns you can edit (same rules as CampaignList).
    return raw.filter((c) => canManageCampaign(c, campaignActor));
  }, [data, campaignActor]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={true}
          className={cn(
            "max-w-[calc(100vw-2rem)] sm:max-w-xl max-h-[90dvh] overflow-hidden flex flex-col p-0 gap-0",
            "rounded-xl border-border bg-card"
          )}
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">Select your campaign</DialogTitle>

          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3 shrink-0">
            <h2 className="text-base sm:text-lg font-semibold">Select your campaign</h2>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 px-3 text-xs"
              onClick={() => setCreateCampaignOpen(true)}
            >
              Add campaign
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5 space-y-4">
            {isLoading && (
              <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading your campaigns…
              </div>
            )}

            {isError && !isLoading && (
              <p className="text-sm text-destructive">
                Unable to load your campaigns. Sign in and try again, or check your connection.
              </p>
            )}

            {!isLoading && !isError && campaigns.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  You don&apos;t have any campaigns yet, or none match your account. Create a campaign first, then
                  create a task for it.
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

            {!isLoading &&
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
