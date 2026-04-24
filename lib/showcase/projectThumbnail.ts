import type { Project, ProjectCreatorProfileRef } from "@/types/projects/projectTypes";
import { DEFAULT_API_URL } from "@/lib/axiosClients";

function coerceUrl(entry: unknown): string {
    if (entry == null || entry === "") return "";
    if (typeof entry === "string") {
        const s = entry.trim();
        return s;
    }
    if (typeof entry === "object" && entry !== null && "url" in entry) {
        return String((entry as { url?: unknown }).url ?? "").trim();
    }
    return "";
}

function toAbsoluteUploadUrl(raw: string): string {
    const v = String(raw ?? "").trim();
    if (!v) return "";
    if (/^https?:\/\//i.test(v) || v.startsWith("blob:") || v.startsWith("data:")) return v;
    const normalized = v.replace(/\\/g, "/");
    if (normalized.startsWith("localhost:") || normalized.startsWith("127.0.0.1:")) {
        return `http://${normalized}`;
    }
    if (normalized.startsWith("/uploads/")) {
        const base = (process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL).replace(/\/+$/, "");
        return `${base}${normalized}`;
    }
    if (normalized.startsWith("uploads/")) {
        const base = (process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL).replace(/\/+$/, "");
        return `${base}/${normalized}`;
    }
    // Some payloads send only a file name; treat it as uploaded image.
    if (!normalized.includes("/") && /\.(png|jpe?g|gif|webp|bmp|svg|avif)$/i.test(normalized)) {
        const base = (process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL).replace(/\/+$/, "");
        return `${base}/uploads/images/${normalized}`;
    }
    return normalized;
}

function looksLikeImageUrl(url: string): boolean {
    const v = String(url ?? "").trim();
    if (!v) return false;
    if (v.startsWith("blob:") || v.startsWith("data:image/")) return true;
    try {
        const pathname = new URL(v).pathname.toLowerCase();
        return /\.(png|jpe?g|gif|webp|bmp|svg|avif)$/i.test(pathname);
    } catch {
        return /\.(png|jpe?g|gif|webp|bmp|svg|avif)$/i.test(v.toLowerCase());
    }
}

function firstFromArray(arr: unknown, imageOnly = false): string {
    if (!Array.isArray(arr)) return "";
    for (const x of arr) {
        const u = toAbsoluteUploadUrl(coerceUrl(x));
        if (!u) continue;
        if (imageOnly && !looksLikeImageUrl(u)) continue;
        return u;
    }
    return "";
}

function collectFromArray(arr: unknown, imageOnly = false): string[] {
    if (!Array.isArray(arr)) return [];
    const out: string[] = [];
    for (const x of arr) {
        const u = toAbsoluteUploadUrl(coerceUrl(x));
        if (!u) continue;
        if (imageOnly && !looksLikeImageUrl(u)) continue;
        out.push(u);
    }
    return out;
}

function profileThumb(cp: ProjectCreatorProfileRef | null | undefined): string {
    if (!cp) return "";
    return (
        toAbsoluteUploadUrl(coerceUrl(cp.preview)) ||
        toAbsoluteUploadUrl(coerceUrl(cp.main)) ||
        toAbsoluteUploadUrl(coerceUrl(cp.avatar))
    );
}

/**
 * Image URL for showcase grid cards — project media first, then linked campaign, then creator profile art.
 */
export function resolveProjectThumbnail(project: Project): string {
    const p = project as Project & {
        media_urls?: string[];
        imageUrl?: string;
        image?: string;
        thumbnail?: string;
    };

    return (
        firstFromArray(p.images, true) ||
        firstFromArray(p.mediaUrls, true) ||
        firstFromArray(p.media_urls, true) ||
        (looksLikeImageUrl(toAbsoluteUploadUrl(coerceUrl(p.imageUrl))) ? toAbsoluteUploadUrl(coerceUrl(p.imageUrl)) : "") ||
        (looksLikeImageUrl(toAbsoluteUploadUrl(coerceUrl(p.image))) ? toAbsoluteUploadUrl(coerceUrl(p.image)) : "") ||
        (looksLikeImageUrl(toAbsoluteUploadUrl(coerceUrl(p.thumbnail))) ? toAbsoluteUploadUrl(coerceUrl(p.thumbnail)) : "") ||
        firstFromArray(p.campaign?.attachments, true) ||
        profileThumb(p.creator?.creatorProfile ?? undefined) ||
        ""
    );
}

/**
 * Ordered candidate image URLs for resilient card rendering.
 * Prefer likely image links first, then allow generic URL fallbacks.
 */
export function resolveProjectThumbnailCandidates(project: Project): string[] {
    const p = project as Project & {
        media_urls?: string[];
        imageUrl?: string;
        image?: string;
        thumbnail?: string;
    };

    const strict = [
        ...collectFromArray(p.images, true),
        ...collectFromArray(p.mediaUrls, true),
        ...collectFromArray(p.media_urls, true),
        ...collectFromArray(p.campaign?.attachments, true),
    ];

    const loose = [
        ...collectFromArray(p.images, false),
        ...collectFromArray(p.mediaUrls, false),
        ...collectFromArray(p.media_urls, false),
        ...collectFromArray(p.campaign?.attachments, false),
        toAbsoluteUploadUrl(coerceUrl(p.imageUrl)),
        toAbsoluteUploadUrl(coerceUrl(p.image)),
        toAbsoluteUploadUrl(coerceUrl(p.thumbnail)),
        profileThumb(p.creator?.creatorProfile ?? undefined),
    ].filter(Boolean);

    return Array.from(new Set([...strict, ...loose]));
}
