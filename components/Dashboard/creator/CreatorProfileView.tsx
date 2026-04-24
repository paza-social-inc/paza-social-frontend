"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const creatorId = Number(user?.id);

    const loadProfile = useCallback(async () => {
        if (!creatorId) return;
        setLoading(true);
        try {
            const res = await getCreatorProfile();
            if (res.success) {
                setProfile(res.data);
            } else {
                setError(res.message || "Failed to load creator profile");
            }
        } catch {
            setError("Error fetching creator profile");
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

    if (error || !profile) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <RiErrorWarningLine className="h-12 w-12 text-destructive opacity-50" />
                <h3 className="text-lg font-semibold">Creator Profile Not Found</h3>
                <p className="text-muted-foreground max-w-sm">{error || "Please complete your onboarding to access the creator dashboard."}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Tabs defaultValue="narrative" className="w-full">
                <TabsList className="grid grid-cols-2 lg:grid-cols-7 w-full h-auto gap-1 p-1 bg-muted/50">
                    <TabsTrigger value="narrative" className="py-2">Story</TabsTrigger>
                    <TabsTrigger value="capabilities" className="py-2">Capabilities</TabsTrigger>
                    <TabsTrigger value="routine" className="py-2">Routine</TabsTrigger>
                    <TabsTrigger value="affinities" className="py-2">Affinities</TabsTrigger>
                    <TabsTrigger value="working-style" className="py-2">Style</TabsTrigger>
                    <TabsTrigger value="audience" className="py-2">Audience</TabsTrigger>
                    <TabsTrigger value="portfolio" className="py-2">Portfolio</TabsTrigger>
                </TabsList>
                
                <div className="mt-6">
                    <TabsContent value="narrative">
                        <CreatorNarrativeForm 
                            initialData={profile} 
                            onSuccess={(data) => setProfile(data)} 
                        />
                    </TabsContent>
                    
                    <TabsContent value="capabilities">
                        <CreatorCapabilitiesForm 
                            initialData={profile} 
                            onSuccess={(data) => setProfile(data)} 
                        />
                    </TabsContent>

                    <TabsContent value="routine">
                        <CreatorRoutineForm 
                            initialData={profile} 
                            onSuccess={(data) => setProfile(data)} 
                        />
                    </TabsContent>

                    <TabsContent value="affinities">
                        <CreatorAffinityForm 
                            initialData={profile} 
                            onSuccess={(data) => setProfile(data)} 
                        />
                    </TabsContent>
                    
                    <TabsContent value="working-style">
                        <WorkingStyleForm 
                            initialData={profile} 
                            onSuccess={(data) => setProfile(data)} 
                        />
                    </TabsContent>
                    
                    <TabsContent value="audience">
                        <AudienceDemographicsForm 
                            initialData={profile} 
                            onSuccess={(data) => setProfile(data)} 
                        />
                    </TabsContent>

                    <TabsContent value="portfolio">
                        <CreatorPortfolioManager 
                            initialProjects={profile.pastProjects || []} 
                            onUpdate={loadProfile}
                        />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
