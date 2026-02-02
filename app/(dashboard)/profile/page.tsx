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

export default function ProfilePage() {
    const [activeTab, setActiveTab] = React.useState("feed");


    const statsCards = [
        { title: "Campaigns", count: 54, subtitle: "Campaigns completed", inProgress: 3, label: "Campaigns in progress", month: "July" },
        { title: "Tasks", count: 54, subtitle: "Tasks completed", inProgress: 3, label: "Tasks in progress", month: "July" },
        { title: "Proposals", count: 54, subtitle: "Proposals completed", inProgress: 3, label: "Proposals in progress", month: "July" }
    ];

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
                            <h1 className="text-2xl font-bold text-foreground">Hi, John</h1>
                            <div className="flex gap-2">
                                <Button variant="outline" className="h-10" size="sm"><RiAddLine /> Invite Members</Button>
                                <ShareProfile user_id="Avx8HD" />
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

                    {/* Quick Action Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-2 border-primary">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2">Find your next job</h3>
                                <Button variant="link" className="p-0 h-auto">View all jobs</Button>
                            </CardContent>
                        </Card>
                        <Card className="border-2 border-primary">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2">Open Projects</h3>
                                <Button variant="link" className="p-0 h-auto">View all projects</Button>
                            </CardContent>
                        </Card>
                        <Card className="border-2 border-primary">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2">Open Campaigns</h3>
                                <Button variant="link" className="p-0 h-auto">Explore creators</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="px-8 pt-6 pb-2">
                    <div className="flex gap-8 border-b">
                        <button
                            onClick={() => setActiveTab("feed")}
                            className={`pb-2 font-medium ${activeTab === "feed" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
                        >
                            Feed
                        </button>
                        <button
                            onClick={() => setActiveTab("bio")}
                            className={`pb-2 font-medium ${activeTab === "bio" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
                        >
                            Bio and Info
                        </button>
                        <button
                            onClick={() => setActiveTab("works")}
                            className={`pb-2 font-medium ${activeTab === "works" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
                        >
                            Works
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="px-8 py-6">
                    {activeTab === "feed" && (
                        <div className="space-y-6">
                            {/* Overview Header */}
                            <div className="flex items-center justify-between">
                                <p className="text-muted-foreground">Lets see an overview of your activity here</p>
                                <Button variant="link" className="p-0 h-auto">
                                    Share <RiShareLine />
                                </Button>
                            </div>

                            {/* Tab Navigation */}
                            <div className="flex gap-6 border-b overflow-x-auto">
                                <button className="pb-2 font-medium border-b-2 border-foreground whitespace-nowrap">Ongoing Jobs</button>
                                <button className="pb-2 font-medium text-muted-foreground whitespace-nowrap">Ongoing Projects</button>
                                <button className="pb-2 font-medium text-muted-foreground whitespace-nowrap">Campaigns</button>
                                <button className="pb-2 font-medium text-muted-foreground whitespace-nowrap">All Stats</button>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {statsCards.map((stat, index) => (
                                    <Card key={index}>
                                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                                            <CardTitle className="text-base font-medium">{stat.title}</CardTitle>
                                            <Button variant="ghost" size="icon">
                                                <RiMoreLine className="h-4 w-4" />
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div>
                                                <div className="text-3xl font-bold">{stat.count}</div>
                                                <div className="text-sm text-muted-foreground">{stat.subtitle}</div>
                                            </div>
                                            <div>
                                                <div className="text-primary font-semibold">{stat.inProgress}</div>
                                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                                            </div>
                                            <div className="pt-2 border-t">
                                                <div className="text-sm font-medium">{stat.month}</div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "bio" && (
                        <div className="space-y-6">
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-semibold mb-3">About</h2>
                                    <p className="text-muted-foreground mb-4">
                                        Creative professional passionate about design and user experience.
                                        I love creating beautiful, functional interfaces that make a difference in people's lives.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline">🎨 UI/UX Designer</Badge>
                                        <Badge variant="outline">⚛️ React Developer</Badge>
                                        <Badge variant="outline">📱 Mobile Design</Badge>
                                        <Badge variant="outline">🎯 Product Strategy</Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <RiMapPinLine className="h-4 w-4 text-muted-foreground" />
                                        <span>New York, United States</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <RiCalendarLine className="h-4 w-4 text-muted-foreground" />
                                        <span>Joined March 2020</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === "works" && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>Portfolio</span>
                                        <Button variant="outline" size="sm">Add Work</Button>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[1, 2, 3, 4, 5, 6].map((work) => (
                                            <div key={work} className="aspect-square bg-muted flex items-center justify-center">
                                                <div className="text-center text-muted-foreground">
                                                    <RiCameraLine className="h-8 w-8 mx-auto mb-2" />
                                                    <p className="text-sm">Work {work}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
