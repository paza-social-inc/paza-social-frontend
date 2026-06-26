import { Suspense } from "react";
import { RiLoader2Line } from "@remixicon/react";
import BrandProfileView from "@/components/Dashboard/brand/BrandProfileView";

export default function BrandPage() {
    return (
        <div className="container max-w-5xl mx-auto py-6 px-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Brand Profile</h1>
                <p className="text-muted-foreground mt-1">Manage your brand identity, voice, and portfolio.</p>
            </div>
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <RiLoader2Line className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse">Loading brand profile...</p>
                </div>
            }>
                <BrandProfileView />
            </Suspense>
        </div>
    );
}