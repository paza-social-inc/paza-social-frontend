"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RiLoader2Line, RiHeartLine } from "@remixicon/react";
import { CreatorProfile, updateFullCreatorProfile } from "@/lib/data/creator";
import toast from "react-hot-toast";

interface CreatorAffinityFormProps {
    initialData: Partial<CreatorProfile>;
    onSuccess?: (newData: CreatorProfile) => void;
}

export default function CreatorAffinityForm({ initialData, onSuccess }: CreatorAffinityFormProps) {
    const { register, handleSubmit } = useForm<Partial<CreatorProfile>>({
        defaultValues: initialData,
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const onSubmit = async (data: Partial<CreatorProfile>) => {
        setIsSubmitting(true);
        try {
            const res = await updateFullCreatorProfile(data);
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Dream Brand Collaboration</Label>
                            <Input 
                                {...register("dreamBrandCollaboration")} 
                                placeholder="What's the one brand you'd love to work with?" 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Product You Always Recommend</Label>
                            <Input 
                                {...register("alwaysRecommendProduct")} 
                                placeholder="What do you recommend unprompted?" 
                            />
                        </div>
                    </div>

                    <div className="space-y-4 border-t pt-6">
                        <h3 className="text-sm font-medium uppercase text-muted-foreground">Relational Intelligence</h3>
                        
                        <div className="space-y-2">
                            <Label>Meaningful Collaborators</Label>
                            <Textarea 
                                {...register("collaboratorsMeaningfulWork")} 
                                placeholder="Who have you worked with who brings out your best work? (e.g. Opposite strengths, like-minded creators)"
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Future Collaboration Wishlist</Label>
                            <Input 
                                {...register("tomorrowCollaboration")} 
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
