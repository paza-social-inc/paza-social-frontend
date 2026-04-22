"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiAddLine, RiCloseLine, RiLoader2Line, RiSparklingLine } from "@remixicon/react";
import { CreatorProfile, updateNarrativeIdentity } from "@/lib/data/creator";
import toast from "react-hot-toast";

interface NarrativeFormProps {
    creatorId: number;
    initialData: Partial<CreatorProfile>;
    onSuccess?: (newData: CreatorProfile) => void;
}

export default function CreatorNarrativeForm({ creatorId, initialData, onSuccess }: NarrativeFormProps) {
    const { register, handleSubmit, setValue, watch } = useForm<Partial<CreatorProfile>>({
        defaultValues: initialData,
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [tagInput, setTagInput] = React.useState("");
    const vibes = watch("originStoryTags") || [];

    const onSubmit = async (data: Partial<CreatorProfile>) => {
        setIsSubmitting(true);
        try {
            // We'll cast to any for now to allow extra fields (mission, goal, etc) 
            // while matching the identity-related backend update.
            const res = await updateNarrativeIdentity(data as any);
            if (res.success) {
                toast.success("Creator narrative updated");
                if (onSuccess) onSuccess(res.data);
            }
        } catch (err) {
            toast.error("Failed to update narrative");
        } finally {
            setIsSubmitting(false);
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !vibes.includes(tagInput.trim())) {
            setValue("originStoryTags", [...vibes, tagInput.trim()]);
            setTagInput("");
        }
    };

    return (
        <Card>
            <CardHeader shadow="none" border={false}>
                <CardTitle className="flex items-center gap-2">
                    <RiSparklingLine className="h-5 w-5 text-primary" />
                    Storytelling & Vibe
                </CardTitle>
                <CardDescription>Tell brands who you are and what you stand for.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label>Origin Story</Label>
                        <Textarea 
                            {...register("originStory")} 
                            placeholder="How did you start creating? What's your unique journey?"
                            className="min-h-[120px]"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Purpose / Mission</Label>
                            <Input {...register("purposeOrMission")} placeholder="What drives your content?" />
                        </div>
                        <div className="space-y-2">
                            <Label>Long-term Goal</Label>
                            <Input {...register("longTermGoal")} placeholder="Where do you see yourself in 5 years?" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Content Style</Label>
                        <Input {...register("contentStyle")} placeholder="e.g. Cinematic, Raw/Authentic, Educational" />
                    </div>

                    <div className="space-y-3">
                        <Label>Vibe Keywords</Label>
                        <div className="flex gap-2">
                            <Input 
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                placeholder="Add vibe (e.g. Energetic, Minimalist)"
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            />
                            <Button type="button" variant="outline" size="icon" onClick={addTag}>
                                <RiAddLine />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {vibes.map(t => (
                                <Badge key={t} variant="secondary" className="gap-1">
                                    {t} <RiCloseLine className="h-3 w-3 cursor-pointer" onClick={() => setValue("originStoryTags", vibes.filter(v => v !== t))} />
                                </Badge>
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
