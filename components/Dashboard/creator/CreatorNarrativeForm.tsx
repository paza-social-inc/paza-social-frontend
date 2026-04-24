"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiCloseLine, RiLoader2Line, RiSparklingLine, RiPaletteLine } from "@remixicon/react";
import { CreatorProfile, updateNarrativeIdentity } from "@/lib/data/creator";
import { NARRATIVE_IDENTITY_TAGS, CREATOR_TONE_CATEGORIES } from "@/lib/constants/creatorTaxonomy";
import toast from "react-hot-toast";

export default function CreatorNarrativeForm({ initialData, onSuccess }: { initialData: Partial<CreatorProfile>, onSuccess?: (newData: CreatorProfile) => void }) {
    const { register, handleSubmit, setValue, watch } = useForm<Partial<CreatorProfile>>({
        defaultValues: initialData,
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const vibes = watch("originStoryTags") || [];

    const onSubmit = async (data: Partial<CreatorProfile>) => {
        setIsSubmitting(true);
        try {
            // We'll cast to any for now to allow extra fields (mission, goal, etc) 
            // while matching the identity-related backend update.
            const res = await updateNarrativeIdentity(data as Partial<CreatorProfile>);
            if (res.success) {
                toast.success("Creator narrative updated");
                if (onSuccess) onSuccess(res.data);
            }
        } catch {
            toast.error("Failed to update narrative");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <RiSparklingLine className="h-5 w-5 text-primary" />
                    Storytelling & Vibe
                </CardTitle>
                <CardDescription>Tell brands who you are and what you stand for.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Origin Story <span className="text-muted-foreground font-normal">(Max 250 characters)</span></Label>
                            <Textarea 
                                {...register("originStory")} 
                                placeholder="What sparked your creative journey? How did you get started?"
                                className="min-h-[120px]"
                                maxLength={250}
                            />
                            <p className="text-xs text-muted-foreground text-right">{watch("originStory")?.length || 0}/250</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Narrative Identity Tags</Label>
                        <div className="flex flex-wrap gap-2">
                            {NARRATIVE_IDENTITY_TAGS.map(tag => (
                                <Badge
                                    key={tag}
                                    variant={vibes.includes(tag) ? "default" : "outline"}
                                    className="cursor-pointer py-1.5 px-3 text-sm transition-all hover:scale-105"
                                    onClick={() => {
                                        if (vibes.includes(tag)) {
                                            setValue("originStoryTags", vibes.filter(v => v !== tag));
                                        } else {
                                            setValue("originStoryTags", [...vibes, tag]);
                                        }
                                    }}
                                >
                                    {tag}
                                    {vibes.includes(tag) && <RiCloseLine className="ml-1 h-3.5 w-3.5" />}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Philosophical & Value Alignment (Tone) */}
                    <div className="space-y-6 border-t pt-6">
                        <div>
                            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <RiPaletteLine className="h-4 w-4" /> Personal Brand Voice & Tone
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">Select the tags that best describe your creative energy.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(Object.entries(CREATOR_TONE_CATEGORIES) as [keyof typeof CREATOR_TONE_CATEGORIES, string[]][]).map(([category, tags]) => (
                                <div key={category} className="space-y-2">
                                    <Label className="capitalize text-xs font-bold text-primary/70">{category} Tone</Label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {tags.map(tag => {
                                            const field = `tone${category.charAt(0).toUpperCase() + category.slice(1)}` as keyof CreatorProfile;
                                            const currentTags = (watch(field) as string[]) || [];
                                            const isActive = currentTags.includes(tag);
                                            
                                            return (
                                                <Badge
                                                    key={tag}
                                                    variant={isActive ? "default" : "secondary"}
                                                    className="cursor-pointer text-[10px] px-2 py-0.5"
                                                    onClick={() => {
                                                        if (isActive) setValue(field, currentTags.filter(t => t !== tag) as never);
                                                        else setValue(field, [...currentTags, tag] as never);
                                                    }}
                                                >
                                                    {tag}
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <RiLoader2Line className="mr-2 h-4 w-4 animate-spin" />}
                            Update Narrative
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
