"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { useQuery } from "@tanstack/react-query";
import { fetchAuthMe } from "@/lib/data/auth";
import { BrandProfile, BrandPastProject } from "@/lib/data/brands";
import IdentityForm from "./IdentityForm";
import NarrativeForm from "./NarrativeForm";
import ProductManager from "./ProductManager";
import IpDeclarationForm from "./IpDeclarationForm";
import PastProjectsManager from "./PastProjectsManager";
import BrandVoiceForm from "./BrandVoiceForm";
import BrandPromptsForm from "./BrandPromptsForm";
import BrandMediaUpload from "./BrandMediaUpload";
import { RiLoader2Line, RiErrorWarningLine, RiStore2Line } from "@remixicon/react";
import { Button } from "@/components/ui/button";

export default function BrandProfileView() {
    const { user, token, isAuthenticated } = useAuth();

    // AuthMe usually contains the canonical business ID
    const { data: authMe } = useQuery({
        queryKey: ["auth-me", token ?? null],
        queryFn: fetchAuthMe,
        enabled: Boolean(isAuthenticated && token),
        staleTime: 5 * 60 * 1000,
    });

    // Try to get businessId from: authMe -> user context -> localStorage bridge (for very fresh creations)
    const [localBridgeId, setLocalBridgeId] = React.useState<number | null>(null);

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const cached = localStorage.getItem("paza_latest_business_id");
            if (cached) setLocalBridgeId(Number(cached));
        }
    }, []);

    const businessId = authMe?.businessId || (user as { businessId?: number })?.businessId || localBridgeId;
    const [profile, setProfile] = useState<BrandProfile | null>(null);
    const [projects, setProjects] = useState<BrandPastProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProfile = React.useCallback(async () => {
        if (!businessId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const { getBrandProfile, listBrandPastProjects } = await import("@/lib/data/brands");

            // Fetch both profile and projects in parallel for better performance
            const [profileRes, projectsRes] = await Promise.all([
                getBrandProfile(businessId),
                listBrandPastProjects(businessId)
            ]);

            if (profileRes.success) {
                setProfile(profileRes.data);
            } else {
                setError(profileRes.message || "Failed to load profile");
            }

            if (projectsRes.success) {
                setProjects(projectsRes.data);
            }
        } catch (err: unknown) {
            const e = err as { response?: { status?: number }; data?: { message?: string } };
            // If the business doesn't exist in the DB, it's effectively a "new" brand onboarding case
            if (e.response?.status === 404 || (typeof e.data?.message === 'string' && e.data.message.includes("not found"))) {
                setProfile(null);
            } else {
                setError("Failed to fetch brand profile data");
            }
        } finally {
            setLoading(false);
        }
    }, [businessId]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <RiLoader2Line className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Loading brand profile...</p>
            </div>
        );
    }

    // Handle case where user is a business but hasn't set up a brand/business entity yet
    if (!businessId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-muted/50 to-background shadow-2xl dark:from-zinc-900/50">
                    <div className="relative h-32 w-full overflow-hidden sm:h-40">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-rose-500 to-amber-500 opacity-20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="rounded-full bg-background/20 p-4 backdrop-blur-md ring-1 ring-white/20">
                                <RiStore2Line className="h-10 w-10 text-orange-500 sm:h-12 sm:w-12" />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 text-center sm:p-10">
                        <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">Ready to build your Brand?</h3>
                        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                            Join our ecosystem of creators. Once you define your brand identity, you&apos;ll be able to
                            set your voice, tone, and showcase products to the world.
                        </p>

                        <div className="mt-10 text-left">
                            <div className="mb-6 flex items-center gap-2 border-b border-border pb-2">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">1</span>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Initial Identity</h4>
                            </div>
                            <IdentityForm
                                businessId={businessId || 0}
                                initialData={{}}
                                onSuccess={() => {
                                    window.location.reload();
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <RiErrorWarningLine className="h-12 w-12 text-destructive opacity-50" />
                <h3 className="text-lg font-semibold">Something went wrong</h3>
                <p className="text-muted-foreground max-w-sm">{error || "Could not find your business profile. Our team has been notified."}</p>
                <Button variant="outline" onClick={loadProfile}>Try Again</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Tabs defaultValue="identity" className="w-full">
                <TabsList className="flex w-full h-auto gap-1 p-1 bg-muted/50 overflow-x-auto">
                    <TabsTrigger value="identity" className="py-2 text-xs sm:text-sm whitespace-nowrap">Identity</TabsTrigger>
                    <TabsTrigger value="media" className="py-2 text-xs sm:text-sm whitespace-nowrap">Media</TabsTrigger>
                    <TabsTrigger value="narrative" className="py-2 text-xs sm:text-sm whitespace-nowrap">Narrative</TabsTrigger>
                    <TabsTrigger value="voice" className="py-2 text-xs sm:text-sm whitespace-nowrap">Voice & Tone</TabsTrigger>
                    <TabsTrigger value="prompts" className="py-2 text-xs sm:text-sm whitespace-nowrap">Prompts</TabsTrigger>
                    <TabsTrigger value="portfolio" className="py-2 text-xs sm:text-sm whitespace-nowrap">Portfolio</TabsTrigger>
                    <TabsTrigger value="products" className="py-2 text-xs sm:text-sm whitespace-nowrap">Products</TabsTrigger>
                    <TabsTrigger value="protection" className="py-2 text-xs sm:text-sm whitespace-nowrap">IP Protection</TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <TabsContent value="identity">
                        <IdentityForm
                            businessId={businessId}
                            initialData={profile}
                            onSuccess={(data) => setProfile(data)}
                        />
                    </TabsContent>

                    <TabsContent value="media">
                        <BrandMediaUpload
                            businessId={businessId}
                            currentLogo={profile.logo}
                            currentCover={profile.coverImage}
                            onUpdate={(updates) => setProfile(prev => prev ? { ...prev, ...updates } : prev)}
                        />
                    </TabsContent>

                    <TabsContent value="narrative">
                        <NarrativeForm
                            businessId={businessId}
                            initialData={profile}
                            onSuccess={(data) => setProfile(data)}
                        />
                    </TabsContent>

                    <TabsContent value="voice">
                        <BrandVoiceForm
                            businessId={businessId}
                            initialData={profile}
                            onSuccess={(data) => setProfile(data)}
                        />
                    </TabsContent>

                    <TabsContent value="prompts">
                        <BrandPromptsForm
                            businessId={businessId}
                            initialData={profile}
                            onSuccess={(data) => setProfile(data)}
                        />
                    </TabsContent>

                    <TabsContent value="portfolio">
                        <PastProjectsManager
                            businessId={businessId}
                            initialProjects={projects}
                            onUpdate={loadProfile}
                        />
                    </TabsContent>

                    <TabsContent value="products">
                        <ProductManager
                            businessId={businessId}
                            initialProducts={profile.products || []}
                        />
                    </TabsContent>

                    <TabsContent value="protection">
                        <IpDeclarationForm
                            businessId={businessId}
                            isAlreadyEnabled={profile.ipPublisherEnabled}
                            onSuccess={loadProfile}
                        />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
