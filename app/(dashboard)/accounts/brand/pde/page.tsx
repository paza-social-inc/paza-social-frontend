import { Suspense } from "react";
import { RiLoader2Line } from "@remixicon/react";
import BrandPdeDashboard from "@/components/Dashboard/brand/BrandPdeDashboard";

export default function BrandPDEPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <RiLoader2Line className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Loading PDE insights...</p>
        </div>
      }
    >
      <BrandPdeDashboard />
    </Suspense>
  );
}
