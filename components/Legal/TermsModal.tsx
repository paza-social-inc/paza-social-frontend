"use client";

import React from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { TermsContent } from "./TermsContent";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Mobile-first Terms of Service modal: sheet-like on small screens, scrollable content.
 */
export function TermsModal({ open, onOpenChange }: TermsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "flex flex-col p-0 gap-0 overflow-hidden",
          "w-[calc(100vw-0.5rem)] max-w-[calc(100vw-0.5rem)] sm:w-full sm:max-w-2xl",
          "h-[92dvh] max-h-[92dvh] sm:h-[85vh] sm:max-h-[85vh]",
          "rounded-2xl sm:rounded-2xl",
          "top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]",
          "bottom-auto sm:bottom-auto",
          "border-border bg-background"
        )}
        aria-describedby="terms-modal-content"
      >
        <DialogTitle className="sr-only">Terms of Service</DialogTitle>

        {/* Sticky header – mobile first: touch-friendly close */}
        <div className="flex items-center justify-between shrink-0 px-4 py-3 sm:px-5 sm:py-4 border-b border-border bg-background">
          <h2 className="text-base sm:text-lg font-semibold text-foreground truncate pr-2">
            Terms of Service
          </h2>
          <div className="flex items-center gap-2">
            <Link
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-primary hover:underline whitespace-nowrap"
            >
              Full page
            </Link>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-full p-2 -mr-2 touch-manipulation hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Scrollable body with safe area at bottom */}
        <div
          id="terms-modal-content"
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain px-4 py-4 sm:px-5 sm:py-5 pb-[env(safe-area-inset-bottom,1rem)]"
        >
          <TermsContent compactIntro />
        </div>
      </DialogContent>
    </Dialog>
  );
}
