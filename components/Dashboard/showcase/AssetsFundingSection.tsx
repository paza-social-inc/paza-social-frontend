"use client";

import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2, UploadCloud, Paperclip, X, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { projectsApi } from "@/lib/data/projects";
import type {
  AssetsFunding,
  AssetType,
  CurrencyCode,
  DateRange,
  DeliveryGuarantee,
  FailureOutcome,
  Money,
  Project,
  ProjectAttachment,
  RevenueSource,
  UseOfFundsCategory,
  YesNo,
  YesNoPending,
} from "@/types/projects/projectTypes";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// NOTE: this file assumes `select`, `radio-group`, `dialog`, and `textarea`
// are already added to your shadcn components. If not:
// `npx shadcn@latest add select radio-group dialog textarea`
// ---------------------------------------------------------------------------

const EMPTY_ASSETS_FUNDING: AssetsFunding = {
  hasIP: false,
  assetType: undefined,
  ownership: { whoOwns: undefined, registered: undefined, jurisdiction: "" },
  revenueHistory: {
    hasEarned: false,
    amount: undefined,
    source: undefined,
    period: { start: "", end: "" },
    proofUrl: "",
  },
  costLedger: { production: undefined, marketing: undefined, legal: undefined },
  seekingFunding: false,
  capitalIntent: { amount: undefined, useOfFunds: undefined, useOfFundsNote: "", expectedOutcome: "" },
  deliveryGuarantee: undefined,
  failureOutcome: undefined,
  risk: { canEarnWithoutCreator: undefined, rightsLicensable: undefined, knownDistributors: "" },
  escrowRequired: false,
  killSwitchEnabled: false,
  attachments: [],
};

const EXPECTED_OUTCOME_MAX = 180;
const USE_OF_FUNDS_NOTE_MAX = 400;
const DEFAULT_CURRENCY: CurrencyCode = "USD";
/** Currency assumed for pre-migration records that stored bare KES numbers with no currency field. */
const LEGACY_CURRENCY: CurrencyCode = "KES";

const ASSET_TYPE_OPTIONS: { value: AssetType; label: string }[] = [
  { value: "distribution_media", label: "Distribution Media" },
  { value: "relationship_graph", label: "Relationship Graph" },
  { value: "content_system", label: "Content System" },
  { value: "ip_vault", label: "IP Vault" },
  { value: "data_intelligence", label: "Data / Intelligence" },
];

const REGISTERED_OPTIONS: { value: YesNoPending; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "pending", label: "Pending" },
];

const REVENUE_SOURCE_OPTIONS: { value: RevenueSource; label: string }[] = [
  { value: "client", label: "Client" },
  { value: "platform", label: "Platform" },
  { value: "license", label: "License" },
];

const USE_OF_FUNDS_OPTIONS: { value: UseOfFundsCategory; label: string }[] = [
  { value: "production", label: "Production" },
  { value: "marketing_distribution", label: "Marketing / Distribution" },
  { value: "legal_registration", label: "Legal / Registration" },
  { value: "team_collaborator_costs", label: "Team / Collaborator Costs" },
  { value: "licensing_acquisition", label: "Licensing Acquisition" },
];

const DELIVERY_GUARANTEE_OPTIONS: { value: DeliveryGuarantee; label: string; hint: string }[] = [
  { value: "strict", label: "Strict Delivery", hint: "All units must deliver" },
  { value: "partial", label: "Partial Tolerance", hint: "X% allowed to fail" },
  { value: "best_effort", label: "Best-Effort", hint: "No hard delivery guarantee" },
];

const FAILURE_OUTCOME_OPTIONS: { value: FailureOutcome; label: string }[] = [
  { value: "refund", label: "Refund undelivered units" },
  { value: "replace", label: "Replace with equivalent delivery" },
  { value: "reallocate", label: "Reallocate budget to another asset in project" },
  { value: "no_remedy", label: "No remedy" },
];

