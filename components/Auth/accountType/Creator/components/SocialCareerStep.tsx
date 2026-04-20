import SocialMediaStep from "./SocialMediaStep";
import { SocialCareerStepProps } from "@/types/preferences/Creator/CreatorType";

/** Social channel links (single step per design). */
export default function SocialCareerStep({ data, onUpdate }: SocialCareerStepProps) {
    return <SocialMediaStep data={data} onUpdate={onUpdate} />;
}
