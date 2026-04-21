import { Suspense } from "react";
import ShowcaseProjectPageClient from "./ShowcaseProjectPageClient";

function ShowcaseProjectFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center text-muted-foreground">
      Loading…
    </div>
  );
}

export default function ShowcaseProjectPage() {
  return (
    <Suspense fallback={<ShowcaseProjectFallback />}>
      <ShowcaseProjectPageClient />
    </Suspense>
  );
}
