import type { Project, ProjectCreatorProfileRef } from "@/types/projects/projectTypes";

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

function firstFromArray(arr: unknown): string {
    if (!Array.isArray(arr)) return "";
    for (const x of arr) {
        const u = coerceUrl(x);
        if (u) return u;
    }
    return "";
}

function profileThumb(cp: ProjectCreatorProfileRef | null | undefined): string {
    if (!cp) return "";
    return coerceUrl(cp.preview) || coerceUrl(cp.main) || coerceUrl(cp.avatar);
}

/**
 * Image URL for showcase grid cards — project media first, then linked campaign, then creator profile art.
 */
export function resolveProjectThumbnail(project: Project): string {
    const p = project as Project & { media_urls?: string[] };

    return (
        firstFromArray(p.images) ||
        firstFromArray(p.mediaUrls) ||
        firstFromArray(p.media_urls) ||
        firstFromArray(p.campaign?.attachments) ||
        profileThumb(p.creator?.creatorProfile ?? undefined) ||
        ""
    );
}
