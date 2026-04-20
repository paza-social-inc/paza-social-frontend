"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { jobsApi } from "@/lib/data/jobs";
import { SendProposalForm } from "@/components/Dashboard/Jobs/SendProposalForm";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/store/auth/useAuth";

function resolveJobOwnerId(job: {
  owner_id?: number | string;
  owner?: { id?: number | string };
}): number | null {
  const raw = job.owner_id ?? job.owner?.id;
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export default function JobApplyPage() {
  const params = useParams();
  const { user } = useAuth();
  const id = params?.id as string | undefined;
  const jobId = id ? parseInt(id, 10) : NaN;

  const { data: job, isLoading, isError } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => jobsApi.getById(jobId),
    enabled: Number.isInteger(jobId) && jobId > 0,
  });

  if (!id || !Number.isInteger(jobId) || jobId <= 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Invalid job.</p>
        <Button asChild variant="link" className="mt-2">
          <Link href="/jobs">Back to jobs</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-destructive">Failed to load job.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/jobs">Back to jobs</Link>
        </Button>
      </div>
    );
  }

  const jobTitle =
    (job as { values?: { title?: string } }).values?.title ??
    (job as { title?: string }).title ??
    "Job";

  const viewerId = user?.id != null ? Number(user.id) : NaN;
  const jobOwnerId = resolveJobOwnerId(
    job as { owner_id?: number | string; owner?: { id?: number | string } }
  );
  const isJobOwner =
    Number.isFinite(viewerId) &&
    jobOwnerId != null &&
    viewerId === jobOwnerId;

  if (isJobOwner) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-4">
        <p className="text-muted-foreground">
          You can&apos;t send a proposal on a job you posted. Creators apply
          here; open the job to manage proposals.
        </p>
        <Button asChild>
          <Link href={`/jobs/${id}`}>Back to job</Link>
        </Button>
      </div>
    );
  }

  return (
    <SendProposalForm
      jobId={jobId}
      jobTitle={jobTitle}
      jobOwnerUserId={jobOwnerId}
    />
  );
}
