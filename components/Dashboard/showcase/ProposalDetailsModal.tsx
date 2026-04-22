"use client";

import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Check, Loader2, BadgeCheck } from "lucide-react";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  projectProposalsApi,
  formatProposalTimeline,
  type CreatorProjectProposal,
  type CreatorProjectProposalStatusAction,
} from "@/lib/data/projectProposals";

const NOTIFICATIONS_QUERY_KEY = ["notifications"] as const;

function proposerPhotoUrl(proposer: CreatorProjectProposal["proposer"]) {
  if (!proposer) return null;
  const p = proposer as {
    profilePhotoUrl?: string | null;
    avatarUrl?: string | null;
    profilePicture?: string | null;
    image?: string | null;
  };
  return (
    p.profilePhotoUrl ??
    p.avatarUrl ??
    p.profilePicture ??
    p.image ??
    null
  );
}

function initials(first?: string, last?: string) {
  const a = (first?.[0] ?? "").toUpperCase();
  const b = (last?.[0] ?? "").toUpperCase();
  const s = `${a}${b}`.trim();
  return s || "?";
}

function formatPricingLine(p: CreatorProjectProposal): string {
  const fee = p.fee?.trim();
  if (!fee) return "Fee to be discussed";
  const ct = (p.collaborationType ?? "").toLowerCase();
  if (ct.includes("post")) return `${fee} per post`;
  if (ct.includes("campaign")) return `${fee} — campaign`;
  if (ct.includes("task")) return `${fee} — task`;
  return fee;
}

function highlightsForProposal(p: CreatorProjectProposal): string[] {
  const lines: string[] = [
    "I have the required number of followers.",
  ];
  const range = formatProposalTimeline(p);
  if (range) {
    lines.push(`Availability: ${range}`);
  } else {
    lines.push("I'm available for an immediate start.");
  }
  return lines;
}

function ActionButtonRow({
  pending,
  busyAction,
  onAccept,
  onReject,
  className,
}: {
  pending: boolean;
  busyAction: null | CreatorProjectProposalStatusAction;
  onAccept: () => void;
  onReject: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-3",
        className
      )}
    >
      <Button
        type="button"
        disabled={!pending || busyAction !== null}
        onClick={onAccept}
        className="h-11 rounded-xl bg-orange-500 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
      >
        {busyAction === "accepted" ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          "Accept Proposal"
        )}
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={!pending || busyAction !== null}
        onClick={onReject}
        className="h-11 rounded-xl border-red-400/80 bg-transparent font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
      >
        {busyAction === "rejected" ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          "Reject Proposal"
        )}
      </Button>
    </div>
  );
}

export interface ProposalDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposal: CreatorProjectProposal | null;
  /** Showcase project id (required to accept/reject) */
  projectId: number;
}

