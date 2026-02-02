import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    RiFolderLine,
} from "@remixicon/react";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"


export const ProfileSidebar = () => {


    const profileStats = {
        progress: 20
    };


    return (
        <div className="border-r max-w-xs sticky top-0">
            <div className="space-y-6 divide-y">
                {/* Profile Summary */}
                <div className="text-center space-y-6 py-8 p-6">
                    <div className="flex flex-col items-center">
                        <Progress value={profileStats.progress}
                            strokeWidth={10}
                            title="Progress"
                            className="mb-5" size={150}
                            variant="radial" />
                        <p className="text-sm text-muted-foreground">Profile {profileStats.progress}% complete</p>
                        <Button variant="secondary" className="w-full mt-4 h-auto">Complete Profile</Button>
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
    )
}