const YES_NO_OPTIONS: { value: YesNo; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

/** Curated shortlist shown in the currency picker. Any ISO 4217 code still formats fine via Intl. */
const CURRENCY_OPTIONS: { value: CurrencyCode; label: string }[] = [
  { value: "KES", label: "KES — Kenyan Shilling" },
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "NGN", label: "NGN — Nigerian Naira" },
  { value: "ZAR", label: "ZAR — South African Rand" },
  { value: "GHS", label: "GHS — Ghanaian Cedi" },
  { value: "UGX", label: "UGX — Ugandan Shilling" },
  { value: "TZS", label: "TZS — Tanzanian Shilling" },
  { value: "INR", label: "INR — Indian Rupee" },
  { value: "CAD", label: "CAD — Canadian Dollar" },
  { value: "AUD", label: "AUD — Australian Dollar" },
];

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia",
  "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
  "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
  "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde",
  "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China",
  "Colombia", "Comoros", "Congo (Brazzaville)", "Congo (DRC)", "Costa Rica", "Croatia",
  "Cuba", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini",
  "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana",
  "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
  "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo",
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
  "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives",
  "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
  "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
  "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine",
  "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar", "Romania", "Russia", "Rwanda", "Saint Lucia", "Samoa", "San Marino",
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia",
  "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan",
  "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago",
  "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates",
  "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
];

function labelFor<T extends string>(options: { value: T; label: string }[], value?: T | null): string {
  return options.find((o) => o.value === value)?.label ?? "—";
}

function currencySymbol(code: CurrencyCode | string): string {
  try {
    const parts = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
    }).formatToParts(0);
    return parts.find((p) => p.type === "currency")?.value ?? code;
  } catch {
    return code;
  }
}

function formatMoney(m?: Money | null): string {
  if (!m || m.amount === undefined || m.amount === null || Number.isNaN(m.amount)) return "—";
  const currency = m.currency ?? DEFAULT_CURRENCY;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(m.amount);
  } catch {
    return `${currency} ${m.amount.toLocaleString()}`;
  }
}

function formatDateRange(range?: DateRange | null): string {
  if (!range || (!range.start && !range.end)) return "—";
  const fmt = (v?: string) => {
    if (!v) return "?";
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  };
  return `${fmt(range.start)} – ${fmt(range.end)}`;
}

function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Strip an amount input down to digits + a single decimal point (max 2 dp) while the user is typing. */
function sanitizeAmountInput(raw: string): string {
  const stripped = raw.replace(/[^0-9.]/g, "");
  const firstDot = stripped.indexOf(".");
  if (firstDot === -1) return stripped;
  const intPart = stripped.slice(0, firstDot);
  const decPart = stripped.slice(firstDot + 1).replace(/\./g, "").slice(0, 2);
  return `${intPart}.${decPart}`;
}

