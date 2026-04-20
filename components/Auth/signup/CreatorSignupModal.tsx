"use client";

import Link from "next/link";
import { SignupForm } from "@/components/Auth/signup/SignUpForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type CreatorSignupModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Extra classes on the dialog surface (width, z-index). */
  className?: string;
};

/**
 * Creator email/password signup + post-signup profile journey, in a dialog.
 * Use on the landing page or over the auth layout so the page stays visible behind the overlay.
 */
export function CreatorSignupModal({
  open,
  onOpenChange,
  className,
}: CreatorSignupModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        overlayClassName="z-[100] bg-black/70"
        className={cn(
          "z-[101] max-h-[min(92vh,920px)] w-[min(100vw-1rem,52rem)] max-w-[min(100vw-1rem,52rem)] gap-0 overflow-hidden border-zinc-800 bg-[#050505] p-0 text-white shadow-2xl sm:max-w-3xl",
          className
        )}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Create your creator account</DialogTitle>
          <DialogDescription>
            Sign up with Google or email, then complete your creator profile.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[min(90vh,880px)] overflow-y-auto overflow-x-hidden px-4 py-5 sm:px-6 sm:py-6">
          {open ? (
            <SignupForm
              accountType="creator"
              className="max-w-none gap-5 py-0 min-h-0"
            />
          ) : null}
        </div>
        <div className="border-t border-zinc-800 px-4 py-3 sm:px-6">
          <p className="text-center text-[11px] text-zinc-500">
            Signing up as a brand?{" "}
            <Link
              href="/register?accountType=brand"
              className="text-orange-500 underline-offset-2 hover:underline"
              onClick={() => onOpenChange(false)}
            >
              Brand registration
            </Link>
            {" · "}
            <Link
              href="/account-type"
              className="text-zinc-400 underline-offset-2 hover:underline"
              onClick={() => onOpenChange(false)}
            >
              Compare account types
            </Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
