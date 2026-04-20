"use client";

import { useRef, useEffect, ReactNode } from "react";
import { motion, useInView, useAnimation, Variants } from "framer-motion";

/**
 * MaskedReveal — the exact text animation on minemal.dental.
 *
 * Each child line is wrapped in overflow:hidden.
 * When the element enters the viewport, the inner text slides up
 * from translateY(100%) to translateY(0) with opacity 0→1.
 * 
 * This creates the "text emerging from below a mask" effect.
 */

interface MaskedRevealProps {
  children: ReactNode;
  /** Delay before this line starts (seconds). Use for stagger. */
  delay?: number;
  /** How far below the mask the text starts (px). Default 80. */
  distance?: number;
  /** Duration of the reveal (seconds). Default 0.9. */
  duration?: number;
  /** Optional extra className on the outer mask div */
  className?: string;
  /** Whether to trigger once (default) or every time it enters */
  once?: boolean;
}

const maskVariants: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: {
      ease: [0.16, 1, 0.3, 1],
      duration: 0.95,
    },
  },
};

export function MaskedReveal({
  children,
  delay = 0,
  className = "",
  once = true,
}: MaskedRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "0px 0px -60px 0px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else if (!once) {
      controls.start("hidden");
    }
  }, [isInView, controls, once]);

  return (
    <div
      ref={ref}
      className={`overflow-hidden ${className}`}
      style={{ display: "block" }}
    >
      <motion.div
        variants={maskVariants}
        initial="hidden"
        animate={controls}
        transition={{
          ease: [0.16, 1, 0.3, 1],
          duration: 0.95,
          delay,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * MaskedRevealGroup — wraps multiple lines with auto-stagger.
 * Each direct child gets a MaskedReveal with incrementing delay.
 *
 * Usage:
 *   <MaskedRevealGroup stagger={0.12}>
 *     <p>Line one</p>
 *     <p>Line two</p>
 *   </MaskedRevealGroup>
 */
interface MaskedRevealGroupProps {
  children: ReactNode[];
  stagger?: number;
  baseDelay?: number;
}

export function MaskedRevealGroup({
  children,
  stagger = 0.1,
  baseDelay = 0,
}: MaskedRevealGroupProps) {
  return (
    <>
      {children.map((child, i) => (
        <MaskedReveal key={i} delay={baseDelay + i * stagger}>
          {child}
        </MaskedReveal>
      ))}
    </>
  );
}
