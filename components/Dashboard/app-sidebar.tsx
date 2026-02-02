"use client";

import * as React from "react";

import { NavUser } from "@/components/Dashboard/nav-menu/nav-user";
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
import {
    RiSlowDownLine,
    RiIdCardLine,
    RiMessageLine,
    RiNavigationLine,
    RiSpeakLine,
    RiCustomerServiceLine,
    RiMailAddLine

} from "@remixicon/react";
import Logo from "@/assets/Logo";
import { usePathname } from "next/navigation";

// This is sample data.
const data = {
    user: {
        name: "Mark Bannert",
        email: "mark@bannert.com",
        avatar:
            "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp3/user_itiiaq.png",
    },
    navMain: [
        {
            title: "General",
            items: [
                {
                    title: "Overview",
                    url: "/overview",
                    icon: RiSlowDownLine,
                    isActive: true,
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
                    title: "Campaigns",
                    url: "/campaigns",
                    icon: RiSpeakLine,
                },
                {
                    title: "Payments",
                    url: "/payments",
                    icon: RiIdCardLine,
                },
                {
                    title: "Invite Members",
                    url: "/invite",
                    icon: RiMailAddLine,
                },
                {
                    title: "Help & Support",
                    url: "/support",
                    icon: RiCustomerServiceLine,
                },
            ],
        },
    ],
};



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();
    return (
        <Sidebar collapsible="icon" variant="sidebar" {...props}>
            <SidebarHeader className="h-16 max-md:mt-2 mb-2 justify-center">
                <Logo />
            </SidebarHeader>
            <SidebarContent className="-mt-2">
                {data.navMain.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel className="uppercase text-muted-foreground/65">
                            {item.title}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((item) => (
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
                ))}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
