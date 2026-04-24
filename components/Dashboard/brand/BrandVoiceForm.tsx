"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { RiCloseLine, RiLoader2Line, RiVoiceprintLine } from "@remixicon/react";
import { BrandProfile, updateBrandVoice } from "@/lib/data/brands";
import { COLLABORATION_STYLES, TONE_CATEGORIES, RISK_CONSTRAINT_LABELS } from "@/lib/constants/brandTaxonomy";
import toast from "react-hot-toast";

interface BrandVoiceFormProps {
    businessId: number;
    initialData: Partial<BrandProfile>;
    onSuccess?: (newData: BrandProfile) => void;
}

type RiskKey = keyof NonNullable<BrandProfile["riskConstraints"]>;

export default function BrandVoiceForm({ businessId, initialData, onSuccess }: BrandVoiceFormProps) {
    const { handleSubmit, setValue, watch } = useForm<Partial<BrandProfile>>({
        defaultValues: initialData,
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const collaborationStyle = watch("collaborationStyle") || [];
    const toneEmotional = watch("toneEmotional") || [];
    const toneProfessional = watch("toneProfessional") || [];
    const toneCultural = watch("toneCultural") || [];
    const toneLifestyle = watch("toneLifestyle") || [];
    const riskConstraints = watch("riskConstraints") || {};

    const onSubmit = async (data: Partial<BrandProfile>) => {
        setIsSubmitting(true);
        try {
            const res = await updateBrandVoice(businessId, data);
            if (res.success) {
                toast.success("Brand voice & tone updated");
                if (onSuccess) onSuccess(res.data);
            } else {
                toast.error(res.message || "Failed to update voice settings");
            }
        } catch {
            toast.error("An error occurred while saving");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleChip = (field: keyof BrandProfile, value: string, max = 8) => {
        const current = (watch(field) as string[]) || [];
        if (current.includes(value)) {
            setValue(field as keyof BrandProfile, current.filter((v) => v !== value) as never);
        } else if (current.length < max) {
            setValue(field as keyof BrandProfile, [...current, value] as never);
        }
    };

    const toggleRisk = (key: RiskKey) => {
        const current = { ...riskConstraints };
        current[key] = !current[key];
        setValue("riskConstraints", current);
    };

    const toneGroups: { label: string; field: keyof BrandProfile; options: string[]; current: string[] }[] = [
        { label: "Emotional", field: "toneEmotional", options: TONE_CATEGORIES.emotional, current: toneEmotional },
        { label: "Professional", field: "toneProfessional", options: TONE_CATEGORIES.professional, current: toneProfessional },
        { label: "Cultural", field: "toneCultural", options: TONE_CATEGORIES.cultural, current: toneCultural },
        { label: "Lifestyle", field: "toneLifestyle", options: TONE_CATEGORIES.lifestyle, current: toneLifestyle },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <RiVoiceprintLine className="h-5 w-5 text-primary" />
                    Voice & Tone
                </CardTitle>
                <CardDescription>Define how your brand sounds, collaborates, and what constraints apply.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Collaboration Style */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Collaboration Style</Label>
                        <p className="text-sm text-muted-foreground">How do you prefer to work with creators? Select up to 2.</p>
                        <div className="flex flex-wrap gap-2">
                            {COLLABORATION_STYLES.map((style) => (
                                <Badge
                                    key={style}
                                    variant={collaborationStyle.includes(style) ? "default" : "outline"}
                                    className="cursor-pointer py-1.5 px-3 text-sm transition-all hover:scale-105"
                                    onClick={() => toggleChip("collaborationStyle", style, 2)}
                                >
                                    {style}
                                    {collaborationStyle.includes(style) && (
                                        <RiCloseLine className="ml-1 h-3.5 w-3.5" />
                                    )}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Tone Tags */}
                    <div className="space-y-4 border-t pt-6">
                        <Label className="text-base font-semibold">Brand Tone</Label>
                        <p className="text-sm text-muted-foreground">Pick tags that best describe your brand&apos;s voice.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {toneGroups.map(({ label, field, options, current }) => (
                                <div key={label} className="space-y-2">
                                    <Label className="text-sm text-muted-foreground uppercase tracking-wider">{label}</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {options.map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant={current.includes(tag) ? "default" : "outline"}
                                                className="cursor-pointer py-1 px-2.5 text-xs transition-all hover:scale-105"
                                                onClick={() => toggleChip(field, tag)}
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ideal Buyer */}
                    <div className="space-y-2 border-t pt-6">
                        <Label htmlFor="idealBuyerProfile" className="text-base font-semibold">Ideal Buyer Profile</Label>
                        <Textarea
                            id="idealBuyerProfile"
                            value={watch("idealBuyerProfile") || ""}
                            onChange={(e) => setValue("idealBuyerProfile", e.target.value)}
                            placeholder="Describe your ideal buyer in a few sentences..."
                            className="min-h-[80px]"
                        />
                    </div>

                    {/* Risk Constraints */}
                    <div className="space-y-4 border-t pt-6">
                        <Label className="text-base font-semibold">Risk Constraints</Label>
                        <p className="text-sm text-muted-foreground">Flag any sensitivities that constrain who or how creators can promote your brand.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Object.entries(RISK_CONSTRAINT_LABELS).map(([key, label]) => (
                                <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                                    <Label className="font-normal text-sm cursor-pointer flex-1 pr-2">{label}</Label>
                                    <Switch
                                        checked={!!riskConstraints[key as RiskKey]}
                                        onCheckedChange={() => toggleRisk(key as RiskKey)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <RiLoader2Line className="mr-2 h-4 w-4 animate-spin" />}
                            Save Voice & Tone
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
