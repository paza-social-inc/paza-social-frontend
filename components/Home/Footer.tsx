"use client"
import { ArrowUp } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { RiArrowUpLine } from "@remixicon/react";

export default function Footer({ showMain = true }: { showMain: boolean }) {

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="flex flex-col justify-between ">

            <div className={`${showMain ? "grid" : "hidden"} border-t border-zinc-500/20 pt-12 mt-5 grid-cols-1 dark:text-zinc-500 text-black md:grid-cols-3 gap-4 p-4 mb-12`}>
                <div className="space-y-12 flex flex-col items-center text-sm">
                    <p>Home</p>

                    <div
                        onClick={handleScrollToTop}
                        className="group border border-zinc-500 cursor-pointer rounded-full flex items-center justify-center text-center h-[300px] w-[300px] relative overflow-hidden"
                    >
                        <span className="absolute dark:bg-zinc-200 bg-black bottom-0 left-0 w-full h-0 transition-all duration-300 ease-in-out group-hover:h-full" />
                        <ArrowUp className="text-5xl scale-200 group-hover:dark:text-black group-hover:text-white text-black dark:text-white/70 font-bold z-10 transition-all duration-300" />
                    </div>

                </div>

                <div className="text-sm space-y-24">
                    <div className="space-y-4">
                        <p>Services</p>
                        <p>Partnership</p>
                        <p>About us</p>
                    </div>

                    <div className="space-y-4">
                        <p>+1891989-11-91</p>
                        <p>hello@logoipsum.com</p>
                        <p className="text-orange-700">Call me back</p>
                        <p className="text-center">CONTACT US</p>
                        <p>FOLLOW US</p>
                        <div className="flex justify-between">
                            <p>Telegram</p>
                            <p>/</p>
                            <p>Whatsapp</p>
                            <p>/</p>
                            <p>Instagram</p>
                        </div>

                    </div>
                </div>

                <div className="text-sm space-y-40">
                    <p>Contacts</p>
                    <p>2972 Westheimer Rd. Santa Ana,Illinois 85486 </p>
                </div>
            </div>

            <div className={`self-center p-8 w-full border-t dark:border-zinc-800 border-gray-200 text-xs flex items-center justify-between`}>
                <p className="dark:text-zinc-400 text-zinc-600">
                    Copyright © {new Date().getFullYear()} Paza Social All Rights Reserved.
                </p>
                <div className="flex items-center gap-4">
                    <AnimatedThemeToggler />
                    {!showMain && (
                        <Button
                            size="icon"
                            variant='secondary'
                            className="border dark:border-border border-zinc-500"
                            onClick={handleScrollToTop}>
                            <RiArrowUpLine />
                        </Button>
                    )}
                </div>
            </div>

        </div>
    )
}
