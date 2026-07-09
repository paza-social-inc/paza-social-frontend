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
import type { ProjectSlotItem } from "@/types/projects/projectTypes";

function newSlotId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `slot-${Date.now()}`;
}

function emptySlot(): ProjectSlotItem {
  return {
    id: newSlotId(),
    title: "",
    deliverables: "",
    usageRights: "",
    exclusivity: "",
    budgetBand: "",
    kpis: "",
    reportingCadence: "",
    proofRequired: "",
  };
}

function formFromInitial(initial: ProjectSlotItem | null): ProjectSlotItem {
  if (!initial) return emptySlot();
  return {
    id: initial.id || newSlotId(),
    title: initial.title ?? "",
    deliverables: initial.deliverables ?? "",
    usageRights: initial.usageRights ?? "",
    exclusivity: initial.exclusivity ?? "",
    budgetBand: initial.budgetBand ?? "",
    kpis: initial.kpis ?? "",
    reportingCadence: initial.reportingCadence ?? "",
    proofRequired: initial.proofRequired ?? "",
  };
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: ProjectSlotItem | null;
  slotLabel: string;
  onSave: (item: ProjectSlotItem) => void;
};

export function ProjectSlotModal({ open, onOpenChange, initial, slotLabel, onSave }: Props) {
  const [form, setForm] = useState<ProjectSlotItem>(emptySlot);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90vh,800px)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initial ? `Edit ${slotLabel}` : `Create ${slotLabel}`}</DialogTitle>
          <DialogDescription>
            Describe what the brand gets in this package. You can use one line per bullet in the
            text areas.
          </DialogDescription>
        </DialogHeader>
        <form id="project-slot-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="slot-title">Title</Label>
            <Input
              id="slot-title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Starter bundle, Full campaign"
              className="min-h-11"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slot-del">Deliverables</Label>
            <Textarea
              id="slot-del"
              rows={3}
              className="text-sm"
              placeholder="One per line"
              value={form.deliverables ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, deliverables: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slot-ur">Usage rights</Label>
            <Textarea
              id="slot-ur"
              rows={2}
              className="text-sm"
              placeholder="One per line"
              value={form.usageRights ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, usageRights: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slot-ex">Exclusivity</Label>
            <Input
              id="slot-ex"
              value={form.exclusivity ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, exclusivity: e.target.value }))}
              placeholder="e.g. None, Category, Full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slot-budget">Budget band</Label>
            <Input
              id="slot-budget"
              value={form.budgetBand ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, budgetBand: e.target.value }))}
              placeholder="e.g. Kes 50k – 150k"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slot-kpi">KPIs</Label>
            <Textarea
              id="slot-kpi"
              rows={2}
              className="text-sm"
              placeholder="One per line"
              value={form.kpis ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, kpis: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slot-cadence">Reporting cadence</Label>
            <Input
              id="slot-cadence"
              value={form.reportingCadence ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, reportingCadence: e.target.value }))}
              placeholder="e.g. Weekly, End of campaign"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slot-proof">Proof of delivery</Label>
            <Textarea
              id="slot-proof"
              rows={2}
              className="text-sm"
              placeholder="One per line"
              value={form.proofRequired ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, proofRequired: e.target.value }))}
            />
          </div>
        </form>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="project-slot-form" className="bg-orange-500 font-semibold text-black hover:bg-orange-600">
            Save slot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
