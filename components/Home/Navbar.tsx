"use client"

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function NavBar() {
    const [active, setActive] = useState("Home");
    const router = useRouter();
    const path = usePathname();

    useEffect(() => {
        if (path === "/") setActive("Home");
        else if (path === "/services") setActive("Services");
        else if (path === "/about") setActive("About");
        else if (path === "/login") setActive("Login");
    }, [path]);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Services", href: "/services" },
        { name: "About", href: "/about" },
        { name: "Login", href: "/login" },
    ];

    return (
        <nav className="flex sticky top-0 bg-background z-20 justify-between items-center text-sm cursor-pointer p-4 px-0 border-b sm:border-none">
            <div className="font-extrabold tracking-wider text-2xl">PAZA</div>

            {/* Desktop Nav */}
            <div className="hidden md:flex justify-center space-x-8 tracking-wide">
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        onClick={() => setActive(link.name)}
                        className={`${active === link.name
                            ? "text-orange-700 font-semibold underline underline-offset-2"
                            : "dark:text-zinc-400 text-foreground"
                            }`}
                        href={link.href}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>

            {/* Desktop Button */}
            <div className="hidden md:block max-w-[150px] w-full">
                <Button
                    onClick={() => router.push("/account-type")}
                    className="bg-white border border-zinc-400 dark:border-transparent text-black p-2 w-full hover:bg-orange-700 hover:text-white"
                >
                    GET STARTED
                </Button>
            </div>

            {/* Mobile Sheet Menu */}
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <SheetHeader>
                            <SheetTitle className="text-xl font-bold">PAZA</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6 space-y-4 p-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    onClick={() => setActive(link.name)}
                                    className={`block ${active === link.name
                                        ? "text-orange-700 font-semibold underline"
                                        : "text-zinc-400"
                                        }`}
                                    href={link.href}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Button
                                onClick={() => router.push("/account-type")}
                                className="w-full mt-4 bg-orange-700 text-white hover:bg-orange-800"
                            >
                                GET STARTED
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}
