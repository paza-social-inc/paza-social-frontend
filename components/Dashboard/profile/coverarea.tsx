"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RiCameraLine, RiLoader2Line } from "@remixicon/react";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAuthMe } from "@/lib/data/auth";
import { getCreatorProfile, uploadCreatorAvatar, uploadCreatorPreview } from "@/lib/data/creator";
import { getBrandProfile, uploadBrandLogo, uploadBrandCoverImage } from "@/lib/data/brands";
import toast from "react-hot-toast";

export default function CoverArea() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const isBrand = user?.accountType === "Business" || user?.accountType === "Brand";

    const bgInputRef = useRef<HTMLInputElement | null>(null);
    const avatarInputRef = useRef<HTMLInputElement | null>(null);

    // Live image sources. Seeded from the persisted profile, updated optimistically
    // and confirmed with the persisted S3 URL once the upload resolves.
    const [bgImage, setBgImage] = useState("");
    const [avatarImage, setAvatarImage] = useState("");
    const [uploadingBg, setUploadingBg] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // Brand profiles are keyed on businessId from /api/users/me.
    const { data: authMe } = useQuery({
        queryKey: ["auth-me-cover"],
        queryFn: fetchAuthMe,
        staleTime: 5 * 60 * 1000,
    });

    // Load the persisted media so the cover/avatar show on page load (and survive refresh).
    const { data: profile } = useQuery({
        queryKey: ["profile-media", isBrand ? "brand" : "creator", authMe?.businessId ?? null],
        enabled: !isBrand || Boolean(authMe?.businessId),
        staleTime: 30 * 1000,
        queryFn: async () => {
            if (isBrand) {
                const businessId = authMe?.businessId;
                if (!businessId) return { avatar: "", bg: "" };
                const res = await getBrandProfile(businessId);
                return { avatar: res.data?.logo ?? "", bg: res.data?.coverImage ?? "" };
            }
            const res = await getCreatorProfile();
            return { avatar: res.data?.avatar ?? "", bg: res.data?.preview ?? "" };
        },
    });

    // Seed local state once the persisted profile media resolves.
    useEffect(() => {
        if (profile) {
            if (profile.avatar) setAvatarImage(profile.avatar);
            if (profile.bg) setBgImage(profile.bg);
        }
    }, [profile]);

    const refreshCompletion = () => {
        queryClient.invalidateQueries({ queryKey: ["profile-completion"] });
        queryClient.invalidateQueries({ queryKey: ["profile-media"] });
    };

    const handleBgChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // Optimistic preview so the user sees the new banner immediately.
        setBgImage(URL.createObjectURL(file));
        setUploadingBg(true);
        try {
            if (isBrand) {
                const businessId = authMe?.businessId;
                if (!businessId) throw new Error("Business profile not found");
                const res = await uploadBrandCoverImage(businessId, file);
                setBgImage(res.data?.coverImage ?? "");
            } else {
                const res = await uploadCreatorPreview(file);
                setBgImage(res.data?.preview ?? "");
            }
            refreshCompletion();
            toast.success("Banner updated");
        } catch (err) {
            // Revert to the persisted value on failure.
            setBgImage(profile?.bg ?? "");
            toast.error(err instanceof Error ? err.message : "Failed to update banner");
        } finally {
            setUploadingBg(false);
            if (bgInputRef.current) bgInputRef.current.value = "";
        }
    };

    const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarImage(URL.createObjectURL(file));
        setUploadingAvatar(true);
        try {
            if (isBrand) {
                const businessId = authMe?.businessId;
                if (!businessId) throw new Error("Business profile not found");
                const res = await uploadBrandLogo(businessId, file);
                setAvatarImage(res.data?.logo ?? "");
            } else {
                const res = await uploadCreatorAvatar(file);
                setAvatarImage(res.data?.avatar ?? "");
            }
            refreshCompletion();
            toast.success("Profile picture updated");
        } catch (err) {
            setAvatarImage(profile?.avatar ?? "");
            toast.error(err instanceof Error ? err.message : "Failed to update profile picture");
        } finally {
            setUploadingAvatar(false);
            if (avatarInputRef.current) avatarInputRef.current.value = "";
        }
    };

    const initials = (user?.firstname?.[0] ?? "") + (user?.lastname?.[0] ?? "");

    return (
        <div className="relative h-64 group/cover bg-muted-foreground/40 dark:border-b-0 border-b">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all"
                style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
            />

            {/* Background Upload Hover Overlay */}
            <div
                className="absolute inset-0 group-hover/cover:bg-muted-foreground/60 group-hover/cover:dark:bg-background/40 flex items-center justify-center transition-all cursor-pointer z-10"
                onClick={() => bgInputRef.current?.click()}
            >
                <Button
                    variant="ghost"
                    className="cursor-pointer rounded-full h-11 w-11 group-hover/cover:bg-secondary group-hover/cover:dark:bg-background"
                    size="icon"
                >
                    {uploadingBg ? (
                        <RiLoader2Line className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : (
                        <RiCameraLine className="group-hover/cover:opacity-100 opacity-0 transition-all text-muted-foreground h-6 w-6" />
                    )}
                </Button>
                <input
                    type="file"
                    accept="image/*"
                    ref={bgInputRef}
                    onChange={handleBgChange}
                    className="hidden"
                />
            </div>

            {/* Profile Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 px-8 pb-6 z-20">
                <div className="flex items-end justify-end flex-wrap gap-4 relative w-full">
                    <div className="flex gap-6 flex-col items-start absolute top-0 left-0">
                        {/* Avatar Group */}
                        <div className="relative group/avatar overflow-hidden">
                            <Avatar className="h-40 w-40 border-4 bg-muted-foreground border-background relative">
                                <AvatarImage src={avatarImage} className="object-cover" />
                                <AvatarFallback className="text-2xl">
                                    {initials || "U"}
                                </AvatarFallback>
                            </Avatar>

                            {/* Avatar Upload Hover Overlay */}
                            <div
                                className="absolute rounded-full inset-0 group-hover/avatar:bg-muted-foreground/60 group-hover/avatar:dark:bg-background/40 flex items-center justify-center transition-all cursor-pointer"
                                onClick={() => avatarInputRef.current?.click()}
                            >
                                <Button
                                    variant="ghost"
                                    className="cursor-pointer rounded-full h-11 w-11 group-hover/avatar:bg-secondary group-hover/avatar:dark:bg-background"
                                    size="icon"
                                >
                                    {uploadingAvatar ? (
                                        <RiLoader2Line className="h-6 w-6 animate-spin text-muted-foreground" />
                                    ) : (
                                        <RiCameraLine className="group-hover/avatar:opacity-100 opacity-0 transition-all text-muted-foreground h-6 w-6" />
                                    )}
                                </Button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={avatarInputRef}
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>
                    <Button asChild className="mb-2 min-h-11 touch-manipulation">
                        <Link href="/showcase/new">+ New Project</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
