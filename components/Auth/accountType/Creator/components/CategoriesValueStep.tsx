import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategoriesValuesStepProps } from "@/types/preferences/Creator/CreatorType";
import { cn } from "@/lib/utils";
import { cj } from "../creatorJourneyTheme";
import { StepSection } from "./StepSection";
import { Search, X, Plus } from "lucide-react";
import { useMemo, useState } from "react";

const MAIN_CATEGORIES: { id: string; label: string }[] = [
    { id: "media_entertainment", label: "Media & Entertainment" },
    { id: "lifestyle_wellness", label: "Lifestyle & Wellness" },
    { id: "arts_creativity", label: "Arts & Creativity" },
    { id: "business_innovation", label: "Business & Innovation" },
    { id: "education_learning", label: "Education & Learning" },
    { id: "community_social", label: "Community & Social Impact" },
    { id: "sports_recreation", label: "Sports & Recreation" },
    { id: "events_experiences", label: "Events & Experiences" },
];

const SKILLS_BY_MAIN: Record<string, string[]> = {
    media_entertainment: [
        "Podcasts & Audio Content",
        "Video Production",
        "News & Commentary",
        "Music",
        "Performing Arts",
        "Gaming & Esports",
        "Animation & VFX",
        "Social media Content",
    ],
    lifestyle_wellness: ["Fitness", "Nutrition", "Mindfulness", "Fashion", "Beauty", "Travel"],
    arts_creativity: ["Visual Arts", "Design", "Photography", "Writing", "Crafts"],
    business_innovation: ["Startups", "Finance", "Marketing", "Leadership", "Product"],
    education_learning: ["Tutoring", "Courses", "STEM", "Languages", "Coaching"],
    community_social: ["Non-profit", "Activism", "Local community", "Diversity"],
    sports_recreation: ["Team sports", "Outdoor", "Esports commentary", "Coaching"],
    events_experiences: ["Live events", "Festivals", "Hospitality", "Experiential"],
};

// Core-values taxonomy: pillar -> specific values under that pillar.
const VALUE_CATEGORIES: { id: string; label: string }[] = [
    { id: "authenticity", label: "Authenticity" },
    { id: "innovation", label: "Innovation" },
    { id: "excellence", label: "Excellence" },
    { id: "transparency", label: "Transparency" },
    { id: "inclusivity", label: "Inclusivity" },
    { id: "sustainability", label: "Sustainability" },
    { id: "customer_centricity", label: "Customer-Centricity" },
    { id: "adaptability", label: "Adaptability" },
    { id: "positioning", label: "Positioning" },
    { id: "cultural_resonance", label: "Cultural Resonance" },
    { id: "purpose_conviction", label: "Purpose & Conviction" },
];

const VALUE_SUBFIELDS: Record<string, string[]> = {
    authenticity: ["Originality", "Genuine Expression", "Honest Representation"],
    innovation: [
        "Visionary Thinking",
        "Bold Experimentation",
        "Relentless Curiosity",
        "Responsive Evolution",
        "Progressive Innovation",
    ],
    excellence: ["High Standards", "Precision", "Disciplined Execution"],
    transparency: [
        "Trustworthiness",
        "Ethical Consistency",
        "Open Communication",
        "Clarity in Operations",
    ],
    inclusivity: ["Diverse Representation", "Equity", "Cultural Intelligence"],
    sustainability: ["Environmental Consciousness", "Conscious Resource Use", "Long-Term Thinking"],
    customer_centricity: [
        "User-First Approach",
        "Product-Led Solutions",
        "Feedback Integration",
        "Service-Oriented Thinking",
    ],
    adaptability: ["Flexibility", "Resilience", "Responsive to Change"],
    positioning: ["Exclusive", "Timeless", "Niche Authority", "Aspirational Identity"],
    cultural_resonance: [
        "Cultural Relevance",
        "Cultural Impact",
        "Global Resonance",
        "Local Authenticity",
    ],
    purpose_conviction: [
        "Mission-Driven Action",
        "Resolve",
        "Boldness",
        "Accountable",
        "Clarity of Purpose",
    ],
};

