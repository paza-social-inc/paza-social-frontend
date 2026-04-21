"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, User } from "lucide-react"

export default function OnboardingPage() {
    const [selectedType, setSelectedType] = useState<"brand" | "creator">("creator")
    const router = useRouter()

    const handleAccountTypeSelect = (type: "brand" | "creator") => {
        setSelectedType(type)
        // Redirect to specific onboarding flow
        router.push(`/onboarding/${type}`)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Welcome to Paza!</CardTitle>
                    <CardDescription>
                        Let&apos;s set up your account. First, tell us what type of account you need.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className={`cursor-pointer transition-all ${selectedType === 'brand' ? 'ring-2 ring-primary' : ''}`}>
                            <CardContent className="p-6 text-center" onClick={() => handleAccountTypeSelect('brand')}>
                                <Briefcase className="w-12 h-12 mx-auto mb-4 text-primary" />
                                <h3 className="text-lg font-semibold mb-2">I&apos;m a Brand</h3>
                                <p className="text-sm text-muted-foreground">
                                    Companies & Groups looking to collaborate with creators
                                </p>
                            </CardContent>
                        </Card>

                        <Card className={`cursor-pointer transition-all ${selectedType === 'creator' ? 'ring-2 ring-primary' : ''}`}>
                            <CardContent className="p-6 text-center" onClick={() => handleAccountTypeSelect('creator')}>
                                <User className="w-12 h-12 mx-auto mb-4 text-primary" />
                                <h3 className="text-lg font-semibold mb-2">I&apos;m a Creator</h3>
                                <p className="text-sm text-muted-foreground">
                                    Individuals & Collectives creating content
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            onClick={() => handleAccountTypeSelect(selectedType)}
                            className="flex-1"
                        >
                            Continue with {selectedType === 'brand' ? 'Brand' : 'Creator'} Setup
                        </Button>
                        <Button variant="outline" onClick={() => router.push('/')}>
                            Skip for now
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
