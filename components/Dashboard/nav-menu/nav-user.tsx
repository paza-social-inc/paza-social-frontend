"use client";

import {
    RiMore2Line,
    RiUserLine,
    RiSunLine,
    RiMoonLine,
    RiLogoutCircleLine,
    RiSettingsLine,
} from "@remixicon/react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

export function NavUser({
    user,
}: {
    user: {
        name: string;
        email: string;
        avatar: string;
    };
}) {
    const { isMobile } = useSidebar();
    const { theme, setTheme } = useTheme();
    const router = useRouter();

    const handleNavigate = (path: string) => {
        router.push(path);
    }

    const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="in-data-[state=expanded]:size-6 transition-[width,height] duration-200 ease-in-out">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight ms-1">
                                <span className="truncate font-medium">{user.name}</span>
                            </div>
                            <div className="size-8 rounded-lg flex items-center justify-center bg-sidebar-accent/50 in-[[data-slot=dropdown-menu-trigger]:hover]:bg-transparent">
                                <RiMore2Line className="size-5 opacity-40" size={20} />
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuItem className="gap-3 px-1" onClick={() => handleNavigate("/profile")}>
                            <RiUserLine
                                size={20}
                                className="text-muted-foreground/70"
                                aria-hidden="true"
                            />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleNavigate("/settings")}   className="gap-3 px-1">
                            <RiSettingsLine
                                size={20}
                                className="text-muted-foreground/70"
                                aria-hidden="true"
                            />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={toggleTheme} className="gap-3 px-1">
                            {theme === "dark" ?
                                <RiMoonLine
                                    size={20}
                                    className="text-muted-foreground/70"
                                    aria-hidden="true"
                                /> : <RiSunLine
                                    size={20}
                                    className="text-muted-foreground/70"
                                    aria-hidden="true"

                                />
                            }
                            <span>{theme}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-3 px-1">
                            <RiLogoutCircleLine
                                size={20}
                                className="text-muted-foreground/70"
                                aria-hidden="true"
                            />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
