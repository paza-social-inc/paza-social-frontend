"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiCloseLine, RiLoader2Line, RiGroupLine, RiAddLine } from "@remixicon/react";
import {
    BrandCreatorPreference,
    getCreatorPreferences,
    updateCreatorPreferences,
} from "@/lib/data/brands";
import {
    CREATOR_CATEGORIES,
    CONTENT_FORMATS,
    AUDIENCE_SIZES,
    CREATOR_CHARACTERISTICS,
    BRAND_SAFETY_TOPICS,
} from "@/lib/constants/brandTaxonomy";
import toast from "react-hot-toast";

interface CreatorPreferencesFormProps {
    businessId: number;
    onSuccess?: (data: BrandCreatorPreference) => void;
}

// ─── Inline Tag Input Component ─────────────────────────────────────────────

function TagInput({
    label,
    description,
    tags,
    onChange,
    placeholder = "Type a name and press Enter",
}: {
    label: string;
    description?: string;
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
}) {
    const [input, setInput] = React.useState("");

    const addTag = () => {
        const trimmed = input.trim();
        if (!trimmed) return;
        if (tags.includes(trimmed)) {
            toast.error("Already added");
            return;
        }
        onChange([...tags, trimmed]);
        setInput("");
    };

    const removeTag = (tag: string) => {
        onChange(tags.filter((t) => t !== tag));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag();
        }
    };

    return (
        <div className="space-y-2">
            <Label className="font-semibold">{label}</Label>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
            <div className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1"
                />
                <Button type="button" variant="outline" size="icon" onClick={addTag} disabled={!input.trim()}>
                    <RiAddLine className="h-4 w-4" />
                </Button>
            </div>
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="py-1 px-2.5 text-xs">
                            {tag}
                            <RiCloseLine
                                className="ml-1.5 h-3 w-3 cursor-pointer hover:text-destructive"
                                onClick={() => removeTag(tag)}
                            />
                        </Badge>
                    ))}
                </div>
            )}
            {tags.length === 0 && (
                <p className="text-xs text-muted-foreground italic">None added yet</p>
            )}
        </div>
    );
}

// ─── Chip Group (Multi-select badge grid) ────────────────────────────────────

function ChipGroup({
    options,
    selected,
    onChange,
    max,
}: {
    options: string[];
    selected: string[];
    onChange: (updated: string[]) => void;
    max?: number;
}) {
    const toggle = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((v) => v !== value));
        } else if (!max || selected.length < max) {
            onChange([...selected, value]);
        }
    };

    return (
        <div className="flex flex-wrap gap-2">
            {options.map((opt) => (
                <Badge
                    key={opt}
                    variant={selected.includes(opt) ? "default" : "outline"}
                    className="cursor-pointer py-1.5 px-3 text-sm transition-all hover:scale-105"
                    onClick={() => toggle(opt)}
                >
                    {opt}
                    {selected.includes(opt) && (
                        <RiCloseLine className="ml-1 h-3.5 w-3.5" />
                    )}
                </Badge>
            ))}
        </div>
    );
}

