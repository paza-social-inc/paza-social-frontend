import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialMediaStepProps } from "@/types/preferences/Creator/CreatorType";

export default function SocialMediaStep({ data, onUpdate }: SocialMediaStepProps) {

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Social Media Presence</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                        id="instagram"
                        placeholder="@username"
                        value={data.instagram}
                        onChange={(e) => onUpdate({ instagram: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tiktok">TikTok</Label>
                    <Input
                        id="tiktok"
                        placeholder="@username"
                        value={data.tiktok}
                        onChange={(e) => onUpdate({ tiktok: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input
                        id="youtube"
                        placeholder="Channel URL"
                        value={data.youtube}
                        onChange={(e) => onUpdate({ youtube: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter/X</Label>
                    <Input
                        id="twitter"
                        placeholder="@username"
                        value={data.twitter}
                        onChange={(e) => onUpdate({ twitter: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                        id="linkedin"
                        placeholder="Profile URL"
                        value={data.linkedin}
                        onChange={(e) => onUpdate({ linkedin: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                        id="facebook"
                        placeholder="Page URL"
                        value={data.facebook}
                        onChange={(e) => onUpdate({ facebook: e.target.value })}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="followers">Total Followers</Label>
                <Input
                    id="followers"
                    type="number"
                    placeholder="Estimated total followers across platforms"
                    value={data.followers}
                    onChange={(e) => onUpdate({ followers: e.target.value })}
                />
            </div>
        </div>
    )
}
