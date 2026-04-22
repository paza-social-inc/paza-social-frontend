"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jobsApi } from "@/lib/data/jobs";
import { escrowPaymentsApi } from "@/lib/data/escrowPayments";
import { messagesApi } from "@/lib/data/messages";
import { usersApi } from "@/lib/data/users";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RiCheckLine,
  RiCloseLine,
  RiChat1Line,
  RiUser3Line,
  RiMoneyDollarCircleLine,
  RiFileListLine,
} from "@remixicon/react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface JobProposalsListProps {
  jobId: number;
}

export default function JobProposalsList({ jobId }: JobProposalsListProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [openingChatId, setOpeningChatId] = useState<number | null>(null);

  const { data: proposals = [], isLoading, isError } = useQuery({
    queryKey: ["job-proposals", jobId],
    queryFn: () => jobsApi.getJobProposals(jobId),
    enabled: !!jobId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ proposalId, status }: { proposalId: number; status: any }) =>
      jobsApi.updateProposalStatus(jobId, proposalId, status),
    onSuccess: (updated) => {
      toast.success(`Proposal ${updated.status}`);
      queryClient.invalidateQueries({ queryKey: ["job-proposals", jobId] });
      queryClient.invalidateQueries({ queryKey: ["job-stats", jobId] });
      
      if (updated.status.toLowerCase() === "accepted") {
        toast.success("Proposal accepted! You can now fund the escrow to start work.");
      }
    },
    onError: () => toast.error("Failed to update proposal status"),
  });

  const fundMutation = useMutation({
    mutationFn: (proposalId: number) => escrowPaymentsApi.createFromProposal(proposalId),
    onSuccess: (data) => {
      if (data.paymentUrl) {
        toast.success("Redirecting to payment...");
        window.location.href = data.paymentUrl;
      } else {
        toast.error("Could not get payment URL");
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to initiate payment");
    },
  });

  const openChatMutation = useMutation({
    mutationFn: async (proposerId: number) => {
      const conv = await messagesApi.getOrCreateConversation(String(proposerId));
      return conv._id;
    },
    onSuccess: (conversationId) => {
      router.push(`/inbox?id=${conversationId}`);
    },
    onSettled: () => setOpeningChatId(null),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-destructive text-sm">
        Failed to load proposals.
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="text-center py-12 rounded-xl border border-dashed border-border bg-muted/30">
        <RiFileListLine className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm font-medium text-foreground">No proposals received yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          When creators apply to this job, their proposals will appear here.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case "accepted":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 border-0">Accepted</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-orange-500 text-orange-600">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Proposals Received</h3>
        <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
          {proposals.length} Total
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {proposals.map((p) => {
          const pid = p.id;
          const proposerId = p.proposerId;
          const isPending = p.status?.toLowerCase() === "pending";

          return (
            <Card key={pid} className="overflow-hidden hover:shadow-md transition-shadow border-border">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  {/* Proposer Info Side */}
                  <div className="w-full sm:w-48 bg-muted/30 p-4 border-b sm:border-b-0 sm:border-r border-border flex flex-col items-center justify-center text-center">
                    <div className="h-14 w-14 rounded-full bg-orange-500/20 flex items-center justify-center mb-2">
                      <RiUser3Line className="h-7 w-7 text-orange-600" />
                    </div>
                    <p className="font-bold text-sm truncate w-full">{p.proposerName || "Creator"}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1">
                      {p.proposerType || "PRO"}
                    </p>
                    <div className="mt-3 flex gap-2">
                       <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full"
                        title="Message Creator"
                        disabled={openingChatId === proposerId}
                        onClick={() => {
                          setOpeningChatId(proposerId);
                          openChatMutation.mutate(proposerId);
                        }}
                      >
                        {openingChatId === proposerId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RiChat1Line className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Proposal Details Content */}
                  <div className="flex-1 p-5 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="font-bold text-base">{p.title}</h4>
                      {getStatusBadge(p.status)}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {p.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border mt-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <RiMoneyDollarCircleLine className="h-4 w-4 text-emerald-500" />
                        Budget: <span className="text-foreground font-semibold">Ksh {p.proposedBudget?.toLocaleString() || "N/A"}</span>
                      </div>
                      
                      {p.deliverables && p.deliverables.length > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <RiFileListLine className="h-4 w-4 text-blue-500" />
                          {p.deliverables.length} Deliverables
                        </div>
                      )}
                    </div>

                    {isPending && (
                      <div className="flex items-center gap-2 pt-4 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 border-destructive/30"
                          onClick={() => updateStatusMutation.mutate({ proposalId: pid, status: "rejected" })}
                          disabled={updateStatusMutation.isPending}
                        >
                          <RiCloseLine className="h-4 w-4 mr-1.5" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => updateStatusMutation.mutate({ proposalId: pid, status: "accepted" })}
                          disabled={updateStatusMutation.isPending || fundMutation.isPending}
                        >
                          <RiCheckLine className="h-4 w-4 mr-1.5" />
                          Accept Proposal
                        </Button>
                      </div>
                    )}

                    {!isPending && p.status?.toLowerCase() === "accepted" && (
                      <div className="flex justify-end pt-4">
                        <Button
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                          onClick={() => fundMutation.mutate(pid)}
                          disabled={fundMutation.isPending}
                        >
                          {fundMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <RiMoneyDollarCircleLine className="h-4 w-4 mr-2" />
                          )}
                          Fund & Start Project
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
