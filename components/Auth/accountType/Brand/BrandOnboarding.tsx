"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Field, FieldLabel } from "@/components/ui/field";
import { ArrowLeft, ArrowRight, Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { pazaApi } from "@/lib/axiosClients";
import {
    ensureBusinessId,
    saveBrandProfileFull,
    type BrandOnboardingFormState,
} from "@/lib/data/brandOnboarding";
import { usePreventRefresh } from "@/hooks/use-preventRefresh";
import toast from "react-hot-toast";
import Logo from "@/assets/Logo";
import { cj } from "../Creator/creatorJourneyTheme";
import { BrandSocialCareerStep } from "./BrandSocialCareerStep";

const STEPS = [
    {
        id: 1,
        title: "Company details",
        description: "Business identity and primary contact details",
        short: "Details",
    },
    { id: 2, title: "Social links", description: "Channels where your brand is active", short: "Social" },
    { id: 3, title: "Profile", description: "Logo or profile picture", short: "Photo" },
];

const initialForm: BrandOnboardingFormState = {
    companyName: "",
    website: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    twitter: "",
    linkedin: "",
    facebook: "",
    followers: "",
    careerMilestones: "",
    profilePicture: null,
};

export type BrandOnboardingProps = {
    embedded?: boolean;
    onComplete?: () => void;
    className?: string;
    stepOffset?: number;
    totalSteps?: number;
};

export default function BrandOnboarding({
    embedded = false,
    onComplete,
    className,
    stepOffset = 0,
    totalSteps,
}: BrandOnboardingProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<BrandOnboardingFormState>(initialForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authReady, setAuthReady] = useState(embedded);
    const router = useRouter();

    const totalJourneySteps = STEPS.length;

    useEffect(() => {
        if (embedded) return;
        let cancelled = false;
        void (async () => {
            try {
                await pazaApi.get("/api/auth/me");
                if (!cancelled) setAuthReady(true);
            } catch {
                if (!cancelled) router.push("/login");
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [embedded, router]);

    const updateFormData = (field: keyof BrandOnboardingFormState, value: unknown) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const patchFormData = (updates: Partial<BrandOnboardingFormState>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const businessId = await ensureBusinessId({
                companyName: formData.companyName,
                website: formData.website,
            });
            await saveBrandProfileFull(businessId, formData);
            const hasLocalPhoto = Boolean(formData.profilePicture);
            toast.success(
                hasLocalPhoto
                    ? "Brand profile and logo saved."
                    : "Brand profile saved"
            );
            if (onComplete) onComplete();
            else router.push("/overview");
        } catch (e: unknown) {
            const ax = e as {
                response?: { data?: { message?: string; details?: { message?: string }[] } };
            };
            const msg =
                ax.response?.data?.details?.map((d) => d.message).join(". ") ||
                ax.response?.data?.message ||
                "Could not save your brand profile. Please try again.";
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => {
        if (currentStep < totalJourneySteps) {
            setCurrentStep(currentStep + 1);
        } else {
            void handleSubmit();
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else if (!embedded) {
            router.back();
        }
    };

    const hasAnySocialLink = () => {
        const s =
            formData.instagram.trim() ||
            formData.tiktok.trim() ||
            formData.youtube.trim() ||
            formData.twitter.trim() ||
            formData.linkedin.trim() ||
            formData.facebook.trim();
        return Boolean(s);
    };

    const canProceed = () => {
        const stepId = STEPS[currentStep - 1]?.id;
        switch (stepId) {
            case 1:
                return Boolean(
                    formData.companyName &&
                        formData.website &&
                        formData.email &&
                        formData.phone &&
                        formData.address &&
                        formData.role
                );
            case 2:
                return hasAnySocialLink();
            case 3:
                return Boolean(formData.profilePicture);
            default:
                return false;
        }
    };

    usePreventRefresh(isSubmitting);

    const effectiveTotalSteps = totalSteps ?? totalJourneySteps;
    const displayStep = Math.min(stepOffset + currentStep, effectiveTotalSteps);
    const progressPct = (displayStep / effectiveTotalSteps) * 100;

    const inputClass = embedded ? cj.input : undefined;

    const renderStepContent = () => {
        const stepId = STEPS[currentStep - 1]?.id;
        switch (stepId) {
            case 1:
                return (
                    <div className="space-y-4">
                        <Field>
                            <FieldLabel
                                htmlFor="company-name"
                                className={embedded ? cj.labelField : undefined}
                            >
                                Company Name
                            </FieldLabel>
                            <Input
                                id="company-name"
                                placeholder="Your company name"
                                value={formData.companyName}
                                onChange={(e) => updateFormData("companyName", e.target.value)}
                                className={inputClass}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="email" className={embedded ? cj.labelField : undefined}>
                                Company Email
                            </FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                placeholder="business@yourcompany.com"
                                value={formData.email}
                                onChange={(e) => updateFormData("email", e.target.value)}
                                className={inputClass}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="website" className={embedded ? cj.labelField : undefined}>
                                Company Website
                            </FieldLabel>
                            <Input
                                id="website"
                                type="url"
                                placeholder="https://yourcompany.com"
                                value={formData.website}
                                onChange={(e) => updateFormData("website", e.target.value)}
                                className={inputClass}
                            />
                        </Field>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="phone" className={embedded ? cj.labelField : undefined}>
                                    Contact
                                </FieldLabel>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+254 …"
                                    value={formData.phone}
                                    onChange={(e) => updateFormData("phone", e.target.value)}
                                    className={inputClass}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="address" className={embedded ? cj.labelField : undefined}>
                                    Company Address
                                </FieldLabel>
                                <Input
                                    id="address"
                                    placeholder="Location"
                                    value={formData.address}
                                    onChange={(e) => updateFormData("address", e.target.value)}
                                    className={inputClass}
                                />
                            </Field>
                        </div>
                        <Field>
                            <FieldLabel htmlFor="role" className={embedded ? cj.labelField : undefined}>
                                Role in company
                            </FieldLabel>
                            <Input
                                id="role"
                                placeholder="Marketing Manager, CEO, etc."
                                value={formData.role}
                                onChange={(e) => updateFormData("role", e.target.value)}
                                className={inputClass}
                            />
                        </Field>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <BrandSocialCareerStep data={formData} onPatch={patchFormData} />
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <div className="text-center">
                            <Label className={cn("text-base font-medium", embedded && "text-zinc-200")}>
                                Upload Profile Picture
                            </Label>
                            <div
                                className={cn(
                                    "mt-4 rounded-lg border-2 border-dashed p-8 text-center",
                                    embedded ? "border-zinc-600 bg-zinc-900/40" : "border-gray-300"
                                )}
                            >
                                <Upload
                                    className={cn(
                                        "mx-auto mb-4 h-12 w-12",
                                        embedded ? "text-zinc-500" : "text-gray-400"
                                    )}
                                />
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="profile-upload"
                                        className={cn(
                                            "cursor-pointer hover:underline",
                                            embedded ? "text-orange-400" : "text-primary"
                                        )}
                                    >
                                        Click to upload
                                    </Label>
                                    <p className={cn("text-sm", embedded ? "text-zinc-500" : "text-muted-foreground")}>
                                        PNG, JPG up to 10MB
                                    </p>
                                </div>
                                <Input
                                    id="profile-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                        updateFormData("profilePicture", e.target.files?.[0] || null)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (!embedded && !authReady) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (embedded) {
        return (
            <div className={cn(cj.shell, "space-y-6 rounded-2xl p-4 sm:p-6", className)}>
                <div className="flex items-start justify-between gap-4">
                    <div className="pt-0.5 [&_img]:h-8 [&_img]:w-auto">
                        <Logo />
                    </div>
                    <div className="text-right">
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                            Step {displayStep} of {effectiveTotalSteps}
                        </p>
                        <p className="text-sm font-medium text-orange-400">{STEPS[currentStep - 1]?.short}</p>
                    </div>
                </div>

                <div className="space-y-2 text-center">
                    <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                        Please fill up these details
                    </h1>
                    <p className="text-sm text-zinc-400">
                        Tell us about your brand so we can tailor campaigns and discovery for you.
                    </p>
                </div>

                <div className="space-y-1.5">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                        <div
                            className="h-full rounded-full bg-orange-600 transition-[width] duration-300 ease-out"
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                    <p className="text-center text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                        {STEPS[currentStep - 1]?.title}
                    </p>
                </div>

                <div className={cn(cj.card, "min-h-[min(52vh,480px)] p-4 sm:p-6")}>{renderStepContent()}</div>

                <div className="flex flex-wrap gap-3 pt-1">
                    {!(embedded && currentStep === 1) ? (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            disabled={isSubmitting}
                            className={cn(cj.btnSecondary, "h-12 flex-1 rounded-xl border-zinc-600 sm:max-w-[50%]")}
                        >
                            {currentStep === 1 ? "Back" : "Previous"}
                        </Button>
                    ) : null}
                    {currentStep < totalJourneySteps ? (
                        <Button
                            type="button"
                            onClick={nextStep}
                            disabled={isSubmitting || !canProceed()}
                            className={cn(
                                cj.btnPrimary,
                                "h-12 gap-2 rounded-xl",
                                embedded && currentStep === 1 ? "w-full" : "min-w-0 flex-1"
                            )}
                        >
                            Next
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={() => void handleSubmit()}
                            disabled={isSubmitting || !canProceed()}
                            className={cn(
                                cj.btnPrimary,
                                "h-12 rounded-xl",
                                embedded && currentStep === 1 ? "w-full" : "min-w-0 flex-1"
                            )}
                        >
                            {isSubmitting ? (
                                <span className="inline-flex items-center justify-center gap-2">
                                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                                    Saving…
                                </span>
                            ) : (
                                "Save"
                            )}
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    const progress = (currentStep / totalJourneySteps) * 100;

    return (
        <div className="min-h-screen bg-background p-4">
            <div className="mx-auto max-w-2xl">
                <Card>
                    <CardHeader>
                        <div className="mb-4 flex items-center justify-between">
                            <Button variant="ghost" size="sm" onClick={prevStep} disabled={currentStep === 1}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Step {currentStep} of {totalJourneySteps}
                            </span>
                        </div>
                        <Progress value={progress} className="mb-4" />
                        <CardTitle className="text-xl">{STEPS[currentStep - 1]?.title}</CardTitle>
                        <CardDescription>{STEPS[currentStep - 1]?.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {renderStepContent()}

                        <div className="mt-6 flex justify-end">
                            <Button onClick={nextStep} disabled={!canProceed() || isSubmitting}>
                                {currentStep === totalJourneySteps ? (
                                    isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving…
                                        </>
                                    ) : (
                                        "Complete Setup"
                                    )
                                ) : (
                                    <>
                                        Continue
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
