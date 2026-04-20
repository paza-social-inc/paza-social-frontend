"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Circle,
  Loader2,
  MessageCircle,
  MoreVertical,
  Paperclip,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";

import { campaignApi } from "@/lib/data/campaigns";
import type {
  Campaign,
  CampaignMilestone,
  CampaignMilestoneStatus,
} from "@/types/campaigns/campaignTypes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { tasksApi, type TaskListItem } from "@/lib/data/tasks";
import { useAuth } from "@/hooks/store/auth/useAuth";

type TaskFilter = "all" | "mine";
type BoardColumn = "todo" | "inProgress" | "completed";

function statusToColumn(status?: string | null): BoardColumn {
  if (status === "Completed" || status === "Done") return "completed";
  if (status === "In Progress") return "inProgress";
  if (status === "Review") return "inProgress";
  return "todo";
}

function milestoneProgressPercent(m: CampaignMilestone): number {
  if (m.status === "Completed") return 100;
  const start = m.start ? new Date(m.start).getTime() : NaN;
  const end = m.end ? new Date(m.end).getTime() : NaN;
  if (Number.isFinite(start) && Number.isFinite(end) && end > start) {
    const now = Date.now();
    const p = ((now - start) / (end - start)) * 100;
    return Math.round(Math.min(99, Math.max(8, p)));
  }
  if (m.status === "To-Do") return 12;
  return 45;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }
  return (parts[0]?.slice(0, 2) ?? "?").toUpperCase();
}

type BoardItem = {
  source: "milestone" | "task";
  id?: number;
  title: string;
  description?: string | null;
  status?: string | null;
  start?: string | null;
  end?: string | null;
  ownerId?: number | null;
  assigneeId?: number | null;
  assigneeEmail?: string | null;
  assigneeName?: string | null;
  budgetKsh?: string | null;
  attachmentName?: string | null;
};

export interface CampaignTasksBoardProps {
  campaignId: number;
  milestones: CampaignMilestone[];
  teams?: Campaign["teams"];
  restrictToAssignedOnly?: boolean;
}

