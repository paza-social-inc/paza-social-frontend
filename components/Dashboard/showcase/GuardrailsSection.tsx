"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { projectsApi } from "@/lib/data/projects";
import type {
  BrandCancellationRule,
  BrandDelayRule,
  HardNoCategoryId,
  Project,
  ProjectGuardrails,
} from "@/types/projects/projectTypes";
import {
  DEFAULT_PROJECT_GUARDRAILS,
  GUARDRAIL_CREATIVE_ITEMS,
  GUARDRAIL_HARD_NO_CATALOG,
} from "./showcaseData";

const ALLOWED_HARD_NO = new Set<HardNoCategoryId>(
  GUARDRAIL_HARD_NO_CATALOG.map((c) => c.id) as HardNoCategoryId[]
);

const LEGACY_HARD_NO_LABEL_TO_ID: Record<string, HardNoCategoryId> = {
  Alcohol: "alcohol",
  "Betting/Gambling": "gambling",
  Politics: "politics",
  "Adult/Sexual content": "adult",
  "Tobacco/Nicotine/Vapes": "tobacco",
  "Crypto/\"get rich\" schemes": "crypto",
};

const DELAY_OPTIONS: BrandDelayRule[] = ["24h", "48h", "72h"];
const CANCEL_OPTIONS: BrandCancellationRule[] = ["20%", "40%", "60%"];

function isDelayRule(v: string): v is BrandDelayRule {
  return (DELAY_OPTIONS as string[]).includes(v);
}

function isCancelRule(v: string): v is BrandCancellationRule {
  return (CANCEL_OPTIONS as string[]).includes(v);
}

