"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiAddLine, RiCloseLine, RiLoader2Line, RiHeartLine } from "@remixicon/react";
import { CreatorProfile, updatePrompts } from "@/lib/data/creator";
import toast from "react-hot-toast";

interface CreatorAffinityFormProps {
    initialData: Partial<CreatorProfile>;
    onSuccess?: (newData: CreatorProfile) => void;
}

export default function CreatorAffinityForm({ initialData, onSuccess }: CreatorAffinityFormProps) {
  function toArray(value: unknown): string[] {
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string" && v.trim() !== "");
    if (typeof value === "string" && value.trim() !== "") return [value.trim()];
    return [];
}

// ...inside the component:

    const { register, handleSubmit, setValue, watch } = useForm<Partial<CreatorProfile>>({
        defaultValues: {
            ...initialData,
            dreamBrandCollaboration: toArray(initialData.dreamBrandCollaboration) as never,
            alwaysRecommend: toArray(initialData.alwaysRecommend) as never,
        },
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [tagInputs, setTagInputs] = React.useState({ brand: "", product: "" });

    const dreamBrands = toArray(watch("dreamBrandCollaboration"));
    const recommendedProducts = toArray(watch("alwaysRecommend"));

    const onSubmit = async (data: Partial<CreatorProfile>) => {
        setIsSubmitting(true);
        try {
            const res = await updatePrompts(data);
            if (res.success) {
                toast.success("Affinities updated");
                if (onSuccess) onSuccess(res.data);
            }
        } catch {
            toast.error("Failed to update affinities");
        } finally {
            setIsSubmitting(false);
        }
    };

    const addTag = (field: keyof CreatorProfile, inputKey: keyof typeof tagInputs) => {
        const val = tagInputs[inputKey].trim();
        const current = (watch(field) as string[]) || [];
        if (val && !current.includes(val)) {
            setValue(field, [...current, val] as never);
            setTagInputs((p) => ({ ...p, [inputKey]: "" }));
        }
    };

   const removeTag = (field: keyof CreatorProfile, val: string) => {
    const current = toArray(watch(field));
    setValue(field, current.filter((t) => t !== val) as never);
};

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <RiHeartLine className="h-5 w-5 text-primary" />
                    Brand Affinity & Loyalty
                </CardTitle>
                <CardDescription>Tell us about the brands you love and people you admire.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label>Dream Brand Collaboration</Label>
                                {dreamBrands.length > 0 && (
                                    <button
                                        type="button"
                                        className="text-xs text-destructive hover:underline"
                                        onClick={() => setValue("dreamBrandCollaboration", [] as never)}
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    value={tagInputs.brand}
                                    onChange={(e) => setTagInputs((p) => ({ ...p, brand: e.target.value }))}
                                    placeholder="What's the one brand you'd love to work with?"
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && (e.preventDefault(), addTag("dreamBrandCollaboration", "brand"))
                                    }
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => addTag("dreamBrandCollaboration", "brand")}
                                >
                                    <RiAddLine />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {dreamBrands.map((b) => (
                                  <Badge key={b} variant="outline" className="gap-1 border-orange-200">
                                        {b}
                                        <button
                                            type="button"
                                            onClick={() => removeTag("dreamBrandCollaboration", b)}
                                            className="ml-0.5 rounded-full p-0.5 hover:bg-black/10"
                                            aria-label={`Remove ${b}`}
                                        >
                                            <RiCloseLine className="h-3 w-3 pointer-events-none" />
                                        </button>
                                  </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label>Product You Always Recommend</Label>
                                {recommendedProducts.length > 0 && (
                                    <button
                                        type="button"
                                        className="text-xs text-destructive hover:underline"
                                        onClick={() => setValue("alwaysRecommend", [] as never)}
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    value={tagInputs.product}
                                    onChange={(e) => setTagInputs((p) => ({ ...p, product: e.target.value }))}
                                    placeholder="What do you recommend unprompted?"
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && (e.preventDefault(), addTag("alwaysRecommend", "product"))
                                    }
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => addTag("alwaysRecommend", "product")}
                                >
                                    <RiAddLine />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {recommendedProducts.map((p) => (
                                   <Badge key={p} variant="outline" className="gap-1">
                                        {p}
                                        <button
                                            type="button"
                                            onClick={() => removeTag("alwaysRecommend", p)}
                                            className="ml-0.5 rounded-full p-0.5 hover:bg-black/10"
                                            aria-label={`Remove ${p}`}
                                        >
                                            <RiCloseLine className="h-3 w-3 pointer-events-none" />
                                        </button>
                                   </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 border-t pt-6">
                        <h3 className="text-sm font-medium uppercase text-muted-foreground">Relational Intelligence</h3>

                        <div className="space-y-2">
                            <Label>Meaningful Collaborators</Label>
                            <Textarea
                                {...register("collabMindedPeople")}
                                placeholder="Who have you worked with who brings out your best work? (e.g. Opposite strengths, like-minded creators)"
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Future Collaboration Wishlist</Label>
                            <Input
                                {...register("dreamCollaborator")}
                                placeholder="Who would you collaborate with tomorrow if given the chance?"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <RiLoader2Line className="mr-2 h-4 w-4 animate-spin" />}
                            Save Affinities
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}