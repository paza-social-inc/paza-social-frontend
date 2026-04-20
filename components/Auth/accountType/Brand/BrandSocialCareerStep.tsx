"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { BrandOnboardingFormState } from "@/lib/data/brandOnboarding";
import { cn } from "@/lib/utils";
import { cj } from "../Creator/creatorJourneyTheme";
import { StepSection } from "../Creator/components/StepSection";
import type { ReactNode } from "react";

type PlatformKey = "instagram" | "tiktok" | "youtube" | "twitter" | "linkedin" | "facebook";

const PLATFORMS: {
    key: PlatformKey;
    label: string;
    placeholder: string;
    glyph: ReactNode;
}[] = [
    {
        key: "instagram",
        label: "Instagram",
        placeholder: "@handle or URL",
        glyph: (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-[10px] font-bold text-white">
                IG
            </span>
        ),
    },
    {
        key: "tiktok",
        label: "TikTok",
        placeholder: "@handle or URL",
        glyph: (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-[10px] font-bold text-white">
                TT
            </span>
        ),
    },
    {
        key: "youtube",
        label: "YouTube",
        placeholder: "Channel URL",
        glyph: (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-600 text-[10px] font-bold text-white">
                YT
            </span>
        ),
    },
    {
        key: "twitter",
        label: "X (Twitter)",
        placeholder: "@handle",
        glyph: (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-[10px] font-bold text-white">
                X
            </span>
        ),
    },
    {
        key: "linkedin",
        label: "LinkedIn",
        placeholder: "Profile URL",
        glyph: (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0a66c2] text-[10px] font-bold text-white">
                in
            </span>
        ),
    },
    {
        key: "facebook",
        label: "Facebook",
        placeholder: "Page URL",
        glyph: (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1877f2] text-[10px] font-bold text-white">
                f
            </span>
        ),
    },
];

type Props = {
    data: BrandOnboardingFormState;
    onPatch: (updates: Partial<BrandOnboardingFormState>) => void;
};

export function BrandSocialCareerStep({ data, onPatch }: Props) {
    return (
        <div className="space-y-6">
            <StepSection kicker="Social Media Links">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {PLATFORMS.map((p) => {
                        const value = data[p.key];
                        return (
                            <div
                                key={p.key}
                                className="space-y-3 rounded-xl border border-zinc-700/90 bg-zinc-900/40 p-3"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                        {p.glyph}
                                        <span className="truncate text-sm font-medium text-zinc-200">
                                            {p.label}
                                        </span>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-8 shrink-0 rounded-full border-orange-500/50 px-3 text-[11px] font-semibold uppercase tracking-wide text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
                                        onClick={() =>
                                            document.getElementById(`brand-social-${p.key}`)?.focus()
                                        }
                                    >
                                        Connect
                                    </Button>
                                </div>
                                <div>
                                    <Input
                                        id={`brand-social-${p.key}`}
                                        placeholder={p.placeholder}
                                        value={value}
                                        onChange={(e) => onPatch({ [p.key]: e.target.value })}
                                        className={cn(cj.input, "h-10 border-zinc-600/80 text-sm")}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </StepSection>
        </div>
    );
}
