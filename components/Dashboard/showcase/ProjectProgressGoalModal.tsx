"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Plus, Trash2 } from "lucide-react";
import type {
  ProjectProgressGoal,
  ProjectProgressObjective,
} from "@/types/projects/projectTypes";

function newId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function emptyObjective(): ProjectProgressObjective {
  return {
    id: newId("obj"),
    text: "",
    target: 0,
    achieved: 0,
    timeframeStart: "",
    timeframeEnd: "",
  };
}

function formFromInitial(initial: ProjectProgressGoal | null): ProjectProgressGoal {
  if (!initial) {
    return {
      id: newId("goal"),
      title: "",
      objectives: [emptyObjective()],
      progressNote: "",
    };
  }
  return {
    id: initial.id || newId("goal"),
    title: initial.title ?? "",
    objectives:
      initial.objectives && initial.objectives.length > 0
        ? initial.objectives.map((o) => ({
            ...o,
            timeframeStart: o.timeframeStart ?? "",
            timeframeEnd: o.timeframeEnd ?? "",
          }))
        : [emptyObjective()],
    progressNote: initial.progressNote ?? "",
  };
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: ProjectProgressGoal | null;
  onSave: (goal: ProjectProgressGoal) => void;
};

export function ProjectProgressGoalModal({ open, onOpenChange, initial, onSave }: Props) {
  const [form, setForm] = useState<ProjectProgressGoal>(formFromInitial(null));

  useEffect(() => {
    if (!open) return;
    setForm(formFromInitial(initial));
  }, [open, initial]);

  const updateObjective = (id: string, patch: Partial<ProjectProgressObjective>) => {
    setForm((f) => ({
      ...f,
      objectives: f.objectives.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    }));
  };

  const addObjective = () => {
    setForm((f) => ({ ...f, objectives: [...f.objectives, emptyObjective()] }));
  };

  const removeObjective = (id: string) => {
    setForm((f) => ({
      ...f,
      objectives: f.objectives.length > 1 ? f.objectives.filter((o) => o.id !== id) : f.objectives,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = form.title.trim();
    if (!title) return;
    const cleanedObjectives = form.objectives
      .map((o) => ({ ...o, text: o.text.trim() }))
      .filter((o) => o.text !== "" || o.target > 0);
    onSave({
      ...form,
      title,
      objectives: cleanedObjectives.length > 0 ? cleanedObjectives : [emptyObjective()],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent
        overlayClassName="z-200 bg-black/70 backdrop-blur-sm"
        className="z-201 max-h-[min(90vh,640px)] overflow-y-auto border-border shadow-2xl sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle>{initial ? "Edit goal" : "Create goal"}</DialogTitle>
          <DialogDescription>
            Set the objectives so brands see what you are working toward.
          </DialogDescription>
        </DialogHeader>
        <form id="progress-goal-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-title">Goal title</Label>
            <Input
              id="goal-title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Public awareness"
              className="min-h-11"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Objectives</Label>
            <div className="space-y-3">
              {form.objectives.map((o) => (
                <div key={o.id} className="rounded-lg border border-border p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      value={o.text}
                      onChange={(e) => updateObjective(o.id, { text: e.target.value })}
                      placeholder="e.g. Improve views"
                      className="min-h-11 flex-1"
                    />
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={o.target === 0 ? "" : o.target}
                      onChange={(e) =>
                        updateObjective(o.id, {
                          target: e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)),
                        })
                      }
                      placeholder="Target"
                      className="min-h-11 w-28"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0 text-destructive hover:text-destructive"
                      aria-label="Remove objective"
                      onClick={() => removeObjective(o.id)}
                      disabled={form.objectives.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <Input
                      type="date"
                      aria-label="Objective time frame start"
                      className="min-h-11 flex-1"
                      value={o.timeframeStart ?? ""}
                      onChange={(e) => updateObjective(o.id, { timeframeStart: e.target.value })}
                    />
                    <span className="shrink-0 text-sm text-muted-foreground">to</span>
                    <Input
                      type="date"
                      aria-label="Objective time frame end"
                      className="min-h-11 flex-1"
                      value={o.timeframeEnd ?? ""}
                      onChange={(e) => updateObjective(o.id, { timeframeEnd: e.target.value })}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1 text-orange-500 hover:text-orange-600 hover:bg-orange-500/10 px-0"
              onClick={addObjective}
            >
              <Plus className="h-4 w-4" />
              Add another objective
            </Button>
          </div>
        </form>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="progress-goal-form"
            className="bg-orange-500 font-semibold text-black hover:bg-orange-600"
          >
            Save goal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}