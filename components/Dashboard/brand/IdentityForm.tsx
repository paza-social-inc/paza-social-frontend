"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RiAddLine, RiCloseLine, RiLoader2Line } from "@remixicon/react";
import { BrandProfile, updateBrandIdentity } from "@/lib/data/brands";
import { BRAND_INDUSTRIES, BRAND_SUBCATEGORIES_MAP } from "@/lib/constants/brandTaxonomy";
import toast from "react-hot-toast";

interface IdentityFormProps {
    businessId: number;
    initialData: Partial<BrandProfile>;
    onSuccess?: (newData: BrandProfile) => void;
}

export default function IdentityForm({ businessId, initialData, onSuccess }: IdentityFormProps) {
    const { register, handleSubmit, setValue, watch } = useForm<Partial<BrandProfile>>({
        defaultValues: initialData,
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const subcategories = watch("subcategory") || [];
    const operatingRegions = watch("operatingRegions") || [];
    const selectedIndustry = watch("industry") || "";

    // Get available subcategories based on selected industry
    const availableSubcategories = selectedIndustry ? (BRAND_SUBCATEGORIES_MAP[selectedIndustry] || []) : [];

    const onSubmit = async (data: Partial<BrandProfile>) => {
        setIsSubmitting(true);
        try {
            const res = await updateBrandIdentity(businessId, data);
            if (res.success) {
                toast.success("Brand identity updated successfully");
                if (onSuccess) onSuccess(res.data);
            } else {
                toast.error(res.message || "Failed to update identity");
            }
        } catch {
            toast.error("An error occurred while saving");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleSubcategory = (sub: string) => {
        if (subcategories.includes(sub)) {
            setValue("subcategory", subcategories.filter(t => t !== sub));
        } else if (subcategories.length < 2) {
            setValue("subcategory", [...subcategories, sub]);
        } else {
            toast.error("Maximum 2 subcategories allowed");
        }
    };

    const addRegion = () => {
        setValue("operatingRegions", [...operatingRegions, { country: "", city: "" }]);
    };

    const removeRegion = (index: number) => {
        setValue("operatingRegions", operatingRegions.filter((_, i) => i !== index));
    };

    const updateRegion = (index: number, field: "country" | "city", value: string) => {
        const newRegions = [...operatingRegions];
        newRegions[index][field] = value;
        setValue("operatingRegions", newRegions);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Brand Identity</CardTitle>
                <CardDescription>Manage your brand&apos;s display identity, industry, and categories.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="brandname">Internal Brand Name</Label>
                            <Input id="brandname" {...register("brandname")} placeholder="e.g. Acme Corp" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="displayName">Public Display Name</Label>
                            <Input id="displayName" {...register("displayName")} placeholder="e.g. Acme Studio" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input id="website" {...register("website")} placeholder="https://yourbrand.com" type="url" />
                        </div>
                        <div className="space-y-2">
                            <Label>Primary Contact Channel</Label>
                            <Select
                                onValueChange={(val) => setValue("primaryContactChannel", val)}
                                defaultValue={initialData.primaryContactChannel}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select channel" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                    <SelectItem value="phone">Phone Call</SelectItem>
                                    <SelectItem value="linkedin">LinkedIn DM</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Industry */}
                    <div className="space-y-2">
                        <Label>Industry</Label>
                        <Select
                            onValueChange={(val) => {
                                setValue("industry", val);
                                // Reset subcategories when industry changes
                                setValue("subcategory", []);
                            }}
                            defaultValue={initialData.industry}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select your industry" />
                            </SelectTrigger>
                            <SelectContent>
                                {BRAND_INDUSTRIES.map((ind) => (
                                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Subcategories — shown when industry is selected */}
                    {selectedIndustry && availableSubcategories.length > 0 && (
                        <div className="space-y-3">
                            <Label>Subcategories <span className="text-muted-foreground font-normal">(select up to 2)</span></Label>
                            <div className="flex flex-wrap gap-2">
                                {availableSubcategories.map(sub => (
                                    <Badge
                                        key={sub}
                                        variant={subcategories.includes(sub) ? "default" : "outline"}
                                        className="cursor-pointer py-1.5 px-3 text-sm transition-all hover:scale-105"
                                        onClick={() => toggleSubcategory(sub)}
                                    >
                                        {sub}
                                        {subcategories.includes(sub) && (
                                            <RiCloseLine className="ml-1 h-3.5 w-3.5" />
                                        )}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                            <Label>Restricted Category</Label>
                            <p className="text-sm text-muted-foreground">Is your brand in a regulated industry (e.g. Alcohol, Fintech)?</p>
                        </div>
                        <Switch
                            checked={watch("restrictedCategory")}
                            onCheckedChange={(val) => setValue("restrictedCategory", val)}
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Operating Regions</Label>
                            <Button type="button" variant="ghost" size="sm" onClick={addRegion} className="h-8">
                                <RiAddLine className="mr-1 h-4 w-4" /> Add Region
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {operatingRegions.map((region, idx) => (
                                <div key={idx} className="flex gap-2 items-end">
                                    <div className="flex-1 space-y-1">
                                        <Input
                                            placeholder="Country"
                                            value={region.country}
                                            onChange={(e) => updateRegion(idx, "country", e.target.value)}
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Input
                                            placeholder="City (optional)"
                                            value={region.city}
                                            onChange={(e) => updateRegion(idx, "city", e.target.value)}
                                        />
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeRegion(idx)}>
                                        <RiCloseLine className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <RiLoader2Line className="mr-2 h-4 w-4 animate-spin" />}
                            Save Identity Changes
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
