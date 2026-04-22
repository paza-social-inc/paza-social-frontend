"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiAddLine, RiCloseLine, RiLoader2Line, RiMagicLine } from "@remixicon/react";
import { BrandProfile, updateBrandNarrative } from "@/lib/data/brands";
import toast from "react-hot-toast";

interface NarrativeFormProps {
    businessId: number;
    initialData: Partial<BrandProfile>;
    onSuccess?: (newData: BrandProfile) => void;
}

export default function NarrativeForm({ businessId, initialData, onSuccess }: NarrativeFormProps) {
    const { register, handleSubmit, setValue, watch } = useForm<Partial<BrandProfile>>({
        defaultValues: initialData,
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [tagInputs, setTagInputs] = React.useState({
        knownFor: "",
        disallowed: "",
        anchor: ""
    });

    const knownFor = watch("knownFor") || [];
    const disallowed = watch("disallowedAdjacency") || [];
    const anchors = watch("contextualAnchor") || [];

    const onSubmit = async (data: Partial<BrandProfile>) => {
        setIsSubmitting(true);
        try {
            const res = await updateBrandNarrative(businessId, data);
            if (res.success) {
                toast.success("Brand narrative updated");
                if (onSuccess) onSuccess(res.data);
            } else {
                toast.error(res.message || "Failed to update narrative");
            }
        } catch {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const addTag = (field: keyof BrandProfile, inputKey: keyof typeof tagInputs, max = 10) => {
        const val = tagInputs[inputKey].trim();
        const current = (watch(field) as string[]) || [];
        if (val && !current.includes(val) && current.length < max) {
            setValue(field as keyof BrandProfile, [...current, val] as never);
            setTagInputs(prev => ({ ...prev, [inputKey]: "" }));
        }
    };

    const removeTag = (field: keyof BrandProfile, val: string) => {
        const current = (watch(field) as string[]) || [];
        setValue(field as keyof BrandProfile, current.filter(t => t !== val) as never);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Brand Narrative</CardTitle>
                <CardDescription>Define how your brand tells its story and connects with audiences.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Basic Storytelling */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="tagline">Tagline</Label>
                            <Input id="tagline" {...register("tagline")} placeholder="A short, catchy phrase" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">About the Brand</Label>
                            <Textarea 
                                id="description" 
                                {...register("description")} 
                                placeholder="Deep dive into your brand mission..."
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>

                    {/* Keywords & Anchors */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label>Known For (Max 3)</Label>
                            <div className="flex gap-2">
                                <Input 
                                    value={tagInputs.knownFor}
                                    onChange={(e) => setTagInputs(p => ({ ...p, knownFor: e.target.value }))}
                                    placeholder="Add attribute"
                                    disabled={knownFor.length >= 3}
                                />
                                <Button type="button" size="sm" variant="outline" onClick={() => addTag("knownFor", "knownFor", 3)}>
                                    <RiAddLine />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {knownFor.map(t => (
                                    <Badge key={t} variant="secondary" className="gap-1">
                                        {t} <RiCloseLine className="h-3 w-3 cursor-pointer" onClick={() => removeTag("knownFor", t)} />
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>Contextual Anchors (Max 2)</Label>
                            <div className="flex gap-2">
                                <Input 
                                    value={tagInputs.anchor}
                                    onChange={(e) => setTagInputs(p => ({ ...p, anchor: e.target.value }))}
                                    placeholder="Add anchor"
                                    disabled={anchors.length >= 2}
                                />
                                <Button type="button" size="sm" variant="outline" onClick={() => addTag("contextualAnchor", "anchor", 2)}>
                                    <RiAddLine />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {anchors.map(t => (
                                    <Badge key={t} variant="outline" className="gap-1">
                                        {t} <RiCloseLine className="h-3 w-3 cursor-pointer" onClick={() => removeTag("contextualAnchor", t)} />
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Depth & Emotion */}
                    <div className="space-y-4 border-t pt-6">
                        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <RiMagicLine className="h-4 w-4" /> Strategic Narrative
                        </h3>
                        
                        <div className="space-y-2">
                            <Label htmlFor="narrativePrompts">Narrative Prompts</Label>
                            <Textarea 
                                id="narrativePrompts" 
                                {...register("narrativePrompts")} 
                                placeholder="Instructions for creators on tone and hooks..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="emotionalOutcome">Desired Emotional Outcome</Label>
                            <Input id="emotionalOutcome" {...register("emotionalOutcome")} placeholder="e.g. Empowered, Secure, Excited" />
                        </div>

                        <div className="space-y-3">
                            <Label>Disallowed Adjacency</Label>
                            <div className="flex gap-2">
                                <Input 
                                    value={tagInputs.disallowed}
                                    onChange={(e) => setTagInputs(p => ({ ...p, disallowed: e.target.value }))}
                                    placeholder="Topics to avoid..."
                                />
                                <Button type="button" size="sm" variant="outline" onClick={() => addTag("disallowedAdjacency", "disallowed")}>
                                    <RiAddLine />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {disallowed.map(t => (
                                    <Badge key={t} variant="destructive" className="gap-1 bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20">
                                        {t} <RiCloseLine className="h-3 w-3 cursor-pointer" onClick={() => removeTag("disallowedAdjacency", t)} />
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Jobs to be Done */}
                    <div className="space-y-4 border-t pt-6">
                        <Label className="text-lg font-semibold">Core Job Statement</Label>
                        <p className="text-sm text-muted-foreground">What specific progress does your customer make using your brand?</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="jobSituation">1. The Situation</Label>
                                <Input id="jobSituation" {...register("jobStatementSituation")} placeholder="When..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="jobProgress">2. The Progress</Label>
                                <Input id="jobProgress" {...register("jobStatementProgress")} placeholder="I want to..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="jobOutcome">3. The Outcome</Label>
                                <Input id="jobOutcome" {...register("jobStatementOutcome")} placeholder="So that..." />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 gap-4">
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
