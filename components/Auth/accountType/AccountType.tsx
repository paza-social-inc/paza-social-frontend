"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { RiBriefcaseLine, RiUserLine } from "@remixicon/react"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function AccountType({ className, ...props }: React.ComponentProps<"div">) {
    const [selectedType, setSelectedType] = useState<"brand" | "creator">("creator")
    const router = useRouter()

    const handleAccountTypeSelect = (type: "brand" | "creator") => {
        setSelectedType(type);
        router.push(`/register?accountType=${type}`)
    }

    return (
        <div className={cn("min-h-screen my-6 flex items-center justify-center bg-background p-4", className)} {...props}>
            <Card className="w-full max-w-3xl p-4 border-zinc-300 dark:border-border border-2">
                <CardHeader className="text-center py-4">
                    <CardTitle className="text-4xl font-bold dark:text-foreground text-black">Welcome to Paza!</CardTitle>
                    <CardDescription className="dark:text-foreground text-black">
                        Let&apos;s get you started. First, tell us what type of account you need.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className={`cursor-pointer hover:border-primary/20 border-2 transition-all ${selectedType === 'brand' ? 'border-primary' : ''}`}>
                            <CardContent className="p-6 text-center" onClick={() => handleAccountTypeSelect('brand')}>
                                <RiBriefcaseLine className="w-12 h-12 mx-auto mb-4 text-primary" />
                                <h3 className="text-lg font-semibold mb-2">I&apos;m a Brand</h3>
                                <p className="text-sm text-muted-foreground">
                                    Companies & Groups looking to collaborate with creators
                                </p>
                            </CardContent>
                        </Card>

                        <Card className={`cursor-pointer border-2 hover:border-primary/20 transition-all ${selectedType === 'creator' ? 'border-primary' : ''}`}>
                            <CardContent className="p-6 text-center" onClick={() => handleAccountTypeSelect('creator')}>
                                <RiUserLine className="w-12 h-12 mx-auto mb-4 text-primary" />
                                <h3 className="text-lg font-semibold mb-2">I&apos;m a Creator</h3>
                                <p className="text-sm text-muted-foreground">
                                    Individuals & Collectives creating content
                                </p>
                            </CardContent>
                        </Card>
                    </div>


                </CardContent>
                <CardFooter className="flex gap-4 py-4">
                    <Button
                        onClick={() => handleAccountTypeSelect(selectedType)}
                        className="flex-1"
                    >
                        Continue with {selectedType === 'brand' ? 'Brand' : 'Creator'} Setup
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    {/* <Button variant="outline" onClick={() => router.push('/')}> */}
                    {/*     Skip for now */}
                    {/* </Button> */}
                </CardFooter>
            </Card>
        </div>
    )
}
