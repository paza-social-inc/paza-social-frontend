import { Suspense } from "react";
import CreateProjectForm from "@/components/Dashboard/showcase/CreateProjectForm";

export default function NewProjectPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
          Loading…
        </div>
      }
    >
      <CreateProjectForm mode="page" />
    </Suspense>
  );
}
