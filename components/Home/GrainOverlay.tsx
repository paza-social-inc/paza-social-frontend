"use client";

import { useEffect, useRef } from "react";

/**
 * Full-page animated film-grain overlay.
 * Coarse, visible grain matching the minemal.dental aesthetic.
 * Higher opacity + lower frequency = grain you can actually SEE.
 */
export default function GrainOverlay() {
  const filterRef = useRef<SVGFETurbulenceElement | null>(null);
  const rafRef = useRef<number>(0);
  const frameRef = useRef(0);

  useEffect(() => {
    let seed = 0;
    const tick = () => {
      frameRef.current++;
      // Update every 2 frames for a lively grain (~30fps)
      if (frameRef.current % 2 === 0) {
        seed = (seed + 1) % 1000;
        filterRef.current?.setAttribute("seed", String(seed));
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="grain-overlay pointer-events-none fixed inset-0 z-[999] select-none"
      style={{ mixBlendMode: "overlay", opacity: 0.22 }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="paza-grain" x="0%" y="0%" width="100%" height="100%"
          colorInterpolationFilters="sRGB">
          <feTurbulence
            ref={filterRef}
            type="fractalNoise"
            baseFrequency="0.58"
            numOctaves="4"
            stitchTiles="stitch"
            seed="0"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paza-grain)" opacity="1" />
      </svg>
    </div>
  );
}
