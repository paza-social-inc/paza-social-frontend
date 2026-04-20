import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BasicInfoStepProps } from "@/types/preferences/Creator/CreatorType";
import { cj } from "../creatorJourneyTheme";
import { StepSection } from "./StepSection";
import { cn } from "@/lib/utils";

export default function BasicInfoStep({ data, onUpdate }: BasicInfoStepProps) {
    return (
        <StepSection kicker="Creator profile" title="How should we introduce you?">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="creatorname" className={cj.labelField}>
                        Creator name
                    </Label>
                    <Input
                        id="creatorname"
                        placeholder="Your public creator name"
                        value={data.creatorname}
                        onChange={(e) => onUpdate({ creatorname: e.target.value })}
                        className={cn(cj.input, "h-11")}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="about" className={cj.labelField}>
                        About
                    </Label>
                    <Textarea
                        id="about"
                        placeholder="What you create, your audience, and what collaborations you are looking for"
                        rows={5}
                        value={data.about}
                        onChange={(e) => onUpdate({ about: e.target.value })}
                        className={cn(cj.textarea, "resize-none")}
                    />
                </div>
            </div>
        </StepSection>
    );
}
