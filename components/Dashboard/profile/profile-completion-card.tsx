"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RiCheckLine } from "@remixicon/react";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { useQuery } from "@tanstack/react-query";
import { fetchAuthMe } from "@/lib/data/auth";
import {
    computeCompletion,
    creatorSections,
    brandSections,
    type CompletionResult,
} from "@/lib/data/profileCompletion";

const EMPTY: CompletionResult = { percent: 0, filled: 0, total: 0, nextIncompleteId: null };

/**
 * Radial progress + "Complete profile" button. Shared by the desktop sidebar
 * and the mobile in-page card so the same data drives both.
 *
 * `variant`:
 *  - "full"  → the centered card used in the desktop sidebar (large radial).
 *  - "compact" → a horizontal layout used at the top of the profile page on mobile.
 */
export function ProfileCompletionCard({
    variant = "full",
}: {
    variant?: "full" | "compact";
}) {
    const { user } = useAuth();
    const isBrand = user?.accountType === "Business" || user?.accountType === "Brand";

    const { data: authMe } = useQuery({
        queryKey: ["auth-me-sidebar"],
        queryFn: fetchAuthMe,
        staleTime: 5 * 60 * 1000,
    });

    const { data: completion = EMPTY } = useQuery<CompletionResult>({
        queryKey: ["profile-completion", isBrand ? "brand" : "creator", authMe?.businessId ?? null],
        enabled: !isBrand || Boolean(authMe?.businessId),
        staleTime: 30 * 1000,
        queryFn: async () => {
            if (isBrand) {
                const businessId = authMe?.businessId;
                if (!businessId) return EMPTY;
                const { getBrandProfile } = await import("@/lib/data/brands");
                const res = await getBrandProfile(businessId);
                return computeCompletion(brandSections(res.success ? res.data : null));
            }
            const { getCreatorProfile } = await import("@/lib/data/creator");
            const res = await getCreatorProfile();
            return computeCompletion(creatorSections(res.success ? res.data : null));
        },
    });

    const completeHref = completion.nextIncompleteId
        ? `/profile?tab=${completion.nextIncompleteId}`
        : "/profile";

    const fullyComplete = completion.total > 0 && completion.filled === completion.total;

    const buttonContent = fullyComplete ? (
        <>
            <RiCheckLine className="mr-1 h-4 w-4" /> Profile complete
        </>
    ) : (
        <>Complete profile</>
    );

    if (variant === "compact") {
        return (
            <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
                <Progress
                    value={completion.percent}
                    strokeWidth={10}
                    title="Profile progress"
                    size={72}
                    variant="radial"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div>
                        <p className="text-sm font-medium text-foreground">
                            Profile {completion.percent}% complete
                        </p>
                        {completion.total > 0 && (
                            <p className="text-xs text-muted-foreground">
                                {completion.filled} of {completion.total} sections filled
                            </p>
                        )}
                    </div>
                    <Button asChild variant="secondary" size="sm" className="h-auto w-fit">
                        <Link href={completeHref}>{buttonContent}</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="text-center space-y-6 py-8 p-6">
            <div className="flex flex-col items-center">
                <Progress
                    value={completion.percent}
                    strokeWidth={10}
                    title="Profile progress"
                    className="mb-5"
                    size={150}
                    variant="radial"
                />
                <p className="text-sm text-muted-foreground">
                    Profile {completion.percent}% complete
                </p>
                {completion.total > 0 && (
                    <p className="text-xs text-muted-foreground/70 mt-1">
                        {completion.filled} of {completion.total} sections filled
                    </p>
                )}
                <Button asChild variant="secondary" className="w-full mt-4 h-auto">
                    <Link href={completeHref}>{buttonContent}</Link>
                </Button>
            </div>
        </div>
    );
}
