import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProfileMediaStepProps } from "@/types/preferences/Creator/CreatorType";
import { RiCameraLine } from "@remixicon/react";
import { cj } from "../creatorJourneyTheme";
import { StepSection } from "./StepSection";
import { cn } from "@/lib/utils";

export default function ProfileMediaStep({ data, onUpdate }: ProfileMediaStepProps) {
    return (
        <div className="space-y-8">
            <StepSection title="Choose profile picture">
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <div
                            className={cn(
                                "flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-2 border-zinc-700 bg-zinc-900/80",
                                data.avatar && "border-orange-500/40"
                            )}
                        >
                            {data.avatar ? (
                                <img
                                    src={data.avatar}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-[10px] uppercase tracking-widest text-zinc-600">
                                    Photo
                                </span>
                            )}
                        </div>
                        <label
                            htmlFor="avatar-upload"
                            className="absolute bottom-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-zinc-600 bg-zinc-800 text-white shadow-lg transition-colors hover:bg-zinc-700"
                        >
                            <RiCameraLine className="h-5 w-5" />
                            <Input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        onUpdate({
                                            avatar: URL.createObjectURL(file),
                                            avatarFile: file,
                                        });
                                    }
                                }}
                            />
                        </label>
                    </div>
                    <p className="mt-2 text-center text-[11px] text-zinc-500">PNG or JPG · up to 5MB</p>
                </div>
            </StepSection>

            <div className="space-y-3 border-t border-zinc-800 pt-6">
                <p className={cj.labelMuted}>Banner (optional)</p>
                <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 p-6 text-center">
                    <Input
                        id="banner-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                onUpdate({
                                    preview: URL.createObjectURL(file),
                                    previewFile: file,
                                });
                            }
                        }}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                        onClick={() => document.getElementById("banner-upload")?.click()}
                    >
                        Upload banner
                    </Button>
                    <p className="mt-2 text-[11px] text-zinc-500">Recommended 1200×400</p>
                    {data.preview ? (
                        <img
                            src={data.preview}
                            alt=""
                            className="mt-4 h-28 w-full rounded-lg object-cover"
                        />
                    ) : null}
                </div>
            </div>
        </div>
    );
}
