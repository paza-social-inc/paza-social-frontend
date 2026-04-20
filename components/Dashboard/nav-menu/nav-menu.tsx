"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import UserDropDown from "./nav-menu-dropdrown";
import NotificationMenu from "./notification-menu";
import SearchBar from "./search-bar";
import { cn } from "@/lib/utils";

const navigationLinks = [
    { href: "/overview", label: "Dashboard" },
    { href: "/jobs", label: "Job Board" },
    { href: "/showcase", label: "Showcase" },
    { href: "/profile", label: "Profile" },
] as const;

export default function NavMenu() {
    const pathname = usePathname();

    return (
        <div className="flex w-full min-w-0 flex-col gap-1.5 sm:gap-2 lg:h-14 lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:px-2">
            <nav aria-label="Dashboard sections" className="min-w-0 lg:flex lg:flex-1 lg:min-w-0">
                <ul
                    className={cn(
                        "flex min-w-0 flex-nowrap items-stretch gap-0.5 overflow-x-auto overscroll-x-contain pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none]",
                        "[&::-webkit-scrollbar]:hidden",
                        "touch-pan-x sm:gap-1 sm:pb-0.5 lg:gap-2 lg:overflow-visible lg:pb-0"
                    )}
                >
                    {navigationLinks.map((link) => {
                        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                        return (
                            <li key={link.href} className="flex shrink-0">
                                <Link
                                    href={link.href}
                                    className={cn(
                                        "inline-flex min-h-9 shrink-0 items-center rounded-md px-2 py-1.5 text-xs font-medium transition-colors sm:min-h-10 sm:px-2.5 sm:py-2 sm:text-sm md:px-3",
                                        active
                                            ? "bg-orange-500/15 text-orange-600 dark:text-orange-400"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="flex min-w-0 shrink-0 items-center justify-end gap-1.5 sm:gap-3 lg:gap-4">
                <SearchBar />
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <NotificationMenu />
                    <UserDropDown />
                </div>
            </div>
        </div>
    );
}
