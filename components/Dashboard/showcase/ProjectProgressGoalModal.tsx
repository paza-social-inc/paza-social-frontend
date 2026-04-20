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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ProjectProgressGoal } from "@/types/projects/projectTypes";

function newGoalId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `goal-${Date.now()}`;
}

function formFromInitial(initial: ProjectProgressGoal | null): ProjectProgressGoal {
  if (!initial) {
    return {
      id: newGoalId(),
      title: "",
      objective: "",
      target: "",
      timeframeStart: "",
      timeframeEnd: "",
    };
  }
  return {
    id: initial.id || newGoalId(),
    title: initial.title ?? "",
    objective: initial.objective ?? "",
    target: initial.target ?? "",
    timeframeStart: initial.timeframeStart ?? "",
    timeframeEnd: initial.timeframeEnd ?? "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = form.title.trim();
    if (!title) return;
    onSave({ ...form, title });
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
            Set the objective and timeframe so brands see what you are working toward.
          </DialogDescription>
        </DialogHeader>
        <form id="progress-goal-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-title">Goal title</Label>
            <Input
              id="goal-title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Reach 100k impressions"
              className="min-h-11"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal-objective">Objective</Label>
            <Textarea
              id="goal-objective"
              rows={4}
              className="text-sm"
              value={form.objective ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, objective: e.target.value }))}
              placeholder="What success looks like, deliverables, or milestones…"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal-target">Target</Label>
            <Input
              id="goal-target"
              value={form.target ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, target: e.target.value }))}
              placeholder="e.g. 100K impressions, 500 signups, 30 deliverables"
              className="min-h-11"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="goal-start">Time frame start</Label>
              <Input
                id="goal-start"
                type="date"
                className="min-h-11"
                value={form.timeframeStart ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, timeframeStart: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-end">Time frame end</Label>
              <Input
                id="goal-end"
                type="date"
                className="min-h-11"
                value={form.timeframeEnd ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, timeframeEnd: e.target.value }))}
              />
            </div>
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
