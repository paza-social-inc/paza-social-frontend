"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { getCreatorProfile, CreatorProfile } from "@/lib/data/creator";
import CreatorNarrativeForm from "./CreatorNarrativeForm";
import WorkingStyleForm from "./WorkingStyleForm";
import CreatorCapabilitiesForm from "./CreatorCapabilitiesForm";
import AudienceDemographicsForm from "./AudienceDemographicsForm";
import CreatorPortfolioManager from "./CreatorPortfolioManager";
import CreatorRoutineForm from "./CreatorRoutineForm";
import CreatorAffinityForm from "./CreatorAffinityForm";
import { RiLoader2Line, RiErrorWarningLine } from "@remixicon/react";

export default function CreatorProfileView() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<CreatorProfile | null>(null);
    const [projects, setProjects] = useState<CreatorPastProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const creatorId = Number(user?.id);

    const loadProfile = useCallback(async () => {
        if (!creatorId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const { getCreatorProfile, listCreatorPastProjects } = await import("@/lib/data/creator");
            
            // Parallel fetch for speed
            const [profileRes, projectsRes] = await Promise.all([
                getCreatorProfile(),
                listCreatorPastProjects()
            ]);

            if (profileRes.success) {
                setProfile(profileRes.data);
            } else {
                // If it's a 404 or specifically 'not found', we'll allow onboarding
                if (profileRes.message?.toLowerCase().includes("not found")) {
                    setProfile(null);
                } else {
                    setError(profileRes.message || "Failed to load creator profile");
                }
            }

            if (projectsRes.success) {
                setProjects(projectsRes.data);
            }
        } catch (e: any) {
            // Check for 404 in the catch block as well for robust error handling
            if (e.response?.status === 404 || e.response?.data?.message?.toLowerCase().includes("not found")) {
                setProfile(null);
            } else {
                setError("Error fetching creator profile data");
            }
        } finally {
            setLoading(false);
        }
    }, [creatorId]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <RiLoader2Line className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Loading creator dashboard...</p>
            </div>
        );
    }

    // We only show the error state if there's a real failure. 
    // If profile is null, we proceed to allow onboarding/initialization.
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <RiErrorWarningLine className="h-12 w-12 text-destructive opacity-50" />
                <h3 className="text-lg font-semibold">Profile Loading Error</h3>
                <p className="text-muted-foreground max-w-sm">{error}</p>
                <Button onClick={loadProfile} variant="outline" className="mt-2">Try Again</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Tabs defaultValue="narrative" className="w-full">
                <div className="overflow-x-auto no-scrollbar pb-1">
                    <TabsList className="inline-flex min-w-full h-auto bg-transparent border-b rounded-none p-0 gap-4 md:gap-8 justify-start">
                        <TabsTrigger value="narrative" className="tab-trigger">Story</TabsTrigger>
                        <TabsTrigger value="capabilities" className="tab-trigger">Capabilities</TabsTrigger>
                        <TabsTrigger value="routine" className="tab-trigger">Routine</TabsTrigger>
                        <TabsTrigger value="affinities" className="tab-trigger">Affinities</TabsTrigger>
                        <TabsTrigger value="working-style" className="tab-trigger">Style</TabsTrigger>
                        <TabsTrigger value="audience" className="tab-trigger">Audience</TabsTrigger>
                        <TabsTrigger value="portfolio" className="tab-trigger">Portfolio</TabsTrigger>
                    </TabsList>
                </div>
                
                <div className="mt-6">
                    <TabsContent value="narrative">
                        <CreatorNarrativeForm 
                            initialData={profile || {}} 
                            onSuccess={(data) => setProfile(data)} 
                        />
                    </TabsContent>
                    
                    <TabsContent value="capabilities">
                        <CreatorCapabilitiesForm 
                            initialData={profile || {}} 
                            onSuccess={(data) => setProfile(data)} 
                        />
                    </TabsContent>

                    <TabsContent value="routine">
                        <CreatorRoutineForm 
                            initialData={profile || {}} 
                            onSuccess={(data) => setProfile(data)} 
                        />
                    </TabsContent>

                    <TabsContent value="affinities">
                        <CreatorAffinityForm 
                            initialData={profile || {}} 
                            onSuccess={(data) => setProfile(data)} 
                        />
                    </TabsContent>
                    
                    <TabsContent value="working-style">
                        <WorkingStyleForm 
                            initialData={profile || {}} 
                            onSuccess={(data) => setProfile(data)} 
                        />
                    </TabsContent>
                    
                    <TabsContent value="audience">
                        <AudienceDemographicsForm 
                            initialData={profile || {}} 
                            onSuccess={(data) => setProfile(data)} 
                        />
                    </TabsContent>

                    <TabsContent value="portfolio">
                        <CreatorPortfolioManager 
                            initialProjects={projects} 
                            onUpdate={loadProfile}
                        />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
