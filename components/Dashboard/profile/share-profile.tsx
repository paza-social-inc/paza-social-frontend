"use client"

import { useId, useRef, useState } from "react"
import {
    RiCheckLine,
    RiFileCopyLine,
    RiShareForwardFill,
} from "@remixicon/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { SocialLinksData } from "./socail-links"


interface props {
    open?: boolean;
    onOpenChange?: (val: boolean) => void;
    user_id: string;
}

export default function ShareProfile({ open, onOpenChange, user_id }: props) {
    const id = useId()
    const [copied, setCopied] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement>(null);

    const { socialLinks } = SocialLinksData(user_id);

    const handleCopy = () => {
        if (inputRef.current) {
            navigator.clipboard.writeText(inputRef.current.value)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <Popover open={open} onOpenChange={onOpenChange}>
                <PopoverTrigger>
                    <Button
                        variant="default" className="h-10" size="sm"><RiShareForwardFill /> Share Profile</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="flex flex-col gap-3 text-center">
                        <div className="text-sm font-medium">Share code</div>

                        <div className="flex flex-wrap justify-between gap-2">
                            {socialLinks.map((item, index) => (
                                <TooltipProvider delayDuration={0} key={index}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <a
                                                href={item.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={item.title}
                                            >
                                                <Button size="icon" variant="outline">
                                                    {item.icon}
                                                </Button>
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent className="px-2 py-1 text-xs">
                                            {item.title}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <div className="relative">
                                <Input
                                    ref={inputRef}
                                    id={id}
                                    className="pe-9"
                                    type="text"
                                    defaultValue={`https://paza-social.com/share/${user_id}`}
                                    aria-label="Share link"
                                    readOnly
                                />
                                <TooltipProvider delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={handleCopy}
                                                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 transition-[color,box-shadow] outline-none hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed"
                                                aria-label={copied ? "Copied" : "Copy to clipboard"}
                                                disabled={copied}
                                            >
                                                <div
                                                    className={cn(
                                                        "transition-all",
                                                        copied
                                                            ? "scale-100 opacity-100"
                                                            : "scale-0 opacity-0"
                                                    )}
                                                >
                                                    <RiCheckLine
                                                        className="stroke-emerald-500"
                                                        size={16}
                                                        aria-hidden="true"
                                                    />
                                                </div>
                                                <div
                                                    className={cn(
                                                        "absolute transition-all",
                                                        copied
                                                            ? "scale-0 opacity-0"
                                                            : "scale-100 opacity-100"
                                                    )}
                                                >
                                                    <RiFileCopyLine size={16} aria-hidden="true" />
                                                </div>
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="px-2 py-1 text-xs">
                                            Copy to clipboard
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
