import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ExperienceStepProps } from "@/types/preferences/Creator/CreatorType";
import { cj } from "../creatorJourneyTheme";
import { StepSection } from "./StepSection";
import { cn } from "@/lib/utils";

export default function ExperienceStep({ data, onUpdate }: ExperienceStepProps) {
    return (
        <div className="space-y-8">
            <StepSection kicker="Career milestones">
                <Label htmlFor="milestones" className={cj.labelField}>
                    Career milestones
                </Label>
                <Textarea
                    id="milestones"
                    placeholder="Mention any significant milestones you have achieved or are striving to reach"
                    rows={5}
                    value={data.milestones}
                    onChange={(e) => onUpdate({ milestones: e.target.value })}
                    className={cn(cj.textarea, "resize-none")}
                />
            </StepSection>
        </div>
    );
}
