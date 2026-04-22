"use client";

import * as React from "react";

import { NavUser } from "@/components/Dashboard/nav-menu/nav-user";
import { useQuery } from "@tanstack/react-query";
import { fetchAuthMe } from "@/lib/data/auth";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import Logo from "@/assets/Logo";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/store/auth/useAuth";
import {
    RiSlowDownLine,
    RiIdCardLine,
    RiMessageLine,
    RiNavigationLine,
    RiSpeakLine,
    RiCustomerServiceLine,
    RiMailAddLine,
    RiBriefcaseLine,
    RiNotification3Line,
    RiSettings3Line
} from "@remixicon/react";

// Navigation structure
const navItems = [
    {
        title: "Overview",
        url: "/overview",
        icon: RiSlowDownLine,
    },
    {
        title: "Campaigns",
        url: "/campaigns",
        icon: RiSpeakLine,
    },
    {
        title: "Jobs",
        url: "/jobs",
        icon: RiBriefcaseLine,
    },
    {
        title: "Inbox",
        url: "/inbox",
        icon: RiMessageLine,
    },
    {
        title: "Tasks",
        url: "/tasks",
        icon: RiNavigationLine,
    },
    {
        title: "Notifications",
        url: "/notifications",
        icon: RiNotification3Line,
    },
    {
        title: "Payments",
        url: "/payments",
        icon: RiIdCardLine,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: RiSettings3Line,
    },
];



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();
    const { user } = useAuth();
    const { data: authMe } = useQuery({
        queryKey: ["auth-me"],
        queryFn: fetchAuthMe,
        staleTime: 5 * 60 * 1000,
    });

    const displayName =
        [authMe?.firstName, authMe?.lastName].filter(Boolean).join(" ").trim() ||
        [user?.firstname, user?.lastname].filter(Boolean).join(" ").trim() ||
        "User";

    const userData = {
        name: displayName,
        email: authMe?.email ?? user?.email ?? "",
        avatar: user?.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${authMe?.email ?? user?.email ?? "paza"}`,
    };

    return (
        <Sidebar collapsible="icon" variant="sidebar" {...props}>
            <SidebarHeader className="h-16 max-md:mt-2 mb-2 justify-center">
                <Logo />
            </SidebarHeader>
            <SidebarContent className="-mt-2">
                <SidebarGroup>
                    <SidebarGroupLabel className="uppercase text-muted-foreground/65">
                        General
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        className="group/menu-button group-data-[collapsible=icon]:px-[5px]! font-medium gap-3 [&>svg]:size-auto"
                                        tooltip={item.title}
                                        isActive={pathname.includes(item.url)}
                                    >
                                        <a href={item.url}>
                                            {item.icon && (
                                                <item.icon
                                                    size={22}
                                                    aria-hidden="true"
                                                />
                                            )}
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={userData} />
            </SidebarFooter>
        </Sidebar>
    );
}
