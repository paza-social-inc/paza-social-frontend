"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { getBrandProfile, BrandProfile } from "@/lib/data/brands";
import IdentityForm from "./IdentityForm";
import NarrativeForm from "./NarrativeForm";
import ProductManager from "./ProductManager";
import IpDeclarationForm from "./IpDeclarationForm";
import PastProjectsManager from "./PastProjectsManager";
import BrandVoiceForm from "./BrandVoiceForm";
import BrandPromptsForm from "./BrandPromptsForm";
import BrandMediaUpload from "./BrandMediaUpload";
import { RiLoader2Line, RiErrorWarningLine } from "@remixicon/react";

export default function BrandProfileView() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<BrandProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const businessId = (user as { businessId?: number })?.businessId || (user?.id ? Number(user.id) : null);

    const loadProfile = React.useCallback(async () => {
        if (!businessId) return;
        setLoading(true);
        try {
            const res = await getBrandProfile(businessId);
            if (res.success) {
                setProfile(res.data);
            } else {
                setError(res.message || "Failed to load profile");
            }
        } catch {
            setError("Failed to fetch brand profile data");
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

    if (error || !profile || businessId == null) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <RiErrorWarningLine className="h-12 w-12 text-destructive opacity-50" />
                <h3 className="text-lg font-semibold">Something went wrong</h3>
                <p className="text-muted-foreground max-w-sm">{error || "Could not find your business profile. Our team has been notified."}</p>
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
                            initialProjects={profile.pastProjects || []} 
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
