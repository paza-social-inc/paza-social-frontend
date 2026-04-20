"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { HARD_NO_OPTIONS, CREATIVE_NON_NEGOTIABLES } from "./showcaseData";
import { cn } from "@/lib/utils";

type GuardrailsData = {
  hardNo?: string[];
  creativeNonNegotiables?: Record<string, boolean>;
  brandDelayRule?: string;
  brandCancellationRule?: string;
  unauthorizedUsageCharge?: boolean;
};

export function GuardrailsSection({ guardrails }: { guardrails: GuardrailsData }) {
  const hardNo = guardrails.hardNo ?? [];
  const creative = guardrails.creativeNonNegotiables ?? {};
  const delayOptions = ["24h", "48h", "72h"];
  const cancellationOptions = ["20%", "40%", "60%"];

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            1) Hard No categories
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            If a mandate is tagged, creator cannot be added unless they explicitly override for that mandate.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {HARD_NO_OPTIONS.map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={hardNo.includes(opt)} readOnly className="pointer-events-none" />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            2) Creative non-negotiables
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {CREATIVE_NON_NEGOTIABLES.map((label, i) => {
            const key = ["noScriptedLines", "noDancing", "noProfanity", "noMedicalClaims", "noPaidAds", "noRepostingToBrand"][i];
            const on = creative[key as keyof typeof creative];
            return (
              <div key={label} className="flex items-center justify-between gap-4">
                <Label className="text-sm font-normal cursor-pointer flex-1">{label}</Label>
                <span className={cn("text-sm font-medium", on ? "text-foreground" : "text-muted-foreground")}>
                  {on ? "On" : "Off"}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            3) Recourse rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">A) Brand delay rule</Label>
            <p className="text-sm mt-1">
              Auto-extend my deadline if brand is late with assets/feedback by:{" "}
              <span className="font-medium">{guardrails.brandDelayRule ?? "—"}</span>
            </p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {delayOptions.map((d) => (
                <span key={d} className="text-xs px-2 py-1 rounded-md bg-muted">{d}</span>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">B) Brand cancellation rule</Label>
            <p className="text-sm mt-1">
              If brand cancels after work starts, creator keeps:{" "}
              <span className="font-medium">{guardrails.brandCancellationRule ?? "—"}</span>
            </p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {cancellationOptions.map((c) => (
                <span key={c} className="text-xs px-2 py-1 rounded-md bg-muted">{c}</span>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">C) Unauthorized usage</Label>
            <p className="text-sm mt-1">
              If brand uses content outside agreed window, charge:{" "}
              {guardrails.unauthorizedUsageCharge ? "Yes" : "No"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
