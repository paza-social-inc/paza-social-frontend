"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { jobsApi } from "@/lib/data/jobs";
import {
  projectProposalsApi,
  type CreatorProjectProposalMine,
} from "@/lib/data/projectProposals";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, FileText, ArrowRight, LayoutGrid } from "lucide-react";
import type { JobProposal } from "@/types/job.types";

function StatusBadge({ status }: { status?: string }) {
  const v = (status ?? "pending").toLowerCase();
  const variant =
    v === "accepted"
      ? "default"
      : v === "rejected"
        ? "destructive"
        : v === "completed"
          ? "secondary"
          : "outline";
  return (
    <Badge variant={variant} className="capitalize">
      {v}
    </Badge>
  );
}

export default function ProposalsPage() {
  const {
    data: jobProposals = [],
    isLoading: jobsLoading,
    isError: jobsError,
  } = useQuery({
    queryKey: ["my-proposals"],
    queryFn: () => jobsApi.getMyProposals(),
  });

  const {
    data: showcaseProposals = [],
    isLoading: showcaseLoading,
    isError: showcaseError,
  } = useQuery({
    queryKey: ["my-showcase-proposals"],
    queryFn: () => projectProposalsApi.getMine(),
  });

  const loading = jobsLoading || showcaseLoading;

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (jobsError && showcaseError) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-destructive">Failed to load your proposals.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/jobs">Browse jobs</Link>
        </Button>
      </div>
    );
  }

  const jobList = jobProposals as JobProposal[];
  const showcaseList = showcaseProposals as CreatorProjectProposalMine[];

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Proposals</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Track proposals you&apos;ve sent for jobs and showcase collaborations
        </p>
      </div>

      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="mb-4 h-auto w-full flex-wrap justify-start gap-1 sm:w-fit">
          <TabsTrigger value="jobs" className="px-4">
            Job proposals
            {jobList.length > 0 ? (
              <Badge variant="secondary" className="ml-2 tabular-nums">
                {jobList.length}
              </Badge>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="showcase" className="px-4">
            Showcase collaborations
            {showcaseList.length > 0 ? (
              <Badge variant="secondary" className="ml-2 tabular-nums">
                {showcaseList.length}
              </Badge>
            ) : null}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="mt-0">
          {jobsError ? (
            <p className="text-destructive text-sm py-4">
              Could not load job proposals.
            </p>
          ) : jobList.length === 0 ? (
            <Card className="border-border rounded-xl">
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-medium">No job proposals yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Apply to jobs from the job board to see your proposals here.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/jobs">Browse jobs</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <ul className="space-y-3">
              {jobList.map((p) => {
                const id = p.id ?? (p as { _id?: string })._id;
                const jobId = p.jobId;
                return (
                  <li key={id ?? String(jobId)}>
                    <Card className="border-border rounded-xl overflow-hidden hover:bg-muted/30 transition-colors">
                      <Link
                        href={
                          id != null
                            ? `/proposals/${id}`
                            : jobId != null
                              ? `/jobs/${jobId}`
                              : "#"
                        }
                        className="block"
                      >
                        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-foreground truncate">
                              {p.title}
                            </p>
                            {p.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                                {p.description}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <StatusBadge status={p.status} />
                              {p.proposedBudget && (
                                <span className="text-xs text-muted-foreground">
                                  {p.proposedBudget}
                                </span>
                              )}
                              {p.createdAt && (
                                <span className="text-xs text-muted-foreground">
                                  {new Date(p.createdAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          {jobId != null && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="shrink-0"
                              asChild
                            >
                              <span>
                                View job{" "}
                                <ArrowRight className="h-4 w-4 ml-1" />
                              </span>
                            </Button>
                          )}
                        </CardContent>
                      </Link>
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="showcase" className="mt-0">
          {showcaseError ? (
            <p className="text-destructive text-sm py-4">
              Could not load showcase proposals.
            </p>
          ) : showcaseList.length === 0 ? (
            <Card className="border-border rounded-xl">
              <CardContent className="py-12 text-center">
                <LayoutGrid className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-medium">
                  No showcase proposals yet
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Send a collaboration request from a creator&apos;s showcase
                  project to track it here. When the owner accepts or declines,
                  you&apos;ll see the status and get a notification.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/showcase">Browse showcase</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <ul className="space-y-3">
              {showcaseList.map((p) => {
                const pid = p.project?.id;
                return (
                  <li key={p.id}>
                    <Card className="border-border rounded-xl overflow-hidden hover:bg-muted/30 transition-colors">
                      <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-foreground truncate">
                            {p.project?.title ?? "Showcase project"}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5 capitalize">
                            {p.collaborationType}
                            {p.fee ? ` · ${p.fee}` : ""}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <StatusBadge status={p.status} />
                            {p.createdAt && (
                              <span className="text-xs text-muted-foreground">
                                Sent {new Date(p.createdAt).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        {pid != null && (
                          <Button variant="outline" size="sm" className="shrink-0" asChild>
                            <Link href={`/showcase/projects/${pid}`}>
                              View project
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </Link>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
