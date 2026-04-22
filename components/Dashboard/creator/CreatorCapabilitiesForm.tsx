"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RiAddLine, RiCloseLine, RiLoader2Line, RiCompassLine } from "@remixicon/react";
import { CreatorProfile, updateCreativeCapabilities } from "@/lib/data/creator";
import toast from "react-hot-toast";

interface CapabilitiesFormProps {
    creatorId: number;
    initialData: Partial<CreatorProfile>;
    onSuccess?: (newData: CreatorProfile) => void;
}

export default function CreatorCapabilitiesForm({ creatorId, initialData, onSuccess }: CapabilitiesFormProps) {
    const { register, handleSubmit, setValue, watch } = useForm<Partial<CreatorProfile>>({
        defaultValues: initialData,
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [tagInputs, setTagInputs] = React.useState({ shards: "", props: "" });

    const shards = watch("domainShards") || [];
    const valueProps = watch("valueProp") || [];

    const onSubmit = async (data: Partial<CreatorProfile>) => {
        setIsSubmitting(true);
        try {
            const res = await updateCreativeCapabilities(data);
            if (res.success) {
                toast.success("Capabilities updated");
                if (onSuccess) onSuccess(res.data);
            }
        } catch (err) {
            toast.error("Failed to update capabilities");
        } finally {
            setIsSubmitting(false);
        }
    };

    const addTag = (field: keyof CreatorProfile, inputKey: keyof typeof tagInputs) => {
        const val = tagInputs[inputKey].trim();
        const current = (watch(field) as string[]) || [];
        if (val && !current.includes(val)) {
            setValue(field as any, [...current, val]);
            setTagInputs(p => ({ ...p, [inputKey]: "" }));
        }
    };

    return (
        <Card>
            <CardHeader shadow="none" border={false}>
                <CardTitle className="flex items-center gap-2">
                    <RiCompassLine className="h-5 w-5 text-primary" />
                    Creative Capabilities
                </CardTitle>
                <CardDescription>Detail your professional level and specific domains of expertise.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Professional Skill Level</Label>
                            <Select 
                                onValueChange={(val: any) => setValue("skillLevel", val)}
                                defaultValue={initialData.skillLevel}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Beginner">Beginner / Aspiring</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate / Growing</SelectItem>
                                    <SelectItem value="Expert">Expert / Pro</SelectItem>
                                    <SelectItem value="Veteran">Veteran / Established</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Creator Type</Label>
                            <Select 
                                onValueChange={(val: any) => setValue("creatorType", val)}
                                defaultValue={initialData.creatorType}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Independent">Independent / Solo</SelectItem>
                                    <SelectItem value="Agency">Agency / Creative Collective</SelectItem>
                                    <SelectItem value="Curator">Content Curator</SelectItem>
                                    <SelectItem value="UGC">UGC Creator</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Domain Shards (Niches)</Label>
                        <div className="flex gap-2">
                            <Input 
                                value={tagInputs.shards}
                                onChange={(e) => setTagInputs(p => ({ ...p, shards: e.target.value }))}
                                placeholder="Add niche (e.g. Sustainable Fashion, SaaS Demo)"
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag("domainShards", "shards"))}
                            />
                            <Button type="button" variant="outline" size="icon" onClick={() => addTag("domainShards", "shards")}>
                                <RiAddLine />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {shards.map(t => (
                                <Badge key={t} variant="secondary" className="gap-1">
                                    {t} <RiCloseLine className="h-3 w-3 cursor-pointer" onClick={() => setValue("domainShards", shards.filter(v => v !== t))} />
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Unique Value Props</Label>
                        <div className="flex gap-2">
                            <Input 
                                value={tagInputs.props}
                                onChange={(e) => setTagInputs(p => ({ ...p, props: e.target.value }))}
                                placeholder="What makes you stand out?"
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag("valueProp", "props"))}
                            />
                            <Button type="button" variant="outline" size="icon" onClick={() => addTag("valueProp", "props")}>
                                <RiAddLine />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {valueProps.map(t => (
                                <Badge key={t} variant="outline" className="gap-1 border-primary/20">
                                    {t} <RiCloseLine className="h-3 w-3 cursor-pointer" onClick={() => setValue("valueProp", valueProps.filter(v => v !== t))} />
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <RiLoader2Line className="mr-2 h-4 w-4 animate-spin" />}
                            Update Capabilities
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
