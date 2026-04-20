"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registerLenisInstance } from "@/lib/scrollWithLenis";

/**
 * Inertia-based smooth scroll using Lenis.
 * This is the #1 effect that makes premium sites like minemal.dental
 * feel physically different from ordinary pages — the scroll has mass and momentum.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      // Smooth exponential ease-out — scroll has mass but doesn't drag
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.8,
      // Let nested overflow-x (e.g. How it works strip) keep native scroll without Lenis fighting it
      allowNestedScroll: true,
    });

    registerLenisInstance(lenis);

    let raf: number;
    const animate = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      registerLenisInstance(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
