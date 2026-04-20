import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategoriesValuesStepProps } from "@/types/preferences/Creator/CreatorType";
import { cn } from "@/lib/utils";
import { cj } from "../creatorJourneyTheme";
import { StepSection } from "./StepSection";
import { Search, X } from "lucide-react";
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

export default function CategoriesValuesStep({ data, onUpdate }: CategoriesValuesStepProps) {
    const [search, setSearch] = useState("");

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

            <div className="space-y-2 border-t border-zinc-800 pt-6">
                <Label className={cj.labelField} htmlFor="coreValues">
                    Core values (optional)
                </Label>
                <Input
                    id="coreValues"
                    placeholder="e.g. authenticity, sustainability — comma separated"
                    value={data.coreValues.join(", ")}
                    onChange={(e) =>
                        onUpdate({
                            coreValues: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        })
                    }
                    className={cn(cj.input, "h-11")}
                />
            </div>
        </div>
    );
}
