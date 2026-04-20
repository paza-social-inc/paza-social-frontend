"use client";

import CreatorRegistration from "@/components/Auth/accountType/Creator/Creator";

/** Creator journey: personal → profile → niche → social & career → photo (`CreatorRegistration`). */
export default function CreatorOnboardingPage() {
    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <CreatorRegistration />
        </div>
    );
}
