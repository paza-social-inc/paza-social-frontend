"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Image from "next/image";
import { X, Check, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Opening } from "@/types/openings";

export type OpeningApplicant = {
  id: number;
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
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opening: Opening | null;
  applicants?: OpeningApplicant[];
  onBack?: () => void;
}) {
  const [showMore, setShowMore] = useState(false);

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
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border"
                  >
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
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {}}
                        className="h-9 w-9 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:opacity-90 transition-opacity touch-manipulation"
                        aria-label="Reject"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {}}
                        className="h-9 w-9 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:opacity-90 transition-opacity touch-manipulation"
                        aria-label="Accept"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
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
