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
import { RiLoader2Line, RiErrorWarningLine } from "@remixicon/react";

export default function BrandProfileView() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<BrandProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const businessId = (user as any)?.businessId || Number(user?.id); // Workaround if businessId isn't on user object yet

    const loadProfile = async () => {
        if (!businessId) return;
        setLoading(true);
        try {
            const res = await getBrandProfile(businessId);
            if (res.success) {
                setProfile(res.data);
            } else {
                setError(res.message || "Failed to load profile");
            }
        } catch (err) {
            setError("Failed to fetch brand profile data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, [businessId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <RiLoader2Line className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Loading brand profile...</p>
            </div>
        );
    }

    if (error || !profile) {
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
                <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full h-auto gap-1 p-1 bg-muted/50">
                    <TabsTrigger value="identity" className="py-2">Identity</TabsTrigger>
                    <TabsTrigger value="narrative" className="py-2">Narrative</TabsTrigger>
                    <TabsTrigger value="portfolio" className="py-2">Portfolio</TabsTrigger>
                    <TabsTrigger value="products" className="py-2">Products</TabsTrigger>
                    <TabsTrigger value="protection" className="py-2">IP Protection</TabsTrigger>
                </TabsList>
                
                <div className="mt-6">
                    <TabsContent value="identity">
                        <IdentityForm 
                            businessId={businessId} 
                            initialData={profile} 
                            onSuccess={(data) => setProfile(data)} 
                        />
                    </TabsContent>
                    
                    <TabsContent value="narrative">
                        <NarrativeForm 
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