export function ProposalDetailsModal({
  open,
  onOpenChange,
  proposal,
  projectId,
}: ProposalDetailsModalProps) {
  const queryClient = useQueryClient();
  const [busyAction, setBusyAction] =
    useState<null | CreatorProjectProposalStatusAction>(null);

  const proposer = proposal?.proposer;
  const name = proposer
    ? `${proposer.firstName} ${proposer.lastName}`.trim()
    : "Unknown proposer";
  const categoryLabel = proposal?.collaborationType?.trim() || "Creator";
  const photo = useMemo(() => proposerPhotoUrl(proposer), [proposer]);
  const verified = Boolean(
    (proposer as { isVerified?: boolean } | undefined)?.isVerified
  );
  const relativeTime = proposal?.createdAt
    ? formatDistanceToNow(new Date(proposal.createdAt), { addSuffix: true })
    : "";

  const highlights = useMemo(
    () => (proposal ? highlightsForProposal(proposal) : []),
    [proposal]
  );

  const pricingLine = useMemo(
    () => (proposal ? formatPricingLine(proposal) : ""),
    [proposal]
  );

  const pending =
    !proposal ||
    String(proposal.status ?? "pending").toLowerCase() === "pending";

  const validProjectId = Number.isFinite(projectId) && projectId > 0;

  const mutation = useMutation({
    mutationFn: async (status: CreatorProjectProposalStatusAction) => {
      if (!proposal || !validProjectId) {
        throw new Error("Invalid proposal or project");
      }
      return projectProposalsApi.updateStatus(projectId, proposal.id, status);
    },
    onMutate: (status) => {
      setBusyAction(status);
    },
    onSettled: () => {
      setBusyAction(null);
    },
    onSuccess: (_, status) => {
      toast.success(
        status === "accepted" ? "Proposal accepted" : "Proposal declined"
      );
      onOpenChange(false);
      queryClient.invalidateQueries({
        queryKey: ["creator-project-proposals", projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["creator-projects", String(projectId)],
      });
      queryClient.invalidateQueries({ queryKey: ["my-showcase-proposals"] });
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
    onError: (err: unknown) => {
      const msg =
        axios.isAxiosError(err) &&
        err.response?.data &&
        typeof (err.response.data as { message?: string }).message === "string"
          ? (err.response.data as { message: string }).message
          : "Could not update proposal";
      toast.error(msg);
    },
  });

  const handleAccept = () => mutation.mutate("accepted");
  const handleReject = () => mutation.mutate("rejected");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          "flex max-h-[min(90vh,720px)] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl border-zinc-800 bg-zinc-900 p-0 text-zinc-100 shadow-2xl sm:max-w-lg",
          "[&_[data-slot=dialog-close]]:text-zinc-400 [&_[data-slot=dialog-close]]:hover:text-zinc-200"
        )}
      >
        <DialogTitle className="sr-only">Proposal Details</DialogTitle>

        <div className="shrink-0 border-b border-zinc-800 px-5 pb-4 pt-6 text-center">
          <h2 className="text-lg font-bold tracking-tight text-white">
            Proposal Details
          </h2>
          <div className="mt-4 px-1">
            <ActionButtonRow
              pending={pending && validProjectId}
              busyAction={busyAction}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {!proposal ? (
            <p className="text-center text-sm text-zinc-400">
              No proposal selected.
            </p>
          ) : (
            <div className="space-y-5">
              <div className="flex gap-3">
                <Avatar className="size-14 shrink-0 border border-zinc-700">
                  {photo ? (
                    <AvatarImage src={photo} alt="" className="object-cover" />
                  ) : null}
                  <AvatarFallback className="bg-zinc-800 text-base font-semibold text-zinc-200">
                    {initials(proposer?.firstName, proposer?.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-white">{name}</span>
                    {verified ? (
                      <BadgeCheck
                        className="size-5 shrink-0 text-orange-500"
                        aria-label="Verified"
                      />
                    ) : null}
                    {relativeTime ? (
                      <span className="text-xs text-zinc-500">{relativeTime}</span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-sm text-zinc-400">{categoryLabel}</p>
                </div>
              </div>

              <ul className="space-y-2.5">
                {highlights.map((line, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 text-sm leading-snug text-zinc-300"
                  >
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-orange-400">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div>
                <p className="text-lg font-bold text-white">{pricingLine}</p>
                {proposal.kind ? (
                  <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500">
                    {proposal.kind} proposal
                  </p>
                ) : null}
              </div>

              <div className="space-y-3 text-sm leading-relaxed text-zinc-400">
                {proposal.reason ? (
                  <p className="whitespace-pre-wrap">{proposal.reason}</p>
                ) : (
                  <p className="italic text-zinc-500">No message provided.</p>
                )}
                {proposal.collaborators && proposal.collaborators.length > 0 ? (
                  <p className="text-xs text-zinc-500">
                    Collaborators mentioned:{" "}
                    {proposal.collaborators.join(", ")}
                  </p>
                ) : null}
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-zinc-800 bg-zinc-950/90 px-5 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <p className="text-center text-sm text-zinc-400 sm:text-left">
              {pending ? (
                "Everything looking good?"
              ) : (
                <span className="capitalize">
                  This proposal is {String(proposal?.status ?? "").toLowerCase()}.
                </span>
              )}
            </p>
            <div className="sm:min-w-0 sm:flex-1 sm:max-w-md">
              <ActionButtonRow
                pending={pending && validProjectId}
                busyAction={busyAction}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
