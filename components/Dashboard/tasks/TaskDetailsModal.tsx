"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Task } from "@/components/Dashboard/tasks/TasksTab";
import {
  FileText,
  ImageIcon,
  Loader2,
  Maximize2,
  Minimize2,
  Paperclip,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { appendFrontendTaskNotification } from "@/lib/frontendTaskNotifications";

function formatDisplayDate(iso?: string) {
  if (!iso) return "—";
  if (iso.includes("-")) {
    const [y, m, d] = iso.split("-").map((x) => Number(x));
    if ([y, m, d].every((n) => Number.isFinite(n))) {
      return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "numeric",
        year: "numeric",
      });
    }
  }
  const dt = new Date(iso);
  return Number.isNaN(dt.getTime())
    ? iso
    : dt.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "numeric",
        year: "numeric",
      });
}

function formatDateTime(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

function statusPillClass(status?: string) {
  const s = (status ?? "").toLowerCase();
  if (s.includes("progress"))
    return "bg-amber-500/20 text-amber-300 border-amber-500/40";
  if (s.includes("review"))
    return "bg-sky-500/20 text-sky-300 border-sky-500/40";
  if (s.includes("done") || s.includes("complete"))
    return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
  return "bg-zinc-600/40 text-zinc-300 border-zinc-500/50";
}

function milestoneFromStatus(status?: Task["status"]): number {
  if (status === "Done") return 100;
  if (status === "Review") return 85;
  if (status === "In Progress") return 65;
  return 15;
}

function fileExt(name: string): string {
  const m = /\.([^.]+)$/.exec(name);
  return (m?.[1] ?? "").toLowerCase();
}

function attachmentKind(
  name: string
): "pdf" | "image" | "other" {
  const ext = fileExt(name);
  if (ext === "pdf") return "pdf";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(ext))
    return "image";
  return "other";
}

const WORKFLOW: NonNullable<Task["status"]>[] = [
  "Not Started",
  "In Progress",
  "Review",
  "Done",
];

type TaskCommentRow = {
  id: string;
  body: string;
  authorName: string;
  at: string;
};

function taskCommentsStorageKey(taskId: string): string {
  return `paza-task-comments-v1:${taskId}`;
}

function loadTaskCommentsFromStorage(taskId: string): TaskCommentRow[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(taskCommentsStorageKey(taskId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (c): c is TaskCommentRow =>
        Boolean(c) &&
        typeof (c as TaskCommentRow).id === "string" &&
        typeof (c as TaskCommentRow).body === "string" &&
        typeof (c as TaskCommentRow).authorName === "string" &&
        typeof (c as TaskCommentRow).at === "string"
    );
  } catch {
    return [];
  }
}

function saveTaskCommentsToStorage(taskId: string, rows: TaskCommentRow[]): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(taskCommentsStorageKey(taskId), JSON.stringify(rows));
  } catch {
    // ignore quota / private mode
  }
}

export interface TaskDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  /** Assignee (not task creator): no edit/delete/upload; comments + workflow tabs only. */
  readOnlyTaskMetadata?: boolean;
  onMarkComplete?: (task: Task) => void;
  /** When set (e.g. creator assignee), workflow stages are tappable to change status in the parent UI. */
  onWorkflowStatusChange?: (task: Task, status: NonNullable<Task["status"]>) => void;
  /** Brand (or business/individual) who created the task — show local-only comment composer. */
  canComposeBrandTaskComments?: boolean;
  /** Display name stored on each posted comment (e.g. brand contact). */
  taskCommentAuthorName?: string;
  onRequestEdit?: (task: Task) => void;
  onDeleted?: (task: Task) => Promise<void> | void;
}

