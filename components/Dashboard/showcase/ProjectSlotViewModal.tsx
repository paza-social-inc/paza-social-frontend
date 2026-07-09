"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ProjectSlotItem } from "@/types/projects/projectTypes";

function lines(text: string | undefined): string[] {
  if (!text?.trim()) return [];
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slotLabel: string;
  item: ProjectSlotItem | null;
  canEdit: boolean;
  onRequestEdit: () => void;
};

export function ProjectSlotViewModal({
  open,
  onOpenChange,
  slotLabel,
  item,
  canEdit,
  onRequestEdit,
}: Props) {
  if (!item) return null;

  const deliverables = lines(item.deliverables);
  const usage = lines(item.usageRights);
  const kpis = lines(item.kpis);
  const proof = lines(item.proofRequired);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90vh,800px)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="pr-8 text-left">
            {slotLabel}
            <span className="block text-base font-semibold text-foreground mt-1">
              {item.title}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {item.budgetBand?.trim() ? (
            <section>
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Package / budget band
              </p>
              <p className="mt-1 text-base font-semibold text-orange-500 dark:text-orange-400">
                {item.budgetBand}
              </p>
            </section>
          ) : null}

          {deliverables.length > 0 ? (
            <section>
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Deliverables
              </p>
              <ul className="mt-1 list-inside list-disc space-y-1 text-foreground">
                {deliverables.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {usage.length > 0 ? (
            <section>
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Usage rights
              </p>
              <ul className="mt-1 list-inside list-disc space-y-1 text-muted-foreground">
                {usage.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {item.exclusivity?.trim() &&
          item.exclusivity.trim().toLowerCase() !== "null" ? (
            <section>
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Exclusivity
              </p>
              <p className="mt-1 text-foreground">{item.exclusivity}</p>
            </section>
          ) : null}

          {kpis.length > 0 ? (
            <section>
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                KPIs
              </p>
              <ul className="mt-1 list-inside list-disc space-y-1 text-muted-foreground">
                {kpis.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {item.reportingCadence?.trim() ? (
            <section>
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Reporting cadence
              </p>
              <p className="mt-1 text-foreground">{item.reportingCadence}</p>
            </section>
          ) : null}

          {proof.length > 0 ? (
            <section>
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Proof of delivery
              </p>
              <ul className="mt-1 list-inside list-disc space-y-1 text-muted-foreground">
                {proof.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {canEdit ? (
            <Button
              type="button"
              className="bg-orange-500 font-semibold text-black hover:bg-orange-600"
              onClick={() => {
                onOpenChange(false);
                onRequestEdit();
              }}
            >
              Edit slot
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
