import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileMediaStepProps } from "@/types/preferences/Creator/CreatorType";
import { RiUploadLine } from "@remixicon/react";




export default function ProfileMediaStep({ data, onUpdate }: ProfileMediaStepProps) {

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Profile Media</h2>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Profile Avatar</Label>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                        <RiUploadLine className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                            Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG up to 5MB
                        </p>
                        <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) onUpdate({ avatar: URL.createObjectURL(file) });
                            }}
                        />
                    </div>
                    {data.avatar && (
                        <img
                            src={data.avatar}
                            alt="Avatar preview"
                            className="mt-4 w-32 h-32 rounded-full object-cover mx-auto"
                        />
                    )}
                </div>
                <div className="space-y-2">
                    <Label>Profile Preview/Banner</Label>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                        <RiUploadLine className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                            Upload a banner image
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG up to 5MB (recommended: 1200x400)
                        </p>
                        <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) onUpdate({ preview: URL.createObjectURL(file) });
                            }}
                        />
                    </div>
                    {data.preview && (
                        <img
                            src={data.preview}
                            alt="Banner preview"
                            className="mt-4 w-full h-40 rounded-lg object-cover"
                        />
                    )}
                </div>
            </div>
        </div>

    )
}
