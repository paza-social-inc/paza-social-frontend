"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jobsApi } from "@/lib/data/jobs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, ArrowLeft } from "lucide-react";
import type { JobProposal } from "@/types/job.types";
import toast from "react-hot-toast";

export default function JobProposalsPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const jobId = id ? Number(id) : NaN;
  const queryClient = useQueryClient();
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<JobProposal | null>(null);

  const { data: proposals = [], isLoading, isError } = useQuery({
    queryKey: ["job-proposals", jobId],
    queryFn: () => jobsApi.getJobProposals(jobId),
    enabled: !Number.isNaN(jobId),
  });

  const statusMutation = useMutation({
    mutationFn: ({
      proposalId,
      status,
    }: {
      proposalId: number;
      status: "accepted" | "rejected";
    }) => jobsApi.updateProposalStatus(jobId, proposalId, status),
    onSuccess: (_data, variables) => {
      toast.success(
        variables.status === "accepted"
          ? "Proposal accepted"
          : "Proposal rejected"
      );
      void queryClient.invalidateQueries({ queryKey: ["job-proposals", jobId] });
      void queryClient.invalidateQueries({ queryKey: ["job", jobId] });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Could not update proposal";
      toast.error(msg);
    },
  });

  if (!id || Number.isNaN(jobId)) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-muted-foreground">Invalid job.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/jobs">Back to jobs</Link>
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

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center space-y-3">
        <p className="text-destructive">Failed to load proposals for this job.</p>
        <Button asChild variant="outline">
          <Link href={`/jobs/${id}`}>Back to job</Link>
        </Button>
      </div>
    );
  }

  const list = proposals as JobProposal[];

  const proposalStatusVariant = (status: string) => {
    if (status === "accepted") return "default" as const;
    if (status === "rejected") return "destructive" as const;
    if (status === "completed") return "secondary" as const;
    return "outline" as const;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Proposals for this job</h1>
          <p className="text-sm text-muted-foreground">
            Showing {list.length} proposal{list.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button asChild variant="ghost">
          <Link href={`/jobs/${id}`} className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to job
          </Link>
        </Button>
      </div>

      {list.length === 0 ? (
        <Card className="border-border rounded-xl">
          <CardContent className="py-12 text-center space-y-2">
            <p className="font-medium text-foreground">No proposals yet</p>
            <p className="text-sm text-muted-foreground">
              Once creators send proposals for this job, they will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map((p) => {
            const pid = p.id ?? (p as { _id?: string })._id;
            const numericId =
              typeof pid === "number" ? pid : pid != null ? Number(pid) : NaN;
            const status = (p.status ?? "pending").toLowerCase();
            const canRespond =
              status === "pending" &&
              Number.isFinite(numericId) &&
              numericId > 0;
            return (
              <Card
                key={pid ?? `${p.createdAt}-${p.title}`}
                className="border-border rounded-xl h-full flex flex-col cursor-pointer transition-colors hover:border-orange-500/50"
                onClick={() => {
                  setSelectedProposal(p);
                  setDetailOpen(true);
                }}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base line-clamp-2">{p.title}</CardTitle>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge
                      variant={proposalStatusVariant(status)}
                      className="capitalize"
                    >
                      {status}
                    </Badge>
                    {p.createdAt && (
                      <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-3 text-sm">
                  {p.description && (
                    <p className="text-muted-foreground line-clamp-3">{p.description}</p>
                  )}
                  {p.proposedBudget && (
                    <p className="text-foreground font-medium">
                      Budget: <span className="font-semibold">{p.proposedBudget}</span>
                    </p>
                  )}
                  {((p.collaborators && p.collaborators.length > 0) ||
                    (p.collaboratorIds && p.collaboratorIds.length > 0)) && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Collaborators
                      </p>
                      <ul className="text-xs text-foreground list-disc list-inside space-y-0.5">
                        {p.collaborators && p.collaborators.length > 0
                          ? p.collaborators.map((c, i) => {
                              const name =
                                `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim() ||
                                c.email ||
                                `User #${c.id}`;
                              return <li key={`${c.id ?? i}`}>{name}</li>;
                            })
                          : (p.collaboratorIds ?? []).map((cid) => (
                              <li key={cid}>User #{cid}</li>
                            ))}
                      </ul>
                    </div>
                  )}
                  {p.deliverables && p.deliverables.length > 0 && (
                    <div className="mt-auto pt-2 space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Deliverables
                      </p>
                      <ul className="text-xs text-foreground list-disc list-inside space-y-0.5">
                        {p.deliverables.slice(0, 3).map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                        {p.deliverables.length > 3 && (
                          <li className="text-muted-foreground">
                            +{p.deliverables.length - 3} more
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  {canRespond ? (
                    <div
                      className="flex flex-col gap-2 sm:flex-row sm:justify-end pt-2 border-t border-border mt-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        className="sm:flex-1"
                        disabled={statusMutation.isPending}
                        onClick={() =>
                          statusMutation.mutate({
                            proposalId: numericId,
                            status: "rejected",
                          })
                        }
                      >
                        Reject
                      </Button>
                      <Button
                        type="button"
                        className="sm:flex-1 bg-emerald-600 text-white hover:bg-emerald-600/90"
                        disabled={statusMutation.isPending}
                        onClick={() =>
                          statusMutation.mutate({
                            proposalId: numericId,
                            status: "accepted",
                          })
                        }
                      >
                        Accept
                      </Button>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Proposal Details</DialogTitle>
            <DialogDescription>
              Review full proposal information and decide whether to accept or reject.
            </DialogDescription>
          </DialogHeader>
          {!selectedProposal ? (
            <p className="text-sm text-muted-foreground">No proposal selected.</p>
          ) : (
            (() => {
              const pid = selectedProposal.id ?? (selectedProposal as { _id?: string })._id;
              const numericId = typeof pid === "number" ? pid : pid != null ? Number(pid) : NaN;
              const status = String(selectedProposal.status ?? "pending").toLowerCase();
              const canRespond = status === "pending" && Number.isFinite(numericId) && numericId > 0;
              return (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">{selectedProposal.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant={proposalStatusVariant(status)} className="capitalize">
                        {status}
                      </Badge>
                      {selectedProposal.createdAt ? (
                        <span>{new Date(selectedProposal.createdAt).toLocaleString()}</span>
                      ) : null}
                    </div>
                  </div>

                  {selectedProposal.description ? (
                    <section className="space-y-1.5">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Proposal
                      </p>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                        {selectedProposal.description}
                      </p>
                    </section>
                  ) : null}

                  {selectedProposal.proposedBudget ? (
                    <section className="space-y-1.5">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Budget
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {selectedProposal.proposedBudget}
                      </p>
                    </section>
                  ) : null}

                  {selectedProposal.deliverables && selectedProposal.deliverables.length > 0 ? (
                    <section className="space-y-1.5">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Deliverables
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                        {selectedProposal.deliverables.map((d, i) => (
                          <li key={`${d}-${i}`}>{d}</li>
                        ))}
                      </ul>
                    </section>
                  ) : null}

                  {((selectedProposal.collaborators && selectedProposal.collaborators.length > 0) ||
                    (selectedProposal.collaboratorIds && selectedProposal.collaboratorIds.length > 0)) && (
                    <section className="space-y-1.5">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Collaborators
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                        {selectedProposal.collaborators && selectedProposal.collaborators.length > 0
                          ? selectedProposal.collaborators.map((c, i) => {
                              const name =
                                `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim() ||
                                c.email ||
                                `User #${c.id}`;
                              return <li key={`${c.id ?? i}`}>{name}</li>;
                            })
                          : (selectedProposal.collaboratorIds ?? []).map((cid) => (
                              <li key={cid}>User #{cid}</li>
                            ))}
                      </ul>
                    </section>
                  )}

                  {canRespond ? (
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end pt-3 border-t border-border">
                      <Button
                        type="button"
                        variant="outline"
                        className="sm:flex-1"
                        disabled={statusMutation.isPending}
                        onClick={() =>
                          statusMutation.mutate({
                            proposalId: numericId,
                            status: "rejected",
                          })
                        }
                      >
                        Reject Proposal
                      </Button>
                      <Button
                        type="button"
                        className="sm:flex-1 bg-orange-500 text-black hover:bg-orange-600"
                        disabled={statusMutation.isPending}
                        onClick={() =>
                          statusMutation.mutate({
                            proposalId: numericId,
                            status: "accepted",
                          })
                        }
                      >
                        Accept Proposal
                      </Button>
                    </div>
                  ) : null}
                </div>
              );
            })()
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

