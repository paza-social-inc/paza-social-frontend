"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { joinWaitlist } from "@/lib/data/waitlist";

type Role = "creator" | "brand" | "agency" | "community" | "manager";

interface WaitlistPayload {
  role: Role;
  intent: string;
  optimization: string;
  identity: string;
  email?: string;
}

const ROLES: { value: Role; label: string }[] = [
  { value: "creator", label: "Creator" },
  { value: "brand", label: "Brand" },
  { value: "agency", label: "Agency" },
  { value: "community", label: "Community" },
  { value: "manager", label: "Creator Manager" },
];

const INTENT_OPTIONS: Record<string, string[]> = {
  creator: ["Find high-fit partnerships", "Grow audience/community", "Build long-term collaborations"],
  community: ["Find high-fit partnerships", "Grow audience/community", "Build long-term collaborations"],
  manager: ["Find high-fit partnerships", "Grow audience/community", "Build long-term collaborations"],
  brand: ["Measure creator impact", "Launch campaigns", "Find creators", "Improve campaign performance"],
  agency: ["Measure creator impact", "Launch campaigns", "Find creators", "Improve campaign performance"],
};

const OPTIMIZATION_OPTIONS: Record<string, string[]> = {
  creator: ["Audience trust", "Long-term partnerships", "Community growth", "Visibility"],
  community: ["Audience trust", "Long-term partnerships", "Community growth", "Visibility"],
  manager: ["Audience trust", "Long-term partnerships", "Community growth", "Visibility"],
  brand: ["Sales/conversions", "Cultural relevance", "Visibility", "Long-term partnerships"],
  agency: ["Sales/conversions", "Cultural relevance", "Visibility", "Long-term partnerships"],
};

