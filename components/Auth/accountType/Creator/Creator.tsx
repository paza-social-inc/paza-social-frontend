import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Stepper,
    StepperItem,
    StepperTrigger,
    StepperIndicator,
    StepperTitle,
    StepperSeparator,
} from "@/components/ui/stepper";
import ProfileMediaStep from "./components/ProfileMediaStep";
import CategoriesValuesStep from "./components/CategoriesValueStep";
import ExperienceStep from "./components/ExperienceStep";
import SocialMediaStep from "./components/SocialMediaStep";
import BasicInfoStep from "./components/BasicInfoStep";
import { Creator, initialCreatorData } from "@/types/preferences/Creator/CreatorType";
import { usePreventRefresh } from "@/hooks/use-preventRefresh";
import { useRouter } from "next/navigation";

const steps = [
    { step: 1, title: "Basic Info" },
    { step: 2, title: "SocialMedia" },
    { step: 3, title: "Experience" },
    { step: 4, title: "Categories & Values" },
    { step: 5, title: "Profile" }
];


export default function CreatorRegistration() {
    const [activeStep, setActiveStep] = useState(1);
    const [isFilling, setIsFilling] = useState(false);
    const [formData, setFormData] = useState<Creator>(initialCreatorData);
    const router = useRouter();

    const updateField = (data: Partial<Creator>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const handleNext = () => {
        setIsFilling(true);
        if (activeStep < 5) setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        if (activeStep === 1) router.back();
        else if (activeStep > 1) setActiveStep(activeStep - 1);
    };

    const handleSubmit = () => {
        setIsFilling(false);
        console.log("Form submitted:", formData);
    };


    usePreventRefresh(isFilling);

    return (
        <div className="p-6 space-y-8 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Complete Your Creator Profile</h1>
                <p className="text-muted-foreground">
                    Let's set up your profile to get you started
                </p>
            </div>

            <Stepper value={activeStep} onValueChange={setActiveStep}>
                {steps.map((stepItem, index) => (
                    <StepperItem
                        className="not-last:flex-1"
                        key={stepItem.step}
                        step={stepItem.step}
                        completed={activeStep > stepItem.step}
                    >
                        <StepperTrigger asChild>
                            <StepperIndicator />
                        </StepperTrigger>
                        {index < steps.length - 1 && <StepperSeparator />}
                    </StepperItem>
                ))}
            </Stepper>

            <div className="dark:bg-neutral-900 bg-card border rounded-lg p-6 min-h-[400px]">
                {activeStep === 1 && (
                    <BasicInfoStep data={formData} onUpdate={updateField} />
                )}

                {activeStep === 2 && (
                    <SocialMediaStep data={formData} onUpdate={updateField} />
                )}

                {activeStep === 3 && (
                    <ExperienceStep data={formData} onUpdate={updateField} />
                )}

                {activeStep === 4 && (
                    <CategoriesValuesStep data={formData} onUpdate={updateField} />
                )}

                {activeStep === 5 && (
                    <ProfileMediaStep data={formData} onUpdate={updateField} />
                )}
            </div>

            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={handleBack}
                >
                    Back
                </Button>
                {activeStep < 5 ? (
                    <Button onClick={handleNext}>Next</Button>
                ) : (
                    <Button onClick={handleSubmit} className="bg-orange-600 hover:bg-orange-700">
                        Complete Registration
                    </Button>
                )}
            </div>
        </div>
    );
}
