
import { ChangeEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RiCameraLine } from "@remixicon/react";

export default function CoverArea() {
    const bgInputRef = useRef<HTMLInputElement | null>(null);
    const avatarInputRef = useRef<HTMLInputElement | null>(null);

    const [bgImage, setBgImage] = useState("");
    const [avatarImage, setAvatarImage] = useState("https://c4.wallpaperflare.com/wallpaper/951/991/685/star-wars-darth-vader-low-poly-stormtrooper-wallpaper-preview.jpg");

    const handleBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setBgImage(URL.createObjectURL(file));
    };

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setAvatarImage(URL.createObjectURL(file));
    };

    return (
        <div className="relative h-64 group/cover bg-muted-foreground/40 dark:border-b-0 border-b">
            {/* Background Image (preview) */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all"
                style={{ backgroundImage: `url(${bgImage})` }}
            />

            {/* Background Upload Hover Overlay */}
            <div
                className="absolute inset-0 group-hover/cover:bg-muted-foreground/60 group-hover/cover:dark:bg-background/40 flex items-center justify-center transition-all cursor-pointer z-10"
                onClick={() => bgInputRef.current?.click()}
            >
                <Button
                    variant="ghost"
                    className="cursor-pointer rounded-full h-11 w-11 group-hover/cover:bg-secondary group-hover/cover:dark:bg-background"
                    size="icon"
                >
                    <RiCameraLine className="group-hover/cover:opacity-100 opacity-0 transition-all text-muted-foreground h-6 w-6" />
                </Button>
                <input
                    type="file"
                    accept="image/*"
                    ref={bgInputRef}
                    onChange={handleBgChange}
                    className="hidden"
                />
            </div>

            {/* Profile Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 px-8 pb-6 z-20">
                <div className="flex items-end justify-end flex-wrap gap-4 relative w-full">
                    <div className="flex gap-6 flex-col items-start absolute top-0 left-0">
                        {/* Avatar Group */}
                        <div className="relative group/avatar overflow-hidden">
                            <Avatar className="h-40 w-40 border-4 bg-muted-foreground border-background relative">
                                <AvatarImage src={avatarImage} className="object-cover" />
                                <AvatarFallback className="text-2xl">AG</AvatarFallback>
                            </Avatar>

                            {/* Avatar Upload Hover Overlay */}
                            <div
                                className="absolute rounded-full inset-0 group-hover/avatar:bg-muted-foreground/60 group-hover/avatar:dark:bg-background/40 flex items-center justify-center transition-all cursor-pointer"
                                onClick={() => avatarInputRef.current?.click()}
                            >
                                <Button
                                    variant="ghost"
                                    className="cursor-pointer rounded-full h-11 w-11 group-hover/avatar:bg-secondary group-hover/avatar:dark:bg-background"
                                    size="icon"
                                >
                                    <RiCameraLine className="group-hover/avatar:opacity-100 opacity-0 transition-all text-muted-foreground h-6 w-6" />
                                </Button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={avatarInputRef}
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>
                    <Button className="mb-2">+ New Project</Button>
                </div>
            </div>
        </div>
    );
}
