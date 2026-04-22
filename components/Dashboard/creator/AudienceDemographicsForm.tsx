"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RiAddLine, RiCloseLine, RiLoader2Line, RiTeamLine } from "@remixicon/react";
import { CreatorProfile, updateAudience } from "@/lib/data/creator";
import toast from "react-hot-toast";

interface AudienceFormProps {
    creatorId: number;
    initialData: Partial<CreatorProfile>;
    onSuccess?: (newData: CreatorProfile) => void;
}

export default function AudienceDemographicsForm({ creatorId, initialData, onSuccess }: AudienceFormProps) {
    const { register, handleSubmit, setValue, watch } = useForm<Partial<CreatorProfile>>({
        defaultValues: initialData,
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const locales = watch("locales") || [];

    const onSubmit = async (data: Partial<CreatorProfile>) => {
        setIsSubmitting(true);
        try {
            // updateAudience in lib/data/creator currently takes specific fields, 
            // but we'll cast to any for now to permit the extra form fields 
            // until the backend is fully extended.
            const res = await updateAudience(data as any);
            if (res.success) {
                toast.success("Audience data updated");
                if (onSuccess) onSuccess(res.data);
            }
        } catch (err) {
            toast.error("Failed to update audience");
        } finally {
            setIsSubmitting(false);
        }
    };

    const addLocale = () => {
        setValue("locales", [...locales, { country: "", city: "" }]);
    };

    const removeLocale = (idx: number) => {
        setValue("locales", locales.filter((_, i) => i !== idx));
    };

    const updateLocale = (idx: number, field: "country" | "city", val: string) => {
        const newLocales = [...locales];
        newLocales[idx][field] = val;
        setValue("locales", newLocales);
    };

    return (
        <Card>
            <CardHeader shadow="none" border={false}>
                <CardTitle className="flex items-center gap-2">
                    <RiTeamLine className="h-5 w-5 text-primary" />
                    Audience Demographics
                </CardTitle>
                <CardDescription>Tell brands who consumes your content and where they are located.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-2">
                        <Label>Audience Description</Label>
                        <Textarea 
                            {...register("audienceDescription")} 
                            placeholder="Describe your typical viewer, what they like, and why they follow you..."
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <Label className="text-base">Gender Split (%)</Label>
                            <div className="flex gap-4">
                                <div className="space-y-2 flex-1">
                                    <Label className="text-xs">Male (%)</Label>
                                    <Input 
                                        type="number" 
                                        {...register("genderMale", { valueAsNumber: true })} 
                                        placeholder="0" 
                                    />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <Label className="text-xs">Female (%)</Label>
                                    <Input 
                                        type="number" 
                                        {...register("genderFemale", { valueAsNumber: true })} 
                                        placeholder="0" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-base">Top Regions</Label>
                            <div className="space-y-3">
                                {locales.map((loc, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <Input 
                                            placeholder="Country" 
                                            value={loc.country}
                                            onChange={(e) => updateLocale(idx, "country", e.target.value)}
                                            className="flex-1"
                                        />
                                        <Input 
                                            placeholder="City" 
                                            value={loc.city || ""}
                                            onChange={(e) => updateLocale(idx, "city", e.target.value)}
                                            className="flex-1"
                                        />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeLocale(idx)}>
                                            <RiCloseLine className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="ghost" size="sm" onClick={addLocale} className="h-8">
                                    <RiAddLine className="h-4 w-4 mr-1" /> Add Region
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <RiLoader2Line className="mr-2 h-4 w-4 animate-spin" />}
                            Save Audience Data
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
