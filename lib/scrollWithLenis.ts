import type Lenis from "lenis";

let lenisRef: Lenis | null = null;

/** Called from SmoothScroll when Lenis mounts / unmounts. */
export function registerLenisInstance(instance: Lenis | null): void {
  lenisRef = instance;
}

/** Scroll to top — uses Lenis when present so smooth-scroll pages respond correctly. */
export function scrollPageToTop(): void {
  if (typeof window === "undefined") return;
  try {
    if (lenisRef) {
      lenisRef.scrollTo(0);
      return;
    }
  } catch {
    // fallback below
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}