export default function CategoriesValuesStep({ data, onUpdate }: CategoriesValuesStepProps) {
    const [search, setSearch] = useState("");
    const [activeValueCats, setActiveValueCats] = useState<string[]>([]);
    const [customValue, setCustomValue] = useState("");

    const filteredMain = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return MAIN_CATEGORIES;
        return MAIN_CATEGORIES.filter((c) => c.label.toLowerCase().includes(q));
    }, [search]);

    const mainId = data.category || "";
    const skillPool = SKILLS_BY_MAIN[mainId] ?? [];

    const toggleMain = (id: string) => {
        const next = mainId === id ? "" : id;
        onUpdate({
            category: next,
            topics: next ? [] : data.topics,
            subCategory: next ? [] : data.subCategory,
        });
    };

    const toggleTopic = (skill: string) => {
        const set = new Set(data.topics);
        if (set.has(skill)) set.delete(skill);
        else set.add(skill);
        onUpdate({ topics: Array.from(set) });
    };

    const toggleValueCategory = (id: string) => {
        setActiveValueCats((prev) => {
            if (prev.includes(id)) {
                // Collapsing a pillar also clears any values selected under it.
                const subs = new Set(VALUE_SUBFIELDS[id] ?? []);
                onUpdate({ coreValues: data.coreValues.filter((v) => !subs.has(v)) });
                return prev.filter((x) => x !== id);
            }
            return [...prev, id];
        });
    };

    const toggleCoreValue = (value: string) => {
        const set = new Set(data.coreValues);
        if (set.has(value)) set.delete(value);
        else set.add(value);
        onUpdate({ coreValues: Array.from(set) });
    };

    const addCustomValue = () => {
        const v = customValue.trim();
        if (!v) return;
        if (!data.coreValues.includes(v)) {
            onUpdate({ coreValues: [...data.coreValues, v] });
        }
        setCustomValue("");
    };

    return (
        <div className="space-y-8">
            <StepSection kicker="Area of expertise / niche / category / skills">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search categories & skills"
                        className={cn(cj.input, "h-11 pl-10")}
                    />
                </div>
                <div>
                    <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                        Search for main category
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {filteredMain.map((c) => {
                            const active = mainId === c.id;
                            return (
                                <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => toggleMain(c.id)}
                                    className={cn(
                                        cj.chip,
                                        active && cj.chipActive,
                                        "inline-flex items-center gap-1.5"
                                    )}
                                >
                                    {c.label}
                                    {active ? <X className="h-3 w-3 opacity-80" /> : null}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </StepSection>

            {mainId ? (
                <>
                    <StepSection kicker="Skill sub-category">
                        <div className="rounded-xl border border-zinc-700/80 bg-zinc-900/50 p-3 sm:p-4">
                            <p className="mb-3 text-[11px] text-zinc-500">Selected focus (tap skills below)</p>
                            <div className="min-h-[40px]">
                                {data.topics.length === 0 ? (
                                    <span className="text-sm text-zinc-600">Pick skills in the next row</span>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {data.topics.slice(0, 4).map((t) => (
                                            <span
                                                key={t}
                                                className="inline-flex items-center gap-1 rounded-full bg-orange-600 px-3 py-1 text-xs font-medium text-white"
                                            >
                                                {t}
                                                <button
                                                    type="button"
                                                    className="rounded-full p-0.5 hover:bg-white/20"
                                                    aria-label={`Remove ${t}`}
                                                    onClick={() => toggleTopic(t)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </StepSection>

                    <div className="space-y-3">
                        <Label className={cj.labelField}>You can select multiple skills</Label>
                        <div className="flex flex-wrap gap-2">
                            {skillPool.map((skill) => {
                                const active = data.topics.includes(skill);
                                return (
                                    <button
                                        key={skill}
                                        type="button"
                                        onClick={() => toggleTopic(skill)}
                                        className={cn(
                                            cj.chip,
                                            active && cj.chipActive,
                                            "inline-flex items-center gap-1.5 text-[11px]"
                                        )}
                                    >
                                        {skill}
                                        {active ? <X className="h-3 w-3 opacity-80" /> : null}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </>
            ) : null}

            <StepSection kicker="Core values">
                <p className="text-sm text-zinc-500">
                    Select the values that align with your goals and ethos. Pick a pillar, then choose the
                    specific values under it.
                </p>

                <div className="rounded-xl border border-zinc-700/80 bg-zinc-900/50 p-3 sm:p-4">
                    <p className="mb-3 text-[11px] text-zinc-500">Selected values</p>
                    <div className="min-h-[40px]">
                        {data.coreValues.length === 0 ? (
                            <span className="text-sm text-zinc-600">
                                Pick a pillar below, then select the values under it
                            </span>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {data.coreValues.map((v) => (
                                    <span
                                        key={v}
                                        className="inline-flex items-center gap-1 rounded-full bg-orange-600 px-3 py-1 text-xs font-medium text-white"
                                    >
                                        {v}
                                        <button
                                            type="button"
                                            className="rounded-full p-0.5 hover:bg-white/20"
                                            aria-label={`Remove ${v}`}
                                            onClick={() => toggleCoreValue(v)}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                        Choose one or more pillars
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {VALUE_CATEGORIES.map((c) => {
                            const active = activeValueCats.includes(c.id);
                            return (
                                <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => toggleValueCategory(c.id)}
                                    className={cn(
                                        cj.chip,
                                        active && cj.chipActive,
                                        "inline-flex items-center gap-1.5"
                                    )}
                                >
                                    {c.label}
                                    {active ? <X className="h-3 w-3 opacity-80" /> : null}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {activeValueCats.length > 0 && (
                    <div className="space-y-5">
                        {activeValueCats.map((catId) => {
                            const cat = VALUE_CATEGORIES.find((c) => c.id === catId);
                            const subs = VALUE_SUBFIELDS[catId] ?? [];
                            return (
                                <div key={catId} className="space-y-2">
                                    <Label className={cj.labelField}>{cat?.label}</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {subs.map((sub) => {
                                            const active = data.coreValues.includes(sub);
                                            return (
                                                <button
                                                    key={sub}
                                                    type="button"
                                                    onClick={() => toggleCoreValue(sub)}
                                                    className={cn(
                                                        cj.chip,
                                                        active && cj.chipActive,
                                                        "inline-flex items-center gap-1.5 text-[11px]"
                                                    )}
                                                >
                                                    {sub}
                                                    {active ? <X className="h-3 w-3 opacity-80" /> : null}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="space-y-2 border-t border-zinc-800 pt-4">
                    <Label className={cj.labelField} htmlFor="customCoreValue">
                        Not represented? Add your own
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            id="customCoreValue"
                            placeholder="e.g. Craftsmanship"
                            value={customValue}
                            onChange={(e) => setCustomValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addCustomValue();
                                }
                            }}
                            className={cn(cj.input, "h-11")}
                        />
                        <button
                            type="button"
                            onClick={addCustomValue}
                            className={cn(cj.chip, "inline-flex h-11 items-center gap-1.5 px-4")}
                        >
                            <Plus className="h-4 w-4" />
                            Add
                        </button>
                    </div>
                </div>
            </StepSection>
        </div>
    );
}