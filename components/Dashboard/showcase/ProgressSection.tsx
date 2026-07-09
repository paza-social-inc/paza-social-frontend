"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { format, parseISO } from "date-fns";
import { Calendar, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { projectsApi } from "@/lib/data/projects";
import type {
  Project,
  ProjectProgress,
  ProjectProgressGoal,
  ProjectProgressObjective,
  ProjectProgressUpdate,
} from "@/types/projects/projectTypes";
import { ProjectProgressGoalModal } from "./ProjectProgressGoalModal";

const EMPTY_PROGRESS: ProjectProgress = {
  reachTarget: "",
  reachAchieved: "",
  reachPercent: 0,
  completed: false,
  goals: [],
};

function clampPercent(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function newId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeProgressUpdate(raw: unknown): ProjectProgressUpdate | null {
  if (raw == null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = String(o.id ?? "").trim() || newId("upd");
  const achieved = Number.isFinite(Number(o.achieved)) ? Number(o.achieved) : 0;
  const note = String(o.note ?? "").trim() || undefined;
  const date = String(o.date ?? "").trim() || new Date().toISOString();
  return { id, achieved, note, date };
}

function normalizeObjective(raw: unknown): ProjectProgressObjective | null {
  if (raw == null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id =
    String(o.id ?? "").trim() ||
    (typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `obj-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const historyRaw = o.history;
  const history = Array.isArray(historyRaw)
    ? (historyRaw.map(normalizeProgressUpdate).filter(Boolean) as ProjectProgressUpdate[])
    : [];
  return {
    id,
    text: String(o.text ?? "").trim(),
    target: Number.isFinite(Number(o.target)) ? Number(o.target) : 0,
    achieved: Number.isFinite(Number(o.achieved)) ? Number(o.achieved) : 0,
    timeframeStart: String(o.timeframeStart ?? "").slice(0, 10),
    timeframeEnd: String(o.timeframeEnd ?? "").slice(0, 10),
    history,
  };
}

/** Append a new progress-update entry to one objective and bump its `achieved` value. */
function addProgressUpdate(
  goals: ProjectProgressGoal[],
  goalId: string,
  objectiveId: string,
  achieved: number,
  note: string
): ProjectProgressGoal[] {
  const entry: ProjectProgressUpdate = {
    id: newId("upd"),
    achieved,
    note: note.trim() || undefined,
    date: new Date().toISOString(),
  };
  return goals.map((g) => {
    if (g.id !== goalId) return g;
    return {
      ...g,
      objectives: g.objectives.map((o) =>
        o.id === objectiveId ? { ...o, achieved, history: [entry, ...(o.history ?? [])] } : o
      ),
    };
  });
}

function normalizeGoal(raw: unknown): ProjectProgressGoal | null {
  if (raw == null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const title = String(o.title ?? "").trim();
  if (!title) return null;
  const id =
    String(o.id ?? "").trim() ||
    (typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `goal-${Date.now()}`);
  const objectivesRaw = o.objectives;
  const objectives = Array.isArray(objectivesRaw)
    ? (objectivesRaw.map(normalizeObjective).filter(Boolean) as ProjectProgressObjective[])
    : [];
  return {
    id,
    title,
    objectives,
    progressNote: String(o.progressNote ?? ""),
  };
}

function goalPercent(goal: ProjectProgressGoal): number {
  const objectives = goal.objectives ?? [];
  const withTargets = objectives.filter((o) => o.target > 0);
  if (withTargets.length === 0) return 0;
  const sum = withTargets.reduce(
    (acc, o) => acc + Math.min(100, (o.achieved / o.target) * 100),
    0
  );
  return clampPercent(sum / withTargets.length);
}

function overallGoalsPercent(goals: ProjectProgressGoal[]): number {
  if (goals.length === 0) return 0;
  const sum = goals.reduce((acc, g) => acc + goalPercent(g), 0);
  return clampPercent(sum / goals.length);
}

function overallObjectivesDoneCount(goals: ProjectProgressGoal[]): { done: number; total: number } {
  let done = 0;
  let total = 0;
  for (const g of goals) {
    for (const o of g.objectives ?? []) {
      if (o.target > 0) {
        total += 1;
        if (o.achieved >= o.target) done += 1;
      }
    }
  }
  return { done, total };
}

/** Merge API `progress` with legacy flat fields used on mock / old payloads. */
export function mergeProgressFromProject(project: Project & Record<string, unknown>): ProjectProgress {
  const legacyTarget = String(project.reachTarget ?? "").trim() || undefined;
  const legacyAchieved = String(project.reachAchieved ?? "").trim() || undefined;
  const legacyPercent = clampPercent(Number(project.reachPercent));
  const legacyCompleted = Boolean(project.completed);

  const api = project.progress;
  if (api && typeof api === "object" && !Array.isArray(api)) {
    const p = api as Record<string, unknown>;
    const goalsRaw = p.goals;
    const goals = Array.isArray(goalsRaw)
      ? (goalsRaw.map(normalizeGoal).filter(Boolean) as ProjectProgressGoal[])
      : [];
    return {
      reachTarget: String(p.reachTarget ?? "").trim() || legacyTarget,
      reachAchieved: String(p.reachAchieved ?? "").trim() || legacyAchieved,
      reachPercent: Number.isFinite(Number(p.reachPercent))
        ? clampPercent(Number(p.reachPercent))
        : legacyPercent,
      completed: p.completed !== undefined ? Boolean(p.completed) : legacyCompleted,
      goals,
    };
  }
  return {
    reachTarget: legacyTarget,
    reachAchieved: legacyAchieved,
    reachPercent: legacyPercent,
    completed: legacyCompleted,
    goals: [],
  };
}

function formatDateLabel(iso: string | undefined): string {
  if (!iso?.trim()) return "—";
  try {
    const d = parseISO(iso.length === 10 ? `${iso}T12:00:00` : iso);
    if (Number.isNaN(d.getTime())) return iso;
    return format(d, "PP");
  } catch {
    return iso;
  }
}

function ProgressSummaryCard({
  percent,
  completed,
  status,
  onStatusChange,
  canEditStatus,
  goalsCount,
  objectivesDone,
  objectivesTotal,
}: {
  percent: number;
  completed: boolean;
  status: string;
  onStatusChange: (s: "Completed" | "In progress") => void;
  canEditStatus: boolean;
  goalsCount: number;
  objectivesDone: number;
  objectivesTotal: number;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border overflow-hidden",
        "bg-card dark:bg-[#2C2C2C] text-foreground"
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 p-4 sm:p-5">
        <div className="flex flex-col items-center sm:items-start gap-2 shrink-0">
          <Progress
            variant="radial"
            value={percent}
            size={72}
            strokeWidth={6}
            label=""
            className="shrink-0 text-primary [&_circle:last-of-type]:stroke-primary"
          />
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "h-2 w-2 rounded-full shrink-0",
                completed ? "bg-emerald-500" : "bg-amber-500"
              )}
            />
            {canEditStatus ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto py-0.5 px-0 text-sm font-medium text-foreground hover:bg-white/10 gap-0.5 touch-manipulation"
                  >
                    {status}
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-card border-border">
                  <DropdownMenuItem onClick={() => onStatusChange("Completed")}>
                    Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange("In progress")}>
                    In progress
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <span className="text-sm font-medium">{status}</span>
            )}
          </div>
        </div>

        <div className="w-full sm:w-32 shrink-0 space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Goals
          </p>
          <p className="text-sm font-medium text-foreground">
            {goalsCount} {goalsCount === 1 ? "goal" : "goals"}
          </p>
        </div>

        <div className="w-full sm:w-28 shrink-0 space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Achieved
          </p>
          <p className="text-sm font-medium text-foreground tabular-nums">
            {objectivesDone} / {objectivesTotal}
          </p>
        </div>

        <div className="w-full sm:w-40 shrink-0 space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Progress
          </p>
          <div className="flex items-center gap-2">
            <Progress
              value={percent}
              className="h-2 w-24 sm:w-28 shrink-0 bg-white/20 [&>div]:bg-emerald-500"
            />
            <span className="text-sm font-medium text-foreground tabular-nums shrink-0">
              {percent}%
            </span>
          </div>
        </div>

        <div className="w-full sm:w-32 hidden sm:block">
          <p className="text-xs text-muted-foreground leading-snug">
            Averaged across<br />all goal objectives
          </p>
        </div>
      </div>
    </div>
  );
}

type Props = {
  projectId: string;
  initial: ProjectProgress;
  canEdit: boolean;
};


/**
 * One objective's full detail, shown inside the goal popup: progress bar,
 * time frame, an inline "update progress" form scoped to this objective,
 * and a collapsible history of past updates (newest first).
 */
function ObjectiveDetailCard({
  objective,
  canEdit,
  onSaveUpdate,
}: {
  objective: ProjectProgressObjective;
  canEdit: boolean;
  onSaveUpdate: (achieved: number, note: string) => void;
}) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [achievedInput, setAchievedInput] = useState("");
  const [noteInput, setNoteInput] = useState("");

  const pct = objective.target > 0 ? clampPercent((objective.achieved / objective.target) * 100) : 0;
  const history = objective.history ?? [];

  const handleSave = () => {
    if (achievedInput.trim() === "" && noteInput.trim() === "") return;
    const achievedNum =
      achievedInput.trim() === "" ? objective.achieved : Math.max(0, Number(achievedInput) || 0);
    onSaveUpdate(achievedNum, noteInput);
    setAchievedInput("");
    setNoteInput("");
  };

  return (
    <div className="rounded-lg border border-border p-3 space-y-3">
      <div>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-sm font-medium text-foreground truncate">
            {objective.text || "Untitled objective"}
            {objective.target > 0 ? ` – ${objective.target.toLocaleString()}` : ""}
          </span>
          <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
            {objective.achieved.toLocaleString()} / {objective.target.toLocaleString()}
          </span>
        </div>
        <Progress value={pct} className="h-1.5" />
        {objective.timeframeStart || objective.timeframeEnd ? (
          <div className="mt-1.5 flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3 w-3 shrink-0" />
            <span className="text-xs">
              {formatDateLabel(objective.timeframeStart)} → {formatDateLabel(objective.timeframeEnd)}
            </span>
          </div>
        ) : null}
      </div>

      {canEdit ? (
        <div className="rounded-md border border-border/70 bg-muted/30 p-2.5 space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Update progress
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="number"
              min={0}
              inputMode="numeric"
              className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm sm:w-24"
              placeholder={objective.achieved.toLocaleString()}
              value={achievedInput}
              onChange={(e) => setAchievedInput(e.target.value)}
            />
            <input
              className="flex h-9 min-w-0 flex-1 rounded-md border border-input bg-background px-2 text-sm"
              placeholder="Add a note (optional)"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
            />
            <Button
              type="button"
              size="sm"
              className="shrink-0 bg-orange-500 font-semibold text-black hover:bg-orange-600"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      ) : null}

      {history.length > 0 ? (
        <div>
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs font-medium text-orange-500 hover:text-orange-600"
            onClick={() => setHistoryOpen((v) => !v)}
            aria-expanded={historyOpen}
          >
            <ChevronDown
              className={cn("h-3.5 w-3.5 transition-transform", historyOpen ? "rotate-180" : "")}
            />
            History ({history.length} update{history.length === 1 ? "" : "s"})
          </button>
          {historyOpen ? (
            <ol className="mt-2 space-y-2.5 border-l border-border pl-3">
              {history.map((h) => (
                <li key={h.id} className="text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground tabular-nums">
                      {h.achieved.toLocaleString()} achieved
                    </span>
                    <span className="text-muted-foreground/70">{formatDateLabel(h.date)}</span>
                  </div>
                  {h.note ? <p className="mt-0.5 text-muted-foreground">{h.note}</p> : null}
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function ProgressSection({ projectId, initial, canEdit }: Props) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<ProjectProgress>(() => ({
    ...EMPTY_PROGRESS,
    ...initial,
    goals: [...(initial.goals ?? [])],
  }));
  const [statusUi, setStatusUi] = useState<"Completed" | "In progress">(
    initial.completed ? "Completed" : "In progress"
  );
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [goalModalInitial, setGoalModalInitial] = useState<ProjectProgressGoal | null>(null);
  const [goalsExpanded, setGoalsExpanded] = useState(false);
  const [detailGoal, setDetailGoal] = useState<ProjectProgressGoal | null>(null);

  useEffect(() => {
    const next = { ...EMPTY_PROGRESS, ...initial, goals: [...(initial.goals ?? [])] };
    setDraft(next);
    setStatusUi(next.completed ? "Completed" : "In progress");
  }, [initial]);

  const percentDisplay = overallGoalsPercent(draft.goals ?? []);
  const completedDisplay = statusUi === "Completed";

  const saveMutation = useMutation({
    mutationFn: (payload: ProjectProgress) =>
      projectsApi.update(projectId, {
        progress: {
          reachTarget: payload.reachTarget?.trim() || undefined,
          reachAchieved: payload.reachAchieved?.trim() || undefined,
          reachPercent: clampPercent(payload.reachPercent ?? 0),
          completed: Boolean(payload.completed),
          goals: payload.goals ?? [],
        },
      }),
    onSuccess: () => {
      toast.success("Progress saved");
      queryClient.invalidateQueries({ queryKey: ["creator-projects", projectId] });
      queryClient.invalidateQueries({ queryKey: ["creator-projects"] });
    },
    onError: (err: unknown) => {
      const msg =
        String((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "").trim() ||
        "Could not save";
      toast.error(msg);
    },
  });

  const saveGoalsMutation = useMutation({
    mutationFn: (nextGoals: ProjectProgressGoal[]) =>
      projectsApi.update(projectId, {
        progress: {
          reachTarget: draft.reachTarget?.trim() || undefined,
          reachAchieved: draft.reachAchieved?.trim() || undefined,
          reachPercent:
            statusUi === "Completed" ? 100 : clampPercent(draft.reachPercent ?? 0),
          completed: statusUi === "Completed",
          goals: nextGoals,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-projects", projectId] });
      queryClient.invalidateQueries({ queryKey: ["creator-projects"] });
    },
    onError: (err: unknown) => {
      const msg =
        String((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "").trim() ||
        "Could not save goals";
      toast.error(msg);
    },
  });

  const handleStatusChange = (s: "Completed" | "In progress") => {
    setStatusUi(s);
    setDraft((d) => ({
      ...d,
      completed: s === "Completed",
      reachPercent: s === "Completed" ? 100 : d.reachPercent,
    }));
  };

  const openCreateGoal = () => {
    setGoalModalInitial(null);
    setGoalModalOpen(true);
  };

  const openEditGoal = (g: ProjectProgressGoal) => {
    setGoalModalInitial(g);
    setGoalModalOpen(true);
  };

  const handleGoalSave = (g: ProjectProgressGoal) => {
    const list = [...(draft.goals ?? [])];
    const idx = list.findIndex((x) => x.id === g.id);
    if (idx >= 0) list[idx] = g;
    else list.push(g);
    setDraft((d) => ({ ...d, goals: list }));
    saveGoalsMutation.mutate(list);
  };

  const removeGoal = (id: string) => {
    const nextGoals = (draft.goals ?? []).filter((g) => g.id !== id);
    setDraft((d) => ({ ...d, goals: nextGoals }));
    saveGoalsMutation.mutate(nextGoals);
    setDetailGoal((dg) => (dg?.id === id ? null : dg));
  };

  const handleObjectiveUpdate = (
    goalId: string,
    objectiveId: string,
    achieved: number,
    note: string
  ) => {
    const nextGoals = addProgressUpdate(draft.goals ?? [], goalId, objectiveId, achieved, note);
    setDraft((d) => ({ ...d, goals: nextGoals }));
    saveGoalsMutation.mutate(nextGoals);
    // Keep the open popup's data in sync so the new update/history shows immediately.
    setDetailGoal((dg) => (dg && dg.id === goalId ? nextGoals.find((g) => g.id === goalId) ?? dg : dg));
  };

  const goals = draft.goals ?? [];
  const GOALS_PREVIEW_COUNT = 6;
  const hasMoreGoals = goals.length > GOALS_PREVIEW_COUNT;
  const visibleGoals = goalsExpanded ? goals : goals.slice(0, GOALS_PREVIEW_COUNT);

  const payloadForSave = useMemo(
    () => ({
      ...draft,
      completed: statusUi === "Completed",
      reachPercent: statusUi === "Completed" ? 100 : overallGoalsPercent(draft.goals ?? []),
    }),
    [draft, statusUi]
  );

  return (
    <div className="space-y-10">
      {canEdit && (
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            type="button"
            size="sm"
            disabled={saveMutation.isPending}
            onClick={() =>
              saveMutation.mutate({
                ...payloadForSave,
                reachPercent:
                  statusUi === "Completed" ? 100 : overallGoalsPercent(draft.goals ?? []),
              })
            }
            className="touch-manipulation"
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Save progress"
            )}
          </Button>
        </div>
      )}

      <ProgressSummaryCard
          percent={statusUi === "Completed" ? 100 : percentDisplay}
          completed={completedDisplay}
          status={statusUi}
          onStatusChange={handleStatusChange}
          canEditStatus={canEdit}
          goalsCount={goals.length}
          objectivesDone={overallObjectivesDoneCount(goals).done}
          objectivesTotal={overallObjectivesDoneCount(goals).total}
        />



      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-foreground">Goals & objectives</h2>
            <span className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground">
              {goals.length}
            </span>
          </div>
          {canEdit ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-1 border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              onClick={openCreateGoal}
            >
              <Plus className="h-4 w-4" />
              Create goal
            </Button>
          ) : null}
        </div>
        {canEdit ? (
          <p className="text-xs text-muted-foreground -mt-1">
            Goal changes are saved automatically.
          </p>
        ) : null}

        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center">
            <p className="text-sm text-muted-foreground max-w-sm">
              {canEdit
                ? "No goals yet. Open the popup to add objectives and time frames."
                : "No goals published for this project yet."}
            </p>
            {canEdit ? (
              <Button
                type="button"
                size="default"
                className="gap-2 bg-orange-500 font-semibold text-black hover:bg-orange-600"
                onClick={openCreateGoal}
              >
                <Plus className="h-4 w-4" />
                Create goal
              </Button>
            ) : null}
          </div>
        ) : (
          <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleGoals.map((g) => (
              <Card
                key={g.id}
                className="border-border bg-card dark:bg-zinc-900/50 cursor-pointer transition-colors hover:border-orange-500/50"
                onClick={() => setDetailGoal(g)}
              >
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <CardTitle className="line-clamp-2 text-base font-semibold leading-tight pr-2">
                    {g.title}
                  </CardTitle>
                  {canEdit ? (
                    <div className="flex shrink-0 gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label="Edit goal"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditGoal(g);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        aria-label="Remove goal"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeGoal(g.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : null}
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <Progress
                          variant="radial"
                          value={goalPercent(g)}
                          size={44}
                          strokeWidth={4}
                          label=""
                          valueFontSize="0.7rem"
                          className="text-primary [&_circle:last-of-type]:stroke-primary"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Overall progress
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Averaged across objectives
                        </p>
                      </div>
                    </div>

                    {(g.objectives?.length ?? 0) > 0 ? (
                      <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Objectives
                        </p>
                        {g.objectives.map((o) => {
                          const pct = o.target > 0 ? clampPercent((o.achieved / o.target) * 100) : 0;
                          return (
                            <div key={o.id} className="rounded-lg border border-border p-2.5">
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="text-xs text-foreground truncate">
                                  {o.text || "Untitled objective"}
                                  {o.target > 0 ? ` – ${o.target.toLocaleString()}` : ""}
                                </span>
                                <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">
                                  {o.achieved.toLocaleString()} / {o.target.toLocaleString()}
                                </span>
                              </div>
                              <Progress value={pct} className="h-1.5" />
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </CardContent>
              </Card>
            ))}
          </div>
          {hasMoreGoals ? (
            <div className="flex justify-center pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="min-w-36"
                onClick={() => setGoalsExpanded((v) => !v)}
              >
                {goalsExpanded ? "Show fewer goals" : `Show all goals (${goals.length})`}
              </Button>
            </div>
          ) : null}
          </>
        )}
      </div>

      
      <Dialog open={detailGoal !== null} onOpenChange={(next) => !next && setDetailGoal(null)}>
        <DialogContent
          overlayClassName="z-200 bg-black/70 backdrop-blur-sm"
          className="z-201 max-h-[min(90vh,640px)] overflow-y-auto border-border shadow-2xl sm:max-w-2xl"
        >
          {detailGoal ? (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <Progress
                    variant="radial"
                    value={goalPercent(detailGoal)}
                    size={48}
                    strokeWidth={4}
                    label=""
                    valueFontSize="0.75rem"
                    className="shrink-0 text-primary [&_circle:last-of-type]:stroke-primary"
                  />
                  <div className="text-left">
                    <DialogTitle>{detailGoal.title}</DialogTitle>
                    <DialogDescription>Averaged across objectives</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {(detailGoal.objectives?.length ?? 0) > 0 ? (
                <div className="space-y-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Objectives
                  </p>
                  {detailGoal.objectives.map((o) => (
                    <ObjectiveDetailCard
                      key={o.id}
                      objective={o}
                      canEdit={canEdit}
                      onSaveUpdate={(achieved, note) =>
                        handleObjectiveUpdate(detailGoal.id, o.id, achieved, note)
                      }
                    />
                  ))}
                </div>
              ) : null}

              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => setDetailGoal(null)}>
                  Close
                </Button>
                {canEdit ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-1 border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
                    onClick={() => {
                      const g = detailGoal;
                      setDetailGoal(null);
                      openEditGoal(g);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit goal
                  </Button>
                ) : null}
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <ProjectProgressGoalModal
        open={goalModalOpen}
        onOpenChange={(next) => {
          setGoalModalOpen(next);
          if (!next) setGoalModalInitial(null);
        }}
        initial={goalModalInitial}
        onSave={handleGoalSave}
      />
    </div>
  );
}