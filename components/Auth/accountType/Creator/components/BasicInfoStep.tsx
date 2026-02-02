import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BasicInfoStepProps } from "@/types/preferences/Creator/CreatorType";

export default function BasicInfoStep({ data, onUpdate }: BasicInfoStepProps) {

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Basic Information</h2>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="creatorname">Creator Name *</Label>
                    <Input
                        id="creatorname"
                        placeholder="Your creator name"
                        value={data.creatorname}
                        onChange={(e) => onUpdate({ creatorname: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="about">About *</Label>
                    <Textarea
                        id="about"
                        placeholder="Tell us about yourself..."
                        rows={4}
                        value={data.about}
                        onChange={(e) => onUpdate({ about: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="main">Main Platform</Label>
                    <Select
                        value={data.main}
                        onValueChange={(value) => onUpdate({ main: value })}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select your main platform" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="tiktok">TikTok</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="twitter">Twitter</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}
