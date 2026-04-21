import { Suspense } from "react";
import JobsPageClient from "./JobsPageClient";

function JobsFallback() {
  return (
    <div className="flex min-h-[40vh] w-full items-center justify-center text-muted-foreground">
      Loading…
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<JobsFallback />}>
      <JobsPageClient />
    </Suspense>
  );
}
