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
import { IDENTITY_SIGNALS, EMOTIONAL_OUTCOMES, CONTEXTUAL_ANCHORS } from "@/lib/constants/brandTaxonomy";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    const identitySignals = watch("identitySignal") || [];

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
                            <Label>Contextual Anchors <span className="text-muted-foreground font-normal">(max 2)</span></Label>
                            <p className="text-xs text-muted-foreground">Situations where creators should feature your brand.</p>
                            <div className="flex flex-wrap gap-2">
                                {CONTEXTUAL_ANCHORS.map(anchor => (
                                    <Badge
                                        key={anchor}
                                        variant={anchors.includes(anchor) ? "default" : "outline"}
                                        className="cursor-pointer py-1.5 px-3 text-sm transition-all hover:scale-105"
                                        onClick={() => {
                                            if (anchors.includes(anchor)) {
                                                setValue("contextualAnchor", anchors.filter((a: string) => a !== anchor));
                                            } else if (anchors.length < 2) {
                                                setValue("contextualAnchor", [...anchors, anchor]);
                                            }
                                        }}
                                    >
                                        {anchor}
                                        {anchors.includes(anchor) && (
                                            <RiCloseLine className="ml-1 h-3.5 w-3.5" />
                                        )}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Identity Signals */}
                    <div className="space-y-3">
                        <Label>Identity Signals <span className="text-muted-foreground font-normal">(max 2)</span></Label>
                        <p className="text-xs text-muted-foreground">What identity does your brand project to the audience?</p>
                        <div className="flex flex-wrap gap-2">
                            {IDENTITY_SIGNALS.map(signal => (
                                <Badge
                                    key={signal}
                                    variant={identitySignals.includes(signal) ? "default" : "outline"}
                                    className="cursor-pointer py-1.5 px-3 text-sm transition-all hover:scale-105"
                                    onClick={() => {
                                        if (identitySignals.includes(signal)) {
                                            setValue("identitySignal", identitySignals.filter((s: string) => s !== signal));
                                        } else if (identitySignals.length < 2) {
                                            setValue("identitySignal", [...identitySignals, signal]);
                                        }
                                    }}
                                >
                                    {signal}
                                    {identitySignals.includes(signal) && (
                                        <RiCloseLine className="ml-1 h-3.5 w-3.5" />
                                    )}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Strategic Narrative / Voice */}
                    <div className="space-y-4 border-t pt-6">
                        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <RiMagicLine className="h-4 w-4" /> Strategic Narrative
                        </h3>
                        
                        <div className="space-y-2">
                            <Label htmlFor="narrativePrompts">Narrative Prompts</Label>
                            <Textarea 
                                id="narrativePrompts" 
                                {...register("narrativePrompts")} 
                                placeholder="Instructions for creators on tone, hooks, or specific stories to tell..."
                                className="min-h-[120px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="emotionalOutcome">Desired Emotional Outcome (Select 1)</Label>
                            <Select
                                onValueChange={(val) => setValue("emotionalOutcome", val)}
                                defaultValue={initialData.emotionalOutcome}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="What should the viewer feel?" />
                                </SelectTrigger>
                                <SelectContent>
                                    {EMOTIONAL_OUTCOMES.map(eo => (
                                        <SelectItem key={eo} value={eo}>{eo}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label>Disallowed Adjacency (Guardrails)</Label>
                            <p className="text-xs text-muted-foreground mb-2">What topics or contexts should creators avoid when featuring your brand?</p>
                            
                            <div className="flex gap-4 mb-4">
                                {["Politics", "Adult Content", "Profanity"].map(gate => (
                                    <div key={gate} className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            id={`adj-${gate}`}
                                            checked={disallowed.includes(gate)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setValue("disallowedAdjacency", [...disallowed, gate]);
                                                } else {
                                                    setValue("disallowedAdjacency", disallowed.filter(v => v !== gate));
                                                }
                                            }}
                                            className="rounded border-muted checkbox-brand"
                                        />
                                        <Label htmlFor={`adj-${gate}`} className="text-sm cursor-pointer">{gate}</Label>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <Input 
                                    value={tagInputs.disallowed}
                                    onChange={(e) => setTagInputs(p => ({ ...p, disallowed: e.target.value }))}
                                    placeholder="Add custom guardrail..."
                                />
                                <Button type="button" size="sm" variant="outline" onClick={() => addTag("disallowedAdjacency", "disallowed")}>
                                    <RiAddLine />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {disallowed.filter(t => !["Politics", "Adult Content", "Profanity"].includes(t)).map(t => (
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
                                <Label htmlFor="jobSituation" className="text-xs text-primary/70 uppercase">1. When...</Label>
                                <Input id="jobSituation" {...register("jobStatementSituation")} placeholder="e.g. Kids come home from school" className="bg-muted/30" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="jobProgress" className="text-xs text-primary/70 uppercase">2. I want to...</Label>
                                <Input id="jobProgress" {...register("jobStatementProgress")} placeholder="e.g. reduce germs fast" className="bg-muted/30" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="jobOutcome" className="text-xs text-primary/70 uppercase">3. So I can...</Label>
                                <Input id="jobOutcome" {...register("jobStatementOutcome")} placeholder="e.g. feel I'm protecting my family" className="bg-muted/30" />
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
