"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { projectsApi } from "@/lib/data/projects";
import type { Project, ProjectSlotItem, ProjectSlots } from "@/types/projects/projectTypes";
import { ProjectSlotModal } from "./ProjectSlotModal";
import { ProjectSlotViewModal } from "./ProjectSlotViewModal";

export const MAX_PROJECT_SLOTS = 3;

const EMPTY_SLOTS: ProjectSlots = {
  items: [null, null, null],
  deliverables: [],
  usageRights: [],
  exclusivity: "",
  budgetBand: "",
  kpis: [],
  reportingCadence: "",
  proofRequired: [],
};

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => String(x).trim()).filter(Boolean);
}

function normalizeSlotItem(raw: unknown): ProjectSlotItem | null {
  if (raw == null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const title = String(o.title ?? "").trim();
  if (!title) return null;
  const id =
    String(o.id ?? "").trim() ||
    (typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `slot-${Date.now()}`);
  return {
    id,
    title,
    deliverables: String(o.deliverables ?? ""),
    usageRights: String(o.usageRights ?? ""),
    exclusivity: String(o.exclusivity ?? ""),
    budgetBand: String(o.budgetBand ?? ""),
    kpis: String(o.kpis ?? ""),
    reportingCadence: String(o.reportingCadence ?? ""),
    proofRequired: String(o.proofRequired ?? ""),
  };
}

function legacySlotsToItem(slots: ProjectSlots): ProjectSlotItem | null {
  const del = (slots.deliverables ?? []).join("\n").trim();
  const ur = (slots.usageRights ?? []).join("\n").trim();
  const kpis = (slots.kpis ?? []).join("\n").trim();
  const proof = (slots.proofRequired ?? []).join("\n").trim();
  const ex = String(slots.exclusivity ?? "").trim();
  const bb = String(slots.budgetBand ?? "").trim();
  const rc = String(slots.reportingCadence ?? "").trim();
  if (!del && !ur && !kpis && !proof && !ex && !bb && !rc) return null;
  return {
    id: "legacy",
    title: "Package",
    deliverables: del,
    usageRights: ur,
    exclusivity: ex,
    budgetBand: bb,
    kpis,
    reportingCadence: rc,
    proofRequired: proof,
  };
}

/** Fixed 3 grid cells — `null` is an empty column. */
export function tripleGridFromSlots(slots: ProjectSlots): (ProjectSlotItem | null)[] {
  const out: (ProjectSlotItem | null)[] = [null, null, null];
  const items = slots.items;
  if (Array.isArray(items) && items.length > 0) {
    for (let i = 0; i < MAX_PROJECT_SLOTS; i++) {
      const raw = items[i];
      if (raw == null) {
        out[i] = null;
        continue;
      }
      const n = normalizeSlotItem(raw);
      out[i] = n;
    }
    return out;
  }
  const leg = legacySlotsToItem(slots);
  if (leg) out[0] = leg;
  return out;
}

/** API `slots` JSON or legacy flat fields on the project object. */
export function mergeSlotsFromProject(project: Project & Record<string, unknown>): ProjectSlots {
  const api = project.slots;
  if (api && typeof api === "object" && !Array.isArray(api)) {
    const s = api as Record<string, unknown>;
    const itemsRaw = s.items;
    let items: (ProjectSlotItem | null)[] | undefined;
    if (Array.isArray(itemsRaw)) {
      items = [0, 1, 2].map((i) => {
        const raw = itemsRaw[i];
        if (raw == null) return null;
        return normalizeSlotItem(raw);
      });
    }
    return {
      items,
      deliverables: asStringArray(s.deliverables),
      usageRights: asStringArray(s.usageRights),
      exclusivity: String(s.exclusivity ?? ""),
      budgetBand: String(s.budgetBand ?? ""),
      kpis: asStringArray(s.kpis),
      reportingCadence: String(s.reportingCadence ?? ""),
      proofRequired: asStringArray(s.proofRequired),
    };
  }
  const p = project as Record<string, unknown>;
  return {
    items: undefined,
    deliverables: asStringArray(p.deliverables),
    usageRights: asStringArray(p.usageRights),
    exclusivity: String(p.exclusivity ?? ""),
    budgetBand: String(p.budgetBand ?? ""),
    kpis: asStringArray(p.kpis),
    reportingCadence: String(p.reportingCadence ?? ""),
    proofRequired: asStringArray(p.proofRequired),
  };
}

function payloadForApi(grid: (ProjectSlotItem | null)[]): ProjectSlots {
  return {
    items: grid.map((c) => c),
  };
}

function previewLines(text: string | undefined, maxLines: number): string[] {
  if (!text?.trim()) return [];
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, maxLines);
}

type Props = {
  projectId: string;
  initial: ProjectSlots;
  canEdit: boolean;
};

