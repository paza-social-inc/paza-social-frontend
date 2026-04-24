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
import { IP_TERRITORIES, IP_DURATIONS } from "@/lib/constants/brandTaxonomy";
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
                                <Select onValueChange={(val) => setValue("territory", val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Territory" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {IP_TERRITORIES.map(t => (
                                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Duration of Rights</Label>
                                <Select onValueChange={(val) => setValue("duration", val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {IP_DURATIONS.map(d => (
                                            <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>Rights Channels</Label>
                            <div className="flex gap-4">
                                {["Social", "Paid Ads", "TV/OOH"].map(ch => (
                                    <div key={ch} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={`ip-ch-${ch}`}
                                            checked={channels.includes(ch)}
                                            onCheckedChange={(val) => {
                                                if (val) setValue("channels", [...channels, ch]);
                                                else setValue("channels", channels.filter(c => c !== ch));
                                            }}
                                        />
                                        <Label htmlFor={`ip-ch-${ch}`} className="text-sm font-normal cursor-pointer">{ch}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-destructive/5 p-4 rounded-lg border border-destructive/10 space-y-4">
                        <div className="flex items-start gap-3">
                            <Checkbox 
                                id="enforcement" 
                                checked={watch("enforcementAccepted")}
                                onCheckedChange={(val: boolean) => setValue("enforcementAccepted", val)}
                            />
                            <Label htmlFor="enforcement" className="text-sm font-normal cursor-pointer leading-relaxed text-destructive/80 italic">
                                I solemnly declare that we own or legally represent the IP assets described above.
                                I understand that any misrepresentation of ownership leads to absolute takedown of all campaigns, 
                                account suspension, and legal liability.
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