// ─── Section Wrapper ────────────────────────────────────────────────────────

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-3 border-t pt-6 first:border-t-0 first:pt-0">
            <div>
                <Label className="text-base font-semibold">{title}</Label>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            {children}
        </div>
    );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function CreatorPreferencesForm({ businessId, onSuccess }: CreatorPreferencesFormProps) {
    const [preferences, setPreferences] = React.useState<BrandCreatorPreference>({});
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [loadError, setLoadError] = React.useState<string | null>(null);

    // ── Load existing preferences on mount ──────────────────────────────────────
    React.useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await getCreatorPreferences(businessId);
                if (!cancelled) {
                    if (res.success && res.data) {
                        setPreferences(res.data);
                    }
                    setIsLoading(false);
                }
            } catch (err: unknown) {
                if (!cancelled) {
                    setLoadError(err instanceof Error ? err.message : "Failed to load preferences");
                    setIsLoading(false);
                }
            }
        })();
        return () => { cancelled = true; };
    }, [businessId]);

    // ── Field updaters ─────────────────────────────────────────────────────────
    const setField = <K extends keyof BrandCreatorPreference>(key: K, value: BrandCreatorPreference[K]) => {
        setPreferences((prev) => ({ ...prev, [key]: value }));
    };

    // ── Submit ─────────────────────────────────────────────────────────────────
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await updateCreatorPreferences(businessId, preferences);
            if (res.success) {
                toast.success("Creator preferences saved");
                if (onSuccess) onSuccess(res.data);
            } else {
                toast.error(res.message || "Failed to save preferences");
            }
        } catch {
            toast.error("An error occurred while saving");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Loading state ──────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <RiGroupLine className="h-5 w-5 text-primary" />
                        Creator Preferences
                    </CardTitle>
                    <CardDescription>Define the types of creators you want to partner with.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-12">
                        <RiLoader2Line className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    // ── Error state ───────────────────────────────────────────────────────────
    if (loadError) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <RiGroupLine className="h-5 w-5 text-primary" />
                        Creator Preferences
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-destructive">{loadError}</p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <RiGroupLine className="h-5 w-5 text-primary" />
                    Creator Preferences
                </CardTitle>
                <CardDescription>
                    Tell us what you look for in creator partners. These preferences help our discovery engine
                    recommend the right creators for your brand.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-8">

                    {/* ── 1. Creator Category ─────────────────────────────────── */}
                    <Section
                        title="Creator Categories"
                        description="What niches or verticals are relevant to your brand?"
                    >
                        <ChipGroup
                            options={CREATOR_CATEGORIES}
                            selected={preferences.creatorCategories || []}
                            onChange={(v) => setField("creatorCategories", v)}
                        />
                    </Section>

                    {/* ── 2. Preferred Content Formats ─────────────────────────── */}
                    <Section
                        title="Preferred Content Formats"
                        description="What type of content works best for your brand?"
                    >
                        <ChipGroup
                            options={CONTENT_FORMATS}
                            selected={preferences.preferredContentFormats || []}
                            onChange={(v) => setField("preferredContentFormats", v)}
                        />
                    </Section>

                    {/* ── 3. Preferred Audience Size ───────────────────────────── */}
                    <Section
                        title="Preferred Audience Size"
                        description="What follower range do you typically target?"
                    >
                        <ChipGroup
                            options={AUDIENCE_SIZES}
                            selected={preferences.preferredAudienceSizes || []}
                            onChange={(v) => setField("preferredAudienceSizes", v)}
                        />
                    </Section>

                    {/* ── 4. Preferred Creator Characteristics ──────────────────── */}
                    <Section
                        title="Preferred Creator Characteristics"
                        description="What style, energy, or vibe resonates with your brand?"
                    >
                        <ChipGroup
                            options={CREATOR_CHARACTERISTICS}
                            selected={preferences.preferredCharacteristics || []}
                            onChange={(v) => setField("preferredCharacteristics", v)}
                        />
                    </Section>

                    {/* ── 5. Creators They've Worked With ───────────────────────── */}
                    <Section title="Creators You've Worked With Before">
                        <TagInput
                            label="Previous Collaborators"
                            description="Add creator handles or names your brand has worked with."
                            tags={preferences.previouslyWorkedWith || []}
                            onChange={(v) => setField("previouslyWorkedWith", v)}
                            placeholder="e.g. @creatorsname"
                        />
                    </Section>

                    {/* ── 6. Creators They'd Like to Work With ──────────────────── */}
                    <Section title="Creators You'd Like to Work With">
                        <TagInput
                            label="Dream Collaborators"
                            description="Any creators you're actively hoping to partner with?"
                            tags={preferences.desiredCollaborations || []}
                            onChange={(v) => setField("desiredCollaborations", v)}
                            placeholder="e.g. @dreamcreator"
                        />
                    </Section>

                    {/* ── 7. Creators to Avoid ──────────────────────────────────── */}
                    <Section title="Creators to Avoid">
                        <TagInput
                            label="Blocklist"
                            description="Any creators your brand should not be associated with."
                            tags={preferences.avoidCreators || []}
                            onChange={(v) => setField("avoidCreators", v)}
                            placeholder="e.g. @avoidthis"
                        />
                    </Section>

                    {/* ── 8. Brand Safety Topics ────────────────────────────────── */}
                    <Section
                        title="Brand Safety Topics"
                        description="Content boundaries your creators must respect."
                    >
                        <ChipGroup
                            options={BRAND_SAFETY_TOPICS}
                            selected={preferences.brandSafetyTopics || []}
                            onChange={(v) => setField("brandSafetyTopics", v)}
                        />
                    </Section>

                    {/* ── 9. Brand Safety Requirements (free text) ──────────────── */}
                    <Section
                        title="Additional Brand Safety Requirements"
                        description="Any other safety guidelines, disallowed topics, or compliance notes."
                    >
                        <Textarea
                            value={preferences.brandSafetyRequirements || ""}
                            onChange={(e) => setField("brandSafetyRequirements", e.target.value)}
                            placeholder="Describe any additional brand safety considerations, compliance requirements, or specific content restrictions..."
                            className="min-h-[100px]"
                        />
                    </Section>

                    {/* ── Submit ────────────────────────────────────────────────── */}
                    <div className="flex justify-end pt-4 border-t">
                        <Button type="submit" disabled={isSubmitting} size="lg">
                            {isSubmitting && <RiLoader2Line className="mr-2 h-4 w-4 animate-spin" />}
                            Save Creator Preferences
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
