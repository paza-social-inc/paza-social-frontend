"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Premium custom cursor — a large trailing ring + small dot.
 * The ring follows mouse with spring physics (lag = premium feel).
 * On hover over links/buttons: ring expands and inverts.
 */
export default function CustomCursor() {
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  const ringX = useSpring(dotX, { stiffness: 100, damping: 24, mass: 0.5 });
  const ringY = useSpring(dotY, { stiffness: 100, damping: 24, mass: 0.5 });

  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };

    const onEnterLink = () => {
      ringRef.current?.classList.add("cursor-hover");
      dotRef.current?.classList.add("cursor-hover");
    };
    const onLeaveLink = () => {
      ringRef.current?.classList.remove("cursor-hover");
      dotRef.current?.classList.remove("cursor-hover");
    };

    window.addEventListener("mousemove", onMove);

    // Attach hover to all interactive elements
    const links = document.querySelectorAll("a, button, [role='button']");
    links.forEach((el) => {
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeaveLink);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      links.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterLink);
        el.removeEventListener("mouseleave", onLeaveLink);
      });
    };
  }, [dotX, dotY]);

  return (
    <>
      {/* Dot — instant follow */}
      <motion.div
        ref={dotRef}
        className="cursor-dot"
        style={{ x: dotX, y: dotY }}
      />
      {/* Ring — springs behind */}
      <motion.div
        ref={ringRef}
        className="cursor-ring"
        style={{ x: ringX, y: ringY }}
      />
    </>
  );
}
