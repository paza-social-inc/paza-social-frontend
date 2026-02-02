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
    { id: 1, title: "Basic Info", description: "Personal details" },
    { id: 2, title: "Content Focus", description: "What you create" },
    { id: 3, title: "Platforms", description: "Where you share" },
    { id: 4, title: "About", description: "Your story" },
    { id: 5, title: "Profile", description: "Profile picture" }
]

const CONTENT_TYPES = [
    { id: "lifestyle", label: "Lifestyle" },
    { id: "fashion", label: "Fashion" },
    { id: "beauty", label: "Beauty" },
    { id: "fitness", label: "Fitness" },
    { id: "food", label: "Food & Cooking" },
    { id: "travel", label: "Travel" },
    { id: "tech", label: "Technology" },
    { id: "gaming", label: "Gaming" },
    { id: "music", label: "Music" },
    { id: "art", label: "Art & Design" },
    { id: "education", label: "Education" },
    { id: "business", label: "Business" },
    { id: "other", label: "Other" }
]

const PLATFORMS = [
    { id: "instagram", label: "Instagram" },
    { id: "tiktok", label: "TikTok" },
    { id: "youtube", label: "YouTube" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "facebook", label: "Facebook" },
    { id: "twitter", label: "X (Twitter)" },
    { id: "twitch", label: "Twitch" },
    { id: "pinterest", label: "Pinterest" }
]

export default function CreatorOnboardingPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        stageName: "",
        location: "",
        contentTypes: [] as string[],
        platforms: [] as string[],
        bio: "",
        goals: "",
        experience: "",
        profilePicture: null as File | null
    })
    const router = useRouter()

    const updateFormData = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleContentTypeToggle = (contentId: string) => {
        setFormData(prev => ({
            ...prev,
            contentTypes: prev.contentTypes.includes(contentId)
                ? prev.contentTypes.filter(c => c !== contentId)
                : [...prev.contentTypes, contentId]
        }))
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
        console.log("Submitting creator onboarding:", formData)
        router.push("/dashboard")
    }

    const canProceed = () => {
        switch (currentStep) {
            case 1: return formData.firstName && formData.lastName
            case 2: return formData.contentTypes.length > 0
            case 3: return formData.platforms.length > 0
            case 4: return formData.bio && formData.goals
            case 5: return formData.profilePicture
            default: return false
        }
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="first-name">First Name</FieldLabel>
                                <Input
                                    id="first-name"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={(e) => updateFormData("firstName", e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
                                <Input
                                    id="last-name"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={(e) => updateFormData("lastName", e.target.value)}
                                />
                            </Field>
                        </div>
                        <Field>
                            <FieldLabel htmlFor="stage-name">Stage/Creator Name (Optional)</FieldLabel>
                            <Input
                                id="stage-name"
                                placeholder="Your creator name or alias"
                                value={formData.stageName}
                                onChange={(e) => updateFormData("stageName", e.target.value)}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="location">Location</FieldLabel>
                            <Input
                                id="location"
                                placeholder="City, Country"
                                value={formData.location}
                                onChange={(e) => updateFormData("location", e.target.value)}
                            />
                        </Field>
                    </div>
                )

            case 2:
                return (
                    <div className="space-y-4">
                        <div>
                            <Label className="text-base font-medium">What type of content do you create? (Select all that apply)</Label>
                            <div className="grid grid-cols-3 gap-3 mt-3">
                                {CONTENT_TYPES.map(content => (
                                    <div key={content.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={content.id}
                                            checked={formData.contentTypes.includes(content.id)}
                                            onCheckedChange={() => handleContentTypeToggle(content.id)}
                                        />
                                        <Label htmlFor={content.id} className="text-sm">
                                            {content.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
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
                            <FieldLabel htmlFor="bio">Bio</FieldLabel>
                            <Textarea
                                id="bio"
                                placeholder="Tell us about yourself and your content..."
                                className="min-h-[100px]"
                                value={formData.bio}
                                onChange={(e) => updateFormData("bio", e.target.value)}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="goals">What are your goals as a creator?</FieldLabel>
                            <Textarea
                                id="goals"
                                placeholder="What do you want to achieve with your content?"
                                className="min-h-[80px]"
                                value={formData.goals}
                                onChange={(e) => updateFormData("goals", e.target.value)}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="experience">Experience Level</FieldLabel>
                            <div className="grid grid-cols-3 gap-3 mt-2">
                                {["Beginner", "Intermediate", "Advanced"].map(level => (
                                    <Button
                                        key={level}
                                        variant={formData.experience === level ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => updateFormData("experience", level)}
                                    >
                                        {level}
                                    </Button>
                                ))}
                            </div>
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
