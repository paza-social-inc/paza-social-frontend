"use client";
import { Button } from "@/components/ui/button";
import { resendVerificationEmail } from "@/lib/data/auth";
import { cn } from "@/lib/utils";
import { RiMailLine, RiCheckLine, RiLoader2Line } from "@remixicon/react";
import { useState } from "react";
import Link from "next/link";

interface EmailVerificationPromptProps {
  email: string;
  className?: string;
}

/**
 * Full-screen verification prompt shown to a new user after signup.
 *
 * Tells the user to check their inbox (and spam folder) for the verification
 * email that was sent at registration. Provides a resend button and a link
 * back to the login page.
 */
export function EmailVerificationPrompt({
  email,
  className,
}: EmailVerificationPromptProps) {
  const [resending, setResending] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  const handleResend = async () => {
    setResending(true);
    const res = await resendVerificationEmail(email);
    setResending(false);
    if (res.success) {
      setResendSent(true);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex max-w-md flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Almost there
        </h1>
        <p className="text-sm text-blue-400">
          Verify your email to unlock the full Paza experience.
        </p>
        <p className="text-xs text-zinc-500">
          Don&apos;t worry, we&apos;ll only need you to do this once.
        </p>
      </div>

      {/* Card */}
      <div
        className={cn(
          "flex w-full max-w-md flex-col items-center gap-6",
          "rounded-2xl border border-zinc-800/90 bg-zinc-950/50 p-6 sm:p-10",
          className,
        )}
      >
        <p className="self-start text-xs font-semibold tracking-widest text-zinc-500">
          PERSONAL INFO
        </p>

        {/* Mail icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-600/10">
          <RiMailLine className="h-8 w-8 text-orange-500" />
        </div>

        {/* Heading + message */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="text-xl font-bold text-white">
            Please verify your email account
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
            We&apos;ve sent a confirmation email to{" "}
            <span className="font-semibold text-zinc-200">{email}</span>.
            Click the link in the email to verify your account ownership.
          </p>
          <p className="max-w-sm text-xs text-zinc-500">
            If you don&apos;t see the email, check your spam folder. The
            link expires after 24 hours.
          </p>
        </div>

        {/* Resend */}
        <div className="flex flex-col items-center gap-3">
          {resendSent ? (
            <div className="flex items-center gap-1.5 text-sm font-medium text-green-500">
              <RiCheckLine className="h-4 w-4" />
              Verification email sent — check your inbox.
            </div>
          ) : (
            <Button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="bg-orange-600 text-black font-semibold hover:bg-orange-500 disabled:opacity-60"
            >
              {resending ? (
                <>
                  <RiLoader2Line className="mr-1.5 h-4 w-4 animate-spin" />
                  Sending…
                </>
              ) : (
                "Resend verification email"
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Back to login */}
      <Link
        href="/login"
        className="mt-6 text-sm text-zinc-500 underline underline-offset-4 transition-colors hover:text-zinc-300"
      >
        Back to login
      </Link>
    </div>
  );
}