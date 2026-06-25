/**
 * Profile completion calculator.
 *
 * A profile (creator or brand) is divided into sections, each backed by its own
 * form/tab on the profile page. We treat the profile as "complete" in proportion
 * to how many of those sections have meaningful content filled in.
 *
 * This is the most sensible single metric because the whole UI is structured
 * around these sections — each section is independently editable, so counting
 * filled sections maps directly to what the user sees as progress.
 */
import type { CreatorProfile } from "@/lib/data/creator";
import type { BrandProfile } from "@/lib/data/brands";

type Maybe<T> = T | null | undefined;

function hasValue(v: unknown): boolean {
    if (v == null) return false;
    if (typeof v === "string") return v.trim().length > 0;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "object") return Object.keys(v as Record<string, unknown>).length > 0;
    if (typeof v === "number") return v > 0;
    return Boolean(v);
}

/** A section counts as done if ANY of its defining fields has content. */
function isSectionFilled(fields: unknown[]): boolean {
    return fields.some(hasValue);
}

interface SectionCheck {
    /** Stable id, used for the "jump to next incomplete" deep link. */
    id: string;
    /** Field values that, when present, mark this section as filled. */
    fields: unknown[];
}

/**
 * Each tab on the creator profile, with the fields that define it.
 * Field names must match the real backend entity columns (CreatorProfile).
 * Matches the 7 tabs in CreatorProfileView: Story, Capabilities, Routine,
 * Affinities, Style, Audience, Portfolio.
 */
export function creatorSections(profile: Maybe<CreatorProfile>): SectionCheck[] {
    const p = profile ?? ({} as CreatorProfile);
    return [
        { id: "narrative", fields: [p.originStory, p.originStoryTags, p.about] },
        { id: "capabilities", fields: [p.creatorType, p.skillLevel, p.domainShards, p.valueProp, p.assetClassPrimary] },
        { id: "routine", fields: [p.dailyRoutineText, p.dailyCarryText, p.nostalgicProductsText] },
        { id: "affinities", fields: [p.dreamBrandCollaboration, p.alwaysRecommend, p.dreamCollaborator] },
        { id: "working-style", fields: [p.availabilityType, p.personalityTags] },
        { id: "audience", fields: [p.audienceLocale, p.audienceDescription, p.languages] },
        { id: "portfolio", fields: [p.pastProjects, p.meaningfulProject, p.primaryVerticals] },
    ];
}

/**
 * Each tab on the brand profile, with the fields that define it.
 * Matches the tabs in BrandProfileView: Identity, Media, Narrative,
 * Voice & Tone, Prompts, Portfolio, Products, IP Protection.
 */
export function brandSections(profile: Maybe<BrandProfile>): SectionCheck[] {
    const p = profile ?? ({} as BrandProfile);
    return [
        { id: "identity", fields: [p.brandname, p.displayName, p.website, p.industry, p.subcategory, p.operatingRegions] },
        { id: "media", fields: [p.logo, p.coverImage] },
        { id: "narrative", fields: [p.tagline, p.description, p.knownFor, p.contextualAnchor, p.identitySignal, p.emotionalOutcome] },
        { id: "voice", fields: [p.collaborationStyle, p.idealBuyerProfile, p.toneEmotional, p.toneProfessional, p.toneCultural, p.toneLifestyle] },
        { id: "prompts", fields: [p.admiredCreator, p.coCreationPartner, p.productBefore, p.productAfter, p.idealBuyerDescription, p.avoidedAssociation] },
        { id: "portfolio", fields: [p.pastProjects] },
        { id: "products", fields: [p.products] },
        { id: "protection", fields: [p.ipPublisherEnabled] },
    ];
}

export interface CompletionResult {
    /** 0-100, rounded. */
    percent: number;
    /** How many sections are filled. */
    filled: number;
    /** Total number of sections considered. */
    total: number;
    /** Id of the first unfilled section, for the "Complete profile" deep link. */
    nextIncompleteId: string | null;
}

export function computeCompletion(sections: SectionCheck[]): CompletionResult {
    const total = sections.length;
    if (total === 0) {
        return { percent: 0, filled: 0, total: 0, nextIncompleteId: null };
    }
    let filled = 0;
    let nextIncompleteId: string | null = null;
    for (const s of sections) {
        const done = isSectionFilled(s.fields);
        if (done) {
            filled += 1;
        } else if (nextIncompleteId === null) {
            nextIncompleteId = s.id;
        }
    }
    const percent = Math.round((filled / total) * 100);
    return { percent, filled, total, nextIncompleteId };
}
