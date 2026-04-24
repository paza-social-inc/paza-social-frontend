"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RiLoader2Line, RiCompassLine } from "@remixicon/react";
import { CreatorProfile, updateFullCreatorProfile } from "@/lib/data/creator";
import toast from "react-hot-toast";

interface CreatorRoutineFormProps {
    initialData: Partial<CreatorProfile>;
    onSuccess?: (newData: CreatorProfile) => void;
}

export default function CreatorRoutineForm({ initialData, onSuccess }: CreatorRoutineFormProps) {
    const { register, handleSubmit } = useForm<Partial<CreatorProfile>>({
        defaultValues: initialData,
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const onSubmit = async (data: Partial<CreatorProfile>) => {
        setIsSubmitting(true);
        try {
            const res = await updateFullCreatorProfile(data);
            if (res.success) {
                toast.success("Routine & Gear updated");
                if (onSuccess) onSuccess(res.data);
            }
        } catch {
            toast.error("Failed to update routine");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <RiCompassLine className="h-5 w-5 text-primary" />
                    Routine & Gear
                </CardTitle>
                <CardDescription>Behavioral product data helps brands understand how they fit into your life.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label>A Day in Your Life</Label>
                        <Textarea 
                            {...register("dailyRoutineText")} 
                            placeholder="Walk us through your routine — from when you wake up to when you wind down. What products are part of your daily routine?"
                            className="min-h-[120px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Backpack / Daily Carry</Label>
                        <Textarea 
                            {...register("dailyCarryText")} 
                            placeholder="What are the non-negotiables you never leave behind? (Laptops, Gadgets, Kits, etc.)"
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Nostalgic Favorites</Label>
                        <Textarea 
                            {...register("nostalgicProductsText")} 
                            placeholder="Any favorites from your past/childhood that still hold a special place or that you still use today?"
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <RiLoader2Line className="mr-2 h-4 w-4 animate-spin" />}
                            Save Routine & Gear
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
