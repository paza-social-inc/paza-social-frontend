"use client";

import { useLayoutEffect, useState } from "react";

/**
 * Tracks whether `document.documentElement` has the `dark` class (next-themes + Tailwind).
 * Subscribes to class changes so UI updates immediately when `setTheme` runs, without waiting
 * for a separate `useTheme()` render cycle.
 */
export function useDocumentThemeIsDark(): boolean {
  const [isDark, setIsDark] = useState(true);

  useLayoutEffect(() => {
    const read = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  return isDark;
}
