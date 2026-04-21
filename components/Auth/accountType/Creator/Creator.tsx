import { useState, type ReactElement } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { saveCreatorProfileFull } from "@/lib/data/creatorOnboarding";
import ProfileMediaStep from "./components/ProfileMediaStep";
import CategoriesValuesStep from "./components/CategoriesValueStep";
import SocialCareerStep from "./components/SocialCareerStep";
import BasicInfoStep from "./components/BasicInfoStep";
import PersonalInfoStep from "./components/PersonalInfoStep";
import { Creator, initialCreatorData } from "@/types/preferences/Creator/CreatorType";
import { usePreventRefresh } from "@/hooks/use-preventRefresh";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { cj } from "./creatorJourneyTheme";
import Logo from "@/assets/Logo";
import { ArrowRight, Loader2 } from "lucide-react";

type CreatorJourneyMode = "full" | "signup-lite";

type CreatorJourneyStep = {
    title: string;
    short: string;
    render: (data: Creator, onUpdate: (data: Partial<Creator>) => void) => ReactElement;
};

const FULL_STEPS: CreatorJourneyStep[] = [
    {
        title: "Personal",
        short: "Personal",
        render: (data, onUpdate) => <PersonalInfoStep data={data} onUpdate={onUpdate} />,
    },
    {
        title: "Creator profile",
        short: "Profile",
        render: (data, onUpdate) => <BasicInfoStep data={data} onUpdate={onUpdate} />,
    },
    {
        title: "Niche & skills",
        short: "Niche",
        render: (data, onUpdate) => <CategoriesValuesStep data={data} onUpdate={onUpdate} />,
    },
    {
        title: "Social & career",
        short: "Social",
        render: (data, onUpdate) => <SocialCareerStep data={data} onUpdate={onUpdate} />,
    },
    {
        title: "Photo",
        short: "Photo",
        render: (data, onUpdate) => <ProfileMediaStep data={data} onUpdate={onUpdate} />,
    },
];

const SIGNUP_LITE_STEPS: CreatorJourneyStep[] = [
    {
        title: "Social & career",
        short: "Social",
        render: (data, onUpdate) => <SocialCareerStep data={data} onUpdate={onUpdate} />,
    },
    {
        title: "Photo",
        short: "Photo",
        render: (data, onUpdate) => <ProfileMediaStep data={data} onUpdate={onUpdate} />,
    },
];

export type CreatorRegistrationProps = {
    initialData?: Partial<Creator>;
    onComplete?: () => void;
    embedded?: boolean;
    className?: string;
    stepOffset?: number;
    totalSteps?: number;
    mode?: CreatorJourneyMode;
};

export default function CreatorRegistration({
    initialData,
    onComplete,
    embedded = false,
    className,
    stepOffset = 0,
    totalSteps,
    mode = "full",
}: CreatorRegistrationProps = {}) {
    const [activeStep, setActiveStep] = useState(1);
    const [isFilling, setIsFilling] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<Creator>(() => ({
        ...initialCreatorData,
        ...initialData,
    }));
    const router = useRouter();

    const updateField = (data: Partial<Creator>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };
    const steps = mode === "signup-lite" ? SIGNUP_LITE_STEPS : FULL_STEPS;
    const totalJourneySteps = steps.length;

    const handleNext = () => {
        setIsFilling(true);
        if (activeStep < totalJourneySteps) setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        if (activeStep === 1) {
            if (!embedded) router.back();
            return;
        }
        if (activeStep > 1) setActiveStep(activeStep - 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await saveCreatorProfileFull(formData);
            const hasBlobMedia =
                (formData.avatar?.startsWith("blob:") ?? false) ||
                (formData.preview?.startsWith("blob:") ?? false);
            toast.success(
                hasBlobMedia
                    ? "Profile saved. Photo previews are local only until you upload to storage."
                    : "Creator profile saved"
            );
            setIsFilling(false);
            if (onComplete) onComplete();
            else router.push("/overview");
        } catch (e: unknown) {
            const ax = e as {
                response?: { data?: { message?: string; details?: { message?: string }[] } };
            };
            const msg =
                ax.response?.data?.details?.map((d) => d.message).join(". ") ||
                ax.response?.data?.message ||
                "Could not save your profile. Please try again.";
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    usePreventRefresh(isFilling || isSubmitting);

    const effectiveTotalSteps = totalSteps ?? totalJourneySteps;
    const displayStep = Math.min(stepOffset + activeStep, effectiveTotalSteps);
    const progressPct = (displayStep / effectiveTotalSteps) * 100;
    const currentStep = steps[activeStep - 1];

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
                    <p className="text-sm font-medium text-orange-400">{currentStep?.short}</p>
                </div>
            </div>

            <div className="space-y-2 text-center">
                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                    Please fill up these details
                </h1>
                <p className="text-sm text-zinc-400">
                    How are you planning to use Paza? We&apos;ll fit the experience to your needs.
                </p>
                <p className="text-xs text-zinc-500">
                    Don&apos;t worry, you&apos;ll be able to change this later on.
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
                    {currentStep?.title}
                </p>
            </div>

            <div className={cn(cj.card, "min-h-[min(52vh,480px)] p-4 sm:p-6")}>
                {currentStep?.render(formData, updateField)}
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
                {!(embedded && activeStep === 1) ? (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        disabled={isSubmitting}
                        className={cn(cj.btnSecondary, "h-12 flex-1 rounded-xl border-zinc-600 sm:max-w-[50%]")}
                    >
                        {activeStep === 1 ? "Back" : "Previous"}
                    </Button>
                ) : null}
                {activeStep < totalJourneySteps ? (
                    <Button
                        type="button"
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className={cn(
                            cj.btnPrimary,
                            "h-12 gap-2 rounded-xl",
                            embedded && activeStep === 1 ? "w-full" : "min-w-0 flex-1"
                        )}
                    >
                        Next
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button
                        type="button"
                        onClick={() => void handleSubmit()}
                        disabled={isSubmitting}
                        className={cn(
                            cj.btnPrimary,
                            "h-12 rounded-xl",
                            embedded && activeStep === 1 ? "w-full" : "min-w-0 flex-1"
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