export function CampaignTasksBoard({
  campaignId,
  milestones,
  teams,
  restrictToAssignedOnly = false,
}: CampaignTasksBoardProps) {
  const { user } = useAuth();
  const isCreatorAccount =
    String(user?.accountType ?? "").toLowerCase() === "creator";
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<TaskFilter>(restrictToAssignedOnly ? "mine" : "all");
  const [addOpen, setAddOpen] = useState(false);
  const [addColumn, setAddColumn] = useState<BoardColumn>("todo");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [newAssigneeEmail, setNewAssigneeEmail] = useState("__unassigned__");
  const [newBudgetKsh, setNewBudgetKsh] = useState("");
  const [newAttachmentFile, setNewAttachmentFile] = useState<File | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignTask, setAssignTask] = useState<BoardItem | null>(null);
  const [assignEmail, setAssignEmail] = useState("__unassigned__");

  const { data: campaignTasks = [] } = useQuery({
    queryKey: ["tasks", "campaign", campaignId],
    queryFn: () => tasksApi.getByCampaign(campaignId),
    enabled: Number.isFinite(campaignId) && campaignId > 0,
  });

  const teamMembers = useMemo(() => {
    const list = teams?.flatMap((t) => t.members ?? []) ?? [];
    return list.slice(0, 8);
  }, [teams]);

  const assignableMembers = useMemo(() => {
    const list = teams?.flatMap((t) => t.members ?? []) ?? [];
    const seen = new Set<string>();
    return list
      .map((m) => {
        const email = String(m.email ?? "").trim().toLowerCase();
        const name = String(m.name ?? "").trim() || email;
        return { name, email };
      })
      .filter((m) => {
        if (!m.email) return false;
        if (seen.has(m.email)) return false;
        seen.add(m.email);
        return true;
      });
  }, [teams]);

  const boardItems = useMemo<BoardItem[]>(() => {
    const fromTasks = (campaignTasks ?? []).map((t: TaskListItem) => ({
      source: "task" as const,
      id: t.id,
      title: t.title,
      description: t.description ?? null,
      status: t.status ?? "Not Started",
      start: t.startDate ?? null,
      end: t.dueDate ?? null,
      ownerId: t.createdBy?.id ?? null,
      assigneeId: t.assignee?.id ?? null,
      assigneeEmail: t.assignee?.email ?? null,
      assigneeName:
        [t.assignee?.firstName ?? t.assignee?.firstname, t.assignee?.lastName ?? t.assignee?.lastname]
          .filter(Boolean)
          .join(" ")
          .trim() || t.assignee?.email || null,
      budgetKsh: t.budgetKsh ?? null,
      attachmentName: t.attachmentName ?? null,
    }));
    if (fromTasks.length > 0) return fromTasks;
    return (milestones ?? []).map((m) => ({
      source: "milestone" as const,
      id: m.id,
      title: m.title,
      description: m.description ?? null,
      status: m.status ?? "To-Do",
      start: m.start ?? null,
      end: m.end ?? null,
      ownerId: null,
      assigneeId: null,
      assigneeEmail: null,
      assigneeName: null,
    }));
  }, [campaignTasks, milestones]);

  const filteredMilestones = useMemo(() => {
    const list = boardItems;
    const effectiveFilter: TaskFilter = restrictToAssignedOnly ? "mine" : filter;
    // In collaborator-restricted mode, backend already returns only assigned tasks.
    // Avoid a second frontend user-id filter that can hide valid rows.
    if (restrictToAssignedOnly) {
      return list;
    }
    if (effectiveFilter === "mine") {
      const uid = user?.id ? Number(user.id) : NaN;
      if (!Number.isFinite(uid)) return [];
      return list.filter((m) => {
        if (m.source !== "task") return false;
        // Primary rule: tasks assigned to me.
        if (m.assigneeId != null) return m.assigneeId === uid;
        // Fallback: when assignee is not set, show tasks I created.
        return m.ownerId === uid;
      });
    }
    return list;
  }, [boardItems, filter, restrictToAssignedOnly, user?.id]);

  const columns = useMemo(() => {
    const todo: BoardItem[] = [];
    const inProgress: BoardItem[] = [];
    const completed: BoardItem[] = [];
    for (const m of filteredMilestones) {
      const col = statusToColumn(m.status);
      if (col === "completed") completed.push(m);
      else if (col === "inProgress") inProgress.push(m);
      else todo.push(m);
    }
    return { todo, inProgress, completed };
  }, [filteredMilestones]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
    queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    queryClient.invalidateQueries({ queryKey: ["tasks", "campaign", campaignId] });
    queryClient.invalidateQueries({ queryKey: ["tasks", "mine"] });
  };

  const addMutation = useMutation({
    mutationFn: async () => {
      const title = newTitle.trim();
      const description = newDescription.trim();
      if (!title || !description) {
        throw new Error("Title and description are required.");
      }
      const statusMap: Record<BoardColumn, "Not Started" | "In Progress" | "Done"> = {
        todo: "Not Started",
        inProgress: "In Progress",
        completed: "Done",
      };
      const rawBudget = newBudgetKsh.trim();
      let budgetKshPayload: string | undefined;
      if (rawBudget !== "") {
        const n = Number(rawBudget.replace(/,/g, ""));
        if (!Number.isFinite(n) || n < 0) {
          throw new Error("Enter a valid budget amount (KSh).");
        }
        budgetKshPayload = String(Math.round(n));
      }
      const attachmentName = newAttachmentFile?.name?.trim()
        ? newAttachmentFile.name.trim().slice(0, 500)
        : undefined;
      return tasksApi.create({
        campaignId,
        taskName: title,
        assigneeEmail: newAssigneeEmail === "__unassigned__" ? undefined : newAssigneeEmail,
        priority: "medium",
        status: statusMap[addColumn],
        startDate: newStart || new Date().toISOString().slice(0, 10),
        dueDate: newEnd || newStart || new Date().toISOString().slice(0, 10),
        description,
        ...(budgetKshPayload != null ? { budgetKsh: budgetKshPayload } : {}),
        ...(attachmentName != null ? { attachmentName } : {}),
      });
    },
    onSuccess: () => {
      toast.success("Task added");
      setAddOpen(false);
      setNewTitle("");
      setNewDescription("");
      setNewStart("");
      setNewEnd("");
      setNewAssigneeEmail("__unassigned__");
      setNewBudgetKsh("");
      setNewAttachmentFile(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message || "Failed to add task"),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      milestoneId,
      status,
    }: {
      milestoneId: number;
      status: CampaignMilestoneStatus;
    }) => {
      const item = filteredMilestones.find((m) => m.id === milestoneId);
      if (!item) throw new Error("Task not found");
      if (item.source === "task") {
        const taskStatus: "Not Started" | "In Progress" | "Done" =
          status === "Completed" ? "Done" : status === "In Progress" ? "In Progress" : "Not Started";
        return tasksApi.update(milestoneId, { status: taskStatus });
      }
      return campaignApi.updateMilestone(campaignId, milestoneId, { status });
    },
    onSuccess: () => {
      toast.success("Task updated");
      invalidate();
    },
    onError: () => toast.error("Could not update task"),
  });

  const deleteMutation = useMutation({
    mutationFn: (milestoneId: number) => {
      const item = filteredMilestones.find((m) => m.id === milestoneId);
      if (!item) throw new Error("Task not found");
      if (item.source === "task") return tasksApi.delete(milestoneId);
      return campaignApi.deleteMilestone(campaignId, milestoneId);
    },
    onSuccess: () => {
      toast.success("Task removed");
      invalidate();
    },
    onError: () => toast.error("Could not delete task"),
  });

  const assignMutation = useMutation({
    mutationFn: async (payload: { taskId: number; assigneeEmail?: string | null }) => {
      const row = await tasksApi.update(payload.taskId, {
        assigneeEmail: payload.assigneeEmail ?? null,
      });
      const expected = String(payload.assigneeEmail ?? "").trim().toLowerCase();
      const actual = String(row.assignee?.email ?? "").trim().toLowerCase();
      if (expected) {
        if (!actual || actual !== expected) {
          throw new Error("Assignment did not persist. Please verify selected member account.");
        }
      } else {
        if (row.assignee?.id != null || actual) {
          throw new Error("Unassign did not persist.");
        }
      }
      return row;
    },
    onSuccess: () => {
      toast.success("Assignee updated");
      setAssignOpen(false);
      setAssignTask(null);
      setAssignEmail("__unassigned__");
      invalidate();
    },
    onError: (e: unknown) => {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Could not update assignee";
      toast.error(msg);
    },
  });

  const openAdd = (col: BoardColumn) => {
    setAddColumn(col);
    setAddOpen(true);
    setNewAssigneeEmail("__unassigned__");
    setNewBudgetKsh("");
    setNewAttachmentFile(null);
  };

  const columnMeta: {
    key: BoardColumn;
    label: string;
  }[] = [
    { key: "todo", label: "To-Do" },
    { key: "inProgress", label: "In Progress" },
    { key: "completed", label: "Completed" },
  ];

  const isItemBusy = (itemId?: number) => {
    const updateId = updateStatusMutation.variables?.milestoneId;
    const deleteId = deleteMutation.variables;
    return (
      (updateStatusMutation.isPending && updateId != null && updateId === itemId) ||
      (deleteMutation.isPending && deleteId != null && deleteId === itemId)
    );
  };

  const handleMove = (item: BoardItem, nextStatus: CampaignMilestoneStatus) => {
    if (!item.id) return;
    const current = statusToColumn(item.status);
    const next = statusToColumn(nextStatus);
    if (current === next) return;
    updateStatusMutation.mutate({
      milestoneId: item.id,
      status: nextStatus,
    });
  };

  const handleDelete = (item: BoardItem) => {
    if (!item.id) return;
    deleteMutation.mutate(item.id);
  };

  const openAssign = (item: BoardItem) => {
    if (!item.id || item.source !== "task") return;
    setAssignTask(item);
    setAssignEmail(item.assigneeEmail ?? "__unassigned__");
    setAssignOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold tracking-tight md:text-2xl">
          {restrictToAssignedOnly ? "My Assigned Tasks" : "Campaign Tasks"}
        </h2>
        {restrictToAssignedOnly ? null : (
          <div className="inline-flex rounded-lg border border-border bg-muted/40 p-1">
            <Button
              type="button"
              variant={filter === "all" ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "rounded-md px-4",
                filter === "all" && "bg-zinc-800 text-foreground shadow-sm"
              )}
              onClick={() => setFilter("all")}
            >
              All Tasks
            </Button>
            <Button
              type="button"
              variant={filter === "mine" ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "rounded-md px-4",
                filter === "mine" && "bg-zinc-800 text-foreground shadow-sm"
              )}
              onClick={() => setFilter("mine")}
            >
              My Tasks
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {columnMeta.map(({ key, label }) => {
          const items = columns[key];
          return (
            <div
              key={key}
              className="flex min-h-[min(70vh,520px)] flex-col rounded-xl border border-border/80 bg-muted/20 p-3 dark:bg-zinc-900/40"
            >
              <div className="mb-3 flex items-center justify-between gap-2 px-1">
                <span className="text-sm font-semibold text-foreground">
                  {label}
                </span>
                <Badge
                  variant="secondary"
                  className="h-6 min-w-6 rounded-full px-2 text-xs tabular-nums"
                >
                  {items.length}
                </Badge>
              </div>

              <div className="flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
                {items.length === 0 ? (
                  <p className="px-1 py-6 text-center text-xs text-muted-foreground">
                    {filter === "mine"
                      ? "No tasks assigned to you in this column."
                      : "No tasks in this column yet."}
                  </p>
                ) : (
                  items.map((m, idx) => {
                    const mid = m.id;
                    const currentColumn = statusToColumn(m.status);
                    const busy = isItemBusy(mid);
                    const pct =
                      m.source === "milestone"
                        ? milestoneProgressPercent({
                            id: m.id,
                            title: m.title,
                            description: m.description ?? undefined,
                            start: m.start ?? undefined,
                            end: m.end ?? undefined,
                            status: (m.status as CampaignMilestoneStatus) ?? "To-Do",
                          })
                        : m.status === "Done"
                          ? 100
                          : m.status === "In Progress"
                            ? 55
                            : 12;
                    const startStr = m.start
                      ? new Date(m.start).toLocaleDateString()
                      : "—";
                    const endStr = m.end
                      ? new Date(m.end).toLocaleDateString()
                      : "—";
                    return (
                      <article
                        key={mid ?? `${m.title}-${idx}`}
                        className="rounded-lg border border-border/70 bg-card p-3 shadow-sm"
                      >
                        <div className="flex items-start gap-2">
                          <button
                            type="button"
                            className="mt-0.5 text-muted-foreground hover:text-foreground"
                            aria-label="Task"
                          >
                            <Circle className="h-4 w-4" />
                          </button>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-sm font-semibold leading-snug">
                              {m.title || "Untitled task"}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                                aria-label="Task actions"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                disabled={!mid || busy || currentColumn === "todo"}
                                onClick={() => handleMove(m, "To-Do")}
                              >
                                Move to To-Do
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                disabled={!mid || busy || currentColumn === "inProgress"}
                                onClick={() => handleMove(m, "In Progress")}
                              >
                                Move to In Progress
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                disabled={!mid || busy || currentColumn === "completed"}
                                onClick={() => handleMove(m, "Completed")}
                              >
                                Mark completed
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {!restrictToAssignedOnly && !isCreatorAccount ? (
                                <>
                                  <DropdownMenuItem
                                    disabled={!mid || busy || m.source !== "task"}
                                    onClick={() => openAssign(m)}
                                  >
                                    Assign / Change assignee
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    disabled={!mid || busy}
                                    onClick={() => handleDelete(m)}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </>
                              ) : null}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="mt-3 space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            <span>Progress</span>
                            <span>{pct}%</span>
                          </div>
                          <Progress
                            value={pct}
                            className="h-2 bg-muted/80 [&_[data-slot=progress-indicator]]:bg-emerald-600"
                          />
                          <p className="text-[11px] text-muted-foreground">
                            {pct >= 100
                              ? "Completed 100%"
                              : `In progress — ${pct}%`}
                          </p>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                            Start: {startStr}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                            End: {endStr}
                          </span>
                        </div>
                        {m.source === "task" &&
                        (m.budgetKsh || m.attachmentName) ? (
                          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                            {m.budgetKsh ? (
                              <span className="font-medium text-foreground">
                                Budget:{" "}
                                {Number.isFinite(Number(m.budgetKsh))
                                  ? Number(m.budgetKsh).toLocaleString()
                                  : m.budgetKsh}{" "}
                                KSh
                              </span>
                            ) : null}
                            {m.attachmentName ? (
                              <span
                                className="inline-flex max-w-full items-center gap-1"
                                title={m.attachmentName}
                              >
                                <Paperclip className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">
                                  {m.attachmentName}
                                </span>
                              </span>
                            ) : null}
                          </div>
                        ) : null}

                        <div className="mt-3 flex items-center justify-end gap-2 border-t border-border/60 pt-2">
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-foreground"
                            aria-label="Comments"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </button>
                          <div className="flex -space-x-2">
                            {teamMembers.slice(0, 4).map((mem, i) => (
                              <Avatar
                                key={`${mem.email ?? mem.name}-${i}`}
                                className="h-7 w-7 border-2 border-background text-[10px]"
                              >
                                <AvatarFallback className="bg-orange-500/20 text-[10px] font-medium text-foreground">
                                  {initials(mem.name || mem.email || "?")}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>

              {!restrictToAssignedOnly && !isCreatorAccount ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="mt-3 w-full justify-center gap-2 border border-dashed border-border/80 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  onClick={() => openAdd(key)}
                >
                  <Plus className="h-4 w-4" />
                  Add task
                </Button>
              ) : null}
            </div>
          );
        })}
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              New task —{" "}
              {addColumn === "todo"
                ? "To-Do"
                : addColumn === "inProgress"
                  ? "In Progress"
                  : "Completed"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Creating a new app"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-desc">Description</Label>
              <Textarea
                id="task-desc"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="What needs to be done?"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="task-start">Start date</Label>
                <Input
                  id="task-start"
                  type="date"
                  value={newStart}
                  onChange={(e) => setNewStart(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-end">End date</Label>
                <Input
                  id="task-end"
                  type="date"
                  value={newEnd}
                  onChange={(e) => setNewEnd(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-assignee">Assign to member</Label>
              <select
                id="task-assignee"
                value={newAssigneeEmail}
                onChange={(e) => setNewAssigneeEmail(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="__unassigned__">Unassigned</option>
                {assignableMembers.map((m) => (
                  <option key={m.email} value={m.email}>
                    {m.name} ({m.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-budget">Budget (KSh)</Label>
              <Input
                id="task-budget"
                type="text"
                inputMode="decimal"
                value={newBudgetKsh}
                onChange={(e) => setNewBudgetKsh(e.target.value)}
                placeholder="Optional"
                autoComplete="off"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-attachment">Attachment</Label>
              <Input
                id="task-attachment"
                type="file"
                className="cursor-pointer text-sm file:mr-2 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium"
                onChange={(e) => setNewAttachmentFile(e.target.files?.[0] ?? null)}
              />
              <p className="text-xs text-muted-foreground">
                The file name is saved with the task (upload storage is not used yet).
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setAddOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-orange-500 font-semibold text-black hover:bg-orange-600"
              disabled={addMutation.isPending}
              onClick={() => addMutation.mutate()}
            >
              {addMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Create task"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={assignOpen}
        onOpenChange={(open) => {
          setAssignOpen(open);
          if (!open) {
            setAssignTask(null);
            setAssignEmail("__unassigned__");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <p className="text-sm text-muted-foreground">
              {assignTask?.title ?? "Selected task"}
            </p>
            <div className="grid gap-2">
              <Label htmlFor="reassign-member">Member</Label>
              <select
                id="reassign-member"
                value={assignEmail}
                onChange={(e) => setAssignEmail(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="__unassigned__">Unassigned</option>
                {assignableMembers.map((m) => (
                  <option key={m.email} value={m.email}>
                    {m.name} ({m.email})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setAssignOpen(false);
                setAssignTask(null);
                setAssignEmail("__unassigned__");
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={assignMutation.isPending || !assignTask?.id}
              onClick={() => {
                if (!assignTask?.id) return;
                assignMutation.mutate({
                  taskId: assignTask.id,
                  assigneeEmail: assignEmail === "__unassigned__" ? null : assignEmail,
                });
              }}
            >
              {assignMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save assignee"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
