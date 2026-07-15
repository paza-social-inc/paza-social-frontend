"use client";

import { lazy, Suspense } from "react";
import { RiLoader2Line } from "@remixicon/react";

const PdeShowcase = lazy(() => import("@/components/PDE/PdeShowcase"));

export default function BrandPdeDashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <RiLoader2Line className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Loading PDE Showcase...</p>
        </div>
      }
    >
      <PdeShowcase />
    </Suspense>
  );
}
