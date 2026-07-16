import { pazaApi, getAuthHeaderConfig } from "@/lib/axiosClients";
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
        // ── Personal info (from PersonalInfoStep) ──
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        country: data.country,
        stateRegion: data.stateRegion,
        // ── Social links (from SocialMediaStep) ──
        instagram: data.instagram,
        tiktok: data.tiktok,
        twitter: data.twitter,
        youtube: data.youtube,
        linkedin: data.linkedin,
        facebook: data.facebook,
        social: data.social,
        // ── Career (from SocialCareerStep) ──
        experience: data.experience,
        milestones: data.milestones,
        collabs: collabsStr,
        // ── Skills (from CategoriesValueStep) ──
        category: data.category,
        subCategory: data.subCategory ?? [],
        corevalue: data.corevalue,
        coreValues: data.coreValues ?? [],
        subCoreValues: data.subCoreValues ?? [],
        topics: data.topics ?? [],
    };

    // Persist uploaded URL values only.
    if (data.avatar && !data.avatar.startsWith("blob:")) {
        payload.avatar = data.avatar;
    }
    if (data.preview && !data.preview.startsWith("blob:")) {
        payload.preview = data.preview;
    }

    return payload;
}

async function uploadImageFile(file: File): Promise<string> {
    const form = new FormData();
    form.append("file", file);
    const authCfg = getAuthHeaderConfig();
    const res = await pazaApi.post("/api/uploads/image", form, {
        headers: {
            "Content-Type": "multipart/form-data",
            ...(authCfg.headers || {}),
        },
    });
    const url = res?.data?.data?.url;
    if (typeof url !== "string" || !url) {
        throw new Error("Upload succeeded but no file URL was returned.");
    }
    return url;
}

export async function saveCreatorProfileFull(data: Creator): Promise<unknown> {
    const payloadData: Creator = { ...data };

    if (payloadData.avatarFile instanceof File) {
        payloadData.avatar = await uploadImageFile(payloadData.avatarFile);
        payloadData.avatarFile = undefined;
    }

    if (payloadData.previewFile instanceof File) {
        payloadData.preview = await uploadImageFile(payloadData.previewFile);
        payloadData.previewFile = undefined;
    }

    const authCfg = getAuthHeaderConfig();
    const res = await pazaApi.put("/api/auth/creator-profile/full", buildCreatorProfilePayload(payloadData), authCfg);
    return res.data;
}
