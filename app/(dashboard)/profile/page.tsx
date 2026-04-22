"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    RiClipboardLine,
    RiMapPinLine,
    RiCameraLine,
    RiCalendarLine,
    RiShareLine,
    RiMoreLine,
    RiAddLine,
} from "@remixicon/react";
import { Input } from "@/components/ui/input";
import CoverArea from "@/components/Dashboard/profile/coverarea";
import ShareProfile from "@/components/Dashboard/profile/share-profile";
import { ProfileSidebar } from "@/components/Dashboard/profile/profile-sidebar";

import { useAuth } from "@/hooks/store/auth/useAuth";
import BrandProfileView from "@/components/Dashboard/brand/BrandProfileView";

import CreatorProfileView from "@/components/Dashboard/creator/CreatorProfileView";

export default function ProfilePage() {
    const { user } = useAuth();
    const isBrand = user?.accountType === "Business";

    return (
        <div className="bg-background min-h-screen flex relative">
            {/* Left Sidebar - Activity Feed - Now Sticky */}
            <ProfileSidebar />

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto">
                {/* Cover Photo Section */}
                <CoverArea />
                
                {/* Welcome Section */}
                <div className="px-8 py-6 border-b pt-28">
                    <div className="pb-2 mb-4">
                        <div className="flex gap-4 flex-col">
                            <h1 className="text-2xl font-bold text-foreground">Hi, {user?.firstName || "there"}</h1>
                            <div className="flex gap-2">
                                <Button variant="outline" className="h-10" size="sm"><RiAddLine /> Invite Members</Button>
                                <ShareProfile user_id={user?.id || "Avx8HD"} />
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-muted-foreground mb-4">
                            You now have access to our list of innovative jobs and thriving eco system of creators and brands. What are you gonna do today?
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                            <Input
                                type="text"
                                placeholder="type here..."
                                className="flex-1 px-4 py-2 border bg-background"
                            />
                            <Button variant="outline" className="h-12 w-12" size="icon">
                                <RiClipboardLine className="h-5 w-5" />
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">3 down 7 more to go for you to get a month free!</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-2 border-primary/20 hover:border-primary/50 transition-colors">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2">{isBrand ? "Manage Campaigns" : "Find your next job"}</h3>
                                <Button variant="link" className="p-0 h-auto">View all</Button>
                            </CardContent>
                        </Card>
                        <Card className="border-2 border-primary/20 hover:border-primary/50 transition-colors">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2">{isBrand ? "Discover Creators" : "Open Projects"}</h3>
                                <Button variant="link" className="p-0 h-auto">Explore</Button>
                            </CardContent>
                        </Card>
                        <Card className="border-2 border-primary/20 hover:border-primary/50 transition-colors">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2">Platform Perks</h3>
                                <Button variant="link" className="p-0 h-auto">Learn more</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="px-8 py-8">
                    {isBrand ? (
                        <BrandProfileView />
                    ) : (
                        <CreatorProfileView />
                    )}
                </div>
            </div>
        </div>
    );
}
