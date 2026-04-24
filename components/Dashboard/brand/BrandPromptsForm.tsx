"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RiLoader2Line, RiLightbulbLine } from "@remixicon/react";
import { BrandProfile, updateBrandVoice } from "@/lib/data/brands";
import toast from "react-hot-toast";

interface BrandPromptsFormProps {
    businessId: number;
    initialData: Partial<BrandProfile>;
    onSuccess?: (newData: BrandProfile) => void;
}

interface PromptsFormData {
    admiredCreator: string;
    coCreationPartner: string;
    productBefore: string;
    productAfter: string;
    idealBuyerDescription: string;
    avoidedAssociation: string;
}

const PROMPT_FIELDS: { key: keyof PromptsFormData; label: string; placeholder: string; description: string }[] = [
    {
        key: "admiredCreator",
        label: "Admired Creator",
        placeholder: "e.g. Mkbhd, Emma Chamberlain, Jay Shetty...",
        description: "Name a creator whose style perfectly represents your brand.",
    },
    {
        key: "coCreationPartner",
        label: "Ideal Co-Creation Partner",
        placeholder: "Describe the type of creator you dream of partnering with...",
        description: "What qualities, audience, and style does your ideal collaborator have?",
    },
    {
        key: "productBefore",
        label: "Life Before Your Product",
        placeholder: "Before using our product, customers struggle with...",
        description: "Paint a picture of the problem your customer faces.",
    },
    {
        key: "productAfter",
        label: "Life After Your Product",
        placeholder: "After discovering our product, customers now...",
        description: "Describe the transformation your product delivers.",
    },
    {
        key: "idealBuyerDescription",
        label: "Ideal Buyer Description",
        placeholder: "Our ideal buyer is a 25-35 year old professional who values...",
        description: "A detailed persona of the customer you want creators to speak to.",
    },
    {
        key: "avoidedAssociation",
        label: "Avoided Associations",
        placeholder: "Our brand should never be associated with...",
        description: "Topics, aesthetics, or contexts your brand should steer clear of.",
    },
];

export default function BrandPromptsForm({ businessId, initialData, onSuccess }: BrandPromptsFormProps) {
    const { register, handleSubmit } = useForm<PromptsFormData>({
        defaultValues: {
            admiredCreator: initialData.admiredCreator || "",
            coCreationPartner: initialData.coCreationPartner || "",
            productBefore: initialData.productBefore || "",
            productAfter: initialData.productAfter || "",
            idealBuyerDescription: initialData.idealBuyerDescription || "",
            avoidedAssociation: initialData.avoidedAssociation || "",
        },
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const onSubmit = async (data: PromptsFormData) => {
        setIsSubmitting(true);
        try {
            const res = await updateBrandVoice(businessId, data);
            if (res.success) {
                toast.success("Brand prompts saved");
                if (onSuccess) onSuccess(res.data);
            } else {
                toast.error(res.message || "Failed to save prompts");
            }
        } catch {
            toast.error("An error occurred while saving");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <RiLightbulbLine className="h-5 w-5 text-primary" />
                    Brand Prompts
                </CardTitle>
                <CardDescription>
                    These prompts help creators understand your brand&apos;s positioning and produce content that resonates.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {PROMPT_FIELDS.map(({ key, label, placeholder, description }) => (
                            <div key={key} className="space-y-2">
                                <Label htmlFor={key} className="font-semibold">{label}</Label>
                                <p className="text-xs text-muted-foreground">{description}</p>
                                <Textarea
                                    id={key}
                                    {...register(key)}
                                    placeholder={placeholder}
                                    className="min-h-[90px] text-sm"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <RiLoader2Line className="mr-2 h-4 w-4 animate-spin" />}
                            Save Prompts
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
