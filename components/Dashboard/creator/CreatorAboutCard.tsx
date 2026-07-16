"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiLoader2Line, RiUserLine, RiPencilLine } from "@remixicon/react";
import { CreatorProfile, updateFullCreatorProfile } from "@/lib/data/creator";
import toast from "react-hot-toast";

interface CreatorAboutCardProps {
    initialData: Partial<CreatorProfile>;
    onSuccess?: (newData: CreatorProfile) => void;
}

export default function CreatorAboutCard({ initialData, onSuccess }: CreatorAboutCardProps) {
    const [editing, setEditing] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const { register, handleSubmit, reset, watch } = useForm<Partial<CreatorProfile>>({
        defaultValues: initialData,
    });

    // Keep the form in sync if the profile reloads elsewhere (e.g. after another tab saves).
    React.useEffect(() => {
        reset(initialData);
    }, [initialData, reset]);

    const creatorname = watch("creatorname");
    const about = watch("about");

    const onSubmit = async (data: Partial<CreatorProfile>) => {
        setIsSubmitting(true);
        try {
            const res = await updateFullCreatorProfile(data);
            if (res.success) {
                toast.success("Profile updated");
                setEditing(false);
                if (onSuccess) onSuccess(res.data);
            }
        } catch {
            toast.error("Failed to update profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    const cancel = () => {
        reset(initialData);
        setEditing(false);
    };

    if (editing) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <RiUserLine className="h-5 w-5 text-primary" />
                        Creator Profile
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Creator name</Label>
                            <Input
                                {...register("creatorname")}
                                placeholder="Your public creator name"
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>About</Label>
                            <Textarea
                                {...register("about")}
                                placeholder="What you create, your audience, and what collaborations you are looking for"
                                rows={5}
                                className="min-h-[120px] resize-none"
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={cancel} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <RiLoader2Line className="mr-2 h-4 w-4 animate-spin" />}
                                Save
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        );
    }

    const hasContent = Boolean(creatorname?.trim() || about?.trim());

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <RiUserLine className="h-5 w-5 text-primary" />
                        {creatorname?.trim() || "Creator Profile"}
                    </CardTitle>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-muted-foreground hover:text-foreground"
                    onClick={() => setEditing(true)}
                >
                    <RiPencilLine className="h-3.5 w-3.5" />
                    Edit
                </Button>
            </CardHeader>
            <CardContent>
                {about?.trim() ? (
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {about}
                    </p>
                ) : (
                    <p className="text-sm italic text-muted-foreground/70">
                        {hasContent ? "No about text yet." : "Add your creator name and about to introduce yourself to brands."}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}