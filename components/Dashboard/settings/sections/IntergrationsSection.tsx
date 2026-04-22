import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    RiFacebookCircleLine,
    RiInstagramLine,
    RiLinkedinLine,
    RiTiktokLine,
    RiTwitterXLine,
    RiYoutubeLine,
    RiLoader2Line,
    RiCheckLine,
} from "@remixicon/react";
import { getSocialAuthUrl, SocialPlatform } from "@/lib/data/socialVerification";
import { useAuth } from "@/hooks/store/auth/useAuth";
import toast from "react-hot-toast";

const socialPlatforms: { name: string; id: SocialPlatform; icon: React.ReactNode; description: string }[] = [
    {
        id: "youtube",
        name: "YouTube",
        description: "Verify your channel to enable reach monitoring",
        icon: <RiYoutubeLine className="text-[#FF0000]" />,
    },
    {
        id: "tiktok",
        name: "TikTok",
        description: "Connect your TikTok account for campaign insights",
        icon: <RiTiktokLine />,
    },
    {
        id: "instagram",
        name: "Instagram",
        description: "Sync your professional Instagram account",
        icon: <RiInstagramLine className="text-[#E4405F]" />,
    },
    {
        id: "facebook",
        name: "Facebook",
        description: "Connect your brand page",
        icon: <RiFacebookCircleLine className="text-[#1877F2]" />,
    },
    {
        id: "linkedin",
        name: "LinkedIn",
        description: "Professional reach and networking verification",
        icon: <RiLinkedinLine className="text-[#0A66C2]" />,
    },
    {
        id: "x",
        name: "X (Twitter)",
        description: "Verify your X account identity",
        icon: <RiTwitterXLine />,
    },
];

export function IntegrationsSection() {
    const { user } = useAuth();
    const [loadingPlatform, setLoadingPlatform] = React.useState<string | null>(null);

    const handleConnect = (platform: SocialPlatform) => {
        setLoadingPlatform(platform);
        try {
            const url = getSocialAuthUrl(platform);
            // Redirect to backend auth initiator
            window.location.href = url;
        } catch (err) {
            toast.error("Could not initiate verification");
            setLoadingPlatform(null);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-balance">Social Verification</h1>
                <p className="text-muted-foreground mt-1">
                    Connect your social accounts to verify your reach and unlock platform-linked features.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socialPlatforms.map((platform) => (
                    <Card key={platform.id} className="overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="text-3xl p-3 bg-muted rounded-xl">
                                        {platform.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{platform.name}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed max-w-[200px]">
                                            {platform.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <Button 
                                    className="w-full h-11 rounded-xl" 
                                    variant="outline"
                                    onClick={() => handleConnect(platform.id)}
                                    disabled={loadingPlatform !== null}
                                >
                                    {loadingPlatform === platform.id ? (
                                        <RiLoader2Line className="animate-spin mr-2 h-4 w-4" />
                                    ) : (
                                        "Connect Account"
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
