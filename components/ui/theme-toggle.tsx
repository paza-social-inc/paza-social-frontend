'use client'

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useCallback, useEffect, useRef } from "react"
import { flushSync } from "react-dom"


import { cn } from "@/lib/utils"
import { Button } from "./button"

type Props = {
    className?: string
}

export const AnimatedThemeToggler = ({ className }: Props) => {
    const { theme, setTheme } = useTheme()
    const buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        const updateTheme = () => {
            setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light")
        }

        updateTheme()

        const observer = new MutationObserver(updateTheme)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        })

        return () => observer.disconnect()
    }, [])

    const toggleTheme = useCallback(async () => {
        if (!buttonRef.current) return

        await document.startViewTransition(() => {
            flushSync(() => {
                const newTheme = theme === "dark" ? "light" : "dark"
                document.documentElement.classList.toggle("dark")
                setTheme(newTheme)
            })
        }).ready

        const { top, left, width, height } =
            buttonRef.current.getBoundingClientRect()
        const x = left + width / 2
        const y = top + height / 2
        const maxRadius = Math.hypot(
            Math.max(left, window.innerWidth - left),
            Math.max(top, window.innerHeight - top)
        )

        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${maxRadius}px at ${x}px ${y}px)`,
                ],
            },
            {
                duration: 700,
                easing: "ease-in-out",
                pseudoElement: "::view-transition-new(root)",
            }
        )
    }, [theme])

    return (
        <Button
            size="icon"
            variant="outline"
            ref={buttonRef} onClick={toggleTheme}
            className={cn(className, "cursor-pointer !bg-background rounded-full z-20 border h-10 w-10 dark:border-zinc-600 border-zinc-500")}>
            {theme === "dark" ? <Sun /> : <Moon />}
        </Button>
    )
}
