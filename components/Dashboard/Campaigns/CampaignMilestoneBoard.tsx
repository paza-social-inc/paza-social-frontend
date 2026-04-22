"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { campaignApi } from "@/lib/data/campaigns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CampaignMilestone, 
  CampaignMilestoneStatus 
} from "@/types/campaigns/campaignTypes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  RiFlagLine,
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiCalendarLine,
  RiMoneyDollarCircleLine,
} from "@remixicon/react";
import { Loader2, MoreVertical } from "lucide-react";
import toast from "react-hot-toast";

interface CampaignMilestoneBoardProps {
  campaignId: number;
  milestones: CampaignMilestone[];
  viewerOwnsCampaign: boolean;
}

export default function CampaignMilestoneBoard({
  campaignId,
  milestones,
  viewerOwnsCampaign,
}: CampaignMilestoneBoardProps) {
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<CampaignMilestone | null>(null);

  const addMilestoneMutation = useMutation({
    mutationFn: (data: any) => campaignApi.addMilestone(campaignId, data),
    onSuccess: () => {
      toast.success("Milestone added");
      setIsAddOpen(false);
      queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
    },
    onError: () => toast.error("Failed to add milestone"),
  });

  const updateMilestoneMutation = useMutation({
    mutationFn: (data: any) => {
      if (!editingMilestone?.id) throw new Error("No milestone ID");
      return campaignApi.updateMilestone(campaignId, editingMilestone.id, data);
    },
    onSuccess: () => {
      toast.success("Milestone updated");
      setEditingMilestone(null);
      queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
    },
    onError: () => toast.error("Failed to update milestone"),
  });

  const deleteMilestoneMutation = useMutation({
    mutationFn: (milestoneId: number) =>
      campaignApi.deleteMilestone(campaignId, milestoneId),
    onSuccess: () => {
      toast.success("Milestone deleted");
      queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
    },
    onError: () => toast.error("Failed to delete milestone"),
  });

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      status: formData.get("status") || "To-Do",
      budget: Number(formData.get("budget")) || 0,
      start: formData.get("startDate"),
      end: formData.get("dueDate"),
    };
    addMilestoneMutation.mutate(data);
  };

  const handleUpdateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      status: formData.get("status"),
      budget: Number(formData.get("budget")) || 0,
      start: formData.get("startDate"),
      end: formData.get("dueDate"),
    };
    updateMilestoneMutation.mutate(data);
  };

  const getStatusColor = (status?: string | null) => {
    if (!status) return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400";
      case "in progress":
        return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400";
      case "to-do":
        return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
      default:
        return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <RiFlagLine className="h-5 w-5 text-orange-500" />
            Milestones
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track high-level campaign objectives and deliverables.
          </p>
        </div>
        {viewerOwnsCampaign && (
          <Button onClick={() => setIsAddOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
            <RiAddLine className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {milestones.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <RiFlagLine className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg">No milestones yet</h3>
              <p className="text-sm text-muted-foreground max-w-xs mt-2">
                Set milestones to track critical phases of your campaign.
              </p>
            </CardContent>
          </Card>
        ) : (
          milestones.map((m, idx) => (
            <Card key={m.id ?? `m-${idx}`} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-stretch">
                  <div className={`w-1.5 shrink-0 ${getStatusColor(m.status).split(' ')[0]}`} />
                  <div className="flex-1 p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground">{m.title}</h3>
                          <Badge className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0 border-0 ${getStatusColor(m.status)}`}>
                            {m.status || "To-Do"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {m.description || "No description provided."}
                        </p>
                      </div>
                      {viewerOwnsCampaign && (
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground"
                            onClick={() => setEditingMilestone(m)}
                          >
                            <RiEditLine className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive/70 hover:text-destructive"
                            onClick={() => {
                              if (confirm("Delete this milestone?") && m.id) {
                                deleteMilestoneMutation.mutate(m.id);
                              }
                            }}
                          >
                            <RiDeleteBinLine className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center gap-4 text-xs">
                      {m.start && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <RiCalendarLine className="h-3.5 w-3.5" />
                          Starts: <span className="text-foreground font-medium">{new Date(m.start).toLocaleDateString()}</span>
                        </div>
                      )}
                      {m.end && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <RiCalendarLine className="h-3.5 w-3.5" />
                          Due: <span className="text-foreground font-medium">{new Date(m.end).toLocaleDateString()}</span>
                        </div>
                      )}
                      {m.budget && Number(m.budget) > 0 ? (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <RiMoneyDollarCircleLine className="h-3.5 w-3.5" />
                          Budget: <span className="text-foreground font-medium">Ksh {Number(m.budget).toLocaleString()}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Milestone Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Milestone</DialogTitle>
            <DialogDescription>Define a new goal for this campaign.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="title">Milestone Title</Label>
              <Input id="title" name="title" required placeholder="e.g. Content Production Phase" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="What needs to be achieved?" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" name="startDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" name="dueDate" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (Ksh) - Optional</Label>
              <Input id="budget" name="budget" type="number" placeholder="0" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white" disabled={addMilestoneMutation.isPending}>
                {addMilestoneMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Milestone
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Milestone Dialog */}
      <Dialog open={!!editingMilestone} onOpenChange={(open) => !open && setEditingMilestone(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Milestone</DialogTitle>
          </DialogHeader>
          {editingMilestone && (
            <form onSubmit={handleUpdateSubmit} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input id="edit-title" name="title" defaultValue={editingMilestone.title} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" name="description" defaultValue={editingMilestone.description} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select 
                  id="status" 
                  name="status" 
                  defaultValue={editingMilestone.status}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">Start Date</Label>
                  <Input id="edit-startDate" name="startDate" type="date" defaultValue={editingMilestone.start?.split('T')[0]} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-dueDate">Due Date</Label>
                  <Input id="edit-dueDate" name="dueDate" type="date" defaultValue={editingMilestone.end?.split('T')[0]} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-budget">Budget (Ksh)</Label>
                <Input id="edit-budget" name="budget" type="number" defaultValue={editingMilestone.budget} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setEditingMilestone(null)}>Cancel</Button>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white" disabled={updateMilestoneMutation.isPending}>
                  {updateMilestoneMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
