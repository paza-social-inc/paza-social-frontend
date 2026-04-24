import BrandProfileView from "@/components/Dashboard/brand/BrandProfileView";

export default function BrandPage() {
    return (
        <div className="container max-w-5xl mx-auto py-6 px-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Brand Profile</h1>
                <p className="text-muted-foreground mt-1">Manage your brand identity, voice, and portfolio.</p>
            </div>
            <BrandProfileView />
        </div>
    );
}
