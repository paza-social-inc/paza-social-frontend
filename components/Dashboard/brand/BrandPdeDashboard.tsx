"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { fetchAuthMe } from "@/lib/data/auth";
import { getBrandPDEProfile } from "@/lib/data/brandPde";
import type { BrandPDESegment } from "@/lib/data/brandPde";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  RiStore2Line,
  RiErrorWarningLine,
  RiLightbulbFlashLine,
  RiRouteLine,
  RiMessageLine,
  RiBrainLine,
  RiBarChartLine,
  RiTeamLine,
  RiCheckLine,
  RiCloseLine,
  RiLoader2Line,
  RiArrowRightLine,
  RiSparklingLine,
  RiArrowDownSLine,
} from "@remixicon/react";
import { cn } from "@/lib/utils";
import { useState } from "react";

/* ── Type-safe helpers for JSON data ── */
function strArr(val: unknown): string[] {
  if (Array.isArray(val)) return val.filter((v): v is string => typeof v === "string");
  return [];
}

function num(val: unknown): number | null {
  return typeof val === "number" ? val : null;
}

function str(val: unknown): string | null {
  return typeof val === "string" ? val : null;
}

/* ── Friction colour mapping ── */
const FRICTION_COLORS: Record<string, string> = {
  trust: "text-red-400 bg-red-400/10 border-red-400/20",
  sensory: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  economic: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  cognitive: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  access: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

function getFrictionBadge(friction: string | null) {
  if (!friction) return null;
  const key = Object.keys(FRICTION_COLORS).find((k) =>
    friction.toLowerCase().includes(k)
  );
  return (
    <Badge
      variant="outline"
      className={cn("capitalize font-medium", key ? FRICTION_COLORS[key] : undefined)}
    >
      {friction}
    </Badge>
  );
}

/* ── Empty State ── */
function EmptyPDEState({ businessId }: { businessId: number }) {
  return (
    <Card className="border-dashed border-2">
      <CardContent className="flex flex-col items-center justify-center py-16 gap-6 text-center">
        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
          <RiBrainLine className="size-8 text-primary" />
        </div>
        <div className="max-w-md space-y-2">
          <h3 className="text-xl font-semibold">No PDE Analysis Yet</h3>
          <p className="text-muted-foreground text-sm">
            Product Demand Environment analysis helps you understand your customer segments at a
            behavioral level — their friction points, decision language, and the best ways to
            activate them through your WhatsApp bot.
          </p>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <p className="text-xs text-muted-foreground">
            Connect your data sources (Shopify reviews, support tickets, FAQs) and run an analysis
            to get started.
          </p>
          <Button variant="outline" disabled className="gap-2 mt-2">
            <RiSparklingLine className="size-4" />
            Run PDE Analysis
            <Badge variant="secondary" className="text-[10px] px-1.5">Coming Soon</Badge>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Loading Skeleton ── */
function PDESkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-3 w-24 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-5 w-32 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <RiLoader2Line className="size-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Error State ── */
function PDEErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="border-red-500/20">
      <CardContent className="flex flex-col items-center justify-center py-12 gap-4 text-center">
        <div className="size-12 rounded-full bg-red-500/10 flex items-center justify-center">
          <RiErrorWarningLine className="size-6 text-red-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Failed to Load PDE Profile</h3>
          <p className="text-muted-foreground text-sm mt-1">
            Something went wrong while fetching your brand&apos;s PDE analysis.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}

/* ── Collapsible section helper ── */
function SectionCollapsible({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="border rounded-md">
      <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium hover:bg-muted/50 transition-colors [&[data-state=open]>svg:last-child]:rotate-180">
        <span className="flex items-center gap-2">{icon}{title}</span>
        <RiArrowDownSLine className="size-4 text-muted-foreground transition-transform duration-200" />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3 pt-1">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

/* ── Segment Detail Panel ── */
function SegmentDetailCard({ segment }: { segment: BrandPDESegment }) {
  const topology = segment.behavioralTopology as Record<string, unknown> | null;
  const forceAnalysis = segment.forceAnalysis as Record<string, unknown> | null;
  const transitions = segment.demandTransitionLogic as Record<string, unknown>[] | null;
  const corridors = segment.opportunityCorridors as Record<string, unknown>[] | null;
  const pazaActivation = segment.pazaActivation as Record<string, unknown> | null;
  const languageMap = segment.languageMap as Record<string, unknown> | null;
  const envFit = segment.environmentalFit as Record<string, unknown> | null;
  const gradients = segment.substitutionGradients as Record<string, unknown> | null;

  const adjacentBehaviors = strArr(topology?.adjacentBehaviors);
  const substitutionBehaviors = strArr(topology?.substitutionBehaviors);
  const supportBehaviors = strArr(topology?.supportBehaviors);
  const frictionBarriers = strArr(forceAnalysis?.frictionBarriers);
  const decisionLanguageReqs = strArr(forceAnalysis?.decisionLanguageRequirements);
  const systemConstraints = strArr(forceAnalysis?.systemConstraints);
  const substitutionForceGradients = forceAnalysis?.substitutionForceGradients as Record<string, unknown> | null;
  const bestDemandWindows = envFit?.bestDemandWindows as Record<string, unknown>[] | null;
  const temporalModifiers = envFit?.temporalModifiers as Record<string, unknown>[] | null;
  const comparisonLanguage = strArr(languageMap?.comparisonLanguage);
  const validationLanguage = strArr(languageMap?.validationLanguage);
  const justificationLanguage = strArr(languageMap?.justificationLanguage);
  const objectionHandling = pazaActivation?.objectionHandling as Record<string, unknown> | null;
  const ctaSuggestions = strArr(pazaActivation?.ctaSuggestions);

  const sourceCount = segment.reviewCount + segment.ticketCount + segment.faqCount;

  return (
    <Card className="border-l-4 border-l-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <RiTeamLine className="size-5 text-primary" />
              {segment.segmentLabel}
            </CardTitle>
            {segment.segmentDescription && (
              <CardDescription className="mt-1">{segment.segmentDescription}</CardDescription>
            )}
          </div>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {sourceCount} data sources
          </Badge>
        </div>

        {segment.bestPitch && (
          <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-start gap-2">
              <RiLightbulbFlashLine className="size-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
                  Best Pitch
                </p>
                <p className="text-sm font-medium">{segment.bestPitch}</p>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick stats row */}
        <div className="flex flex-wrap gap-2">
          {getFrictionBadge(segment.dominantFriction)}
          {segment.topCorridor && (
            <Badge variant="outline" className="gap-1.5">
              <RiRouteLine className="size-3" />
              {segment.topCorridor}
              {segment.corridorConfidence && (
                <span className="text-muted-foreground">· {segment.corridorConfidence}</span>
              )}
            </Badge>
          )}
          {segment.decisionLanguage && (
            <Badge variant="outline" className="gap-1.5">
              <RiMessageLine className="size-3" />
              {segment.decisionLanguage.split(",")[0]?.trim()}
              {segment.decisionLanguage.includes(",") && " +more"}
            </Badge>
          )}
        </div>

        {/* Data quality */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {segment.reviewCount > 0 && <span>{segment.reviewCount} reviews</span>}
          {segment.ticketCount > 0 && <span>{segment.ticketCount} tickets</span>}
          {segment.faqCount > 0 && <span>{segment.faqCount} FAQs</span>}
        </div>

        {/* Collapsible detail sections */}
        <div className="space-y-2">
          {/* Behavioral Topology */}
          {topology && (
            <SectionCollapsible
              title="Behavioral Topology"
              icon={<RiBrainLine className="size-4 text-muted-foreground" />}
            >
              <div className="space-y-2 text-sm">
                {adjacentBehaviors.length > 0 && (
                  <div>
                    <span className="text-muted-foreground font-medium">Adjacent: </span>
                    {adjacentBehaviors.join(", ")}
                  </div>
                )}
                {substitutionBehaviors.length > 0 && (
                  <div>
                    <span className="text-muted-foreground font-medium">Substitution: </span>
                    {substitutionBehaviors.join(", ")}
                  </div>
                )}
                {supportBehaviors.length > 0 && (
                  <div>
                    <span className="text-muted-foreground font-medium">Support: </span>
                    {supportBehaviors.join(", ")}
                  </div>
                )}
                {gradients && Object.keys(gradients).length > 0 && (
                  <div className="mt-2">
                    <span className="text-muted-foreground font-medium">Substitution Gradients: </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {(Object.entries(gradients) as [string, unknown][]).map(([key, val]) => (
                        <Badge key={key} variant="outline" className="text-[11px] capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                          {typeof val === "string" ? ` ${val}` : " detected"}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </SectionCollapsible>
          )}

          {/* Force Analysis */}
          {forceAnalysis && (
            <SectionCollapsible
              title="Force Analysis"
              icon={<RiErrorWarningLine className="size-4 text-muted-foreground" />}
            >
              <div className="space-y-3 text-sm">
                {frictionBarriers.length > 0 && (
                  <div>
                    <span className="text-muted-foreground font-medium">Friction Barriers: </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {frictionBarriers.map((f: string, i: number) => (
                        <span key={i} className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border",
                          FRICTION_COLORS[f.toLowerCase()] || "border-muted text-muted-foreground"
                        )}>
                          <RiCloseLine className="size-3" />
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {decisionLanguageReqs.length > 0 && (
                  <div>
                    <span className="text-muted-foreground font-medium">Decision Language: </span>
                    <p className="mt-0.5">
                      {decisionLanguageReqs.join(", ")}
                    </p>
                  </div>
                )}
                {systemConstraints.length > 0 && (
                  <div>
                    <span className="text-muted-foreground font-medium">Constraints: </span>
                    <p className="mt-0.5">
                      {systemConstraints.join(", ")}
                    </p>
                  </div>
                )}
                {substitutionForceGradients && Object.keys(substitutionForceGradients).length > 0 && (
                  <div>
                    <span className="text-muted-foreground font-medium">Substitution Force Gradients: </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                      {Object.entries(substitutionForceGradients).map(([key, val]) => (
                        <Badge
                          key={key}
                          variant="outline"
                          className={cn(
                            "justify-between capitalize text-[11px]",
                            val === "detected"
                              ? "border-green-500/30 text-green-400"
                              : "border-muted text-muted-foreground"
                          )}
                        >
                          <span>{key.replace(/([A-Z])/g, " $1").trim()}</span>
                          <RiCheckLine
                            className={cn(
                              "size-3",
                              val === "detected" ? "text-green-400" : "text-muted-foreground/40"
                            )}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </SectionCollapsible>
          )}

          {/* Environmental Fit */}
          {envFit && (
            <SectionCollapsible
              title="Environmental Fit"
              icon={<RiBarChartLine className="size-4 text-muted-foreground" />}
            >
              <div className="space-y-2 text-sm">
                {bestDemandWindows && bestDemandWindows.length > 0 && (
                  <div>
                    <span className="text-muted-foreground font-medium">Best Windows: </span>
                    <p>{bestDemandWindows.map(
                      (w: Record<string, unknown>) => `${w.day ?? w.time ?? w.window ?? ""}`
                    ).join(", ")}</p>
                  </div>
                )}
                {temporalModifiers && temporalModifiers.length > 0 && (
                  <div className="mt-2">
                    <span className="text-muted-foreground font-medium">Temporal Modifiers: </span>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {temporalModifiers.map(
                        (tm: Record<string, unknown>, i: number) => (
                          <li key={i} className="text-xs text-muted-foreground">
                            {str(tm.month) ? `${str(tm.month)}: ` : ""}
                            {str(tm.description) ?? ""}
                            {num(tm.boost) !== null && (
                              <Badge variant="outline" className="ml-1 text-[10px]">
                                +{(num(tm.boost)! * 100).toFixed(0)}%
                              </Badge>
                            )}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </SectionCollapsible>
          )}

          {/* Opportunity Corridors */}
          {corridors && corridors.length > 0 && (
            <SectionCollapsible
              title={`Opportunity Corridors (${corridors.length})`}
              icon={<RiRouteLine className="size-4 text-muted-foreground" />}
            >
              <div className="space-y-3">
                {corridors.map((c: Record<string, unknown>, i: number) => {
                  const cName = str(c.name);
                  const cRank = num(c.rank);
                  const cConfidence = num(c.confidence);
                  const cDesc = str(c.description);
                  const cFriction = str(c.dominantFriction);
                  return (
                    <div key={i} className="p-3 rounded-lg border bg-card/50">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary/60">#{i + 1}</span>
                          <span className="font-medium">{cName ?? "Unnamed"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {cRank !== null && (
                            <Badge variant="outline" className="text-[10px]">
                              Rank {cRank}
                            </Badge>
                          )}
                          {cConfidence !== null && (
                            <Badge variant="secondary" className="text-[10px]">
                              {(cConfidence * 100).toFixed(0)}% confidence
                            </Badge>
                          )}
                        </div>
                      </div>
                      {cDesc && (
                        <p className="text-xs text-muted-foreground mt-1">{cDesc}</p>
                      )}
                      {cFriction !== null && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">Friction:</span>
                          <Badge variant="outline" className="text-[10px] capitalize">{cFriction}</Badge>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </SectionCollapsible>
          )}

          {/* Demand Transitions */}
          {transitions && transitions.length > 0 && (
            <SectionCollapsible
              title={`Demand Transitions (${transitions.length})`}
              icon={<RiArrowRightLine className="size-4 text-muted-foreground" />}
            >
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {transitions.map((t: Record<string, unknown>, i: number) => {
                  const tProb = num(t.probability);
                  const tOrigin = str(t.origin) ?? "current";
                  const tDest = str(t.destination) ?? "target";
                  return (
                    <div key={i} className="flex items-center gap-2 text-sm p-2 rounded border bg-card/30">
                      <span className="font-medium capitalize">{tOrigin} → {tDest}</span>
                      {tProb !== null && (
                        <Badge variant="outline" className="text-[10px] ml-auto shrink-0">
                          {(tProb * 100).toFixed(0)}%
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </SectionCollapsible>
          )}

          {/* Language Map */}
          {languageMap && (
            <SectionCollapsible
              title="Language Map"
              icon={<RiMessageLine className="size-4 text-muted-foreground" />}
            >
              <div className="space-y-2 text-sm">
                {comparisonLanguage.length > 0 && (
                  <div>
                    <span className="text-muted-foreground font-medium">Comparison: </span>
                    <p className="text-xs mt-0.5">{comparisonLanguage.join(" · ")}</p>
                  </div>
                )}
                {validationLanguage.length > 0 && (
                  <div className="mt-2">
                    <span className="text-muted-foreground font-medium">Validation: </span>
                    <p className="text-xs mt-0.5">{validationLanguage.join(" · ")}</p>
                  </div>
                )}
                {justificationLanguage.length > 0 && (
                  <div className="mt-2">
                    <span className="text-muted-foreground font-medium">Justification: </span>
                    <p className="text-xs mt-0.5">{justificationLanguage.join(" · ")}</p>
                  </div>
                )}
              </div>
            </SectionCollapsible>
          )}

          {/* Paza Activation */}
          {pazaActivation && (
            <SectionCollapsible
              title="Paza Activation"
              icon={<RiSparklingLine className="size-4 text-muted-foreground" />}
            >
              <div className="space-y-2 text-sm">
                {str(pazaActivation.bestPitch) && (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <span className="text-muted-foreground font-medium block text-xs uppercase tracking-wider mb-1">
                      Best Pitch
                    </span>
                    <p className="font-medium">{str(pazaActivation.bestPitch)}</p>
                  </div>
                )}
                {objectionHandling && Object.keys(objectionHandling).length > 0 && (
                  <div className="mt-2">
                    <span className="text-muted-foreground font-medium">Objection Handling: </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {Object.entries(objectionHandling).map(([key, val]) => (
                        <Badge key={key} variant="outline" className="text-[11px]">
                          {key}: {typeof val === "string" ? val.slice(0, 40) : JSON.stringify(val).slice(0, 40)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {ctaSuggestions.length > 0 && (
                  <div className="mt-2">
                    <span className="text-muted-foreground font-medium">CTA Suggestions: </span>
                    <ul className="list-disc list-inside mt-1">
                      {ctaSuggestions.map((cta: string, i: number) => (
                        <li key={i} className="text-xs text-muted-foreground">{cta}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </SectionCollapsible>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Main Brand PDE Dashboard ── */
export default function BrandPdeDashboard() {
  const { user, token, isAuthenticated } = useAuth();

  // Resolve businessId
  const { data: authMe, isLoading: authLoading } = useQuery({
    queryKey: ["auth-me", token ?? null],
    queryFn: fetchAuthMe,
    enabled: Boolean(isAuthenticated && token),
    staleTime: 5 * 60 * 1000,
  });

  const businessId = authMe?.businessId;
  const hasBusinessId = businessId != null && businessId > 0;

  // Fetch PDE profile
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    refetch,
  } = useQuery({
    queryKey: ["brand-pde-profile", businessId],
    queryFn: () => getBrandPDEProfile(businessId!),
    enabled: hasBusinessId,
    staleTime: 2 * 60 * 1000,
  });

  const isLoading = authLoading || (hasBusinessId && profileLoading);
  const isEmpty = !isLoading && !profileError && !profile;
  const hasData = !isLoading && !profileError && profile != null;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-3 py-5 sm:px-5 sm:py-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <RiBrainLine className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">PDE Insights</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Product Demand Environment — behavioral analysis for your customer segments.
            </p>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && <PDESkeleton />}

      {/* Error */}
      {profileError && !isLoading && (
        <PDEErrorState onRetry={() => refetch()} />
      )}

      {/* Empty — no profile yet */}
      {isEmpty && (
        <EmptyPDEState businessId={businessId ?? 0} />
      )}

      {/* Data */}
      {hasData && profile && (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <RiStore2Line className="size-4" />
                  Product Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold truncate" title={profile.productCategory ?? undefined}>
                  {profile.productCategory || "—"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <RiBarChartLine className="size-4" />
                  Core Function
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold truncate text-sm" title={profile.coreFunction ?? undefined}>
                  {profile.coreFunction || "—"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <RiErrorWarningLine className="size-4" />
                  Dominant Frictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold truncate text-sm" title={profile.dominantFrictions ?? undefined}>
                  {profile.dominantFrictions || "None identified"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <RiLightbulbFlashLine className="size-4" />
                  Top Opportunity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold truncate text-sm" title={profile.topOpportunity ?? undefined}>
                  {profile.topOpportunity || "—"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Segments detail */}
          {profile.segments && profile.segments.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <RiTeamLine className="size-5 text-muted-foreground" />
                  Customer Segments
                  <Badge variant="secondary">{profile.segments.length}</Badge>
                </h2>
              </div>
              <div className="space-y-4">
                {profile.segments.map((segment) => (
                  <SegmentDetailCard key={segment.id} segment={segment} />
                ))}
              </div>
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                <RiTeamLine className="size-8 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">No Segments Analyzed</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Run a PDE analysis on your customer segments to see insights here.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
