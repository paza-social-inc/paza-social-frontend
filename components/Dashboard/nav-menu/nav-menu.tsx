"use client"

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import UserDropDown from "./nav-menu-dropdrown"
import NotificationMenu from "./notification-menu";
import SearchBar from "./search-bar";
import { usePathname } from "next/navigation";

const navigationLinks = [
    { href: "/overview", label: "Dashboard", },
    { href: "/jobs", label: "Job Board", },
    { href: "/showcase", label: "Showcase", },
    { href: "/profile", label: "Profile", },
]

export default function NavMenu() {
    const pathname = usePathname();


    return (
        <header className="w-full">
            <div className="flex h-14 px-4 items-center w-full justify-between gap-4">
                {/* Left side */}
                <NavigationMenu className="flex-1">
                    <NavigationMenuList className="gap-2">
                        {navigationLinks.map((link, index) => {
                            return (
                                <NavigationMenuItem key={index}>
                                    <NavigationMenuLink
                                        active={pathname.includes(link.href)}
                                        href={link.href}
                                        className={`text-foreground text-nowrap hover:text-primary flex-row items-center gap-2 py-1.5 font-medium`}
                                    >
                                        <span>{link.label}</span>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            )
                        })}
                    </NavigationMenuList>
                </NavigationMenu>
                {/* Right side */}
                <div className="flex flex-1 items-center justify-end gap-4">
                    <div className="relative">
                        <SearchBar />
                    </div>
                    <div className="flex items-center gap-2">
                        <NotificationMenu />
                        <UserDropDown />
                    </div>

                </div>
            </div>
        </header>
    )
}
