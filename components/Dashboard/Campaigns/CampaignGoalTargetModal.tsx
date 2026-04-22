"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { campaignApi, normalizeCampaign } from "@/lib/data/campaigns";
import type { CampaignGoalDetail, CreateCampaignDto } from "@/types/campaigns/campaignTypes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function formatCampaignDeadlineDisplay(raw: string | null | undefined): string {
  if (raw == null || raw === "") return "—";
  const s = String(raw).trim();
  if (!s) return "—";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (m) {
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    if (!Number.isNaN(d.getTime())) return format(d, "PP");
  }
  try {
    const d = parseISO(s);
    if (!Number.isNaN(d.getTime())) return format(d, "PP");
  } catch {
    /* fall through */
  }
  const fb = new Date(s);
  return Number.isNaN(fb.getTime()) ? "—" : format(fb, "PP");
}

type Props = {
  campaignId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingGoals: string[];
  goalDetails?: CampaignGoalDetail[];
};

/**
 * Single form: optionally add a campaign goal and/or edit target number, deadline, and description.
 */
export function CampaignGoalTargetModal({
  campaignId,
  open,
  onOpenChange,
  existingGoals,
  goalDetails,
}: Props) {
  const queryClient = useQueryClient();
  const [goals, setGoals] = useState<CampaignGoalDetail[]>([]);
  const [goalText, setGoalText] = useState("");
  const [goalTargetInput, setGoalTargetInput] = useState("");
  const [goalDeadlineInput, setGoalDeadlineInput] = useState("");
  const [goalTargetDescriptionInput, setGoalTargetDescriptionInput] = useState("");

  useEffect(() => {
    if (!open) return;
    const normalizedFromDetails = Array.isArray(goalDetails)
      ? goalDetails
          .map((g) => {
            const rawTarget: unknown = g?.targetNumber;
            const targetNumber =
              rawTarget == null ||
              (typeof rawTarget === "string" && rawTarget.trim() === "")
                ? null
                : Number.isFinite(Number(rawTarget))
                  ? Math.trunc(Number(rawTarget))
                  : null;
            return {
            goal: String(g?.goal ?? "").trim(),
            targetNumber,
            deadline:
              g?.deadline == null || String(g.deadline).trim() === ""
                ? null
                : String(g.deadline).slice(0, 10),
            targetDescription:
              g?.targetDescription == null || String(g.targetDescription).trim() === ""
                ? null
                : String(g.targetDescription).trim(),
            };
          })
          .filter((g) => g.goal.length > 0)
      : [];
    setGoals(
      normalizedFromDetails.length > 0
        ? normalizedFromDetails
        : (existingGoals ?? [])
            .map((g) => String(g).trim())
            .filter(Boolean)
            .map((goal) => ({
              goal,
              targetNumber: null,
              deadline: null,
              targetDescription: null,
            }))
    );
    setGoalText("");
    setGoalTargetInput("");
    setGoalDeadlineInput("");
    setGoalTargetDescriptionInput("");
  }, [open, goalDetails, existingGoals]);

  const addGoal = () => {
    const trimmedGoal = goalText.trim();
    if (!trimmedGoal) return;
    const exists = goals.some((g) => g.goal.trim().toLowerCase() === trimmedGoal.toLowerCase());
    if (exists) {
      toast.error("That goal is already listed");
      return;
    }
    const targetRaw = goalTargetInput.trim();
    const targetNumber =
      targetRaw === ""
        ? null
        : Number.isFinite(Number(targetRaw))
          ? Math.trunc(Number(targetRaw))
          : null;
    if (targetRaw !== "" && targetNumber == null) {
      toast.error("Enter a valid target number");
      return;
    }
    const deadline = goalDeadlineInput.trim() === "" ? null : goalDeadlineInput.trim();
    const targetDescription =
      goalTargetDescriptionInput.trim() === ""
        ? null
        : goalTargetDescriptionInput.trim().slice(0, 2000);
    setGoals((prev) => [...prev, { goal: trimmedGoal, targetNumber, deadline, targetDescription }]);
    setGoalText("");
    setGoalTargetInput("");
    setGoalDeadlineInput("");
    setGoalTargetDescriptionInput("");
  };

  const removeGoal = (idx: number) => {
    setGoals((prev) => prev.filter((_, i) => i !== idx));
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: Partial<CreateCampaignDto> = {
        goals: goals.map((g) => g.goal),
        goalDetails: goals,
      };
      return campaignApi.update(campaignId, payload);
    },
    onSuccess: (updated) => {
      toast.success("Goals & target saved");
      queryClient.setQueryData(["campaign", campaignId], normalizeCampaign(updated));
      void queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
      void queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      // Jobs linked to this campaign should reflect updated goals on the board and in job detail.
      void queryClient.invalidateQueries({ queryKey: ["jobs"] });
      void queryClient.invalidateQueries({ queryKey: ["job"] });
      onOpenChange(false);
    },
    onError: (err: unknown) => {
      const msg = String((err as Error)?.message ?? "");
      const api =
        String((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "").trim() ||
        "";
      toast.error(api || "Could not save");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Goals & target</DialogTitle>
          <DialogDescription>
            Add goals and set each goal&apos;s own target number, deadline, and target description.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-goal-input">Goal</Label>
              <Input
                id="campaign-goal-input"
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                placeholder="e.g. Increase sign-ups from creator content"
                className="min-h-11"
                maxLength={500}
                disabled={mutation.isPending}
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="campaign-goal-target-no">Target no. (optional)</Label>
                <Input
                  id="campaign-goal-target-no"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  className="min-h-11"
                  placeholder="e.g. 1000"
                  value={goalTargetInput}
                  onChange={(e) => setGoalTargetInput(e.target.value)}
                  disabled={mutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaign-goal-deadline">Deadline (optional)</Label>
                <Input
                  id="campaign-goal-deadline"
                  type="date"
                  className="min-h-11"
                  value={goalDeadlineInput}
                  onChange={(e) => setGoalDeadlineInput(e.target.value)}
                  disabled={mutation.isPending}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaign-goal-target-description">Target description (optional)</Label>
              <Textarea
                id="campaign-goal-target-description"
                className="min-h-[90px] resize-y"
                placeholder="e.g. Reach 454k impressions across Instagram and TikTok."
                value={goalTargetDescriptionInput}
                onChange={(e) => setGoalTargetDescriptionInput(e.target.value.slice(0, 2000))}
                disabled={mutation.isPending}
                maxLength={2000}
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">Set optional details now, then click Add goal.</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8"
                disabled={mutation.isPending || goalText.trim() === ""}
                onClick={addGoal}
              >
                Add goal
              </Button>
            </div>
            {goals.length > 0 ? (
              <div className="max-h-60 space-y-2 overflow-y-auto rounded-lg border border-border bg-muted/20 p-2">
                {goals.map((g, i) => (
                  <div
                    key={`${g.goal}-${i}`}
                    className="rounded-md border border-border bg-background p-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">{g.goal}</p>
                        <p className="text-xs text-muted-foreground">
                          Target: {g.targetNumber != null ? String(g.targetNumber) : "—"} | Deadline:{" "}
                          {formatCampaignDeadlineDisplay(g.deadline ?? undefined)}
                        </p>
                        {g.targetDescription ? (
                          <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                            {g.targetDescription}
                          </p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove goal ${g.goal}`}
                        className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        onClick={() => removeGoal(i)}
                        disabled={mutation.isPending}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No goals added yet.</p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 font-semibold text-black hover:bg-orange-600"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
