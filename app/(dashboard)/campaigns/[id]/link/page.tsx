"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Link2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { campaignApi, parseCampaignId } from "@/lib/data/campaigns";
import type { Campaign } from "@/types/campaigns/campaignTypes";

function campaignBudgetLabel(c: Campaign): string {
  const b = c.budget;
  if (b == null || b === "") return "—";
  const n = typeof b === "number" ? b : Number(b);
  if (!Number.isFinite(n)) return String(b);
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

export default function LinkCampaignPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const campaignId = useMemo(() => {
    const raw = params?.id;
    return parseCampaignId(Array.isArray(raw) ? raw[0] : raw);
  }, [params?.id]);

  const [selectedId, setSelectedId] = useState<string>("");

  const { data: current, isLoading: loadingCurrent } = useQuery({
    queryKey: ["campaign", campaignId],
    queryFn: () => campaignApi.getById(campaignId!),
    enabled: campaignId != null,
  });

  const {
    data: linkable = [],
    isLoading: loadingLinkable,
    isError: linkableError,
    error: linkableErr,
  } = useQuery({
    queryKey: ["campaigns", "linkable-accepted", campaignId],
    queryFn: () => campaignApi.getLinkableAccepted(campaignId!),
    enabled: campaignId != null,
  });

  const linkMutation = useMutation({
    mutationFn: (linkedCampaignId: number) =>
      campaignApi.linkToAcceptedCampaign(campaignId!, linkedCampaignId),
    onSuccess: () => {
      toast.success("Campaign linked");
      queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      router.push(`/campaigns/${campaignId}`);
    },
    onError: (err: unknown) => {
      const ax = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(ax.response?.data?.message ?? ax.message ?? "Could not link campaign");
    },
  });

  if (campaignId == null) {
    return (
      <div className="mx-auto max-w-lg p-6">
        <p className="text-muted-foreground">Invalid campaign.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/campaigns")}>
          Back to campaigns
        </Button>
      </div>
    );
  }

  const loading = loadingCurrent || loadingLinkable;
  const linkableErrMsg =
    linkableError && linkableErr instanceof Error ? linkableErr.message : "Could not load campaigns";

  return (
    <div className="mx-auto max-w-xl space-y-6 p-4 pb-16 sm:p-6">
      <div className="flex items-start gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => router.push(`/campaigns/${campaignId}`)}
          aria-label="Back to campaign"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Link campaign
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose another campaign you own that already has an{" "}
            <span className="font-medium text-foreground">accepted creator proposal</span> (hired job).
            It will be linked to{" "}
            <span className="font-medium text-foreground">
              {loadingCurrent ? "…" : current?.title ?? `Campaign #${campaignId}`}
            </span>
            .
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading…
        </div>
      ) : linkableError ? (
        <Card className="border-destructive/40">
          <CardContent className="p-4 text-sm text-destructive">{linkableErrMsg}</CardContent>
        </Card>
      ) : linkable.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            No eligible campaigns yet. Create a job from a campaign and accept a creator proposal—then
            you can link that campaign here.
          </CardContent>
        </Card>
      ) : (
        <RadioGroup value={selectedId} onValueChange={setSelectedId} className="space-y-3">
          {linkable.map((c) => {
            const idStr = String(c.id);
            return (
              <Label
                key={c.id}
                htmlFor={`link-${c.id}`}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors has-data-[state=checked]:border-orange-500/70 has-data-[state=checked]:bg-orange-500/5"
              >
                <RadioGroupItem value={idStr} id={`link-${c.id}`} className="mt-1 border-orange-500 text-orange-600" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{c.title}</p>
                  {c.description ? (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.description}</p>
                  ) : null}
                  <p className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                    Budget {campaignBudgetLabel(c)} · ID {c.id}
                  </p>
                </div>
              </Label>
            );
          })}
        </RadioGroup>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/campaigns/${campaignId}`)}
          disabled={linkMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="bg-orange-500 text-white hover:bg-orange-600"
          disabled={!selectedId || linkMutation.isPending || linkable.length === 0}
          onClick={() => {
            const n = Number(selectedId);
            if (!Number.isFinite(n)) return;
            linkMutation.mutate(n);
          }}
        >
          {linkMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Linking…
            </>
          ) : (
            <>
              <Link2 className="mr-2 h-4 w-4" />
              Link selected campaign
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
