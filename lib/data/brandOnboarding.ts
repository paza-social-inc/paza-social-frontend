import { pazaApi } from "@/lib/axiosClients";

/** Client state for the brand onboarding screens (matches `BrandOnboarding` form). */
export type BrandOnboardingFormState = {
    companyName: string;
    website: string;
    email: string;
    phone: string;
    address: string;
    role: string;
    instagram: string;
    tiktok: string;
    youtube: string;
    twitter: string;
    linkedin: string;
    facebook: string;
    /** Optional estimated reach / follower count (shown in profile description). */
    followers: string;
    careerMilestones: string;
    profilePicture: File | null;
};

export function parseCoreValuesToArray(raw: string): string[] {
    return raw
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean);
}

/**
 * Maps onboarding state to the body accepted by
 * `PUT /api/brands/:businessId/profile/full` (see brand.service `allowedFields`).
 */
export function buildBrandProfilePayload(data: BrandOnboardingFormState): Record<string, unknown> {
    const descriptionParts: string[] = [];
    if (data.role?.trim()) descriptionParts.push(`Contact role: ${data.role.trim()}`);
    if (data.followers?.trim()) descriptionParts.push(`Estimated reach: ${data.followers.trim()}`);
    const mergedDescription = descriptionParts.join("\n\n");

    const payload: Record<string, unknown> = {
        brandname: data.companyName.trim(),
        website: data.website.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        address: data.address.trim(),
        description: mergedDescription || undefined,
        mission: data.careerMilestones.trim() || undefined,
        tagline: "",
        values: [] as string[],
    };

    const ig = data.instagram.trim();
    const tt = data.tiktok.trim();
    const yt = data.youtube.trim();
    const tw = data.twitter.trim();
    const li = data.linkedin.trim();
    const fb = data.facebook.trim();
    if (ig) payload.instagram = ig;
    if (tt) payload.tiktok = tt;
    if (yt) payload.youtube = yt;
    if (tw) payload.twitter = tw;
    if (li) payload.linkedin = li;
    if (fb) payload.facebook = fb;

    return payload;
}

/** Reuses an existing membership from GET /api/auth/me when present. */
export async function ensureBusinessId(args: { companyName?: string; website?: string }): Promise<number> {
    const me = await pazaApi.get<{ data?: { businessId?: number | null } }>("/api/auth/me");
    const existing = me.data?.data?.businessId;
    if (existing != null) return existing;

    const res = await pazaApi.post<{ businessId: number }>("/api/auth/business/bootstrap", {
        name: args.companyName?.trim() || "My business",
        website: args.website?.trim(),
    });
    return res.data.businessId;
}

export async function saveBrandProfileFull(
    businessId: number,
    data: BrandOnboardingFormState
): Promise<unknown> {
    const payload = buildBrandProfilePayload(data);
    const res = await pazaApi.put(`/api/brands/${businessId}/profile/full`, payload);
    return res.data;
}
