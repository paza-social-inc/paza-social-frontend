"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { ArrowLeft, ArrowRight, Upload } from "lucide-react"

const STEPS = [
    { id: 1, title: "Basic Info", description: "Company details" },
    { id: 2, title: "Contact", description: "Contact information" },
    { id: 3, title: "Platforms", description: "Social media presence" },
    { id: 4, title: "About", description: "Mission & values" },
    { id: 5, title: "Profile", description: "Profile picture" }
]

const PLATFORMS = [
    { id: "instagram", label: "Instagram" },
    { id: "tiktok", label: "TikTok" },
    { id: "youtube", label: "YouTube" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "facebook", label: "Facebook" },
    { id: "twitter", label: "X (Twitter)" }
]

export default function BrandOnboardingPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        companyName: "",
        website: "",
        email: "",
        phone: "",
        role: "",
        platforms: [] as string[],
        description: "",
        mission: "",
        vision: "",
        coreValues: "",
        profilePicture: null as File | null
    })
    const router = useRouter()

    const updateFormData = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handlePlatformToggle = (platformId: string) => {
        setFormData(prev => ({
            ...prev,
            platforms: prev.platforms.includes(platformId)
                ? prev.platforms.filter(p => p !== platformId)
                : [...prev.platforms, platformId]
        }))
    }

    const nextStep = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1)
        } else {
            handleSubmit()
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = async () => {
        // TODO: Submit form data to API
        console.log("Submitting brand onboarding:", formData)
        router.push("/dashboard")
    }

    const canProceed = () => {
        switch (currentStep) {
            case 1: return formData.companyName && formData.website
            case 2: return formData.email && formData.phone && formData.role
            case 3: return formData.platforms.length > 0
            case 4: return formData.description && formData.mission && formData.vision && formData.coreValues
            case 5: return formData.profilePicture
            default: return false
        }
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <Field>
                            <FieldLabel htmlFor="company-name">Company Name</FieldLabel>
                            <Input
                                id="company-name"
                                placeholder="Your Company Name"
                                value={formData.companyName}
                                onChange={(e) => updateFormData("companyName", e.target.value)}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="website">Website</FieldLabel>
                            <Input
                                id="website"
                                type="url"
                                placeholder="https://yourcompany.com"
                                value={formData.website}
                                onChange={(e) => updateFormData("website", e.target.value)}
                            />
                        </Field>
                    </div>
                )

            case 2:
                return (
                    <div className="space-y-4">
                        <Field>
                            <FieldLabel htmlFor="email">Business Email</FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                placeholder="business@yourcompany.com"
                                value={formData.email}
                                onChange={(e) => updateFormData("email", e.target.value)}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                value={formData.phone}
                                onChange={(e) => updateFormData("phone", e.target.value)}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="role">Your Role</FieldLabel>
                            <Input
                                id="role"
                                placeholder="Marketing Manager, CEO, etc."
                                value={formData.role}
                                onChange={(e) => updateFormData("role", e.target.value)}
                            />
                        </Field>
                    </div>
                )

            case 3:
                return (
                    <div className="space-y-4">
                        <div>
                            <Label className="text-base font-medium">Which platforms do you use? (Select all that apply)</Label>
                            <div className="grid grid-cols-2 gap-3 mt-3">
                                {PLATFORMS.map(platform => (
                                    <div key={platform.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={platform.id}
                                            checked={formData.platforms.includes(platform.id)}
                                            onCheckedChange={() => handlePlatformToggle(platform.id)}
                                        />
                                        <Label htmlFor={platform.id} className="text-sm">
                                            {platform.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )

            case 4:
                return (
                    <div className="space-y-4">
                        <Field>
                            <FieldLabel htmlFor="description">Company Description</FieldLabel>
                            <Textarea
                                id="description"
                                placeholder="Tell us about your company..."
                                className="min-h-[100px]"
                                value={formData.description}
                                onChange={(e) => updateFormData("description", e.target.value)}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="mission">Mission Statement</FieldLabel>
                            <Textarea
                                id="mission"
                                placeholder="What is your company's mission?"
                                className="min-h-[80px]"
                                value={formData.mission}
                                onChange={(e) => updateFormData("mission", e.target.value)}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="vision">Vision Statement</FieldLabel>
                            <Textarea
                                id="vision"
                                placeholder="What is your company's vision for the future?"
                                className="min-h-[80px]"
                                value={formData.vision}
                                onChange={(e) => updateFormData("vision", e.target.value)}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="core-values">Core Values</FieldLabel>
                            <Textarea
                                id="core-values"
                                placeholder="What are your company's core values?"
                                className="min-h-[80px]"
                                value={formData.coreValues}
                                onChange={(e) => updateFormData("coreValues", e.target.value)}
                            />
                        </Field>
                    </div>
                )

            case 5:
                return (
                    <div className="space-y-4">
                        <div className="text-center">
                            <Label className="text-base font-medium">Upload Profile Picture</Label>
                            <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <div className="space-y-2">
                                    <Label htmlFor="profile-upload" className="cursor-pointer text-primary hover:underline">
                                        Click to upload
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        PNG, JPG up to 10MB
                                    </p>
                                </div>
                                <Input
                                    id="profile-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => updateFormData("profilePicture", e.target.files?.[0] || null)}
                                />
                            </div>
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    const progress = (currentStep / STEPS.length) * 100

    return (
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between mb-4">
                            <Button variant="ghost" size="sm" onClick={prevStep} disabled={currentStep === 1}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Step {currentStep} of {STEPS.length}
                            </span>
                        </div>
                        <Progress value={progress} className="mb-4" />
                        <CardTitle className="text-xl">
                            {STEPS[currentStep - 1]?.title}
                        </CardTitle>
                        <CardDescription>
                            {STEPS[currentStep - 1]?.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {renderStepContent()}

                        <div className="flex justify-end mt-6">
                            <Button onClick={nextStep} disabled={!canProceed()}>
                                {currentStep === STEPS.length ? "Complete Setup" : "Continue"}
                                {currentStep !== STEPS.length && <ArrowRight className="w-4 h-4 ml-2" />}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
