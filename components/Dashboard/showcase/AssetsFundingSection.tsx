"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { projectsApi } from "@/lib/data/projects";
import type { AssetsFunding, Project } from "@/types/projects/projectTypes";
import { cn } from "@/lib/utils";

const EMPTY_ASSETS_FUNDING: AssetsFunding = {
  hasIP: false,
  ownership: { whoOwns: "", registered: "", jurisdiction: "" },
  revenueHistory: { hasEarned: false, amount: "", source: "", period: "" },
  costLedger: { production: "", marketing: "", legal: "" },
  seekingFunding: false,
  capitalIntent: { amount: "", useOfFunds: "", expectedOutcome: "" },
  deliveryGuarantee: "",
  failureOutcome: "",
  risk: { canEarnWithoutCreator: "", rightsLicensable: "" },
  escrowRequired: false,
  killSwitchEnabled: false,
};

function mergeLayer<T extends Record<string, unknown>>(base: T, over: Partial<T> | undefined): T {
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
      revenueHistory: mergeLayer(EMPTY_ASSETS_FUNDING.revenueHistory!, a.revenueHistory),
      costLedger: mergeLayer(EMPTY_ASSETS_FUNDING.costLedger!, a.costLedger),
      capitalIntent: mergeLayer(EMPTY_ASSETS_FUNDING.capitalIntent!, a.capitalIntent),
      risk: mergeLayer(EMPTY_ASSETS_FUNDING.risk!, a.risk),
    };
  }

  const p = project as Record<string, unknown>;
  return {
    ...EMPTY_ASSETS_FUNDING,
    hasIP: Boolean(p.hasIP),
    ownership: mergeLayer(EMPTY_ASSETS_FUNDING.ownership!, p.ownership as Record<string, string>),
    revenueHistory: mergeLayer(EMPTY_ASSETS_FUNDING.revenueHistory!, p.revenueHistory as Record<string, unknown>),
    costLedger: mergeLayer(EMPTY_ASSETS_FUNDING.costLedger!, p.costLedger as Record<string, string>),
    seekingFunding: Boolean(p.seekingFunding),
    capitalIntent: mergeLayer(EMPTY_ASSETS_FUNDING.capitalIntent!, p.capitalIntent as Record<string, string>),
    deliveryGuarantee: String(p.deliveryGuarantee ?? ""),
    failureOutcome: String(p.failureOutcome ?? ""),
    risk: mergeLayer(EMPTY_ASSETS_FUNDING.risk!, p.risk as Record<string, string>),
    escrowRequired: Boolean(p.escrowRequired),
    killSwitchEnabled: Boolean(p.killSwitchEnabled),
  };
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

  const setField = <K extends keyof AssetsFunding>(key: K, value: AssetsFunding[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const setNested = <P extends keyof AssetsFunding, K extends string>(
    parent: P,
    key: K,
    value: string | boolean
  ) => {
    setDraft((d) => {
      const cur = (d[parent] ?? {}) as Record<string, unknown>;
      return { ...d, [parent]: { ...cur, [key]: value } };
    });
  };

  const readBlock = (children: React.ReactNode) => (
    <div className="space-y-6">{children}</div>
  );

  const viewOwnership = (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Ownership</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {draft.ownership && (
          <>
            <p>
              <span className="text-muted-foreground">Who owns it:</span> {draft.ownership.whoOwns || "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Registered:</span> {draft.ownership.registered || "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Where:</span> {draft.ownership.jurisdiction || "—"}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );

  const editOwnership = (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Ownership</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-1">
        <div className="space-y-1.5">
          <Label htmlFor="af-who">Who owns it</Label>
          <Input
            id="af-who"
            value={draft.ownership?.whoOwns ?? ""}
            onChange={(e) => setNested("ownership", "whoOwns", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="af-reg">Registered</Label>
          <Input
            id="af-reg"
            value={draft.ownership?.registered ?? ""}
            onChange={(e) => setNested("ownership", "registered", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="af-jur">Jurisdiction</Label>
          <Input
            id="af-jur"
            value={draft.ownership?.jurisdiction ?? ""}
            onChange={(e) => setNested("ownership", "jurisdiction", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {canEdit && (
        <div className="flex flex-wrap items-center justify-end gap-2">
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

      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Is there IP here?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {canEdit ? (
            <div className="flex items-center justify-between gap-3">
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

            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Money history — Has it made money?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {canEdit ? (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <Label htmlFor="af-earned" className="text-muted-foreground font-normal">
                        Has earned revenue
                      </Label>
                      <Switch
                        id="af-earned"
                        checked={Boolean(draft.revenueHistory?.hasEarned)}
                        onCheckedChange={(v) => setNested("revenueHistory", "hasEarned", v)}
                      />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-1">
                      <div className="space-y-1.5">
                        <Label htmlFor="af-amt">Amount</Label>
                        <Input
                          id="af-amt"
                          value={draft.revenueHistory?.amount ?? ""}
                          onChange={(e) => setNested("revenueHistory", "amount", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="af-src">Source</Label>
                        <Input
                          id="af-src"
                          value={draft.revenueHistory?.source ?? ""}
                          onChange={(e) => setNested("revenueHistory", "source", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="af-period">Period</Label>
                        <Input
                          id="af-period"
                          value={draft.revenueHistory?.period ?? ""}
                          onChange={(e) => setNested("revenueHistory", "period", e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                ) : draft.revenueHistory?.hasEarned ? (
                  <>
                    <p>
                      <span className="text-muted-foreground">Amount:</span> {draft.revenueHistory.amount}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Source:</span> {draft.revenueHistory.source}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Period:</span> {draft.revenueHistory.period}
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground">No revenue recorded yet.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  IP Cost Ledger (money already spent)
                </CardTitle>
              </CardHeader>
              <CardContent className={cn("space-y-2 text-sm", canEdit && "grid gap-3")}>
                {canEdit ? (
                  <>
                    <div className="space-y-1.5">
                      <Label htmlFor="af-prod">Production</Label>
                      <Input
                        id="af-prod"
                        value={draft.costLedger?.production ?? ""}
                        onChange={(e) => setNested("costLedger", "production", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="af-mkt">Marketing</Label>
                      <Input
                        id="af-mkt"
                        value={draft.costLedger?.marketing ?? ""}
                        onChange={(e) => setNested("costLedger", "marketing", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="af-leg">Legal / registration</Label>
                      <Input
                        id="af-leg"
                        value={draft.costLedger?.legal ?? ""}
                        onChange={(e) => setNested("costLedger", "legal", e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  draft.costLedger && (
                    <>
                      <p>
                        <span className="text-muted-foreground">Production:</span> {draft.costLedger.production}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Marketing:</span> {draft.costLedger.marketing}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Legal/registration:</span> {draft.costLedger.legal}
                      </p>
                    </>
                  )
                )}
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Capital Intent — Seeking capital?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {canEdit ? (
                  <>
                    <div className="flex items-center justify-between gap-3">
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
                      <div className="grid gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="af-cap-amt">Amount</Label>
                          <Input
                            id="af-cap-amt"
                            value={draft.capitalIntent?.amount ?? ""}
                            onChange={(e) => setNested("capitalIntent", "amount", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="af-use">Use of funds</Label>
                          <Input
                            id="af-use"
                            value={draft.capitalIntent?.useOfFunds ?? ""}
                            onChange={(e) => setNested("capitalIntent", "useOfFunds", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="af-out">Expected outcome</Label>
                          <Input
                            id="af-out"
                            value={draft.capitalIntent?.expectedOutcome ?? ""}
                            onChange={(e) => setNested("capitalIntent", "expectedOutcome", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="af-del">Delivery guarantee</Label>
                          <Input
                            id="af-del"
                            value={draft.deliveryGuarantee ?? ""}
                            onChange={(e) => setField("deliveryGuarantee", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="af-fail">Failure outcome</Label>
                          <Input
                            id="af-fail"
                            value={draft.failureOutcome ?? ""}
                            onChange={(e) => setField("failureOutcome", e.target.value)}
                          />
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
                          <span className="text-muted-foreground">Amount:</span> {draft.capitalIntent.amount}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Use of funds:</span> {draft.capitalIntent.useOfFunds}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Expected outcome:</span>{" "}
                          {draft.capitalIntent.expectedOutcome}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Delivery guarantee:</span> {draft.deliveryGuarantee}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Failure outcome:</span> {draft.failureOutcome}
                        </p>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Risk — If things go wrong</CardTitle>
              </CardHeader>
              <CardContent className={cn("space-y-2 text-sm", canEdit && "grid gap-3")}>
                {canEdit ? (
                  <>
                    <div className="space-y-1.5">
                      <Label htmlFor="af-risk1">Can this asset keep earning without you?</Label>
                      <Input
                        id="af-risk1"
                        value={draft.risk?.canEarnWithoutCreator ?? ""}
                        onChange={(e) => setNested("risk", "canEarnWithoutCreator", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="af-risk2">Can rights be licensed or assigned?</Label>
                      <Input
                        id="af-risk2"
                        value={draft.risk?.rightsLicensable ?? ""}
                        onChange={(e) => setNested("risk", "rightsLicensable", e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  draft.risk && (
                    <>
                      <p>Can this asset keep earning without you? {draft.risk.canEarnWithoutCreator}</p>
                      <p>Can rights be licensed or assigned? {draft.risk.rightsLicensable}</p>
                    </>
                  )
                )}
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Escrow & Kill Switch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {canEdit ? (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <Label htmlFor="af-esc" className="text-muted-foreground font-normal">
                        Escrow required
                      </Label>
                      <Switch
                        id="af-esc"
                        checked={Boolean(draft.escrowRequired)}
                        onCheckedChange={(v) => setField("escrowRequired", v)}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3">
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
                  Kill switch = brand can halt remaining delivery if failure is detected. If escrow = No, asset cannot
                  be used in high-trust brand deals.
                </p>
              </CardContent>
            </Card>
          </>
        )}
    </div>
  );
}
