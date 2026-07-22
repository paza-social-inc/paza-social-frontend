"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, MapPin, User, Globe } from "lucide-react";
import {
    RiInstagramLine,
    RiTiktokLine,
    RiTwitterXLine,
    RiYoutubeLine,
    RiLinkedinLine,
    RiFacebookLine,
    RiTeamLine,
    RiUserLine,
} from "@remixicon/react";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { ProfileCompletionCard } from "./profile-completion-card";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { useQuery } from "@tanstack/react-query";
import { fetchAuthMe } from "@/lib/data/auth";
import { getCreatorProfile } from "@/lib/data/creator";
import { getBrandProfile } from "@/lib/data/brands";
import type { CreatorProfile } from "@/lib/data/creator";

// ── Category ID → Display label ───────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
    media_entertainment: "Media & Entertainment",
    lifestyle_wellness: "Lifestyle & Wellness",
    arts_creativity: "Arts & Creativity",
    business_innovation: "Business & Innovation",
    education_learning: "Education & Learning",
    community_social: "Community & Social Impact",
    sports_recreation: "Sports & Recreation",
    events_experiences: "Events & Experiences",
};

// ── Social platform config (mirrors UserInfoSheet.tsx pattern) ─────────

const SOCIAL_CONFIG = [
    { key: "instagram" as const, label: "Instagram", icon: RiInstagramLine, color: "text-pink-500", baseUrl: "https://instagram.com/" },
    { key: "tiktok" as const, label: "TikTok", icon: RiTiktokLine, color: "text-foreground", baseUrl: "https://tiktok.com/@" },
    { key: "twitter" as const, label: "X (Twitter)", icon: RiTwitterXLine, color: "text-sky-500", baseUrl: "https://x.com/" },
    { key: "youtube" as const, label: "YouTube", icon: RiYoutubeLine, color: "text-red-500", baseUrl: "https://youtube.com/@" },
    { key: "linkedin" as const, label: "LinkedIn", icon: RiLinkedinLine, color: "text-blue-600", baseUrl: "https://linkedin.com/in/" },
    { key: "facebook" as const, label: "Facebook", icon: RiFacebookLine, color: "text-blue-500", baseUrl: "https://facebook.com/" },
];

type SocialKey = (typeof SOCIAL_CONFIG)[number]["key"];

/** Fields the onboarding API stores but the CreatorProfile type may not declare yet. */
type SidebarProfileData = CreatorProfile & {
    gender?: string;
    country?: string;
    stateRegion?: string;
    category?: string;
    topics?: string[];
    subCategory?: string[];
    collabs?: string | string[];
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
    facebook?: string;
    /** The profile response includes the full user record nested under `user`. */
    user?: {
        id?: number;
        gender?: string | null;
        city?: string | null;
        birthday?: string | null;
        firstName?: string;
        lastName?: string;
    };
};

// ── Helpers ───────────────────────────────────────────────────────────

function genderLabel(g: string | undefined): string {
    if (!g) return "";
    const map: Record<string, string> = {
        male: "Male",
        female: "Female",
        non_binary: "Non-binary",
        prefer_not: "Prefer not to say",
        Male: "Male",
        Female: "Female",
        Other: "Other",
    };
    return map[g] ?? g;
}

function collabsToList(collabs: string | string[] | undefined): string[] {
    if (!collabs) return [];
    if (Array.isArray(collabs)) return collabs.filter(Boolean);
    return collabs.split(",").map((s) => s.trim()).filter(Boolean);
}

function buildSocialUrl(key: SocialKey, handle: string): string {
    if (handle.startsWith("http://") || handle.startsWith("https://")) return handle;
    const cfg = SOCIAL_CONFIG.find((c) => c.key === key);
    if (!cfg) return handle;
    return `${cfg.baseUrl}${handle.replace(/^@/, "")}`;
}



// ── Component ─────────────────────────────────────────────────────────

