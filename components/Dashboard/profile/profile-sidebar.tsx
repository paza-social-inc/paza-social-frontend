"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    RiFolderLine,
    RiCheckLine,
} from "@remixicon/react";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
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

export const ProfileSidebar = () => {
    const { user } = useAuth();
    const isBrand = user?.accountType === "Business" || user?.accountType === "Brand";

    // We need the businessId to fetch a brand profile; it lives on /api/users/me.
    const { data: authMe } = useQuery({
        queryKey: ["auth-me-sidebar"],
        queryFn: fetchAuthMe,
        staleTime: 5 * 60 * 1000,
    });

    // Fetch the right profile based on account type, then compute completion.
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

    // "Complete profile" jumps to the first section that still needs content.
    // When everything is done, it just opens the profile to the first tab.
    const completeHref =
        completion.nextIncompleteId
            ? `/profile?tab=${completion.nextIncompleteId}`
            : "/profile";

    const fullyComplete = completion.total > 0 && completion.filled === completion.total;

    return (
        <div className="border-r max-w-xs sticky top-0">
            <div className="space-y-6 divide-y">
                {/* Profile Summary */}
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
                            <Link href={completeHref}>
                                {fullyComplete ? (
                                    <>
                                        <RiCheckLine className="mr-1 h-4 w-4" /> Profile complete
                                    </>
                                ) : (
                                    <>Complete profile</>
                                )}
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Skills Section */}
                <div className="p-6 pt-0">
                    <h3 className="font-semibold mb-3">Skills</h3>
                    <div className="space-y-2">
                        <Badge variant="outline" className="mr-2">Availability Fulltime</Badge>
                        <Badge variant="outline" className="mr-2">Rates (Ksh) 30k - 50k</Badge>
                        <Badge variant="outline">City</Badge>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="p-6 pt-0">
                    <h3 className="font-semibold mb-3">ACTIVITY FEED</h3>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon" className="rounded-xl">
                                    <RiFolderLine />
                                </EmptyMedia>
                                <EmptyTitle>No Activity Yet</EmptyTitle>
                                <EmptyDescription className="w-full">
                                    Your activities will appear here.
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    </div>
                </div>
            </div>
        </div>
    );
};
