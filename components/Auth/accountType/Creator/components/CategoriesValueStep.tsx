import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CategoriesValuesStepProps } from "@/types/preferences/Creator/CreatorType";




export default function CategoriesValuesStep({ data, onUpdate }: CategoriesValuesStepProps) {

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Categories & Values</h2>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="category">Primary Category</Label>
                    <Select
                        value={data.category}
                        onValueChange={(value) => onUpdate({ category: value })}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select your main category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="lifestyle">Lifestyle</SelectItem>
                            <SelectItem value="fashion">Fashion</SelectItem>
                            <SelectItem value="tech">Tech</SelectItem>
                            <SelectItem value="food">Food & Beverage</SelectItem>
                            <SelectItem value="fitness">Fitness</SelectItem>
                            <SelectItem value="travel">Travel</SelectItem>
                            <SelectItem value="beauty">Beauty</SelectItem>
                            <SelectItem value="gaming">Gaming</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="topics">Content Topics (comma-separated)</Label>
                    <Input
                        id="topics"
                        placeholder="e.g., sustainable fashion, vegan recipes, budget travel"
                        value={data.topics.join(", ")}
                        onChange={(e) =>
                            onUpdate({
                                topics:
                                    e.target.value.split(",").map((s) => s.trim())
                            })
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="coreValues">Core Values (comma-separated)</Label>
                    <Input
                        id="coreValues"
                        placeholder="e.g., authenticity, sustainability, inclusivity"
                        value={data.coreValues.join(", ")}
                        onChange={(e) =>
                            onUpdate({
                                coreValues:
                                    e.target.value.split(",").map((s) => s.trim())
                            })
                        }
                    />
                </div>
            </div>
        </div>

    )
}

