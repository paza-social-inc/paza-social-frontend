"use client"

import * as React from "react"
import {
    ArrowUpRightIcon,
    CircleFadingArrowUp,
    SearchIcon,
} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"

export default function SearchBar() {
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <>
            <button
                type="button"
                className="border-input bg-background text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-10 w-full min-w-0 items-center justify-start rounded-md border px-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px] sm:h-11 sm:max-w-sm md:min-w-64 md:max-w-md"
                onClick={() => setOpen(true)}
                aria-label="Search"
            >
                <span className="flex min-w-0 grow items-center">
                    <SearchIcon
                        className="text-muted-foreground/80 me-2 shrink-0"
                        size={16}
                        aria-hidden="true"
                    />
                    <span className="truncate font-normal text-muted-foreground/70">
                        Search
                    </span>
                </span>
                <kbd className="ml-2 hidden h-5 max-h-full items-center rounded border border-transparent bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70 md:inline-flex">
                    ⌘K
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Quick start">
                        <CommandItem>
                            <CircleFadingArrowUp
                                size={16}
                                className="opacity-60"
                                aria-hidden="true"
                            />
                            <span>Content Creator</span>
                            <CommandShortcut className="justify-center">⌘C</CommandShortcut>
                        </CommandItem>
                        <CommandItem>
                            <CircleFadingArrowUp
                                size={16}
                                className="opacity-60"
                                aria-hidden="true"
                            />
                            <span>Brand Content</span>
                            <CommandShortcut className="justify-center">⌘B</CommandShortcut>
                        </CommandItem>
                        <CommandItem>
                            <CircleFadingArrowUp
                                size={16}
                                className="opacity-60"
                                aria-hidden="true"
                            />
                            <span>Social Media Manager</span>
                            <CommandShortcut className="justify-center">⌘S</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Navigation">
                        <CommandItem>
                            <ArrowUpRightIcon
                                size={16}
                                className="opacity-60"
                                aria-hidden="true"
                            />
                            <span>Go to dashboard</span>
                        </CommandItem>
                        <CommandItem>
                            <ArrowUpRightIcon
                                size={16}
                                className="opacity-60"
                                aria-hidden="true"
                            />
                            <span>Go to Campaigns</span>
                        </CommandItem>
                        <CommandItem>
                            <ArrowUpRightIcon
                                size={16}
                                className="opacity-60"
                                aria-hidden="true"
                            />
                            <span>Go to Tasks</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
