import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ExperienceStepProps } from "@/types/preferences/Creator/CreatorType";




export default function ExperienceStep({ data, onUpdate }: ExperienceStepProps) {

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Your Experience</h2>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="experience">Experience Level</Label>
                    <Select
                        value={data.experience}
                        onValueChange={(value) => onUpdate({ experience: value })}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="How long have you been creating?" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="beginner">
                                Less than 1 year
                            </SelectItem>
                            <SelectItem value="intermediate">1-3 years</SelectItem>
                            <SelectItem value="experienced">3-5 years</SelectItem>
                            <SelectItem value="expert">5+ years</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="milestones">Key Milestones</Label>
                    <Textarea
                        id="milestones"
                        placeholder="Share your achievements (e.g., viral posts, collaborations, awards)"
                        rows={4}
                        value={data.milestones}
                        onChange={(e) => onUpdate({ milestones: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="collabs">Past Collaborations (comma-separated)</Label>
                    <Input
                        id="collabs"
                        placeholder="e.g., Nike, Spotify, Local Coffee Shop"
                        value={data.collabs.join(", ")}
                        onChange={(e) =>
                            onUpdate({
                                collabs:
                                    e.target.value.split(",").map((s) => s.trim())
                            })
                        }
                    />
                </div>
            </div>
        </div>

    )
}