export function TaskDetailsModal({
  open,
  onOpenChange,
  task,
  readOnlyTaskMetadata = false,
  onMarkComplete,
  onWorkflowStatusChange,
  canComposeBrandTaskComments = false,
  taskCommentAuthorName = "",
  onRequestEdit,
  onDeleted,
}: TaskDetailsModalProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [confirmingDelete, setConfirmingDelete] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [taskComments, setTaskComments] = React.useState<TaskCommentRow[]>([]);
  const [commentDraft, setCommentDraft] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      setExpanded(false);
      setConfirmingDelete(false);
      setDeleting(false);
    }
  }, [open]);

  React.useEffect(() => {
    if (!open || !task?.id) {
      setTaskComments([]);
      setCommentDraft("");
      return;
    }
    setTaskComments(loadTaskCommentsFromStorage(task.id));
    setCommentDraft("");
  }, [open, task?.id]);

  const milestone =
    task?.milestonePercent ?? milestoneFromStatus(task?.status);
  const budgetDisplay = task?.budgetKsh?.trim()
    ? task.budgetKsh.startsWith("K")
      ? task.budgetKsh
      : `Ksh. ${task.budgetKsh}`
    : "—";

  const spentDisplay = task?.spentKsh?.trim()
    ? task.spentKsh.startsWith("K")
      ? task.spentKsh
      : `Ksh. ${task.spentKsh}`
    : "—";
  const hasTrackedSpend = Boolean(task?.spentKsh?.trim());

  const campaignLabel = task?.campaignTitle?.trim() || null;
  const labelBadges = (task?.labels ?? []).filter(Boolean);

  const creatorName = task?.createdBy?.name?.trim() || "—";
  const creatorAvatar = task?.createdBy?.avatar;

  const assigneeName = task?.assignee?.trim();
  const hasAssignee = Boolean(assigneeName);

  const attachmentName = task?.attachmentName?.trim();
  const attKind = attachmentName ? attachmentKind(attachmentName) : null;

  const canComplete = task && task.status !== "Done";
  const workflowInteractive = Boolean(task && onWorkflowStatusChange);

  const postBrandComment = () => {
    if (!task || !canComposeBrandTaskComments) return;
    const body = commentDraft.trim();
    if (!body) {
      toast.error("Write a comment first");
      return;
    }
    if (body.length > 2000) {
      toast.error("Comment is too long (max 2000 characters)");
      return;
    }
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now());
    const row: TaskCommentRow = {
      id,
      body,
      authorName: String(taskCommentAuthorName || "You").trim() || "You",
      at: new Date().toISOString(),
    };
    const next = [...taskComments, row];
    setTaskComments(next);
    saveTaskCommentsToStorage(task.id, next);
    setCommentDraft("");
    toast.success("Comment added");
    appendFrontendTaskNotification({
      action: `Local comment saved on “${task.title.trim()}”. Open Tasks to continue.`,
      href: "/tasks",
    });
  };

  const handleMarkComplete = () => {
    if (!task || !canComplete) return;
    onMarkComplete?.(task);
    onOpenChange(false);
  };

  const runDelete = async () => {
    if (!task || !onDeleted) return;
    setDeleting(true);
    try {
      await onDeleted(task);
      toast.success("Task deleted");
      setConfirmingDelete(false);
      onOpenChange(false);
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data
          ?.message;
      toast.error(typeof msg === "string" ? msg : "Could not delete task");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "flex max-h-[min(92vh,900px)] flex-col gap-0 overflow-hidden border-zinc-800 bg-zinc-950 p-0 text-zinc-100 shadow-2xl",
          expanded ? "max-w-[min(96vw,1200px)]" : "max-w-[min(96vw,640px)]",
          "duration-200"
        )}
      >
        <DialogTitle className="sr-only">
          {task ? task.title : "Task details"}
        </DialogTitle>

        {task ? (
          <div className="relative flex min-h-0 flex-1 flex-col">
            <>
              <div className="flex items-start justify-between gap-3 border-b border-zinc-800 px-5 py-4">
                <div className="min-w-0">
                  <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                    {task.title}
                  </h2>
                  {campaignLabel ? (
                    <p className="mt-1 truncate text-xs text-zinc-500">
                      Campaign:{" "}
                      <span className="text-zinc-400">{campaignLabel}</span>
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
                  {onRequestEdit ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-zinc-400 hover:bg-zinc-800 hover:text-orange-400"
                      aria-label="Edit task"
                      onClick={() => onRequestEdit(task)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  ) : null}
                  {onDeleted ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-zinc-400 hover:bg-red-950/50 hover:text-red-400"
                      aria-label="Delete task"
                      onClick={() => setConfirmingDelete(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    onClick={() => setExpanded((v) => !v)}
                    aria-label={expanded ? "Shrink modal" : "Expand modal"}
                  >
                    {expanded ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    onClick={() => onOpenChange(false)}
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="space-y-4 border-b border-zinc-800 px-5 py-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-zinc-500">Status</p>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full border px-3 py-0.5 text-xs font-medium",
                          statusPillClass(task.status)
                        )}
                      >
                        {task.status ?? "Not Started"}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-zinc-500">
                        Progress
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Estimated from workflow status (not a separate milestone
                        record).
                      </p>
                      <div className="flex items-center gap-3">
                        <Progress
                          value={milestone}
                          className="h-2 flex-1 bg-zinc-800 [&>div]:bg-emerald-500"
                        />
                        <span className="text-sm font-semibold tabular-nums text-white">
                          {milestone}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <span className="text-sm text-zinc-400">Budget: </span>
                      <span className="text-sm font-medium text-white">
                        {budgetDisplay}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-zinc-400">Spent: </span>
                      <span className="text-sm font-medium text-white">
                        {spentDisplay}
                      </span>
                      {!hasTrackedSpend ? (
                        <span className="ml-1 text-xs text-zinc-500">
                          (not tracked in app)
                        </span>
                      ) : null}
                    </div>
                    <div>
                      <span className="text-sm text-zinc-400">Start date: </span>
                      <span className="text-sm text-white">
                        {formatDisplayDate(task.startDate)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-zinc-400">Due date: </span>
                      <span className="text-sm text-white">
                        {formatDisplayDate(task.dueDate)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-zinc-400">Priority:</span>
                    <span
                      className={cn(
                        "text-sm font-bold capitalize",
                        task.priority === "high"
                          ? "text-red-400"
                          : task.priority === "medium"
                            ? "text-amber-400"
                            : "text-zinc-300"
                      )}
                    >
                      {task.priority}
                    </span>
                  </div>

                  {labelBadges.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-zinc-400">Tags:</span>
                      {labelBadges.map((lb) => (
                        <Badge
                          key={lb}
                          className="border-0 bg-zinc-700 capitalize text-zinc-200"
                        >
                          {lb}
                        </Badge>
                      ))}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-zinc-400">Created by:</span>
                      <Avatar className="size-8 border border-zinc-700">
                        {creatorAvatar ? (
                          <AvatarImage src={creatorAvatar} alt="" />
                        ) : null}
                        <AvatarFallback className="bg-zinc-800 text-xs">
                          {creatorName.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-white">
                        {creatorName}
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                      <span className="text-sm text-zinc-400">Assignee:</span>
                      {hasAssignee ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="size-8 border border-zinc-700">
                            {task.assigneeAvatar ? (
                              <AvatarImage
                                src={task.assigneeAvatar}
                                alt=""
                              />
                            ) : null}
                            <AvatarFallback className="bg-zinc-800 text-xs">
                              {assigneeName!.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-white">
                            {assigneeName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-zinc-500">Unassigned</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-b border-zinc-800 px-5 py-4">
                  <h3 className="mb-2 text-sm font-semibold text-white">
                    Description
                  </h3>
                  {task.description?.trim() ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-zinc-400">
                      {task.description.trim()}
                    </p>
                  ) : (
                    <p className="text-sm text-zinc-500">No description.</p>
                  )}
                </div>

                <div className="border-b border-zinc-800 px-5 py-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">
                      Attachments
                    </h3>
                    {!readOnlyTaskMetadata ? (
                      <button
                        type="button"
                        className="text-sm font-medium text-orange-400 hover:underline"
                        onClick={() => toast("Upload attachment — coming soon")}
                      >
                        Upload
                      </button>
                    ) : null}
                  </div>
                  {attachmentName ? (
                    <div className="flex flex-wrap gap-3">
                      <div className="flex min-w-[160px] flex-1 flex-col rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
                        {attKind === "pdf" ? (
                          <FileText className="mb-2 h-8 w-8 text-orange-400" />
                        ) : attKind === "image" ? (
                          <ImageIcon className="mb-2 h-8 w-8 text-orange-400" />
                        ) : (
                          <Paperclip className="mb-2 h-8 w-8 text-orange-400" />
                        )}
                        <p className="line-clamp-2 text-sm font-medium text-white">
                          {attachmentName}
                        </p>
                        <p className="text-xs uppercase text-zinc-500">
                          {fileExt(attachmentName) || "file"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500">No attachments.</p>
                  )}
                  {attachmentName ? (
                    <button
                      type="button"
                      className="mt-2 text-xs font-medium text-orange-400 hover:underline disabled:opacity-50"
                      disabled
                      title="Download requires a stored file URL from the backend"
                    >
                      Download (link not available)
                    </button>
                  ) : null}
                </div>

                <div className="px-5 py-4">
                  {readOnlyTaskMetadata ? (
                    <p className="mb-3 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs leading-relaxed text-zinc-400">
                      You can&apos;t change title, dates, or other task details here.
                      {workflowInteractive
                        ? " Tap a workflow stage below (or drag the card on the board) to update status. Use Comments when available."
                        : " Move the card on the board to update workflow, and use Comments when available."}
                    </p>
                  ) : null}
                  <Tabs
                    key={`${task.id}-ro-${readOnlyTaskMetadata}`}
                    defaultValue={readOnlyTaskMetadata ? "milestones" : "comments"}
                    className="w-full"
                  >
                    <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
                      <TabsTrigger
                        value="comments"
                        className="relative rounded-none border-b-2 border-transparent px-3 py-2 text-zinc-400 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none"
                      >
                        Comments
                        <Badge className="ml-2 h-5 min-w-5 rounded-full bg-zinc-700 px-1.5 text-[10px] text-zinc-300">
                          {taskComments.length}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger
                        value="activity"
                        className="rounded-none border-b-2 border-transparent px-3 py-2 text-zinc-400 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none"
                      >
                        Activity
                      </TabsTrigger>
                      <TabsTrigger
                        value="milestones"
                        className="rounded-none border-b-2 border-transparent px-3 py-2 text-zinc-400 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none"
                      >
                        Workflow
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="comments" className="mt-4 space-y-4">
                      {taskComments.length === 0 ? (
                        <p className="text-sm text-zinc-500">
                          {canComposeBrandTaskComments
                            ? "No comments yet. Add one below — saved in this browser only until backend comments ship."
                            : "No comments yet."}
                        </p>
                      ) : (
                        <ul className="space-y-3">
                          {taskComments.map((c) => (
                            <li
                              key={c.id}
                              className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2.5"
                            >
                              <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <span className="text-xs font-semibold text-zinc-200">
                                  {c.authorName}
                                </span>
                                <time
                                  className="text-[10px] text-zinc-500 tabular-nums"
                                  dateTime={c.at}
                                >
                                  {formatDateTime(c.at)}
                                </time>
                              </div>
                              <p className="mt-1.5 whitespace-pre-wrap wrap-anywhere text-sm leading-relaxed text-zinc-300">
                                {c.body}
                              </p>
                            </li>
                          ))}
                        </ul>
                      )}
                      {canComposeBrandTaskComments ? (
                        <div className="space-y-2 border-t border-zinc-800 pt-4">
                          <label htmlFor="task-brand-comment" className="text-xs font-medium text-zinc-400">
                            Add a comment
                          </label>
                          <Textarea
                            id="task-brand-comment"
                            value={commentDraft}
                            onChange={(e) => setCommentDraft(e.target.value)}
                            placeholder="Message the assignee…"
                            rows={4}
                            className="min-h-[100px] border-zinc-700 bg-zinc-900/80 text-zinc-100 placeholder:text-zinc-600"
                            maxLength={2000}
                          />
                          <div className="flex justify-end">
                            <Button
                              type="button"
                              className="bg-orange-500 font-semibold text-black hover:bg-orange-400"
                              onClick={postBrandComment}
                              disabled={!commentDraft.trim()}
                            >
                              Post comment
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-zinc-600">
                          Only the teammate who created this task can add comments here.
                        </p>
                      )}
                    </TabsContent>
                    <TabsContent value="activity" className="mt-4 space-y-3">
                      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm">
                        <span className="text-zinc-500">Created: </span>
                        <span className="text-zinc-300">
                          {formatDateTime(task.createdAt)}
                        </span>
                      </div>
                      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm">
                        <span className="text-zinc-500">Last updated: </span>
                        <span className="text-zinc-300">
                          {formatDateTime(task.updatedAt)}
                        </span>
                      </div>
                    </TabsContent>
                    <TabsContent value="milestones" className="mt-4">
                      <p className="mb-3 text-xs text-zinc-500">
                        {workflowInteractive
                          ? "Tap a stage to set the task status. You can still drag the card on the board."
                          : readOnlyTaskMetadata
                            ? "Drag this task between columns on the board to change status. Stages below show the current step."
                            : "Workflow stages for this task. Current stage is highlighted."}
                      </p>
                      <ol className="space-y-2">
                        {WORKFLOW.map((st) => {
                          const isCurrent = task.status === st;
                          const rowClass = cn(
                            "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                            isCurrent
                              ? "border-orange-500/60 bg-orange-500/10 text-white"
                              : "border-zinc-800 bg-zinc-900/40 text-zinc-400",
                            workflowInteractive &&
                              !isCurrent &&
                              "cursor-pointer hover:border-orange-500/40 hover:bg-orange-500/5 hover:text-zinc-200",
                            workflowInteractive && isCurrent && "cursor-default"
                          );
                          if (workflowInteractive && onWorkflowStatusChange) {
                            return (
                              <li key={st} className="list-none">
                                <button
                                  type="button"
                                  className={rowClass}
                                  onClick={() => {
                                    if (task.status === st) return;
                                    onWorkflowStatusChange(task, st);
                                  }}
                                  aria-current={isCurrent ? "step" : undefined}
                                  aria-label={
                                    isCurrent ? `${st}, current stage` : `Set status to ${st}`
                                  }
                                >
                                  <span
                                    className={cn(
                                      "size-2 shrink-0 rounded-full",
                                      isCurrent ? "bg-orange-500" : "bg-zinc-600"
                                    )}
                                  />
                                  {st}
                                  {isCurrent ? (
                                    <Badge className="ml-auto border-orange-500/40 bg-orange-500/20 text-[10px] text-orange-200">
                                      Current
                                    </Badge>
                                  ) : null}
                                </button>
                              </li>
                            );
                          }
                          return (
                            <li key={st} className={rowClass}>
                              <span
                                className={cn(
                                  "size-2 shrink-0 rounded-full",
                                  isCurrent ? "bg-orange-500" : "bg-zinc-600"
                                )}
                              />
                              {st}
                              {isCurrent ? (
                                <Badge className="ml-auto border-orange-500/40 bg-orange-500/20 text-[10px] text-orange-200">
                                  Current
                                </Badge>
                              ) : null}
                            </li>
                          );
                        })}
                      </ol>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-zinc-800 bg-zinc-950 px-5 py-4 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 border-zinc-600 bg-transparent text-white hover:bg-zinc-800"
                  onClick={() => onOpenChange(false)}
                >
                  Back
                </Button>
                {!workflowInteractive ? (
                  <Button
                    type="button"
                    disabled={!canComplete}
                    className="h-11 bg-orange-500 font-semibold text-black hover:bg-orange-400 disabled:opacity-40"
                    onClick={handleMarkComplete}
                  >
                    Mark as Completed
                  </Button>
                ) : null}
              </div>
            </>

            {confirmingDelete && task ? (
              <div
                className="absolute inset-0 z-50 flex items-center justify-center rounded-lg bg-black/75 p-4 backdrop-blur-sm"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="task-delete-title"
              >
                <div className="w-full max-w-sm rounded-xl border border-zinc-700 bg-zinc-900 p-5 shadow-xl">
                  <h3
                    id="task-delete-title"
                    className="text-lg font-semibold text-white"
                  >
                    Delete task?
                  </h3>
                  <p className="mt-2 text-sm text-zinc-400">
                    &quot;{task.title}&quot; will be removed permanently. This
                    cannot be undone.
                  </p>
                  <div className="mt-5 flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-zinc-600 bg-transparent text-white hover:bg-zinc-800"
                      disabled={deleting}
                      onClick={() => setConfirmingDelete(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700"
                      disabled={deleting}
                      onClick={() => void runDelete()}
                    >
                      {deleting ? (
                        <Loader2
                          className="mr-2 h-4 w-4 animate-spin"
                          aria-hidden
                        />
                      ) : null}
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
