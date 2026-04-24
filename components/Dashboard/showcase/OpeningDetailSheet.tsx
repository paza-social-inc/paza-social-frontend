"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Image from "next/image";
import { X, Check, ChevronLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Opening } from "@/types/openings";

export type OpeningApplicant = {
  id: number | string;
  name: string;
  email?: string;
  avatarUrl?: string | null;
  status?: string;
};

export function OpeningDetailSheet({
  open,
  onOpenChange,
  opening,
  applicants = [],
  onBack,
  onApply,
  onAcceptApplicant,
  onRejectApplicant,
  applicantActionLoadingId,
  myApplicationStatus,
  myApplication,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opening: Opening | null;
  applicants?: OpeningApplicant[];
  onBack?: () => void;
  onApply?: (opening: Opening) => void;
  onAcceptApplicant?: (applicant: OpeningApplicant) => void;
  onRejectApplicant?: (applicant: OpeningApplicant) => void;
  applicantActionLoadingId?: string | number | null;
  myApplicationStatus?: string | null;
  myApplication?: {
    status?: string;
    createdAt?: string;
    fee?: string | null;
    timelineStart?: string | null;
    timelineEnd?: string | null;
    coverLetter?: string;
    attachments?: string[] | null;
  } | null;
}) {
  const [showMore, setShowMore] = useState(false);
  const [confirmingAction, setConfirmingAction] = useState<{
    applicantId: string | number;
    type: "accept" | "reject";
  } | null>(null);

  const statusLabel = (status?: string) => {
    const s = String(status ?? "").toLowerCase();
    if (s === "accepted") return "Accepted";
    if (s === "rejected") return "Declined";
    return "Pending";
  };
  const myStatus = String(myApplicationStatus ?? "").toLowerCase();
  const canApply = !myStatus;
  const myTimelineLabel =
    myApplication?.timelineStart && myApplication?.timelineEnd
      ? `${myApplication.timelineStart} - ${myApplication.timelineEnd}`
      : myApplication?.timelineStart
        ? `From ${myApplication.timelineStart}`
        : myApplication?.timelineEnd
          ? `Until ${myApplication.timelineEnd}`
          : null;

  if (!opening) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "rounded-l-2xl overflow-hidden flex flex-col w-full sm:max-w-sm p-0",
          "max-h-dvh sm:max-h-screen"
        )}
      >
        <SheetHeader className="p-4 pb-2 border-b border-border shrink-0 flex flex-row items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-1.5 -ml-1 rounded-md hover:bg-muted transition-colors touch-manipulation"
              aria-label="Back to openings list"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <SheetTitle className="text-left flex-1 truncate">
            {opening.title}
            {opening.roleType && (
              <span className="block text-xs font-normal text-muted-foreground mt-0.5">
                {opening.roleType}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {onApply ? (
            <button
              type="button"
              onClick={() => {
                if (canApply) onApply(opening);
              }}
              disabled={!canApply}
              className={cn(
                "w-full rounded-lg px-3 py-2 text-sm font-semibold transition-colors touch-manipulation",
                canApply
                  ? "bg-orange-500 text-black hover:bg-orange-600"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {myStatus === "accepted"
                ? "Accepted for this opening"
                : myStatus === "rejected"
                  ? "Application declined"
                  : myStatus === "pending"
                    ? "Application submitted"
                    : "Apply to this opening"}
            </button>
          ) : null}
          {(opening.compensation || opening.description) && (
            <div className="flex flex-wrap gap-2 text-sm">
              {opening.compensation && (
                <span className="px-2 py-1 rounded-md bg-muted text-muted-foreground">
                  {opening.compensation}
                </span>
              )}
            </div>
          )}
          {/* Description + Show More + Date */}
          <div>
            <p
              className={cn(
                "text-sm text-muted-foreground leading-relaxed",
                !showMore && "line-clamp-3"
              )}
            >
              {opening.description ?? "No description provided."}
            </p>
            <button
              type="button"
              onClick={() => setShowMore((v) => !v)}
              className="text-sm text-primary font-medium mt-1 hover:underline touch-manipulation"
            >
              {showMore ? "Show less" : "Show More"}
            </button>
            <p className="text-sm text-muted-foreground mt-2">
              Date Posted:{" "}
              {opening.createdAt ? new Date(opening.createdAt).toLocaleDateString() : "—"}
            </p>
          </div>

          {myApplication ? (
            <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-2">
              <p className="text-xs font-semibold text-foreground">My application</p>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                <span
                  className={cn(
                    "inline-flex rounded-full px-2 py-0.5 font-medium",
                    myStatus === "accepted"
                      ? "bg-emerald-500/15 text-emerald-500"
                      : myStatus === "rejected"
                        ? "bg-destructive/15 text-destructive"
                        : "bg-orange-500/15 text-orange-500"
                  )}
                >
                  {myStatus === "accepted"
                    ? "Accepted"
                    : myStatus === "rejected"
                      ? "Rejected"
                      : "Pending"}
                </span>
                <span>
                  Sent:{" "}
                  {myApplication.createdAt
                    ? new Date(myApplication.createdAt).toLocaleDateString()
                    : "—"}
                </span>
                {myApplication.fee ? <span>Fee: {myApplication.fee}</span> : null}
                {myTimelineLabel ? <span>Timeline: {myTimelineLabel}</span> : null}
              </div>
              {myApplication.coverLetter ? (
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {myApplication.coverLetter}
                </p>
              ) : null}
              {(myApplication.attachments ?? []).length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {(myApplication.attachments ?? []).map((url, idx) => {
                    const label =
                      (() => {
                        try {
                          const pathname = new URL(url).pathname;
                          return decodeURIComponent(pathname.split("/").pop() || "Attachment");
                        } catch {
                          return "Attachment";
                        }
                      })();
                    return (
                      <a
                        key={`${url}-${idx}`}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-md border border-border bg-card px-2 py-1 text-[11px] text-primary hover:underline"
                      >
                        {label}
                      </a>
                    );
                  })}
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Applicant(s): users who applied / showed interest */}
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3">
              Applicant{applicants.length === 1 ? "" : "s"}
            </p>
            {applicants.length === 0 ? (
              <div className="rounded-xl border border-border bg-muted/40 px-3 py-4 text-sm text-muted-foreground">
                No applicant yet.
              </div>
            ) : (
              <div className="space-y-2">
                {applicants.map((applicant) => (
                  <div
                    key={applicant.id}
                    className="p-3 rounded-xl bg-muted/40 border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted shrink-0">
                        {applicant.avatarUrl ? (
                          <Image
                            src={applicant.avatarUrl}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                            {(applicant.name?.[0] ?? "?").toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground text-sm truncate">
                          {applicant.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {applicant.email || "No email"}
                        </p>
                        <span
                          className={cn(
                            "mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                            String(applicant.status ?? "").toLowerCase() === "accepted"
                              ? "bg-emerald-500/15 text-emerald-500"
                              : String(applicant.status ?? "").toLowerCase() === "rejected"
                                ? "bg-destructive/15 text-destructive"
                                : "bg-muted text-muted-foreground"
                          )}
                        >
                          {statusLabel(applicant.status)}
                        </span>
                      </div>
                    </div>
                    {String(applicant.status ?? "").toLowerCase() === "pending" && (
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {confirmingAction?.applicantId === applicant.id ? (
                          <>
                            <p className="text-xs text-muted-foreground mr-1">
                              Confirm {confirmingAction.type === "accept" ? "accept" : "decline"}?
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirmingAction.type === "accept") {
                                  onAcceptApplicant?.(applicant);
                                } else {
                                  onRejectApplicant?.(applicant);
                                }
                              }}
                              disabled={applicantActionLoadingId === applicant.id}
                              className={cn(
                                "h-8 rounded-md px-3 text-xs font-medium touch-manipulation",
                                confirmingAction.type === "accept"
                                  ? "bg-emerald-600 text-white hover:opacity-90"
                                  : "bg-destructive text-destructive-foreground hover:opacity-90"
                              )}
                            >
                              {applicantActionLoadingId === applicant.id ? (
                                <span className="inline-flex items-center gap-1">
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  Saving...
                                </span>
                              ) : confirmingAction.type === "accept" ? (
                                "Yes, accept"
                              ) : (
                                "Yes, decline"
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmingAction(null)}
                              disabled={applicantActionLoadingId === applicant.id}
                              className="h-8 rounded-md border border-border px-3 text-xs text-muted-foreground hover:bg-muted touch-manipulation"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmingAction({
                                  applicantId: applicant.id,
                                  type: "accept",
                                })
                              }
                              disabled={!onAcceptApplicant || applicantActionLoadingId === applicant.id}
                              className="h-8 rounded-md bg-emerald-600 px-3 text-xs font-medium text-white hover:opacity-90 touch-manipulation"
                            >
                              <span className="inline-flex items-center gap-1">
                                <Check className="h-3.5 w-3.5" />
                                Accept
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmingAction({
                                  applicantId: applicant.id,
                                  type: "reject",
                                })
                              }
                              disabled={!onRejectApplicant || applicantActionLoadingId === applicant.id}
                              className="h-8 rounded-md border border-destructive/30 bg-destructive/10 px-3 text-xs font-medium text-destructive hover:bg-destructive/15 touch-manipulation"
                            >
                              <span className="inline-flex items-center gap-1">
                                <X className="h-3.5 w-3.5" />
                                Decline
                              </span>
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