export function SlotsSection({ projectId, initial, canEdit }: Props) {
  const queryClient = useQueryClient();
  const [grid, setGrid] = useState<(ProjectSlotItem | null)[]>(() =>
    tripleGridFromSlots({ ...EMPTY_SLOTS, ...initial })
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSlotIndex, setModalSlotIndex] = useState<number>(0);
  const [modalInitial, setModalInitial] = useState<ProjectSlotItem | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewSlotIndex, setViewSlotIndex] = useState(0);
  const [viewItem, setViewItem] = useState<ProjectSlotItem | null>(null);

  useEffect(() => {
    setGrid(tripleGridFromSlots({ ...EMPTY_SLOTS, ...initial }));
  }, [initial]);

  const saveMutation = useMutation({
    mutationFn: (payload: ProjectSlots) => projectsApi.update(projectId, { slots: payload }),
    onSuccess: () => {
      toast.success("Slots saved");
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

  const openCreate = (index: number) => {
    setModalSlotIndex(index);
    setModalInitial(null);
    setModalOpen(true);
  };

  const openEdit = (index: number, item: ProjectSlotItem) => {
    setModalSlotIndex(index);
    setModalInitial(item);
    setModalOpen(true);
  };

  const openView = (index: number, item: ProjectSlotItem) => {
    setViewSlotIndex(index);
    setViewItem(item);
    setViewOpen(true);
  };

  const openEditFromView = () => {
    if (!viewItem) return;
    openEdit(viewSlotIndex, viewItem);
  };

  const handleModalSave = (item: ProjectSlotItem) => {
    setGrid((g) => {
      const next = [...g] as (ProjectSlotItem | null)[];
      next[modalSlotIndex] = item;
      return next;
    });
  };

  const clearSlot = (index: number) => {
    setGrid((g) => {
      const next = [...g] as (ProjectSlotItem | null)[];
      next[index] = null;
      return next;
    });
  };

  const slotLabels = ["Slot 1", "Slot 2", "Slot 3"];

  return (
    <div className="space-y-4">
      {canEdit && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground max-w-xl">
            Up to three packages in one row. Each column is its own slot — add or edit with the
            buttons on each card.
          </p>
          <Button
            type="button"
            size="sm"
            disabled={saveMutation.isPending}
            onClick={() => saveMutation.mutate(payloadForApi(grid))}
            className="touch-manipulation shrink-0"
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Save slots"
            )}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {slotLabels.map((label, index) => {
          const cell = grid[index] ?? null;
          return (
            <Card
              key={label}
              className={
                cell
                  ? "border-border bg-card flex min-h-[220px] flex-col dark:bg-zinc-900/40 cursor-pointer transition-colors hover:bg-muted/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
                  : "border-border bg-card flex min-h-[220px] flex-col dark:bg-zinc-900/40"
              }
              aria-label={cell ? `View ${label} package details` : undefined}
              onClick={
                cell
                  ? () => {
                      openView(index, cell);
                    }
                  : undefined
              }
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-foreground">{label}</CardTitle>
                {canEdit && cell ? (
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label={`Edit ${label}`}
                      onClick={() => openEdit(index, cell)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      aria-label={`Clear ${label}`}
                      onClick={() => clearSlot(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : null}
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-2 pt-0">
                {cell ? (
                  <>
                    <p className="text-base font-semibold leading-tight">{cell.title}</p>
                    {cell.budgetBand ? (
                      <p className="text-xs font-medium text-orange-500 dark:text-orange-400">
                        {cell.budgetBand}
                      </p>
                    ) : null}
                    {previewLines(cell.deliverables, 4).length > 0 ? (
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                          Deliverables
                        </p>
                        <ul className="mt-1 list-inside list-disc text-xs text-muted-foreground">
                          {previewLines(cell.deliverables, 4).map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {cell.exclusivity?.trim() &&
                    cell.exclusivity.trim().toLowerCase() !== "null" ? (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Exclusivity: </span>
                        {cell.exclusivity}
                      </p>
                    ) : null}
                    {previewLines(cell.kpis, 3).length > 0 ? (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">KPIs: </span>
                        {previewLines(cell.kpis, 3).join(" · ")}
                      </p>
                    ) : null}
                  </>
                ) : (
                  <div
                    className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/20 px-3 py-6 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="text-xs text-muted-foreground">Empty — define this package.</p>
                    {canEdit ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => openCreate(index)}
                      >
                        <Plus className="h-4 w-4" />
                        Add slot
                      </Button>
                    ) : (
                      <p className="text-xs text-muted-foreground">—</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ProjectSlotViewModal
        open={viewOpen}
        onOpenChange={setViewOpen}
        slotLabel={slotLabels[viewSlotIndex] ?? "Slot"}
        item={viewItem}
        canEdit={canEdit}
        onRequestEdit={openEditFromView}
      />

      <ProjectSlotModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initial={modalInitial}
        slotLabel={slotLabels[modalSlotIndex] ?? "Slot"}
        onSave={handleModalSave}
      />
    </div>
  );
}
