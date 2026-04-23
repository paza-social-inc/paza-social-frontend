"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { format, parseISO } from "date-fns";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
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
  return {
    id,
    title,
    objective: String(o.objective ?? ""),
    target: String(o.target ?? o.goalTarget ?? ""),
    timeframeStart: String(o.timeframeStart ?? "").slice(0, 10),
    timeframeEnd: String(o.timeframeEnd ?? "").slice(0, 10),
  };
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
}: {
  percent: number;
  completed: boolean;
  status: string;
  onStatusChange: (s: "Completed" | "In progress") => void;
  canEditStatus: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border overflow-hidden",
        "bg-card dark:bg-[#2C2C2C] text-foreground"
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 sm:p-5">
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

        <div className="w-full sm:w-40 shrink-0 space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Progress
          </p>
          <div className="flex items-center gap-2">
            <Progress
              value={percent}
              className="h-2 flex-1 bg-white/20 [&>div]:bg-emerald-500"
            />
            <span className="text-sm font-medium text-foreground tabular-nums shrink-0">
              {percent}%
            </span>
          </div>
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

  useEffect(() => {
    const next = { ...EMPTY_PROGRESS, ...initial, goals: [...(initial.goals ?? [])] };
    setDraft(next);
    setStatusUi(next.completed ? "Completed" : "In progress");
  }, [initial]);

  const targetDisplay = draft.reachTarget?.trim() || "—";
  const achievedDisplay = draft.reachAchieved?.trim() || "—";
  const percentDisplay = clampPercent(draft.reachPercent ?? 0);
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
  };

  const goals = draft.goals ?? [];
  const GOALS_PREVIEW_COUNT = 6;
  const hasMoreGoals = goals.length > GOALS_PREVIEW_COUNT;
  const visibleGoals = goalsExpanded ? goals : goals.slice(0, GOALS_PREVIEW_COUNT);

  const payloadForSave = useMemo(
    () => ({
      ...draft,
      completed: statusUi === "Completed",
      reachPercent: statusUi === "Completed" ? 100 : clampPercent(draft.reachPercent ?? 0),
    }),
    [draft, statusUi]
  );

  return (
    <div className="space-y-6">
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
                  statusUi === "Completed" ? 100 : clampPercent(draft.reachPercent ?? 0),
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
      />

      {canEdit && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 rounded-lg border border-border bg-card/50 p-4 dark:bg-zinc-900/40">
          <p className="text-xs font-medium text-muted-foreground sm:col-span-3">
            Overall reach (optional — shown in the summary card)
          </p>
          <div>
            <label className="text-xs text-muted-foreground" htmlFor="prog-target">
              Target label
            </label>
            <input
              id="prog-target"
              className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={draft.reachTarget ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, reachTarget: e.target.value }))}
              placeholder="e.g. 500K impressions"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground" htmlFor="prog-achieved">
              Achieved label
            </label>
            <input
              id="prog-achieved"
              className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={draft.reachAchieved ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, reachAchieved: e.target.value }))}
              placeholder="e.g. 120K so far"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground" htmlFor="prog-pct">
              Progress %
            </label>
            <input
              id="prog-pct"
              type="number"
              min={0}
              max={100}
              className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={draft.reachPercent ?? 0}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  reachPercent: clampPercent(Number(e.target.value)),
                }))
              }
              disabled={statusUi === "Completed"}
            />
          </div>
        </div>
      )}

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
              <Card key={g.id} className="border-border bg-card dark:bg-zinc-900/50">
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
                        onClick={() => openEditGoal(g)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        aria-label="Remove goal"
                        onClick={() => removeGoal(g.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : null}
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {g.objective?.trim() ? (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Objective
                      </p>
                      <p className="mt-1 line-clamp-4 whitespace-pre-wrap text-muted-foreground">
                        {g.objective}
                      </p>
                    </div>
                  ) : null}
                  {g.target?.trim() ? (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Target
                      </p>
                      <p className="mt-1 text-foreground">{g.target}</p>
                    </div>
                  ) : null}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Time frame
                    </p>
                    <p className="mt-1 text-foreground">
                      {g.timeframeStart || g.timeframeEnd ? (
                        <>
                          {formatDateLabel(g.timeframeStart)} → {formatDateLabel(g.timeframeEnd)}
                        </>
                      ) : (
                        "—"
                      )}
                    </p>
                  </div>
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
