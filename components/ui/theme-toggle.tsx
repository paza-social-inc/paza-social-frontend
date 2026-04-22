"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "./button";

type Props = {
  className?: string;
};

/**
 * Toggles `light` / `dark` via next-themes. Kept free of view-transition + ref coupling
 * so `setTheme` always runs (see Button forwardRef — refs are optional here).
 */
export const AnimatedThemeToggler = ({ className }: Props) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    const effective = resolvedTheme ?? (theme === "light" || theme === "dark" ? theme : "dark");
    setTheme(effective === "dark" ? "light" : "dark");
  }, [resolvedTheme, theme, setTheme]);

  const isDark = (resolvedTheme ?? theme) === "dark";
  const ariaLabel = mounted
    ? isDark
      ? "Switch to light mode"
      : "Switch to dark mode"
    : "Toggle color theme";

  return (
    <Button
      type="button"
      size="icon"
      variant="outline"
      onClick={toggleTheme}
      aria-label={ariaLabel}
      className={cn(
        "z-20 h-10 w-10 cursor-pointer rounded-full border border-zinc-500 bg-background dark:border-zinc-600",
        className,
      )}
    >
      {!mounted ? (
        <span className="inline-block size-4 shrink-0 rounded-full bg-white/20" aria-hidden />
      ) : isDark ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  );
};