const isCreatorSide = (role: Role) =>
  ["creator", "community", "manager"].includes(role);

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full border px-4 py-3 text-left text-[13px] uppercase tracking-wide transition-colors ${
        selected
          ? "border-orange-500 bg-orange-500/10 text-orange-500"
          : "border-[#8c8c8c] text-foreground hover:border-orange-500 hover:text-orange-500 dark:text-zinc-300"
      }`}
    >
      {label}
    </button>
  );
}

export default function WaitlistForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<WaitlistPayload>>({});

  const mutation = useMutation({
    mutationFn: (payload: WaitlistPayload) => joinWaitlist(payload),
    onSuccess: () => {
      toast.success("You're on the list! We'll be in touch soon.");
      setStep(1);
      setData({});
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? "Something went wrong. Please try again.");
    },
  });

  const role = data.role!;
  const intentOptions = role ? INTENT_OPTIONS[role] : [];
  const optimizationOptions = role ? OPTIMIZATION_OPTIONS[role] : [];

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-[2px] flex-1 transition-colors ${
              s <= step ? "bg-orange-500" : "bg-zinc-700"
            }`}
          />
        ))}
      </div>

      {/* Step 1 — Role */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-[13px] uppercase tracking-wide text-zinc-400">
            I&apos;m joining Paza as:
          </p>
          <div className="space-y-2">
            {ROLES.map(({ value, label }) => (
              <OptionButton
                key={value}
                label={label}
                selected={data.role === value}
                onClick={() => setData((d) => ({ ...d, role: value }))}
              />
            ))}
          </div>
          <button
            type="button"
            disabled={!data.role}
            onClick={() => setStep(2)}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 border border-neutral-900/25 bg-transparent px-6 text-sm font-semibold uppercase tracking-wide text-neutral-900 transition-colors hover:border-orange-500 hover:text-orange-500 disabled:opacity-40 dark:border-white/80 dark:text-white sm:w-auto sm:min-w-[180px]"
          >
            Continue
            <ArrowRight className="h-4 w-4 shrink-0 text-orange-500" />
          </button>
        </div>
      )}

      {/* Step 2 — Intent */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-[13px] uppercase tracking-wide text-zinc-400">
            What are you trying to achieve right now?
          </p>
          <div className="space-y-2">
            {intentOptions.map((option) => (
              <OptionButton
                key={option}
                label={option}
                selected={data.intent === option}
                onClick={() => setData((d) => ({ ...d, intent: option }))}
              />
            ))}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex min-h-[44px] items-center border border-[#8c8c8c] px-5 text-[13px] uppercase tracking-wide text-foreground hover:border-orange-500 hover:text-orange-500 dark:text-zinc-300"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!data.intent}
              onClick={() => setStep(3)}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 border border-neutral-900/25 bg-transparent px-6 text-sm font-semibold uppercase tracking-wide text-neutral-900 transition-colors hover:border-orange-500 hover:text-orange-500 disabled:opacity-40 dark:border-white/80 dark:text-white sm:flex-none sm:min-w-[180px]"
            >
              Continue
              <ArrowRight className="h-4 w-4 shrink-0 text-orange-500" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Optimization */}
      {step === 3 && (
        <div className="space-y-4">
          <p className="text-[13px] uppercase tracking-wide text-zinc-400">
            What matters most to you?
          </p>
          <div className="space-y-2">
            {optimizationOptions.map((option) => (
              <OptionButton
                key={option}
                label={option}
                selected={data.optimization === option}
                onClick={() => setData((d) => ({ ...d, optimization: option }))}
              />
            ))}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex min-h-[44px] items-center border border-[#8c8c8c] px-5 text-[13px] uppercase tracking-wide text-foreground hover:border-orange-500 hover:text-orange-500 dark:text-zinc-300"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!data.optimization}
              onClick={() => setStep(4)}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 border border-neutral-900/25 bg-transparent px-6 text-sm font-semibold uppercase tracking-wide text-neutral-900 transition-colors hover:border-orange-500 hover:text-orange-500 disabled:opacity-40 dark:border-white/80 dark:text-white sm:flex-none sm:min-w-[180px]"
            >
              Continue
              <ArrowRight className="h-4 w-4 shrink-0 text-orange-500" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4 — Identity */}
      {step === 4 && (
        <div className="space-y-4">
          <p className="text-[13px] uppercase tracking-wide text-zinc-400">
            Where can we find your primary digital footprint?
          </p>
          <div className="space-y-3">
            {!isCreatorSide(role) && (
              <input
                type="email"
                placeholder="Business email"
                value={data.email ?? ""}
                onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
                className="w-full border border-[#8c8c8c] bg-transparent px-3 py-2.5 text-[14px] text-neutral-900 placeholder:text-neutral-500 focus:border-orange-500 focus:outline-none dark:text-white dark:placeholder:text-[#72716d]"
              />
            )}
            <input
              type="url"
              placeholder={
                isCreatorSide(role)
                  ? "Paste your primary social profile link (Instagram, TikTok, YouTube, X)"
                  : "Website domain"
              }
              value={data.identity ?? ""}
              onChange={(e) => setData((d) => ({ ...d, identity: e.target.value }))}
              className="w-full border border-[#8c8c8c] bg-transparent px-3 py-2.5 text-[14px] text-neutral-900 placeholder:text-neutral-500 focus:border-orange-500 focus:outline-none dark:text-white dark:placeholder:text-[#72716d]"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex min-h-[44px] items-center border border-[#8c8c8c] px-5 text-[13px] uppercase tracking-wide text-foreground hover:border-orange-500 hover:text-orange-500 dark:text-zinc-300"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!data.identity || mutation.isPending}
              onClick={() => mutation.mutate(data as WaitlistPayload)}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 border border-neutral-900/25 bg-transparent px-6 text-sm font-semibold uppercase tracking-wide text-neutral-900 transition-colors hover:border-orange-500 hover:text-orange-500 disabled:opacity-40 dark:border-white/80 dark:text-white sm:flex-none sm:min-w-[220px]"
            >
              {mutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Join the Waitlist
                  <ArrowRight className="h-4 w-4 shrink-0 text-orange-500" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
