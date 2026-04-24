"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
    RiClipboardLine,
    RiAddLine,
} from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import CoverArea from "@/components/Dashboard/profile/coverarea";
import ShareProfile from "@/components/Dashboard/profile/share-profile";
import { ProfileSidebar } from "@/components/Dashboard/profile/profile-sidebar";

import { useAuth } from "@/hooks/store/auth/useAuth";
import BrandProfileView from "@/components/Dashboard/brand/BrandProfileView";

import CreatorProfileView from "@/components/Dashboard/creator/CreatorProfileView";

export default function ProfilePage() {
    const { user } = useAuth();
    const isBrand = user?.accountType === "Business" || user?.accountType === "Brand";

    return (
        <div className="bg-background min-h-screen flex relative">
            {/* Left Sidebar - Activity Feed - Hidden on mobile, sticky on desktop */}
            <div className="hidden lg:block">
                <ProfileSidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto w-full">
                {/* Cover Photo Section */}
                <CoverArea />
                
                {/* Welcome Section */}
                <div className="px-4 md:px-8 py-6 border-b pt-24 md:pt-28">
                    <div className="pb-2 mb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h1 className="text-xl md:text-2xl font-bold text-foreground">Hi, {user?.firstname || "there"}</h1>
                            <div className="flex gap-2 flex-wrap">
                                <Button variant="outline" className="h-9 md:h-10 text-xs md:text-sm" size="sm">
                                    <RiAddLine className="mr-1 h-3.5 w-3.5" /> Invite Members
                                </Button>
                                <ShareProfile user_id={user?.id || "Avx8HD"} />
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-sm md:text-base text-muted-foreground mb-4 max-w-2xl">
                            You now have access to our list of innovative jobs and thriving ecosystem of creators and brands. What are you going to do today?
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                            <Input
                                type="text"
                                placeholder="Type here..."
                                className="flex-1 h-10 md:h-12 px-4 py-2 border bg-background"
                            />
                            <Button variant="outline" className="h-10 w-10 md:h-12 md:w-12 shrink-0" size="icon">
                                <RiClipboardLine className="h-5 w-5" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground italic">3 down, 7 more to go for you to get a month free!</p>
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

                <div className="px-4 md:px-8 py-8">
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
