"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { escrowPaymentsApi, type EscrowListItem } from "@/lib/data/escrowPayments";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RiBankCardLine,
  RiUser3Line,
  RiTimeLine,
  RiCheckDoubleLine,
  RiAlertLine,
  RiArrowRightLine,
  RiRefundLine,
  RiPlayFill,
  RiSendPlane2Fill,
} from "@remixicon/react";
import { Loader2, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

interface EscrowDetailsModalProps {
  escrowId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  viewerUserId: number;
}

export default function EscrowDetailsModal({
  escrowId,
  open,
  onOpenChange,
  viewerUserId,
}: EscrowDetailsModalProps) {
  const queryClient = useQueryClient();

  const { data: escrow, isLoading, isError } = useQuery({
    queryKey: ["escrow-details", escrowId],
    queryFn: () => escrowPaymentsApi.getById(escrowId!),
    enabled: !!escrowId && open,
  });

  const mutationOptions = {
    onSuccess: () => {
      toast.success("Transaction updated");
      queryClient.invalidateQueries({ queryKey: ["escrow-details", escrowId] });
      queryClient.invalidateQueries({ queryKey: ["escrow-list-payments"] });
      queryClient.invalidateQueries({ queryKey: ["escrow-stats"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Action failed");
    },
  };

  const startWorkMutation = useMutation({
    mutationFn: (id: number) => escrowPaymentsApi.startWork(id),
    ...mutationOptions,
  });

  const deliverMutation = useMutation({
    mutationFn: ({ id, note }: { id: number; note: string }) => escrowPaymentsApi.deliver(id, note),
    ...mutationOptions,
  });

  const releaseFundsMutation = useMutation({
    mutationFn: (id: number) => escrowPaymentsApi.releaseFunds(id),
    ...mutationOptions,
  });

  const raiseDisputeMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => escrowPaymentsApi.raiseDispute(id, reason),
    ...mutationOptions,
  });

  if (!open || !escrowId) return null;

  const isBuyer = escrow?.buyer?.id === viewerUserId;
  const isSeller = escrow?.seller?.id === viewerUserId;

  const renderStatusInfo = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case "pending":
        return { 
          icon: <RiBankCardLine className="h-5 w-5 text-amber-500" />,
          desc: "Awaiting payment from buyer." 
        };
      case "funded":
        return { 
          icon: <RiCheckDoubleLine className="h-5 w-5 text-emerald-500" />,
          desc: "Funds secured in escrow. Seller can start work." 
        };
      case "in_progress":
        return { 
          icon: <RiPlayFill className="h-5 w-5 text-blue-500" />,
          desc: "Project is currently active." 
        };
      case "delivered":
        return { 
          icon: <RiSendPlane2Fill className="h-5 w-5 text-purple-500" />,
          desc: "Work submitted. Awaiting buyer approval to release funds." 
        };
      case "released":
        return { 
          icon: <RiCheckDoubleLine className="h-5 w-5 text-emerald-600" />,
          desc: "Funds successfully transferred to seller." 
        };
      case "disputed":
        return { 
          icon: <RiAlertLine className="h-5 w-5 text-rose-500" />,
          desc: "This transaction is under review by support." 
        };
      default:
        return { 
          icon: <RiTimeLine className="h-5 w-5 text-muted-foreground" />,
          desc: status 
        };
    }
  };

  const statusInfo = escrow ? renderStatusInfo(escrow.status) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            Escrow Details
            <Badge variant="outline" className="text-[10px] uppercase ml-2">
              #{escrowId}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Transaction between buyer and seller.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : isError || !escrow ? (
          <div className="text-center py-8 text-destructive">
            Failed to load transaction details.
          </div>
        ) : (
          <div className="space-y-6 pt-2">
            {/* Status Header Block */}
            <div className="rounded-xl bg-muted/30 p-4 border border-border flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 rounded-full bg-background flex items-center justify-center border border-border">
                {statusInfo?.icon}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-base capitalize">{escrow.status.replace("_", " ")}</p>
                <p className="text-xs text-muted-foreground leading-snug">{statusInfo?.desc}</p>
              </div>
            </div>

            {/* Parties Block */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Buyer</p>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <RiUser3Line className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium truncate">{isBuyer ? "You" : (escrow.buyer?.firstName || "Buyer")}</p>
                </div>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Seller</p>
                <div className="flex items-center gap-2 justify-end">
                  <p className="text-sm font-medium truncate">{isSeller ? "You" : (escrow.seller?.firstName || "Seller")}</p>
                  <div className="h-6 w-6 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <RiUser3Line className="h-3.5 w-3.5 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Amounts Block */}
            <Card className="bg-muted/10 border-border/60">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Escrow Amount</span>
                  <span className="font-bold">Ksh {escrow.totalAmountKES.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Seller will receive</span>
                  <span>Ksh {escrow.sellerAmountKES.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Created Date</span>
                  <span>{new Date(escrow.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions Block */}
            <div className="space-y-3 pt-2">
              {/* Seller Actions */}
              {isSeller && escrow.status === "funded" && (
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => startWorkMutation.mutate(escrow.id)}
                  disabled={startWorkMutation.isPending}
                >
                  {startWorkMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RiPlayFill className="h-4 w-4 mr-2" />}
                  Starting Work
                </Button>
              )}

              {isSeller && escrow.status === "in_progress" && (
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => {
                    const note = prompt("Enter a delivery note (optional):") || "";
                    deliverMutation.mutate({ id: escrow.id, note });
                  }}
                  disabled={deliverMutation.isPending}
                >
                  {deliverMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RiSendPlane2Fill className="h-4 w-4 mr-2" />}
                  Deliver Work
                </Button>
              )}

              {/* Buyer Actions */}
              {isBuyer && escrow.status === "delivered" && (
                <div className="flex flex-col gap-2">
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => {
                      if (confirm("Are you satisfied with the work? This will release funds to the seller.")) {
                        releaseFundsMutation.mutate(escrow.id);
                      }
                    }}
                    disabled={releaseFundsMutation.isPending}
                  >
                    {releaseFundsMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RiCheckDoubleLine className="h-4 w-4 mr-2" />}
                    Accept & Release Funds
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-rose-500/50 text-rose-600 hover:bg-rose-500/10"
                    onClick={() => {
                      const reason = prompt("Describe the issue:") || "";
                      if (reason) raiseDisputeMutation.mutate({ id: escrow.id, reason });
                    }}
                    disabled={raiseDisputeMutation.isPending}
                  >
                    <RiAlertLine className="h-4 w-4 mr-2" />
                    Raise Dispute
                  </Button>
                </div>
              )}

              {/* Generic Actions */}
              {escrow.status === "pending" && isBuyer && (
                <Button 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => {
                    // Logic to get payment URL and redirect
                    toast.loading("Getting payment link...");
                    // Assuming createFromProposal or similar logic for pending
                  }}
                >
                  <RiBankCardLine className="h-4 w-4 mr-2" />
                  Complete Payment
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
