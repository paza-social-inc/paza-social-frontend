"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  DollarSign,
  Layers,
  ListChecks,
  Loader2,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  ShieldCheck,
  Target,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
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

function hasValue(text: string | undefined): boolean {
  const t = text?.trim();
  return !!t && t.toLowerCase() !== "null";
}

/** One stat in the 2x2 grid: icon circle + label + value. Neutral by default; `accent` reserved for the single highlighted stat. */
function SlotStat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          accent ? "bg-orange-500/15 text-orange-400" : "bg-muted/60 text-muted-foreground"
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] leading-none text-muted-foreground">{label}</p>
        <p className="mt-1 truncate text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

/** One filled commercial slot, styled after the marketplace opportunity card — kept compact and low-color. */
function FilledSlotCard({
  label,
  item,
  canEdit,
  onOpen,
  onEdit,
  onClear,
}: {
  label: string;
  item: ProjectSlotItem;
  canEdit: boolean;
  onOpen: () => void;
  onEdit: () => void;
  onClear: () => void;
}) {
  const deliverables = previewLines(item.deliverables, 4);
  const kpis = previewLines(item.kpis, 4);
  const summary = deliverables.length > 0 ? deliverables.join(" · ") : null;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View ${label} package details`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="group flex min-h-[232px] cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-orange-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 focus-visible:ring-offset-2 ring-offset-background dark:bg-zinc-900/40"
    >
      {/* Header zone — tinted band so it reads as distinct from the details below */}
      <div className="relative flex items-start gap-3 bg-muted/30 px-4 pb-4 pt-4 dark:bg-white/[0.03]">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-orange-400">
          <Package className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="truncate text-base font-bold leading-tight text-foreground">{item.title}</p>
          {hasValue(item.exclusivity) ? (
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{item.exclusivity}</span>
            </div>
          ) : null}
        </div>
        {canEdit ? (
          <div className="flex shrink-0 gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              aria-label={`Edit ${label}`}
              onClick={onEdit}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label={`Clear ${label}`}
              onClick={onClear}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-4 border-t border-border px-4 pb-4 pt-3.5">
        <div className="grid grid-cols-2 gap-x-2 gap-y-3.5">
          <SlotStat
            icon={DollarSign}
            accent
            label="Budget"
            value={hasValue(item.budgetBand) ? item.budgetBand! : "Negotiable"}
          />
          <SlotStat
            icon={RefreshCw}
            label="Reporting"
            value={hasValue(item.reportingCadence) ? item.reportingCadence! : "N/A"}
          />
          <SlotStat
            icon={ListChecks}
            label="Deliverables"
            value={deliverables.length > 0 ? `${deliverables.length} listed` : "N/A"}
          />
          <SlotStat
            icon={Target}
            label="KPIs"
            value={kpis.length > 0 ? `${kpis.length} tracked` : "N/A"}
          />
        </div>

        {summary ? <p className="line-clamp-2 text-xs text-muted-foreground">{summary}</p> : null}

        <button
          type="button"
          onClick={onOpen}
          className="mt-auto flex w-full items-center justify-center rounded-lg bg-orange-500 py-2.5 text-sm font-bold text-black transition-colors hover:bg-orange-600"
        >
          View details
        </button>
      </div>
    </div>
  );
}

/** An empty slot column, inviting the creator to define a package. */
function EmptySlotCard({
  label,
  canEdit,
  onAdd,
}: {
  label: string;
  canEdit: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="flex min-h-[232px] flex-col rounded-xl border border-dashed border-border bg-card/60 dark:bg-zinc-900/30">
      <div className="flex items-center gap-2 bg-muted/20 px-4 pb-3.5 pt-4 dark:bg-white/[0.02]">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/30" aria-hidden />
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 border-t border-dashed border-border px-4 pb-6 pt-4 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/40">
          <Package className="h-4.5 w-4.5 text-muted-foreground/50" />
        </div>
        <p className="text-xs text-muted-foreground">Empty — define this package.</p>
        {canEdit ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1 border-orange-500/40 text-orange-500 hover:bg-orange-500/10 hover:text-orange-600"
            onClick={onAdd}
          >
            <Plus className="h-4 w-4" />
            Add slot
          </Button>
        ) : (
          <p className="text-xs text-muted-foreground">—</p>
        )}
      </div>
    </div>
  );
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
  const filledCount = grid.filter(Boolean).length;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
            <Layers className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">Commercial slots</h3>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {filledCount}/{MAX_PROJECT_SLOTS} filled
              </span>
            </div>
            <p className="mt-0.5 max-w-md text-xs text-muted-foreground">
              Up to three packages in one row. Each column is its own slot — brands see these when
              browsing your showcase.
            </p>
          </div>
        </div>
        {canEdit && (
          <Button
            type="button"
            size="sm"
            disabled={saveMutation.isPending}
            onClick={() => saveMutation.mutate(payloadForApi(grid))}
            className="touch-manipulation shrink-0 bg-orange-500 font-semibold text-black hover:bg-orange-600"
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
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {slotLabels.map((label, index) => {
          const cell = grid[index] ?? null;
          return cell ? (
            <FilledSlotCard
              key={label}
              label={label}
              item={cell}
              canEdit={canEdit}
              onOpen={() => openView(index, cell)}
              onEdit={() => openEdit(index, cell)}
              onClear={() => clearSlot(index)}
            />
          ) : (
            <EmptySlotCard
              key={label}
              label={label}
              canEdit={canEdit}
              onAdd={() => openCreate(index)}
            />
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