export const ProfileSidebar = () => {
    const { user } = useAuth();
    const isBrand = user?.accountType === "Business" || user?.accountType === "Brand";

    const { data: authMe } = useQuery({
        queryKey: ["auth-me-sidebar"],
        queryFn: fetchAuthMe,
        staleTime: 5 * 60 * 1000,
    });

    // Fetch the full profile based on account type.
    const {
        data: rawProfile,
        isLoading: profileLoading,
    } = useQuery({
        queryKey: ["profile-sidebar", isBrand ? "brand" : "creator", authMe?.businessId ?? null],
        enabled: !isBrand || Boolean(authMe?.businessId),
        staleTime: 30 * 1000,
        queryFn: async (): Promise<SidebarProfileData | null> => {
            if (isBrand) {
                const businessId = authMe?.businessId;
                if (!businessId) return null;
                const res = await getBrandProfile(businessId);
                return res.data as unknown as SidebarProfileData;
            }
            const res = await getCreatorProfile();
            return res.data as SidebarProfileData;
        },
    });
    

    const profile = rawProfile as SidebarProfileData | null;

    // Extract data from profile
    // gender lives on the nested user record; country/stateRegion are not yet
    // returned by the profile API (they need backend support to be persisted).
    const personalInfo = {
        gender: profile?.user?.gender || profile?.gender || undefined,
        country: profile?.country || undefined,
        stateRegion: profile?.stateRegion || undefined,
    };
    const hasPersonalInfo = Object.values(personalInfo).some(Boolean);

    const categoryLabel = profile?.category ? (CATEGORY_LABELS[profile.category] ?? profile.category) : null;
    const topics = profile?.topics ?? [];
    const hasSkills = Boolean(categoryLabel) || topics.length > 0;

    const socials = SOCIAL_CONFIG.map((c) => ({
        ...c,
        handle: (profile as unknown as Record<string, string | undefined>)?.[c.key] ?? "",
    })).filter((s) => Boolean(s.handle));

    const collaboratorNames = collabsToList(profile?.collabs);
    const hasCollaborators = collaboratorNames.length > 0;

    // ── Loading state ────────────────────────────────────────────────
    if (profileLoading) {
        return (
            <div className="border-r max-w-xs sticky top-0">
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            </div>
        );
    }

    return (
        <div className="border-r max-w-xs sticky top-0">
            <div className="space-y-6 divide-y">
                {/* ── Profile Progress ── */}
                <ProfileCompletionCard variant="full" />

                {/* ── Personal Info ── */}
                {hasPersonalInfo && (
                    <div className="p-6 pt-0">
                        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                            Personal Info
                        </h3>
                        <div className="space-y-3">
                            {personalInfo.gender && (
                                <div className="flex items-center gap-3">
                                    <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                                    <span className="text-sm">{genderLabel(personalInfo.gender)}</span>
                                </div>
                            )}
                            {personalInfo.country && (
                                <div className="flex items-center gap-3">
                                    <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
                                    <span className="text-sm">{personalInfo.country}</span>
                                </div>
                            )}
                            {personalInfo.stateRegion && (
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                                    <span className="text-sm">{personalInfo.stateRegion}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Skills ── */}
                <div className="p-6 pt-0">
                    <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                        Skills
                    </h3>
                    {hasSkills ? (
                        <div className="space-y-2">
                            {categoryLabel && (
                                <Badge variant="default" className="mb-2">
                                    {categoryLabel}
                                </Badge>
                            )}
                            {topics.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {topics.map((topic) => (
                                        <Badge key={topic} variant="outline" className="text-xs">
                                            {topic}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Empty>
                                <EmptyHeader>
                                    <EmptyMedia variant="icon" className="rounded-xl">
                                        <RiUserLine />
                                    </EmptyMedia>
                                    <EmptyTitle>No Skills Added</EmptyTitle>
                                    <EmptyDescription className="w-full">
                                        Add your skills to get discovered.
                                    </EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        </div>
                    )}
                </div>

                {/* ── Social Accounts ── */}
                {socials.length > 0 && (
                    <div className="p-6 pt-0">
                        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                            Social Accounts
                        </h3>
                        <div className="space-y-2">
                            {socials.map(({ key, icon: Icon, color, handle }) => {
                                const url = buildSocialUrl(key, handle);
                                const displayHandle = handle.startsWith("http")
                                    ? handle.replace(/https?:\/\//, "").replace(/\/$/, "")
                                    : handle;
                                return (
                                    <a
                                        key={key}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/60 transition-colors group"
                                    >
                                        <Icon className={`h-4 w-4 shrink-0 ${color}`} />
                                        <span className="text-sm truncate group-hover:underline">
                                            {displayHandle}
                                        </span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ── Collaborators / Team ── */}
                <div className="p-6 pt-0">
                    <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                        Collaborators
                    </h3>
                    {hasCollaborators ? (
                        <div className="space-y-3">
                            {collaboratorNames.map((name, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                                            {name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm truncate">{name}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Empty>
                                <EmptyHeader>
                                    <EmptyMedia variant="icon" className="rounded-xl">
                                        <RiTeamLine />
                                    </EmptyMedia>
                                    <EmptyTitle>No Collaborators Yet</EmptyTitle>
                                    <EmptyDescription className="w-full">
                                        People you work with will appear here.
                                    </EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
