"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { jobsApi } from "@/lib/data/jobs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { JobProposal } from "@/types/job.types";

export default function ProposalDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const { data: proposals = [], isLoading, isError } = useQuery({
    queryKey: ["my-proposals"],
    queryFn: () => jobsApi.getMyProposals(),
    enabled: !!id,
  });

  const proposal = id
    ? (proposals as JobProposal[]).find(
        (p) => String(p.id ?? (p as { _id?: string })._id) === id
      )
    : undefined;

  if (!id) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Invalid proposal.</p>
        <Button asChild variant="link" className="mt-2">
          <Link href="/proposals">Back to proposals</Link>
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

  if (isError || !proposal) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-destructive">
          {proposal === undefined && !isError
            ? "Proposal not found."
            : "Failed to load proposal."}
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/proposals">Back to proposals</Link>
        </Button>
      </div>
    );
  }

  const jobId = proposal.jobId;
  const status = (proposal.status ?? "pending").toLowerCase();

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <Link
        href="/proposals"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to proposals
      </Link>

      <Card className="border-border rounded-xl overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-lg">{proposal.title}</CardTitle>
            <Badge
              variant={
                status === "accepted"
                  ? "default"
                  : status === "rejected"
                    ? "destructive"
                    : status === "completed"
                      ? "secondary"
                      : "outline"
              }
              className="capitalize"
            >
              {status}
            </Badge>
          </div>
          {proposal.createdAt && (
            <p className="text-xs text-muted-foreground mt-1">
              Sent {new Date(proposal.createdAt).toLocaleDateString()}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {proposal.description && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Description
              </p>
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {proposal.description}
              </p>
            </div>
          )}
          {proposal.proposedBudget && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Proposed budget
              </p>
              <p className="text-sm font-medium">{proposal.proposedBudget}</p>
            </div>
          )}
          {proposal.deliverables && proposal.deliverables.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Deliverables
              </p>
              <ul className="text-sm text-foreground list-disc list-inside">
                {proposal.deliverables.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          )}
          {jobId != null && (
            <Button asChild className="w-full sm:w-auto">
              <Link href={`/jobs/${jobId}`}>View job</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
