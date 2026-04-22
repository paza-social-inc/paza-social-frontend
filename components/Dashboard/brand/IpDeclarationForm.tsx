"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { RiAddLine, RiCloseLine, RiLoader2Line, RiShieldCheckLine, RiFileUploadLine } from "@remixicon/react";
import { IpDeclarationPayload, submitIpDeclaration } from "@/lib/data/brands";
import toast from "react-hot-toast";

interface IpDeclarationFormProps {
    businessId: number;
    isAlreadyEnabled?: boolean;
    onSuccess?: () => void;
}

export default function IpDeclarationForm({ businessId, isAlreadyEnabled, onSuccess }: IpDeclarationFormProps) {
    const { register, handleSubmit, setValue, watch } = useForm<IpDeclarationPayload>({
        defaultValues: {
            channels: [],
            enforcementAccepted: false,
            ownershipBasis: "we_own_it"
        }
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [channelInput, setChannelInput] = React.useState("");
    const channels = watch("channels") || [];

    const onSubmit = async (data: IpDeclarationPayload) => {
        if (!data.enforcementAccepted) return toast.error("You must accept the enforcement terms");
        
        setIsSubmitting(true);
        try {
            const res = await submitIpDeclaration(businessId, data);
            if (res.success) {
                toast.success("IP Declaration submitted. Publisher features unlocked!");
                if (onSuccess) onSuccess();
            }
        } catch {
            toast.error("Submission failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const addChannel = () => {
        if (channelInput.trim() && !channels.includes(channelInput.trim())) {
            setValue("channels", [...channels, channelInput.trim()]);
            setChannelInput("");
        }
    };

    if (isAlreadyEnabled) {
        return (
            <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="text-center">
                    <RiShieldCheckLine className="h-12 w-12 mx-auto text-primary mb-2" />
                    <CardTitle>IP Protection Active</CardTitle>
                    <CardDescription>Your brand is verified to publish content and claim ownership.</CardDescription>
                </CardHeader>
                <CardContent className="text-center pb-8">
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        You have already submitted your IP declaration and obtained publisher status. 
                        To update your declaration and proof files, please contact support.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <RiShieldCheckLine className="h-5 w-5 text-primary" />
                    IP Declaration Gate
                </CardTitle>
                <CardDescription>Verify your legal ownership of brand assets to unlock publisher tools.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Ownership Basis</Label>
                            <Select 
                                onValueChange={(val: IpDeclarationPayload["ownershipBasis"]) => setValue("ownershipBasis", val)}
                                defaultValue="we_own_it"
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="we_own_it">We own the IP outright</SelectItem>
                                    <SelectItem value="we_licensed_it">We have a valid license</SelectItem>
                                    <SelectItem value="we_represent_owner">We legally represent the owner</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Proof Document URL</Label>
                            <div className="flex gap-2">
                                <Input 
                                    {...register("proofFileUrl")} 
                                    placeholder="Link to Certificate of Registration / License agreement" 
                                />
                                <Button type="button" variant="outline" size="icon">
                                    <RiFileUploadLine className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Territory</Label>
                                <Input {...register("territory")} placeholder="e.g. Kenya, Global, EU" />
                            </div>
                            <div className="space-y-2">
                                <Label>Duration of Rights</Label>
                                <Input {...register("duration")} placeholder="e.g. Perpetual, 5 years" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>Allowed Channels</Label>
                            <div className="flex gap-2">
                                <Input 
                                    value={channelInput}
                                    onChange={(e) => setChannelInput(e.target.value)}
                                    placeholder="Add channel (e.g. Instagram, TikTok)"
                                />
                                <Button type="button" size="sm" variant="outline" onClick={addChannel}>
                                    <RiAddLine />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {channels.map(t => (
                                    <Badge key={t} variant="secondary" className="gap-1">
                                        {t} <RiCloseLine className="h-3 w-3 cursor-pointer" onClick={() => setValue("channels", channels.filter(c => c !== t))} />
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                        <div className="flex items-start gap-3">
                            <Checkbox 
                                id="enforcement" 
                                checked={watch("enforcementAccepted")}
                                onCheckedChange={(val: boolean) => setValue("enforcementAccepted", val)}
                            />
                            <Label htmlFor="enforcement" className="text-sm font-normal cursor-pointer leading-relaxed">
                                I verify that the brand I am registering for is a legal entity and we own or represent the Intellectual Property (IP). 
                                I agree to allow our IP to be used by creators for specifically assigned tasks and acknowledge that Paza acts as a facilitator.
                            </Label>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <RiLoader2Line className="mr-2 h-4 w-4 animate-spin" />}
                        Submit IP Declaration & Unlock Features
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
