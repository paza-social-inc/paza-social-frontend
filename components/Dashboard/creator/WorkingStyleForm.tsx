"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RiAddLine, RiCloseLine, RiLoader2Line, RiSettings4Line } from "@remixicon/react";
import { CreatorProfile, updateWorkingStyle } from "@/lib/data/creator";
import { AVAILABILITY_TYPES, PERSONALITY_TAGS } from "@/lib/constants/creatorTaxonomy";
import toast from "react-hot-toast";

export default function WorkingStyleForm({ initialData, onSuccess }: { initialData: Partial<CreatorProfile>, onSuccess?: (newData: CreatorProfile) => void }) {
    const { register, handleSubmit, setValue, watch } = useForm<Partial<CreatorProfile>>({
        defaultValues: initialData,
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [tagInputs, setTagInputs] = React.useState({ engagement: "", deliverables: "", personality: "" });

    const engagementTypes = watch("engagementType") || [];
    const deliverables = watch("deliverables") || [];
    const personalityTags = watch("personalityTags") || [];

    const onSubmit = async (data: Partial<CreatorProfile>) => {
        setIsSubmitting(true);
        try {
            const res = await updateWorkingStyle(data);
            if (res.success) {
                toast.success("Working style updated");
                if (onSuccess) onSuccess(res.data);
            }
        } catch {
            toast.error("Failed to update working style");
        } finally {
            setIsSubmitting(false);
        }
    };

    const addTag = (field: keyof CreatorProfile, inputKey: keyof typeof tagInputs) => {
        const val = tagInputs[inputKey].trim();
        const current = (watch(field) as string[]) || [];
        if (val && !current.includes(val)) {
            setValue(field as keyof CreatorProfile, [...current, val] as never);
            setTagInputs(p => ({ ...p, [inputKey]: "" }));
        }
    };

    const removeTag = (field: keyof CreatorProfile, val: string) => {
        const current = (watch(field) as string[]) || [];
        setValue(field as keyof CreatorProfile, current.filter(t => t !== val) as never);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <RiSettings4Line className="h-5 w-5 text-primary" />
                    Working Style & Availability
                </CardTitle>
                <CardDescription>Configure how you collaborate with brands and your current capacity.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Working Availability Type</Label>
                            <Select 
                                onValueChange={(val: string) => setValue("availabilityType", val as never)}
                                defaultValue={initialData.availabilityType}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {AVAILABILITY_TYPES.map(at => (
                                        <SelectItem key={at.value} value={at.value}>{at.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Preferred Communication</Label>
                            <Select 
                                onValueChange={(val: string) => setValue("preferredCommunication", val)}
                                defaultValue={initialData.preferredCommunication}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Channel" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                                    <SelectItem value="paza_inbox">Paza Platform</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-4 border-t pt-6">
                        <Label>Personality Traits <span className="text-muted-foreground font-normal">(Choose up to 3)</span></Label>
                        <div className="flex flex-wrap gap-2">
                            {PERSONALITY_TAGS.map(tag => (
                                <Badge
                                    key={tag}
                                    variant={personalityTags.includes(tag) ? "default" : "outline"}
                                    className="cursor-pointer py-1.5 px-3 text-sm transition-all"
                                    onClick={() => {
                                        if (personalityTags.includes(tag)) {
                                            setValue("personalityTags", personalityTags.filter(v => v !== tag));
                                        } else if (personalityTags.length < 3) {
                                            setValue("personalityTags", [...personalityTags, tag]);
                                        }
                                    }}
                                >
                                    {tag}
                                    {personalityTags.includes(tag) && <RiCloseLine className="ml-1 h-3.5 w-3.5" />}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Engagement Models <span className="text-muted-foreground font-normal">(e.g. Retainer, One-off, Licensing)</span></Label>
                        <div className="flex gap-2">
                            <Input 
                                value={tagInputs.engagement}
                                onChange={(e) => setTagInputs(p => ({ ...p, engagement: e.target.value }))}
                                placeholder="Add model..."
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag("engagementType", "engagement"))}
                            />
                            <Button type="button" variant="outline" size="icon" onClick={() => addTag("engagementType", "engagement")}>
                                <RiAddLine />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {engagementTypes.map(t => (
                                <Badge key={t} variant="outline" className="gap-1 border-orange-200">
                                    {t} <RiCloseLine className="h-3 w-3 cursor-pointer" onClick={() => removeTag("engagementType", t)} />
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Standard Deliverables</Label>
                        <div className="flex gap-2">
                            <Input 
                                value={tagInputs.deliverables}
                                onChange={(e) => setTagInputs(p => ({ ...p, deliverables: e.target.value }))}
                                placeholder="e.g. RAW Footage, Scriptwriting, 4K Edit"
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag("deliverables", "deliverables"))}
                            />
                            <Button type="button" variant="outline" size="icon" onClick={() => addTag("deliverables", "deliverables")}>
                                <RiAddLine />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {deliverables.map(t => (
                                <Badge key={t} variant="outline" className="gap-1">
                                    {t} <RiCloseLine className="h-3 w-3 cursor-pointer" onClick={() => removeTag("deliverables", t)} />
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Key Equipment & Software</Label>
                        <Input 
                            {...register("equipmentAndSoftware")} 
                            placeholder="e.g. Sony A7IV, Davinci Resolve, DJI Mavic" 
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <RiLoader2Line className="mr-2 h-4 w-4 animate-spin" />}
                            Save Working Style
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
