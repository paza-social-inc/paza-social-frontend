"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { openingsApi } from "@/lib/data/openings";
import type { Opening } from "@/types/openings";

export function OpeningsListSheet({
  open,
  onOpenChange,
  projectId,
  projectTitle,
  projectDescription,
  projectCreatedAt,
  onSelectOpening,
  myOpeningStatuses = {},
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectTitle?: string;
  projectDescription?: string;
  projectCreatedAt?: string;
  onSelectOpening: (opening: Opening) => void;
  myOpeningStatuses?: Record<string, string>;
}) {
  const { data: openings = [], isLoading, isError } = useQuery({
    queryKey: ["openings", projectId],
    queryFn: () => openingsApi.getByProjectId(projectId),
    enabled: !!projectId,
  });

  const [showMore, setShowMore] = useState(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "rounded-l-2xl overflow-hidden flex flex-col w-full sm:max-w-md p-0",
          "max-h-dvh sm:max-h-screen"
        )}
      >
        <SheetHeader className="p-4 pb-2 border-b border-border shrink-0">
          <SheetTitle className="text-left">Openings</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Project details */}
          <div>
            {projectTitle ? (
              <p className="text-sm font-semibold text-foreground mb-1">{projectTitle}</p>
            ) : null}
            <p
              className={cn(
                "text-sm text-muted-foreground leading-relaxed",
                !showMore && "line-clamp-3"
              )}
            >
              {projectDescription?.trim() || "No project description provided."}
            </p>
            <button
              type="button"
              onClick={() => setShowMore((v) => !v)}
              className="text-sm text-primary font-medium mt-1 hover:underline touch-manipulation"
            >
              {showMore ? "Show less" : "Show More"}
            </button>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-sm text-muted-foreground">
                Date Posted:{" "}
                {projectCreatedAt
                  ? new Date(projectCreatedAt).toLocaleDateString()
                  : "—"}
              </p>
              {openings.length > 0 ? (
                <span
                  className="h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shrink-0"
                  aria-label="Openings count"
                  title={`${openings.length} opening${openings.length === 1 ? "" : "s"}`}
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                </span>
              ) : null}
            </div>
          </div>

          {/* List of openings: role + date per item */}
          <div className="space-y-2 pt-2 border-t border-border">
            {isLoading && (
              <div className="text-sm text-muted-foreground py-6">Loading openings…</div>
            )}

            {isError && !isLoading && (
              <div className="text-sm text-destructive py-6">Failed to load openings.</div>
            )}

            {!isLoading && !isError && openings.length === 0 && (
              <div className="text-sm text-muted-foreground py-6">No openings yet.</div>
            )}

            {!isLoading &&
              !isError &&
              openings.map((op) => {
                const id = op.id ?? op._id ?? "";
                const posted = op.createdAt
                  ? new Date(op.createdAt).toLocaleDateString()
                  : "—";
                const myStatus = myOpeningStatuses[String(id)]?.toLowerCase();

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onSelectOpening(op)}
                    className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 p-3 rounded-xl bg-muted/40 border border-border hover:bg-muted/60 transition-colors text-left touch-manipulation"
                  >
                    <div className="min-w-0">
                      <span className="font-medium text-foreground text-sm block">
                        {op.title}
                      </span>
                      {op.roleType && (
                        <span className="text-xs text-muted-foreground">{op.roleType}</span>
                      )}
                      {myStatus ? (
                        <span
                          className={cn(
                            "mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium",
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
                              : "Applied"}
                        </span>
                      ) : null}
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      Date Posted: {posted}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
