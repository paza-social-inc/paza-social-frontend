"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
    RiFolderLine,
} from "@remixicon/react";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { ProfileCompletionCard } from "./profile-completion-card";

export const ProfileSidebar = () => {
    return (
        <div className="border-r max-w-xs sticky top-0">
            <div className="space-y-6 divide-y">
                {/* Profile Summary */}
                <ProfileCompletionCard variant="full" />

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
