"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { projectsApi } from "@/lib/data/projects";
import {
  projectProposalsApi,
  formatProposalTimeline,
  type CreatorProjectProposal,
} from "@/lib/data/projectProposals";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProposalDetailsModal } from "@/components/Dashboard/showcase/ProposalDetailsModal";
import { cn } from "@/lib/utils";

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

export default function ShowcaseProjectProposalsPage() {
  const [detailProposal, setDetailProposal] =
    useState<CreatorProjectProposal | null>(null);
  const queryClient = useQueryClient();
  const params = useParams();
  const id = params?.id as string | undefined;
  const projectIdNum = id ? Number(id) : NaN;
  const validId = !!id && !Number.isNaN(projectIdNum) && projectIdNum > 0;

  const { data: project } = useQuery({
    queryKey: ["creator-projects", id],
    queryFn: () => projectsApi.getById(id!),
    enabled: validId,
  });

  const {
    data: proposals = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["creator-project-proposals", projectIdNum],
    queryFn: () => projectProposalsApi.getByProjectId(projectIdNum),
    enabled: validId,
  });

  const projectTitle =
    (project as { title?: string } | undefined)?.title ?? "Project";

  const forbidden =
    axios.isAxiosError(error) && error.response?.status === 403;

  const updateStatusMutation = useMutation({
    mutationFn: ({ proposalId, status }: { proposalId: number; status: "accepted" | "rejected" }) =>
      projectProposalsApi.updateStatus(projectIdNum, proposalId, status),
    onSuccess: (_, vars) => {
      toast.success(vars.status === "accepted" ? "Proposal accepted" : "Proposal declined");
      queryClient.invalidateQueries({ queryKey: ["creator-project-proposals", projectIdNum] });
      queryClient.invalidateQueries({ queryKey: ["creator-projects", String(projectIdNum)] });
      queryClient.invalidateQueries({ queryKey: ["my-showcase-proposals"] });
      if (detailProposal?.id === vars.proposalId) setDetailProposal(null);
    },
    onError: (err: unknown) => {
      const msg =
        axios.isAxiosError(err) &&
        err.response?.data &&
        typeof (err.response.data as { message?: string }).message === "string"
          ? (err.response.data as { message: string }).message
          : "Could not update proposal";
      toast.error(msg);
    },
  });

  if (!validId) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-muted-foreground">Invalid project.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/showcase">Back to showcase</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-4 text-center">
        <p className="text-muted-foreground">
          Only the project owner can view collaboration proposals for this project.
        </p>
        <Button asChild variant="outline">
          <Link href={id ? `/showcase/projects/${id}` : "/showcase"}>
            Back to project
          </Link>
        </Button>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center space-y-3">
        <p className="text-destructive">
          {(axios.isAxiosError(error) && error.response?.data?.message) ||
            "Failed to load proposals."}
        </p>
        <Button asChild variant="outline">
          <Link href={`/showcase/projects/${id}`}>Back to project</Link>
        </Button>
      </div>
    );
  }

  const list = proposals as CreatorProjectProposal[];

  return (
    <>
    <ProposalDetailsModal
      open={detailProposal != null}
      onOpenChange={(open) => {
        if (!open) setDetailProposal(null);
      }}
      proposal={detailProposal}
      projectId={projectIdNum}
    />
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="space-y-1 min-w-0">
          <h1 className="text-2xl font-bold text-foreground truncate">
            Proposals — {projectTitle}
          </h1>
          <p className="text-sm text-muted-foreground">
            Collaboration requests for this showcase project ({list.length} total)
          </p>
        </div>
        <Button asChild variant="ghost" className="shrink-0 self-start">
          <Link
            href={`/showcase/projects/${id}`}
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to project
          </Link>
        </Button>
      </div>

      {list.length === 0 ? (
        <Card className="border-border rounded-xl">
          <CardContent className="py-12 text-center space-y-2">
            <p className="font-medium text-foreground">No proposals yet</p>
            <p className="text-sm text-muted-foreground">
              When brands or creators send collaboration requests, they will appear
              here.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/showcase">Browse showcase</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map((p) => {
            const proposerName = p.proposer
              ? `${p.proposer.firstName} ${p.proposer.lastName}`.trim()
              : "—";
            const timelineLabel = formatProposalTimeline(p);
            const pending = String(p.status ?? "pending").toLowerCase() === "pending";
            const rowBusy =
              updateStatusMutation.isPending &&
              updateStatusMutation.variables?.proposalId === p.id;
            return (
              <Card
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={() => setDetailProposal(p)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setDetailProposal(p);
                  }
                }}
                className={cn(
                  "border-border rounded-xl h-full flex flex-col",
                  "cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base line-clamp-2">
                      {proposerName}
                    </CardTitle>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="text-sm text-muted-foreground capitalize">
                    {p.kind} · {p.collaborationType}
                  </p>
                  {p.createdAt && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(p.createdAt).toLocaleString()}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-3 text-sm">
                  {p.reason && (
                    <p className="text-muted-foreground line-clamp-4 flex-1">
                      {p.reason}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {p.fee && (
                      <span className="rounded-md bg-muted px-2 py-1">
                        Fee: {p.fee}
                      </span>
                    )}
                    {timelineLabel && (
                      <span className="rounded-md bg-muted px-2 py-1">
                        {timelineLabel}
                      </span>
                    )}
                  </div>
                  {p.collaborators && p.collaborators.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      +{p.collaborators.length} collaborator(s) noted
                    </p>
                  )}
                  {pending && (
                    <div
                      className="mt-1 flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 border-red-400/60 text-red-400 hover:bg-red-500/10"
                        disabled={rowBusy}
                        onClick={() =>
                          updateStatusMutation.mutate({
                            proposalId: p.id,
                            status: "rejected",
                          })
                        }
                      >
                        {rowBusy && updateStatusMutation.variables?.status === "rejected" ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          "Decline"
                        )}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        className="h-8 bg-orange-500 text-white hover:bg-orange-600"
                        disabled={rowBusy}
                        onClick={() =>
                          updateStatusMutation.mutate({
                            proposalId: p.id,
                            status: "accepted",
                          })
                        }
                      >
                        {rowBusy && updateStatusMutation.variables?.status === "accepted" ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          "Accept"
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
    </>
  );
}
