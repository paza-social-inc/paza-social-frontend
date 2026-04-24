"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RiAddLine, RiCloseLine, RiLoader2Line, RiCompassLine, RiShieldUserLine, RiNodeTree } from "@remixicon/react";
import { CreatorProfile, updateCreativeCapabilities } from "@/lib/data/creator";
import { 
    SKILL_LEVELS, 
    CREATOR_TYPES, 
    DOMAIN_SHARDS, 
    ASSET_CLASSES, 
    VALUE_PROPS 
} from "@/lib/constants/creatorTaxonomy";
import toast from "react-hot-toast";

export default function CreatorCapabilitiesForm({ initialData, onSuccess }: { initialData: Partial<CreatorProfile>, onSuccess?: (newData: CreatorProfile) => void }) {
    const { handleSubmit, setValue, watch } = useForm<Partial<CreatorProfile>>({
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
        } catch {
            toast.error("Failed to update capabilities");
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

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <RiCompassLine className="h-5 w-5 text-primary" />
                    Creative Capabilities
                </CardTitle>
                <CardDescription>Detail your professional level and specific domains of expertise.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Professional Skill Level</Label>
                            <Select 
                                onValueChange={(val: string) => setValue("skillLevel", val as CreatorProfile["skillLevel"])}
                                defaultValue={initialData.skillLevel}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DEVELOPING">Developing (Gaining momentum)</SelectItem>
                                    <SelectItem value="PROFICIENT">Proficient (Reliable execution)</SelectItem>
                                    <SelectItem value="ADVANCED">Advanced (High signal/quality)</SelectItem>
                                    <SelectItem value="EXPERT">Expert (Industry benchmark)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Primary Asset Class <span className="text-muted-foreground font-normal">(Structure)</span></Label>
                            <Select 
                                onValueChange={(val: string) => setValue("assetClassPrimary", val)}
                                defaultValue={initialData.assetClassPrimary}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select asset structure" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ASSET_CLASSES.map(ac => (
                                        <SelectItem key={ac} value={ac}>{ac}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label>Domain Shards (The Topics) <span className="text-muted-foreground font-normal">(Pick up to 2)</span></Label>
                        <div className="flex flex-wrap gap-2">
                            {DOMAIN_SHARDS.map(shard => (
                                <Badge
                                    key={shard}
                                    variant={(watch("domainShards") || []).includes(shard) ? "default" : "outline"}
                                    className="cursor-pointer py-1.5 px-3 text-[11px] transition-all"
                                    onClick={() => {
                                        const current = watch("domainShards") || [];
                                        if (current.includes(shard)) setValue("domainShards", current.filter(s => s !== shard));
                                        else if (current.length < 2) setValue("domainShards", [...current, shard]);
                                    }}
                                >
                                    {shard}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 border-t pt-6">
                        <Label>Creator Types <span className="text-muted-foreground font-normal">(Pick up to 3)</span></Label>
                        <div className="flex flex-wrap gap-2">
                            {CREATOR_TYPES.map(ct => (
                                <Badge
                                    key={ct}
                                    variant={(watch("creatorType") || []).includes(ct) ? "default" : "secondary"}
                                    className="cursor-pointer py-1 px-2.5 text-xs transition-all"
                                    onClick={() => {
                                        const current = watch("creatorType") || [];
                                        if (current.includes(ct)) setValue("creatorType", current.filter(t => t !== ct));
                                        else if (current.length < 3) setValue("creatorType", [...current, ct]);
                                    }}
                                >
                                    {ct}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 border-t pt-6">
                        <Label>What People Come to You For <span className="text-muted-foreground font-normal">(Pick up to 2)</span></Label>
                        <div className="flex flex-wrap gap-2">
                            {VALUE_PROPS.map(vp => (
                                <Badge
                                    key={vp}
                                    variant={(watch("valueProp") || []).includes(vp) ? "default" : "outline"}
                                    className="cursor-pointer py-1.5 px-3 text-xs border-primary/20"
                                    onClick={() => {
                                        const current = watch("valueProp") || [];
                                        if (current.includes(vp)) setValue("valueProp", current.filter(v => v !== vp));
                                        else if (current.length < 2) setValue("valueProp", [...current, vp]);
                                    }}
                                >
                                    {vp}
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