function coerceHardNoList(raw: unknown): HardNoCategoryId[] {
  if (!Array.isArray(raw)) return [];
  const out: HardNoCategoryId[] = [];
  const seen = new Set<HardNoCategoryId>();
  for (const x of raw) {
    const s = String(x ?? "").trim();
    if (!s) continue;
    let id: HardNoCategoryId | undefined;
    if (ALLOWED_HARD_NO.has(s as HardNoCategoryId)) {
      id = s as HardNoCategoryId;
    } else {
      id = LEGACY_HARD_NO_LABEL_TO_ID[s];
    }
    if (id && !seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}

function normalizeCreative(raw: unknown): ProjectGuardrails["creativeNonNegotiables"] {
  const d = DEFAULT_PROJECT_GUARDRAILS.creativeNonNegotiables;
  if (raw == null || typeof raw !== "object" || Array.isArray(raw)) {
    return { ...d };
  }
  const o = raw as Record<string, unknown>;
  const next = { ...d };
  for (const k of Object.keys(d) as (keyof typeof d)[]) {
    if (typeof o[k] === "boolean") next[k] = o[k] as boolean;
  }
  return next;
}

/** Merge API `guardrails` with defaults (supports legacy string hard-no labels). */
export function mergeGuardrailsFromProject(
  project: Project & Record<string, unknown>
): ProjectGuardrails {
  const raw: unknown = project.guardrails;
  if (raw != null && typeof raw === "object" && !Array.isArray(raw)) {
    const g = raw as Record<string, unknown>;
    const delay = String(g.brandDelayRule ?? "");
    const cancel = String(g.brandCancellationRule ?? "");
    return {
      hardNo: coerceHardNoList(g.hardNo),
      creativeNonNegotiables: normalizeCreative(g.creativeNonNegotiables),
      brandDelayRule: isDelayRule(delay) ? delay : DEFAULT_PROJECT_GUARDRAILS.brandDelayRule,
      brandCancellationRule: isCancelRule(cancel)
        ? cancel
        : DEFAULT_PROJECT_GUARDRAILS.brandCancellationRule,
      unauthorizedUsageCharge:
        typeof g.unauthorizedUsageCharge === "boolean"
          ? g.unauthorizedUsageCharge
          : DEFAULT_PROJECT_GUARDRAILS.unauthorizedUsageCharge,
    };
  }
  return { ...DEFAULT_PROJECT_GUARDRAILS, hardNo: [...DEFAULT_PROJECT_GUARDRAILS.hardNo] };
}

function SegmentOption<T extends string>({
  value,
  selected,
  onSelect,
  children,
  disabled,
}: {
  value: T;
  selected: boolean;
  onSelect: (v: T) => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={() => onSelect(value)}
      className={cn(
        "min-h-11 min-w-[4.25rem] flex-1 touch-manipulation rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected
          ? "border-primary bg-primary/15 text-foreground shadow-sm"
          : "border-border bg-muted/25 text-muted-foreground hover:bg-muted/45 hover:text-foreground",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      {children}
    </button>
  );
}

type Props = {
  projectId: string;
  initial: ProjectGuardrails;
  canEdit: boolean;
};

export function GuardrailsSection({ projectId, initial, canEdit }: Props) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<ProjectGuardrails>(initial);
  const [baseline, setBaseline] = useState<ProjectGuardrails>(initial);

  useEffect(() => {
    setDraft(initial);
    setBaseline(initial);
  }, [initial]);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(baseline), [draft, baseline]);

  const saveMutation = useMutation({
    mutationFn: (next: ProjectGuardrails) => projectsApi.update(projectId, { guardrails: next }),
    onSuccess: (_, next) => {
      toast.success("Guardrails saved");
      setBaseline(next);
      setDraft(next);
      void queryClient.invalidateQueries({ queryKey: ["creator-projects", projectId] });
      void queryClient.invalidateQueries({ queryKey: ["creator-projects"] });
    },
    onError: (err: unknown) => {
      const msg =
        String((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "").trim() ||
        "Could not save guardrails";
      toast.error(msg);
    },
  });

  const toggleHardNo = useCallback(
    (id: HardNoCategoryId, checked: boolean) => {
      if (!canEdit) return;
      setDraft((d) => {
        const set = new Set(d.hardNo);
        if (checked) set.add(id);
        else set.delete(id);
        return { ...d, hardNo: Array.from(set) as HardNoCategoryId[] };
      });
    },
    [canEdit]
  );

  const setCreative = useCallback(
    (key: keyof ProjectGuardrails["creativeNonNegotiables"], value: boolean) => {
      if (!canEdit) return;
      setDraft((d) => ({
        ...d,
        creativeNonNegotiables: { ...d.creativeNonNegotiables, [key]: value },
      }));
    },
    [canEdit]
  );

  const readOnlyBanner = !canEdit ? (
    <p className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
      Only the project owner can change guardrails. This is how the creator has set expectations for
      collaborations.
    </p>
  ) : null;

  return (
    <div className="space-y-5 sm:space-y-6">
      {readOnlyBanner}

      <Card className="border-border bg-card">
        <CardHeader className="space-y-1 pb-3 sm:pb-4">
          <CardTitle className="text-base font-semibold text-foreground sm:text-lg">
            Hard No categories
          </CardTitle>
          <CardDescription className="text-xs leading-relaxed sm:text-sm">
            If a brief is tagged with any of these, you will not be added to the mandate unless you
            explicitly agree to an override for that specific brief.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
            {GUARDRAIL_HARD_NO_CATALOG.map(({ id, label, hint }) => {
              const checked = draft.hardNo.includes(id);
              return (
                <li key={id}>
                  <label
                    className={cn(
                      "flex min-h-[3.25rem] cursor-pointer items-start gap-3 rounded-xl border border-border bg-muted/15 px-3 py-3 transition-colors sm:min-h-0 sm:items-center sm:py-3.5",
                      checked && "border-primary/40 bg-primary/5",
                      !canEdit && "cursor-default opacity-90"
                    )}
                  >
                    <Checkbox
                      checked={checked}
                      disabled={!canEdit}
                      onCheckedChange={(v) => toggleHardNo(id, v === true)}
                      className="mt-0.5 shrink-0 sm:mt-0"
                      aria-describedby={`hardno-hint-${id}`}
                    />
                    <span className="min-w-0 flex-1 space-y-0.5">
                      <span className="block text-sm font-medium leading-snug text-foreground">{label}</span>
                      <span id={`hardno-hint-${id}`} className="block text-xs leading-snug text-muted-foreground">
                        {hint}
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="space-y-1 pb-3 sm:pb-4">
          <CardTitle className="text-base font-semibold text-foreground sm:text-lg">
            Creative non-negotiables
          </CardTitle>
          <CardDescription className="text-xs leading-relaxed sm:text-sm">
            Clear rules brands see before they propose work. Toggle each rule on or off.
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border border-t border-border px-0 pt-0 sm:px-0">
          {GUARDRAIL_CREATIVE_ITEMS.map(({ key, label, hint }) => (
            <div
              key={key}
              className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-4"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <Label htmlFor={`gr-${key}`} className="text-sm font-medium text-foreground">
                  {label}
                </Label>
                <p id={`gr-${key}-hint`} className="text-xs leading-relaxed text-muted-foreground">
                  {hint}
                </p>
              </div>
              <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
                <span className="text-xs font-medium text-muted-foreground sm:hidden">
                  {draft.creativeNonNegotiables[key] ? "On" : "Off"}
                </span>
                <Switch
                  id={`gr-${key}`}
                  checked={draft.creativeNonNegotiables[key]}
                  onCheckedChange={(v) => setCreative(key, v)}
                  disabled={!canEdit}
                  className="h-7 w-12 scale-100 data-[state=checked]:bg-primary sm:h-7 sm:w-12"
                  aria-describedby={`gr-${key}-hint`}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="space-y-1 pb-3 sm:pb-4">
          <CardTitle className="text-base font-semibold text-foreground sm:text-lg">Recourse rules</CardTitle>
          <CardDescription className="text-xs leading-relaxed sm:text-sm">
            Defaults you want baked into collaboration expectations. Pick one option per rule.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 sm:space-y-8">
          <section className="space-y-3" aria-labelledby="gr-delay-heading">
            <h3 id="gr-delay-heading" className="text-sm font-semibold text-foreground">
              Brand delay buffer
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Auto-extend your delivery deadline if the brand is late with assets or feedback by{" "}
              <span className="font-semibold text-foreground">{draft.brandDelayRule}</span>.
            </p>
            <div
              className="flex flex-col gap-2 sm:flex-row"
              role="radiogroup"
              aria-label="Deadline extension if brand is late"
            >
              {DELAY_OPTIONS.map((d) => (
                <SegmentOption
                  key={d}
                  value={d}
                  selected={draft.brandDelayRule === d}
                  disabled={!canEdit}
                  onSelect={(v) => canEdit && setDraft((x) => ({ ...x, brandDelayRule: v }))}
                >
                  {d}
                </SegmentOption>
              ))}
            </div>
          </section>

          <section className="space-y-3" aria-labelledby="gr-cancel-heading">
            <h3 id="gr-cancel-heading" className="text-sm font-semibold text-foreground">
              Cancellation after work starts
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              If the brand cancels after you have started, you keep{" "}
              <span className="font-semibold text-foreground">{draft.brandCancellationRule}</span> of the
              agreed fee (per your contract template).
            </p>
            <div
              className="flex flex-col gap-2 sm:flex-row"
              role="radiogroup"
              aria-label="Creator fee retention if brand cancels after work starts"
            >
              {CANCEL_OPTIONS.map((c) => (
                <SegmentOption
                  key={c}
                  value={c}
                  selected={draft.brandCancellationRule === c}
                  disabled={!canEdit}
                  onSelect={(v) => canEdit && setDraft((x) => ({ ...x, brandCancellationRule: v }))}
                >
                  {c}
                </SegmentOption>
              ))}
            </div>
          </section>

          <section
            className="flex flex-col gap-3 rounded-xl border border-border bg-muted/15 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4"
            aria-labelledby="gr-unauth-heading"
          >
            <div className="min-w-0 flex-1 space-y-1">
              <h3 id="gr-unauth-heading" className="text-sm font-semibold text-foreground">
                Unauthorized usage
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                If the brand uses your content outside the agreed window or channels, you want the option to
                charge for that usage.
              </p>
            </div>
            <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end sm:pl-4">
              <span className="text-xs font-medium text-muted-foreground sm:hidden">
                {draft.unauthorizedUsageCharge ? "Enabled" : "Disabled"}
              </span>
              <Switch
                checked={draft.unauthorizedUsageCharge}
                onCheckedChange={(v) => canEdit && setDraft((x) => ({ ...x, unauthorizedUsageCharge: v }))}
                disabled={!canEdit}
                className="h-7 w-12 data-[state=checked]:bg-primary"
                aria-labelledby="gr-unauth-heading"
              />
            </div>
          </section>
        </CardContent>
      </Card>

      {canEdit && (
        <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-end sm:pt-5">
          <Button
            type="button"
            size="sm"
            className="h-11 w-full touch-manipulation sm:h-10 sm:min-w-[11rem]"
            disabled={!dirty || saveMutation.isPending}
            onClick={() => saveMutation.mutate(draft)}
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                Saving…
              </>
            ) : (
              "Save guardrails"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

