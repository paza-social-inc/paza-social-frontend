import { pazaApi } from "@/lib/axiosClients";
import type { Creator } from "@/types/preferences/Creator/CreatorType";

/**
 * Maps client onboarding state to the body accepted by
 * `PUT /api/auth/creator-profile/full` (see Pbbackend auth.controller).
 */
export function buildCreatorProfilePayload(data: Creator): Record<string, unknown> {
    const collabsStr = Array.isArray(data.collabs)
        ? data.collabs.filter(Boolean).join(", ")
        : String(data.collabs ?? "");

    const payload: Record<string, unknown> = {
        creatorname: data.creatorname,
        about: data.about,
        main: data.main || data.category || "",
        followers: data.followers,
        instagram: data.instagram,
        tiktok: data.tiktok,
        twitter: data.twitter,
        youtube: data.youtube,
        linkedin: data.linkedin,
        facebook: data.facebook,
        social: data.social,
        experience: data.experience,
        milestones: data.milestones,
        collabs: collabsStr,
        category: data.category,
        subCategory: data.subCategory ?? [],
        corevalue: data.corevalue,
        coreValues: data.coreValues ?? [],
        subCoreValues: data.subCoreValues ?? [],
        topics: data.topics ?? [],
    };

    // Avoid persisting ephemeral blob: URLs from local file picks until upload pipeline exists.
    if (data.avatar && !data.avatar.startsWith("blob:")) {
        payload.avatar = data.avatar;
    }
    if (data.preview && !data.preview.startsWith("blob:")) {
        payload.preview = data.preview;
    }

    return payload;
}

export async function saveCreatorProfileFull(data: Creator): Promise<unknown> {
    const res = await pazaApi.put("/api/auth/creator-profile/full", buildCreatorProfilePayload(data));
    return res.data;
}