/** Insert thousands separators into a sanitized (digits + optional single dot) amount string. */
function groupThousands(sanitized: string): string {
  const [intPart, decPart] = sanitized.split(".");
  const groupedInt = (intPart || "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decPart !== undefined ? `${groupedInt}.${decPart}` : groupedInt;
}

function parseAmountInput(raw: string): number | undefined {
  if (raw === "" || raw === ".") return undefined;
  const num = Number(raw);
  return Number.isNaN(num) ? undefined : num;
}

function formatAmountForDisplay(amount?: number): string {
  if (amount === undefined || amount === null || Number.isNaN(amount)) return "";
  return amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function mergeLayer<T extends object>(base: T, over: Partial<T> | undefined): T {
  if (!over) return { ...base };
  return { ...base, ...over };
}

/** Merge API `assetsFunding` with legacy mock-project flat fields for the showcase carousel. */
export function mergeAssetsFundingFromProject(project: Project & Record<string, unknown>): AssetsFunding {
  const api = project.assetsFunding;
  if (api && typeof api === "object" && !Array.isArray(api)) {
    const a = api as AssetsFunding;
    return {
      ...EMPTY_ASSETS_FUNDING,
      ...a,
      ownership: mergeLayer(EMPTY_ASSETS_FUNDING.ownership!, a.ownership),
      revenueHistory: {
        ...mergeLayer(EMPTY_ASSETS_FUNDING.revenueHistory!, a.revenueHistory),
        period: mergeLayer(EMPTY_ASSETS_FUNDING.revenueHistory!.period!, a.revenueHistory?.period),
      },
      costLedger: mergeLayer(EMPTY_ASSETS_FUNDING.costLedger!, a.costLedger),
      capitalIntent: mergeLayer(EMPTY_ASSETS_FUNDING.capitalIntent!, a.capitalIntent),
      risk: mergeLayer(EMPTY_ASSETS_FUNDING.risk!, a.risk),
      attachments: a.attachments ?? [],
    };
  }

  // Legacy flat-field fallback (pre-migration mock projects). Best-effort coercion —
  // old records stored money as bare numbers (assumed KES) and period as free text,
  // so we wrap/normalize rather than guess at values we can't parse safely.
  const p = project as Record<string, unknown>;
  const toNum = (v: unknown): number | undefined => {
    const n = Number(v);
    return v !== undefined && v !== null && v !== "" && !Number.isNaN(n) ? n : undefined;
  };
  const toMoney = (v: unknown): Money | undefined => {
    const n = toNum(v);
    return n !== undefined ? { amount: n, currency: LEGACY_CURRENCY } : undefined;
  };
  const legacyOwnership = (p.ownership ?? {}) as Record<string, unknown>;
  const legacyRevenue = (p.revenueHistory ?? {}) as Record<string, unknown>;
  const legacyLedger = (p.costLedger ?? {}) as Record<string, unknown>;
  const legacyCapital = (p.capitalIntent ?? {}) as Record<string, unknown>;
  const legacyRisk = (p.risk ?? {}) as Record<string, unknown>;

  return {
    ...EMPTY_ASSETS_FUNDING,
    hasIP: Boolean(p.hasIP),
    ownership: {
      whoOwns: toNum(legacyOwnership.whoOwns),
      registered: (["yes", "no", "pending"] as const).includes(legacyOwnership.registered as YesNoPending)
        ? (legacyOwnership.registered as YesNoPending)
        : undefined,
      jurisdiction: String(legacyOwnership.jurisdiction ?? ""),
    },
    revenueHistory: {
      hasEarned: Boolean(legacyRevenue.hasEarned),
      amount: toMoney(legacyRevenue.amount),
      source: (["client", "platform", "license"] as const).includes(legacyRevenue.source as RevenueSource)
        ? (legacyRevenue.source as RevenueSource)
        : undefined,
      // Legacy `period` was free text (e.g. "Q1 2026") — can't be safely parsed into a
      // date range, so it's dropped here rather than guessed at.
      period: { start: "", end: "" },
      proofUrl: String(legacyRevenue.proofUrl ?? ""),
    },
    costLedger: {
      production: toMoney(legacyLedger.production),
      marketing: toMoney(legacyLedger.marketing),
      legal: toMoney(legacyLedger.legal),
    },
    seekingFunding: Boolean(p.seekingFunding),
    capitalIntent: {
      amount: toMoney(legacyCapital.amount),
      useOfFunds: undefined,
      useOfFundsNote: "",
      expectedOutcome: String(legacyCapital.expectedOutcome ?? ""),
    },
    deliveryGuarantee: undefined,
    failureOutcome: undefined,
    risk: {
      canEarnWithoutCreator: undefined,
      rightsLicensable: undefined,
      knownDistributors: String(legacyRisk.knownDistributors ?? ""),
    },
    escrowRequired: Boolean(p.escrowRequired),
    killSwitchEnabled: Boolean(p.killSwitchEnabled),
    attachments: [],
  };
}

// ---------------------------------------------------------------------------
// MoneyField — currency picker + thousands-formatted amount input
// ---------------------------------------------------------------------------
function MoneyField({
  idPrefix,
  label,
  value,
  onChange,
}: {
  idPrefix: string;
  label: string;
  value: Money | undefined;
  onChange: (money: Money) => void;
}) {
  const currency = value?.currency ?? DEFAULT_CURRENCY;
  const [text, setText] = useState<string>(() => formatAmountForDisplay(value?.amount));
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the text buffer in sync if the amount changes from outside (e.g. initial load,
  // switching between records). Skipped while focused so it doesn't fight with live typing.
  useEffect(() => {
    if (!isFocused) {
      setText(formatAmountForDisplay(value?.amount));
    }
  }, [value?.amount, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = e.target;
    const cursorPos = el.selectionStart ?? el.value.length;
    // How many digit/dot characters sit before the cursor in the raw (pre-format) value —
    // used to re-place the cursor correctly once commas are inserted/removed.
    const digitsBeforeCursor = el.value.slice(0, cursorPos).replace(/[^0-9.]/g, "").length;

    const sanitized = sanitizeAmountInput(el.value);
    const grouped = groupThousands(sanitized);
    setText(grouped);
    onChange({ amount: parseAmountInput(sanitized), currency });

    requestAnimationFrame(() => {
      const input = inputRef.current;
      if (!input) return;
      let count = 0;
      let pos = grouped.length;
      if (digitsBeforeCursor === 0) {
        pos = 0;
      } else {
        for (let i = 0; i < grouped.length; i++) {
          if (/[0-9.]/.test(grouped[i])) count++;
          if (count === digitsBeforeCursor) {
            pos = i + 1;
            break;
          }
        }
      }
      input.setSelectionRange(pos, pos);
    });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`${idPrefix}-amount`}>{label}</Label>
      <div className="flex gap-2">
        <Select value={currency} onValueChange={(c) => onChange({ amount: value?.amount, currency: c as CurrencyCode })}>
          <SelectTrigger id={`${idPrefix}-currency`} className="w-[104px] shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CURRENCY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {currencySymbol(currency)}
          </span>
          <Input
            ref={inputRef}
            id={`${idPrefix}-amount`}
            inputMode="decimal"
            placeholder="0"
            className="pl-8"
            value={text}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              const parsed = parseAmountInput(sanitizeAmountInput(text));
              setText(formatAmountForDisplay(parsed));
              onChange({ amount: parsed, currency });
            }}
          />
        </div>
      </div>
    </div>
  );
}

type Props = {
  projectId: string;
  /** Merged snapshot from `mergeAssetsFundingFromProject` — update when parent refetches. */
  initial: AssetsFunding;
  canEdit: boolean;
};

export function AssetsFundingSection({ projectId, initial, canEdit }: Props) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<AssetsFunding>(initial);
  const [ufDialogOpen, setUfDialogOpen] = useState(false);
  const [ufNoteDraft, setUfNoteDraft] = useState("");

  useEffect(() => {
    setDraft(initial);
  }, [initial]);

  const saveMutation = useMutation({
    mutationFn: (payload: AssetsFunding) =>
      projectsApi.update(projectId, { assetsFunding: payload }),
    onSuccess: () => {
      toast.success("Assets & funding saved");
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

  const hasIP = draft.hasIP ?? false;
  const seekingFunding = draft.seekingFunding ?? false;
  const isBestEffort = draft.deliveryGuarantee === "best_effort";

  // If the delivery guarantee moves away from Best-Effort while "No remedy" is selected,
  // that selection is no longer valid — clear it rather than silently persist an
  // inconsistent combination.
  useEffect(() => {
    if (!isBestEffort && draft.failureOutcome === "no_remedy") {
      setDraft((d) => ({ ...d, failureOutcome: undefined }));
    }
  }, [isBestEffort, draft.failureOutcome]);

  const setField = <K extends keyof AssetsFunding>(key: K, value: AssetsFunding[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const setNested = <P extends keyof AssetsFunding, K extends string>(parent: P, key: K, value: unknown) => {
    setDraft((d) => {
      const cur = (d[parent] ?? {}) as Record<string, unknown>;
      return { ...d, [parent]: { ...cur, [key]: value } };
    });
  };

  const setDeepNested = <P extends keyof AssetsFunding>(parent: P, child: string, key: string, value: unknown) => {
    setDraft((d) => {
      const parentObj = (d[parent] ?? {}) as Record<string, unknown>;
      const childObj = (parentObj[child] ?? {}) as Record<string, unknown>;
      return {
        ...d,
        [parent]: { ...parentObj, [child]: { ...childObj, [key]: value } },
      };
    });
  };

  const setNestedNumber = <P extends keyof AssetsFunding, K extends string>(parent: P, key: K, raw: string) => {
    if (raw === "") {
      setNested(parent, key, undefined);
      return;
    }
    const num = Number(raw);
    setNested(parent, key, Number.isNaN(num) ? undefined : num);
  };

  const openUseOfFundsDialog = () => {
    setUfNoteDraft(draft.capitalIntent?.useOfFundsNote ?? "");
    setUfDialogOpen(true);
  };

  const saveUseOfFundsNote = () => {
    setNested("capitalIntent", "useOfFundsNote", ufNoteDraft);
    setUfDialogOpen(false);
  };

  const addAttachments = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const next: ProjectAttachment[] = Array.from(files).map((f) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: f.name,
      size: f.size,
      uploadedAt: new Date().toISOString(),
    }));
    setField("attachments", [...(draft.attachments ?? []), ...next]);
  };

  const removeAttachment = (id: string) => {
    setField("attachments", (draft.attachments ?? []).filter((a) => a.id !== id));
  };

  const readBlock = (children: React.ReactNode) => (
    <div className="space-y-7">{children}</div>
  );

  // ---------------------------------------------------------------------
  // Ownership
  // ---------------------------------------------------------------------
  const viewOwnership = (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Ownership</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5 text-sm">
        <p>
          <span className="text-muted-foreground">Asset type:</span>{" "}
          {labelFor(ASSET_TYPE_OPTIONS, draft.assetType)}
        </p>
        <p>
          <span className="text-muted-foreground">Who owns it:</span>{" "}
          {draft.ownership?.whoOwns !== undefined ? `${draft.ownership.whoOwns}%` : "—"}
        </p>
        <p>
          <span className="text-muted-foreground">Registered:</span>{" "}
          {labelFor(REGISTERED_OPTIONS, draft.ownership?.registered)}
        </p>
        <p>
          <span className="text-muted-foreground">Where:</span> {draft.ownership?.jurisdiction || "—"}
        </p>
      </CardContent>
    </Card>
  );

  const editOwnership = (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Ownership</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-1">
        <div className="space-y-2">
          <Label htmlFor="af-asset-type">Type of asset</Label>
          <Select
            value={draft.assetType ?? ""}
            onValueChange={(v) => setField("assetType", v as AssetType)}
          >
            <SelectTrigger id="af-asset-type">
              <SelectValue placeholder="Select asset type" />
            </SelectTrigger>
            <SelectContent>
              {ASSET_TYPE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="af-who">Who owns it (%)</Label>
          <div className="relative">
            <Input
              id="af-who"
              type="number"
              min={0}
              max={100}
              placeholder="e.g. 100"
              value={draft.ownership?.whoOwns ?? ""}
              onChange={(e) => setNestedNumber("ownership", "whoOwns", e.target.value)}
              className="pr-8"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              %
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Is it registered?</Label>
          <RadioGroup
            value={draft.ownership?.registered ?? ""}
            onValueChange={(v) => setNested("ownership", "registered", v)}
            className="flex flex-wrap gap-4"
          >
            {REGISTERED_OPTIONS.map((o) => (
              <div key={o.value} className="flex items-center gap-2">
                <RadioGroupItem value={o.value} id={`af-reg-${o.value}`} />
                <Label htmlFor={`af-reg-${o.value}`} className="font-normal">
                  {o.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="af-jur">Where (jurisdiction)</Label>
          <Input
            id="af-jur"
            list="af-country-list"
            placeholder="Start typing a country…"
            autoComplete="off"
            value={draft.ownership?.jurisdiction ?? ""}
            onChange={(e) => setNested("ownership", "jurisdiction", e.target.value)}
          />
          <datalist id="af-country-list">
            {COUNTRIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-7">
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Is there IP here?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {canEdit ? (
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                This project creates or uses ownable IP (characters, format, catalog, etc.).
              </p>
              <Switch
                checked={hasIP}
                onCheckedChange={(v) => setField("hasIP", v)}
                aria-label="Project has IP"
              />
            </div>
          ) : (
            <p className="text-sm text-foreground">
              {hasIP ? "Yes — This project creates or uses ownable IP" : "No — Tab not applicable"}
            </p>
          )}
        </CardContent>
      </Card>

      {hasIP &&
        readBlock(
          <>
            {canEdit ? editOwnership : viewOwnership}

            {/* Money history */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Money history — Has it made money?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {canEdit ? (
                  <>
                    <div className="flex items-center justify-between gap-4">
                      <Label htmlFor="af-earned" className="text-muted-foreground font-normal">
                        Has earned revenue
                      </Label>
                      <Switch
                        id="af-earned"
                        checked={Boolean(draft.revenueHistory?.hasEarned)}
                        onCheckedChange={(v) => setNested("revenueHistory", "hasEarned", v)}
                      />
                    </div>

                    {draft.revenueHistory?.hasEarned && (
                      <div className="grid gap-4 sm:grid-cols-1">
                        <MoneyField
                          idPrefix="af-amt"
                          label="Amount"
                          value={draft.revenueHistory?.amount}
                          onChange={(m) => setNested("revenueHistory", "amount", m)}
                        />
                        <div className="space-y-2">
                          <Label htmlFor="af-src">Source</Label>
                          <Select
                            value={draft.revenueHistory?.source ?? ""}
                            onValueChange={(v) => setNested("revenueHistory", "source", v)}
                          >
                            <SelectTrigger id="af-src">
                              <SelectValue placeholder="Select source" />
                            </SelectTrigger>
                            <SelectContent>
                              {REVENUE_SOURCE_OPTIONS.map((o) => (
                                <SelectItem key={o.value} value={o.value}>
                                  {o.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Time period</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label htmlFor="af-period-start" className="text-xs font-normal text-muted-foreground">
                                From
                              </Label>
                              <Input
                                id="af-period-start"
                                type="date"
                                value={draft.revenueHistory?.period?.start ?? ""}
                                onChange={(e) => setDeepNested("revenueHistory", "period", "start", e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="af-period-end" className="text-xs font-normal text-muted-foreground">
                                To
                              </Label>
                              <Input
                                id="af-period-end"
                                type="date"
                                min={draft.revenueHistory?.period?.start || undefined}
                                value={draft.revenueHistory?.period?.end ?? ""}
                                onChange={(e) => setDeepNested("revenueHistory", "period", "end", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="af-proof">Proof upload (optional — unlocks finance visibility)</Label>
                          <label
                            htmlFor="af-proof"
                            className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted/40"
                          >
                            <UploadCloud className="h-4 w-4" />
                            {draft.revenueHistory?.proofUrl ? draft.revenueHistory.proofUrl : "Upload screenshot or statement"}
                          </label>
                          <input
                            id="af-proof"
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setNested("revenueHistory", "proofUrl", file.name);
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : draft.revenueHistory?.hasEarned ? (
                  <>
                    <p>
                      <span className="text-muted-foreground">Amount:</span>{" "}
                      {formatMoney(draft.revenueHistory.amount)}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Source:</span>{" "}
                      {labelFor(REVENUE_SOURCE_OPTIONS, draft.revenueHistory.source)}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Period:</span>{" "}
                      {formatDateRange(draft.revenueHistory.period)}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Proof:</span>{" "}
                      {draft.revenueHistory.proofUrl || "Not provided (finance visibility limited)"}
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground">No revenue recorded yet.</p>
                )}
              </CardContent>
            </Card>

            {/* IP Cost Ledger */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  IP Cost Ledger (money already spent)
                </CardTitle>
              </CardHeader>
              <CardContent className={cn("space-y-2.5 text-sm", canEdit && "grid gap-4")}>
                {canEdit ? (
                  <>
                    {(
                      [
                        ["production", "Production"],
                        ["marketing", "Marketing"],
                        ["legal", "Legal / registration"],
                      ] as const
                    ).map(([key, label]) => (
                      <MoneyField
                        key={key}
                        idPrefix={`af-${key}`}
                        label={label}
                        value={draft.costLedger?.[key]}
                        onChange={(m) => setNested("costLedger", key, m)}
                      />
                    ))}
                  </>
                ) : (
                  draft.costLedger && (
                    <>
                      <p>
                        <span className="text-muted-foreground">Production:</span>{" "}
                        {formatMoney(draft.costLedger.production)}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Marketing:</span>{" "}
                        {formatMoney(draft.costLedger.marketing)}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Legal/registration:</span>{" "}
                        {formatMoney(draft.costLedger.legal)}
                      </p>
                    </>
                  )
                )}
              </CardContent>
            </Card>

            {/* Capital Intent */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Capital Intent — Seeking capital?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {canEdit ? (
                  <>
                    <div className="flex items-center justify-between gap-4">
                      <Label htmlFor="af-seek" className="text-muted-foreground font-normal">
                        Seeking funding
                      </Label>
                      <Switch
                        id="af-seek"
                        checked={Boolean(draft.seekingFunding)}
                        onCheckedChange={(v) => setField("seekingFunding", v)}
                      />
                    </div>
                    {seekingFunding && (
                      <div className="grid gap-4">
                        <MoneyField
                          idPrefix="af-cap"
                          label="Amount"
                          value={draft.capitalIntent?.amount}
                          onChange={(m) => setNested("capitalIntent", "amount", m)}
                        />
                        <div className="space-y-2">
                          <Label htmlFor="af-use">Use of funds</Label>
                          <Select
                            value={draft.capitalIntent?.useOfFunds ?? ""}
                            onValueChange={(v) => {
                              setNested("capitalIntent", "useOfFunds", v);
                              setUfNoteDraft(draft.capitalIntent?.useOfFundsNote ?? "");
                              setUfDialogOpen(true);
                            }}
                          >
                            <SelectTrigger id="af-use">
                              <SelectValue placeholder="Tied to IP growth, not lifestyle" />
                            </SelectTrigger>
                            <SelectContent>
                              {USE_OF_FUNDS_OPTIONS.map((o) => (
                                <SelectItem key={o.value} value={o.value}>
                                  {o.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {draft.capitalIntent?.useOfFunds && (
                            <div className="flex items-start justify-between gap-2 rounded-md border border-dashed border-border px-3 py-2">
                              <p className="text-xs text-muted-foreground">
                                {draft.capitalIntent.useOfFundsNote || "No explanation added yet."}
                              </p>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-auto shrink-0 px-2 py-1 text-xs"
                                onClick={openUseOfFundsDialog}
                              >
                                {draft.capitalIntent.useOfFundsNote ? "Edit" : "Add explanation"}
                              </Button>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-baseline justify-between">
                            <Label htmlFor="af-out">Expected outcome</Label>
                            <span className="text-xs text-muted-foreground">
                              {(draft.capitalIntent?.expectedOutcome ?? "").length}/{EXPECTED_OUTCOME_MAX}
                            </span>
                          </div>
                          <Input
                            id="af-out"
                            placeholder="Simple, not a pitch"
                            maxLength={EXPECTED_OUTCOME_MAX}
                            value={draft.capitalIntent?.expectedOutcome ?? ""}
                            onChange={(e) => setNested("capitalIntent", "expectedOutcome", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="af-del">Delivery guarantee type</Label>
                          <Select
                            value={draft.deliveryGuarantee ?? ""}
                            onValueChange={(v) => setField("deliveryGuarantee", v as DeliveryGuarantee)}
                          >
                            <SelectTrigger id="af-del">
                              <SelectValue placeholder="Choose one" />
                            </SelectTrigger>
                            <SelectContent>
                              {DELIVERY_GUARANTEE_OPTIONS.map((o) => (
                                <SelectItem key={o.value} value={o.value}>
                                  {o.label} — {o.hint}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="af-fail">Failure outcome</Label>
                          <Select
                            value={draft.failureOutcome ?? ""}
                            onValueChange={(v) => setField("failureOutcome", v as FailureOutcome)}
                          >
                            <SelectTrigger id="af-fail">
                              <SelectValue placeholder="Choose one" />
                            </SelectTrigger>
                            <SelectContent>
                              {FAILURE_OUTCOME_OPTIONS.map((o) => (
                                <SelectItem key={o.value} value={o.value} disabled={o.value === "no_remedy" && !isBestEffort}>
                                  {o.label}
                                  {o.value === "no_remedy" && !isBestEffort ? " (Best-Effort only)" : ""}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-foreground">{seekingFunding ? "Yes" : "No"}</p>
                    {seekingFunding && draft.capitalIntent && (
                      <>
                        <p>
                          <span className="text-muted-foreground">Amount:</span>{" "}
                          {formatMoney(draft.capitalIntent.amount)}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Use of funds:</span>{" "}
                          {labelFor(USE_OF_FUNDS_OPTIONS, draft.capitalIntent.useOfFunds)}
                        </p>
                        {draft.capitalIntent.useOfFundsNote && (
                          <p>
                            <span className="text-muted-foreground">Explanation:</span>{" "}
                            {draft.capitalIntent.useOfFundsNote}
                          </p>
                        )}
                        <p>
                          <span className="text-muted-foreground">Expected outcome:</span>{" "}
                          {draft.capitalIntent.expectedOutcome || "—"}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Delivery guarantee:</span>{" "}
                          {labelFor(DELIVERY_GUARANTEE_OPTIONS, draft.deliveryGuarantee)}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Failure outcome:</span>{" "}
                          {labelFor(FAILURE_OUTCOME_OPTIONS, draft.failureOutcome)}
                        </p>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Risk */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Risk — If things go wrong</CardTitle>
              </CardHeader>
              <CardContent className={cn("space-y-4 text-sm", canEdit && "grid gap-4")}>
                {canEdit ? (
                  <>
                    <div className="space-y-2">
                      <Label>Can this asset keep earning without you?</Label>
                      <RadioGroup
                        value={draft.risk?.canEarnWithoutCreator ?? ""}
                        onValueChange={(v) => setNested("risk", "canEarnWithoutCreator", v)}
                        className="flex gap-4"
                      >
                        {YES_NO_OPTIONS.map((o) => (
                          <div key={o.value} className="flex items-center gap-2">
                            <RadioGroupItem value={o.value} id={`af-risk1-${o.value}`} />
                            <Label htmlFor={`af-risk1-${o.value}`} className="font-normal">
                              {o.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label>Can rights be licensed or assigned?</Label>
                      <RadioGroup
                        value={draft.risk?.rightsLicensable ?? ""}
                        onValueChange={(v) => setNested("risk", "rightsLicensable", v)}
                        className="flex gap-4"
                      >
                        {YES_NO_OPTIONS.map((o) => (
                          <div key={o.value} className="flex items-center gap-2">
                            <RadioGroupItem value={o.value} id={`af-risk2-${o.value}`} />
                            <Label htmlFor={`af-risk2-${o.value}`} className="font-normal">
                              {o.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="af-dist">Known distributors or buyers (optional)</Label>
                      <Input
                        id="af-dist"
                        value={draft.risk?.knownDistributors ?? ""}
                        onChange={(e) => setNested("risk", "knownDistributors", e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  draft.risk && (
                    <>
                      <p>
                        Can this asset keep earning without you?{" "}
                        {labelFor(YES_NO_OPTIONS, draft.risk.canEarnWithoutCreator)}
                      </p>
                      <p>
                        Can rights be licensed or assigned?{" "}
                        {labelFor(YES_NO_OPTIONS, draft.risk.rightsLicensable)}
                      </p>
                      {draft.risk.knownDistributors && (
                        <p>
                          <span className="text-muted-foreground">Known distributors/buyers:</span>{" "}
                          {draft.risk.knownDistributors}
                        </p>
                      )}
                    </>
                  )
                )}
              </CardContent>
            </Card>

            {/* Escrow & Kill Switch */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Escrow & Kill Switch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {canEdit ? (
                  <>
                    <div className="flex items-center justify-between gap-4">
                      <Label htmlFor="af-esc" className="text-muted-foreground font-normal">
                        Escrow required
                      </Label>
                      <Switch
                        id="af-esc"
                        checked={Boolean(draft.escrowRequired)}
                        onCheckedChange={(v) => setField("escrowRequired", v)}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <Label htmlFor="af-kill" className="text-muted-foreground font-normal">
                        Kill switch enabled
                      </Label>
                      <Switch
                        id="af-kill"
                        checked={Boolean(draft.killSwitchEnabled)}
                        onCheckedChange={(v) => setField("killSwitchEnabled", v)}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <p>Escrow required: {draft.escrowRequired ? "Yes" : "No"}</p>
                    <p>Kill switch enabled: {draft.killSwitchEnabled ? "Yes" : "No"}</p>
                  </>
                )}
                <p className="text-muted-foreground text-xs mt-2">
                  Kill switch = brand can halt remaining delivery if failure is detected.
                  {!draft.escrowRequired && (
                    <span className="text-amber-600 dark:text-amber-500">
                      {" "}
                      Escrow is off — this asset can&apos;t be attached to high-trust brand deals until it&apos;s enabled.
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
          </>
        )}

      {/* Supporting documents — available regardless of the IP toggle above. */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Supporting documents & attachments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {canEdit && (
            <label
              htmlFor="af-attachments"
              className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted/40"
            >
              <Paperclip className="h-4 w-4" />
              Upload contracts, statements, decks, or any other supporting file
            </label>
          )}
          {canEdit && (
            <input
              id="af-attachments"
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                addAttachments(e.target.files);
                e.target.value = "";
              }}
            />
          )}

          {(draft.attachments ?? []).length === 0 ? (
            <p className="text-muted-foreground">No attachments added yet.</p>
          ) : (
            <ul className="space-y-2.5">
              {(draft.attachments ?? []).map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      {a.url ? (
                        <a
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate text-sm font-medium underline-offset-2 hover:underline"
                        >
                          {a.name}
                        </a>
                      ) : (
                        <p className="truncate text-sm font-medium">{a.name}</p>
                      )}
                      {a.size ? <p className="text-xs text-muted-foreground">{formatFileSize(a.size)}</p> : null}
                    </div>
                  </div>
                  {canEdit && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto shrink-0 p-1"
                      onClick={() => removeAttachment(a.id)}
                      aria-label={`Remove ${a.name}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {canEdit && (
        <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
          <Button
            type="button"
            size="sm"
            disabled={saveMutation.isPending}
            onClick={() => saveMutation.mutate(draft)}
            className="touch-manipulation"
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving…
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      )}

      <Dialog open={ufDialogOpen} onOpenChange={setUfDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Explain use of funds</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {labelFor(USE_OF_FUNDS_OPTIONS, draft.capitalIntent?.useOfFunds)} — tell the brand specifically how this
            money will be used.
          </p>
          <Textarea
            value={ufNoteDraft}
            onChange={(e) => setUfNoteDraft(e.target.value)}
            placeholder="e.g. Covers a 3-day shoot with a 4-person crew and post-production."
            maxLength={USE_OF_FUNDS_NOTE_MAX}
            rows={16}
            className="min-h-[360px] resize-y"
          />
          <div className="text-right text-xs text-muted-foreground">
            {ufNoteDraft.length}/{USE_OF_FUNDS_NOTE_MAX}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setUfDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={saveUseOfFundsNote}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}