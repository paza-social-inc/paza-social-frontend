"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Zap,
  Target,
  Users,
  Globe,
  TrendingUp,
  MessageCircle,
  AlertTriangle,
  ShoppingCart,
  BarChart3,
  Lightbulb,
  CheckCircle2,
  Loader2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  BrainCircuit,
  DollarSign,
  Clock,
  MapPin,
  Shield,
  Eye,
  Layers,
  ArrowRight,
  Search,
  RefreshCw,
  FileText,
  Info,
  Rocket,
  Flag,
  Gauge,
  Hash,
  Ban,
  Route,
  Sigma,
  ArrowLeftRight,
  List,
  Activity,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types — PDE 6.11 spec-complete                                    */
/* ------------------------------------------------------------------ */

type PDEUsageFrequency = "daily" | "weekly" | "episodic" | "one-time";
type PDETransactionSurface = "Shopify" | "WhatsApp" | "Physical Retail" | "Mobile App" | "Custom Web";
type PDEFulfillmentReality = "Instant Retail" | "<24 Hours" | "48-72 Hours" | ">7 Days";
type PDEBusinessObjective = "trial_acquisition" | "customer_retention" | "competitor_switching" | "market_expansion";
type PDEFrictionType = "trust" | "sensory" | "economic" | "cognitive" | "access";
type PDECorridorConfidence = "low" | "medium" | "high";
type PDESubstitutionGradient = "hard" | "soft" | "avoidance";
type PDEFeasibility = "blocked" | "constrained" | "viable" | "highly_viable";

interface PDEInput {
  productCategory: string;
  coreFunction: string;
  usageTrigger: string;
  usageFrequency: PDEUsageFrequency;
  dependencyUnit: string;
  failureOutcome: string;  // spec 6.1
  pricePoint: number;
  geography: string[];
  transactionSurface: PDETransactionSurface;
  regulatoryConstraints: string[];
  fulfillmentReality: PDEFulfillmentReality;
  businessObjective: PDEBusinessObjective;
  customerReviews: string[];
  supportTickets: string[];
  faqs: string[];
  customerCommunications: string[];
  marketingCopy: string[];
  directCompetitors: string[];
  customerMentionedAlternatives: string[];
  knownUserWorkarounds: string[];  // spec 6.4
  repeatPurchaseRate?: number;
  cartAbandonmentRate?: number;
  geographicSalesDistribution?: Record<string, number>;
  seasonalSalesVariation?: number[];
  skuPerformanceMetrics?: Record<string, number>;
  observedSignals?: string[];
  technologies?: string[];
  evidence?: string[];
}

interface LanguageMapEntry {
  phrase: string;
  source: string;
  weight: number;
}

interface DemandTransition {
  originState: string;
  destinationState: string;
  probability: number;
  triggerRequired: string;
  substitutionGradient: PDESubstitutionGradient;
  frictionBarriers: PDEFrictionType[];
  criticalValidation: string[];
  feasibility: PDEFeasibility;
}

interface PDEOpportunityCorridor {
  rank: number;
  name: string;
  transition: string;
  temporalWindow: string;
  temporalConfidence: PDECorridorConfidence;
  dominantFriction: PDEFrictionType | null;
  dominantFrictionConfidence: PDECorridorConfidence;
  validationLanguage: { phrase: string; confidence: PDECorridorConfidence }[];
  confidence: PDECorridorConfidence;
}

interface PDEOutput {
  functionalProfile: {
    productCategory: string;
    coreFunction: string;
    usageTrigger: string;
    usageFrequency: string;
    dependencyUnit: string;
    failureOutcome: string;
    pricePoint: number;
  };
  behavioralTopology: {
    adjacentBehaviors: string[];
    substitutionBehaviors: string[];
    substitutionGradients: { behavior: string; gradient: PDESubstitutionGradient; resistanceLevel: string }[];
    supportBehaviors: string[];
    transitionTriggers: string[];
  };
  forceAnalysis: {
    frictionBarriers: PDEFrictionType[];
    frictionDetails: { type: PDEFrictionType; intensity: "low" | "medium" | "high"; confidence: PDECorridorConfidence; evidence: string[] }[];
    decisionLanguageRequirements: string[];
    systemConstraints: string[];
    substitutionForceGradients: { type: PDESubstitutionGradient; label: string; detected: boolean; evidence: string[] }[];
  };
  environmentalFit: {
    activeGeographies: string[];
    transactionSurface: string;
    fulfillmentReality: string;
    bestDemandWindows: string[];
    temporalModifiers: { season: string; activationProbabilityBoost: number; triggerEvent: string }[];
  };
  languageMap: {
    comparisonLanguage: LanguageMapEntry[];
    validationLanguage: LanguageMapEntry[];
    justificationLanguage: LanguageMapEntry[];
    rejectionLanguage: LanguageMapEntry[];
  };
  demandTransitionLogic: DemandTransition[];
  prunedZones: { reason: string; constraint: string; eliminatedCorridors: string[] }[];
  opportunityCorridors: PDEOpportunityCorridor[];
  pazaActivation: {
    bestPitch: string;
    recommendedWhatsappHooks: string[];
    recommendedObjectionHandling: string[];
    recommendedRetargetingAngles: string[];
    recommendedCreatorTraits: string[];
    recommendedCampaignAngles: string[];
  };
}

/* ------------------------------------------------------------------ */
/*  Presets with new fields                                            */
/* ------------------------------------------------------------------ */

const PRESETS: { label: string; icon: typeof Sparkles; input: PDEInput }[] = [
  {
    label: "African Beauty Brand",
    icon: Sparkles,
    input: {
      productCategory: "Natural Skincare",
      coreFunction: "Connects creator activity to commercially verifiable business outcomes",
      usageTrigger: "User enters WhatsApp conversation path",
      usageFrequency: "episodic",
      dependencyUnit: "1 brand workspace / creator program",
      failureOutcome: "Customers lose access to personalized skincare matching and community-driven purchasing",
      pricePoint: 29,
      geography: ["Nigeria", "Kenya", "Ghana", "South Africa"],
      transactionSurface: "WhatsApp",
      regulatoryConstraints: ["NAFDAC compliance", "cosmetic registration"],
      fulfillmentReality: "48-72 Hours",
      businessObjective: "customer_retention",
      customerReviews: ["The product is great but delivery takes too long", "Love the smell but expensive"],
      supportTickets: ["Where is my order?", "How do I track delivery"],
      faqs: ["What ingredients do you use?", "Do you ship internationally"],
      customerCommunications: [],
      marketingCopy: ["DM to order", "link in bio", "limited drop", "creator collaboration"],
      directCompetitors: ["L'Oréal", "Cecred"],
      customerMentionedAlternatives: ["shopify-only stack", "manual whatsapp selling"],
      knownUserWorkarounds: ["Using Instagram DMs to coordinate group orders", "Going to local beauty supply stores instead"],
      repeatPurchaseRate: 35,
      observedSignals: ["instagram creator", "whatsapp commerce", "link in bio"],
      technologies: ["whatsapp", "instagram", "paystack"],
    },
  },
  {
    label: "SaaS Analytics Tool",
    icon: BarChart3,
    input: {
      productCategory: "B2B Analytics Software",
      coreFunction: "Connects demand signals, identity, and business conversion events",
      usageTrigger: "Traffic enters tracked acquisition flow",
      usageFrequency: "daily",
      dependencyUnit: "1 business workspace",
      failureOutcome: "Teams lack visibility into campaign performance and miss revenue attribution data",
      pricePoint: 99,
      geography: ["United States", "United Kingdom", "Canada"],
      transactionSurface: "Custom Web",
      regulatoryConstraints: ["GDPR", "CCPA"],
      fulfillmentReality: "Instant Retail",
      businessObjective: "trial_acquisition",
      customerReviews: ["The setup was confusing", "Great insights once configured", "API docs could be clearer"],
      supportTickets: ["How do I integrate with our CRM?", "Dashboard not loading"],
      faqs: ["Is my data secure?", "Do you offer a free trial"],
      customerCommunications: [],
      marketingCopy: ["analytics for modern teams", "data-driven decisions", "try free for 14 days"],
      directCompetitors: ["Amplitude", "Mixpanel", "Hotjar"],
      customerMentionedAlternatives: ["manual spreadsheets", "google analytics"],
      knownUserWorkarounds: ["Exporting data to Google Sheets for manual analysis", "Relying on fragmented CSV reports"],
    },
  },
  {
    label: "Meal Prep Delivery",
    icon: ShoppingCart,
    input: {
      productCategory: "Food Delivery & Meal Prep",
      coreFunction: "Connects buyer identity, conversation history, and commerce actions",
      usageTrigger: "User reaches checkout or purchase intent stage",
      usageFrequency: "weekly",
      dependencyUnit: "1 commerce workspace",
      failureOutcome: "Customers revert to cooking from scratch or ordering from unverified local vendors",
      pricePoint: 45,
      geography: ["Nigeria", "Ghana"],
      transactionSurface: "WhatsApp",
      regulatoryConstraints: ["food safety certification", "NAFDAC"],
      fulfillmentReality: "<24 Hours",
      businessObjective: "competitor_switching",
      customerReviews: ["The meals are amazing but sometimes late", "Best meal prep in Lagos"],
      supportTickets: ["Missed delivery window", "Wrong meal delivered"],
      faqs: ["Do you deliver on weekends?", "Can I customize my meals"],
      customerCommunications: [],
      marketingCopy: ["fresh meals delivered", "order via WhatsApp", "weekly meal plans"],
      directCompetitors: ["HelloFresh", "local meal prep services"],
      customerMentionedAlternatives: ["manual whatsapp selling", "spreadsheets"],
      knownUserWorkarounds: ["Buying ingredients and cooking in bulk on Sundays", "Rotating between local food vendors"],
      repeatPurchaseRate: 60,
      technologies: ["whatsapp", "paystack"],
    },
  },
  {
    label: "Fashion E‑commerce",
    icon: Eye,
    input: {
      productCategory: "Fashion & Apparel",
      coreFunction: "Connects creator activity to commercially verifiable business outcomes",
      usageTrigger: "Audience interacts with creator-led discovery",
      usageFrequency: "episodic",
      dependencyUnit: "1 brand workspace / creator program",
      failureOutcome: "Potential buyers lose trust and revert to fast-fashion alternatives with faster shipping",
      pricePoint: 59,
      geography: ["South Africa", "Nigeria", "Kenya", "Global"],
      transactionSurface: "Shopify",
      regulatoryConstraints: [],
      fulfillmentReality: "48-72 Hours",
      businessObjective: "market_expansion",
      customerReviews: ["The fabric is amazing", "Love the new collection", "Sizing runs small"],
      supportTickets: ["Size exchange request", "Order not received"],
      faqs: ["What's your return policy", "Do you ship internationally"],
      customerCommunications: [],
      marketingCopy: ["new collection drop", "shop the look", "limited edition", "influencer collaboration"],
      directCompetitors: ["Zara", "Shein"],
      customerMentionedAlternatives: ["shopify-only stack", "linktree routing"],
      knownUserWorkarounds: ["Buying from Shein for faster delivery", "Asking friends in other countries to ship items"],
      technologies: ["shopify", "instagram", "tiktok", "whatsapp"],
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Friction helpers                                                   */
/* ------------------------------------------------------------------ */

const FRICTION_META: Record<PDEFrictionType, { label: string; color: string; icon: typeof AlertTriangle }> = {
  trust: { label: "Trust", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300", icon: Shield },
  sensory: { label: "Sensory", color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300", icon: Eye },
  economic: { label: "Economic", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", icon: DollarSign },
  cognitive: { label: "Cognitive", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300", icon: BrainCircuit },
  access: { label: "Access", color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300", icon: MapPin },
};

const GRADIENT_META: Record<PDESubstitutionGradient, { label: string; color: string }> = {
  hard: { label: "Hard Gradient", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
  soft: { label: "Soft Gradient", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
  avoidance: { label: "Avoidance", color: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300" },
};

const PITCH_LABELS: Record<string, string> = {
  attribution_pitch: "Attribution Pitch",
  whatsapp_conversion_loop_pitch: "WhatsApp Conversion Loop",
  creator_roi_pitch: "Creator ROI Pitch",
  retention_churn_pitch: "Retention & Churn Pitch",
  fragmented_stack_pitch: "Fragmented Stack Pitch",
};

const FEASIBILITY_META: Record<PDEFeasibility, { color: string; icon: typeof CheckCircle2 }> = {
  blocked: { color: "text-red-500 bg-red-50 dark:bg-red-950/20", icon: Ban },
  constrained: { color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20", icon: AlertTriangle },
  viable: { color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20", icon: Activity },
  highly_viable: { color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20", icon: CheckCircle2 },
};

/* ------------------------------------------------------------------ */
/*  Simple dropdown                                                    */
/* ------------------------------------------------------------------ */

function SimpleSelect<T extends string>({
  label, value, options, onChange, icon: Icon,
}: {
  label: string; value: T; options: T[]; onChange: (v: T) => void; icon?: typeof ChevronDown;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
        {Icon && <Icon size={14} />}{label}
      </label>
      <select value={value} onChange={(e) => onChange(e.target.value as T)}
        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

/* ================================================================== */
/*  MAIN PAGE                                                          */
/* ================================================================== */

export default function PDEShowcasePage() {
  const [input, setInput] = useState<PDEInput>({
    productCategory: "",
    coreFunction: "",
    usageTrigger: "",
    usageFrequency: "weekly",
    dependencyUnit: "",
    failureOutcome: "",
    pricePoint: 49,
    geography: [],
    transactionSurface: "Custom Web",
    regulatoryConstraints: [],
    fulfillmentReality: "48-72 Hours",
    businessObjective: "trial_acquisition",
    customerReviews: [],
    supportTickets: [],
    faqs: [],
    customerCommunications: [],
    marketingCopy: [],
    directCompetitors: [],
    customerMentionedAlternatives: [],
    knownUserWorkarounds: [],
  });

  const [output, setOutput] = useState<PDEOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showInput, setShowInput] = useState(true);
  const [geoInput, setGeoInput] = useState("");
  const [reviewsInput, setReviewsInput] = useState("");
  const [supportInput, setSupportInput] = useState("");
  const [faqInput, setFaqInput] = useState("");
  const [marketingInput, setMarketingInput] = useState("");
  const [competitorsInput, setCompetitorsInput] = useState("");
  const [alternativesInput, setAlternativesInput] = useState("");
  const [workaroundsInput, setWorkaroundsInput] = useState("");

  const update = <K extends keyof PDEInput>(key: K, value: PDEInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const loadPreset = useCallback((preset: PDEInput) => {
    setInput(preset);
    setOutput(null);
    setError("");
    setGeoInput(preset.geography.join(", "));
    setReviewsInput(preset.customerReviews.join("\n"));
    setSupportInput(preset.supportTickets.join("\n"));
    setFaqInput(preset.faqs.join("\n"));
    setMarketingInput(preset.marketingCopy.join("\n"));
    setCompetitorsInput(preset.directCompetitors.join(", "));
    setAlternativesInput(preset.customerMentionedAlternatives.join(", "));
    setWorkaroundsInput(preset.knownUserWorkarounds.join("\n"));
  }, []);

  const generate = useCallback(async () => {
    setError(""); setLoading(true); setOutput(null);
    const payload: PDEInput = {
      ...input,
      geography: geoInput.split(",").map((s) => s.trim()).filter(Boolean),
      customerReviews: reviewsInput.split("\n").map((s) => s.trim()).filter(Boolean),
      supportTickets: supportInput.split("\n").map((s) => s.trim()).filter(Boolean),
      faqs: faqInput.split("\n").map((s) => s.trim()).filter(Boolean),
      marketingCopy: marketingInput.split("\n").map((s) => s.trim()).filter(Boolean),
      directCompetitors: competitorsInput.split(",").map((s) => s.trim()).filter(Boolean),
      customerMentionedAlternatives: alternativesInput.split(",").map((s) => s.trim()).filter(Boolean),
      knownUserWorkarounds: workaroundsInput.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    try {
      const isDev = process.env.NODE_ENV === "development";
      const apiUrl = isDev ? "http://localhost:3001"
        : (process.env.NEXT_PUBLIC_AGENTIC_API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.paza.social");
      const res = await fetch(`${apiUrl}/api/pde/generate-blueprint`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error((errBody as { error?: string }).error || `Server error ${res.status}`);
      }
      const json = await res.json();
      setOutput(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate blueprint");
    } finally { setLoading(false); }
  }, [input, geoInput, reviewsInput, supportInput, faqInput, marketingInput, competitorsInput, alternativesInput, workaroundsInput]);

  return (
    <div className="min-h-screen bg-background">
      {/* ──────── Hero ──────── */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-orange-50 via-background to-amber-50 dark:from-orange-950/10 dark:via-background dark:to-amber-950/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.705_0.213_47.604/0.06),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <BrainCircuit size={16} />
              Product Demand Environment — Specification 6.11
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              PDE Engine
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              A behavioral kinematics engine that models demand as state transitions under force constraints.
              Maps functional profiles, behavioral topology, friction fields, and opportunity corridors
              to generate Paza activation strategies.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Zap size={14} className="text-primary" /> Layer A: Behavior Topology</span>
              <span className="flex items-center gap-1.5"><AlertTriangle size={14} className="text-amber-500" /> Layer B: Force Field</span>
              <span className="flex items-center gap-1.5"><Sigma size={14} className="text-emerald-500" /> Transition Probability</span>
              <span className="flex items-center gap-1.5"><Route size={14} className="text-violet-500" /> Opportunity Corridors</span>
              <span className="flex items-center gap-1.5"><Rocket size={14} className="text-primary" /> Paza Activation</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* ──────── Presets ──────── */}
        <div className="mb-8">
          <p className="mb-3 text-sm font-medium text-muted-foreground">Quick demo — pick a preset:</p>
          <div className="flex flex-wrap gap-3">
            {PRESETS.map((p) => (
              <button key={p.label} onClick={() => loadPreset(p.input)}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm hover:border-primary/40 hover:bg-primary/5 hover:shadow-md transition-all">
                <p.icon size={16} className="text-primary" />{p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ──────── Input ──────── */}
        <button onClick={() => setShowInput((s) => !s)}
          className="mb-4 flex w-full items-center justify-between rounded-lg border border-border bg-card px-5 py-3 text-left shadow-sm hover:bg-muted/50 transition-colors">
          <span className="flex items-center gap-2 font-semibold text-foreground">
            <FileText size={18} className="text-primary" />
            Product Input Data
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{showInput ? "shown" : "hidden"}</span>
          </span>
          {showInput ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
        </button>

        <AnimatePresence>
          {showInput && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mb-8 grid gap-5 rounded-xl border border-border bg-card p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80"><Layers size={14} /> Product Category</label>
                  <input value={input.productCategory} onChange={(e) => update("productCategory", e.target.value)} placeholder="e.g. Natural Skincare" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80"><Zap size={14} /> Core Function</label>
                  <input value={input.coreFunction} onChange={(e) => update("coreFunction", e.target.value)} placeholder="e.g. Connects buyer identity..." className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80"><Zap size={14} /> Usage Trigger</label>
                  <input value={input.usageTrigger} onChange={(e) => update("usageTrigger", e.target.value)} placeholder="e.g. User enters WhatsApp conversation" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                </div>
                <SimpleSelect label="Usage Frequency" value={input.usageFrequency} options={["daily","weekly","episodic","one-time"] as const} onChange={(v) => update("usageFrequency", v)} icon={Clock} />
                <SimpleSelect label="Transaction Surface" value={input.transactionSurface} options={["Shopify","WhatsApp","Physical Retail","Mobile App","Custom Web"] as const} onChange={(v) => update("transactionSurface", v)} icon={ShoppingCart} />
                <SimpleSelect label="Fulfillment Reality" value={input.fulfillmentReality} options={["Instant Retail","<24 Hours","48-72 Hours",">7 Days"] as const} onChange={(v) => update("fulfillmentReality", v)} icon={Clock} />
                <SimpleSelect label="Business Objective" value={input.businessObjective} options={["trial_acquisition","customer_retention","competitor_switching","market_expansion"] as const} onChange={(v) => update("businessObjective", v)} icon={Flag} />
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80"><DollarSign size={14} /> Price Point ($)</label>
                  <input type="number" value={input.pricePoint} onChange={(e) => update("pricePoint", Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80"><BookOpen size={14} /> Dependency Unit</label>
                  <input value={input.dependencyUnit} onChange={(e) => update("dependencyUnit", e.target.value)} placeholder="e.g. 1 business workspace" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80"><AlertTriangle size={14} /> Failure Outcome</label>
                  <input value={input.failureOutcome} onChange={(e) => update("failureOutcome", e.target.value)} placeholder="What happens if product is absent/fails?" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80"><Globe size={14} /> Geographies (comma-separated)</label>
                  <input value={geoInput} onChange={(e) => setGeoInput(e.target.value)} placeholder="e.g. Nigeria, Kenya, Ghana" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80"><Users size={14} /> Competitors (comma-separated)</label>
                  <input value={competitorsInput} onChange={(e) => setCompetitorsInput(e.target.value)} placeholder="e.g. Amplitude, Mixpanel" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80"><Search size={14} /> Alternatives (comma-separated)</label>
                  <input value={alternativesInput} onChange={(e) => setAlternativesInput(e.target.value)} placeholder="e.g. manual spreadsheets" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                </div>
                <div className="col-span-full grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80"><MessageCircle size={14} /> Reviews (one per line)</label>
                    <textarea value={reviewsInput} onChange={(e) => setReviewsInput(e.target.value)} rows={3} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none" placeholder="Great product but..." />
                  </div>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80"><AlertTriangle size={14} /> Support Tickets</label>
                    <textarea value={supportInput} onChange={(e) => setSupportInput(e.target.value)} rows={3} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none" placeholder="Where is my order?" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80"><Info size={14} /> FAQs</label>
                    <textarea value={faqInput} onChange={(e) => setFaqInput(e.target.value)} rows={3} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none" placeholder="What ingredients..." />
                  </div>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80"><FileText size={14} /> Workarounds</label>
                    <textarea value={workaroundsInput} onChange={(e) => setWorkaroundsInput(e.target.value)} rows={3} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none" placeholder="How users work around the problem..." />
                  </div>
                </div>
                <div className="col-span-full grid gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80"><FileText size={14} /> Marketing Copy</label>
                    <textarea value={marketingInput} onChange={(e) => setMarketingInput(e.target.value)} rows={3} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none" placeholder="DM to order, link in bio..." />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ──────── Generate ──────── */}
        <div className="mb-8 flex justify-center">
          <button onClick={generate} disabled={loading || !input.productCategory}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            {loading ? <><Loader2 size={20} className="animate-spin" /> Generating PDE Blueprint…</>
              : <><BrainCircuit size={20} /> Generate PDE Blueprint</>}
          </button>
        </div>

        {error && <div className="mb-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/30 dark:bg-red-900/10 dark:text-red-400">{error}</div>}

        {/* ════════════════════════════════════════════════════════════ */}
        {/*  OUTPUT                                                     */}
        {/* ════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {output && (
            <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 32 }} className="space-y-8">

              {/* ── 8.1 Functional Profile ── */}
              <Section title="Functional Profile" icon={Layers} subtitle="8.1 — Core product identity as understood by the PDE engine">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <MetricCard label="Product Category" value={output.functionalProfile.productCategory} />
                  <MetricCard label="Core Function" value={output.functionalProfile.coreFunction} />
                  <MetricCard label="Usage Trigger" value={output.functionalProfile.usageTrigger} />
                  <MetricCard label="Usage Frequency" value={output.functionalProfile.usageFrequency} />
                  <MetricCard label="Dependency Unit" value={output.functionalProfile.dependencyUnit} />
                  <MetricCard label="Price Point" value={`$${output.functionalProfile.pricePoint}`} />
                  <div className="sm:col-span-2 lg:col-span-3">
                    <MetricCard label="Failure Outcome (Spec 6.1)" value={output.functionalProfile.failureOutcome} />
                  </div>
                </div>
              </Section>

              {/* ── 8.2 Behavioral Topology ── */}
              <Section title="Behavioral Topology" icon={TrendingUp} subtitle="8.2 — Layer A: State Space — all behavioral states around this product">
                <div className="grid gap-4 sm:grid-cols-2">
                  <BehaviorCard title="Adjacent Behaviors" icon={ArrowRight} items={output.behavioralTopology.adjacentBehaviors} accent="border-l-blue-400" desc="Pre-demand proximity behaviors (3.1)" />
                  <BehaviorCard title="Substitution Behaviors" icon={RefreshCw} items={output.behavioralTopology.substitutionBehaviors} accent="border-l-amber-400" desc="Equilibrium workarounds (3.2)" />
                  <div className="rounded-xl border border-border bg-background p-4 shadow-sm border-l-4 border-l-rose-400">
                    <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground text-sm"><Gauge size={15} /> Substitution Gradients (Spec 4.1)</h4>
                    <p className="mb-2 text-xs text-muted-foreground">Hard / Soft / Avoidance classification of each substitution behavior</p>
                    <div className="space-y-2">
                      {output.behavioralTopology.substitutionGradients.map((sg, i) => {
                        const meta = GRADIENT_META[sg.gradient];
                        return (
                          <div key={i} className="rounded-lg border border-border p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-foreground">{sg.behavior}</span>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${meta.color}`}>{meta.label}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{sg.resistanceLevel}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <BehaviorCard title="Support Behaviors" icon={CheckCircle2} items={output.behavioralTopology.supportBehaviors} accent="border-l-emerald-400" desc="Post-adoption reinforcement (3.3)" />
                  <div className="sm:col-span-2">
                    <BehaviorCard title="Transition Triggers" icon={Zap} items={output.behavioralTopology.transitionTriggers} accent="border-l-violet-400" desc="State change events (3.4)" />
                  </div>
                </div>
              </Section>

              {/* ── 8.3 Force Analysis ── */}
              <Section title="Force Analysis" icon={AlertTriangle} subtitle="8.3 — Layer B: Force Field — friction, decision language, and constraints">
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Friction Barriers — enhanced */}
                  <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                      <Shield size={16} className="text-rose-500" /> Friction Barriers <span className="text-xs font-normal text-muted-foreground">(4.2)</span>
                    </h4>
                    {output.forceAnalysis.frictionDetails.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">No friction signals detected</p>
                    ) : (
                      <div className="space-y-3">
                        {output.forceAnalysis.frictionDetails.map((f) => {
                          const meta = FRICTION_META[f.type];
                          const Icon = meta.icon;
                          return (
                            <div key={f.type} className="rounded-lg border border-border p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className={`flex items-center gap-1.5 text-sm font-medium ${meta.color.split(" ")[1]}`}>
                                  <Icon size={14} />{meta.label}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {f.intensity} · {f.confidence} confidence
                                </span>
                              </div>
                              {f.evidence.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {f.evidence.map((e, i) => (
                                    <span key={i} className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{e}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Decision Language */}
                  <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                      <MessageCircle size={16} className="text-blue-500" /> Decision Language <span className="text-xs font-normal text-muted-foreground">(4.3)</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {output.forceAnalysis.decisionLanguageRequirements.map((phrase) => (
                        <span key={phrase} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground">{phrase}</span>
                      ))}
                    </div>
                  </div>

                  {/* Substitution Force Gradients */}
                  <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                      <Gauge size={16} className="text-orange-500" /> Substitution Force Gradients <span className="text-xs font-normal text-muted-foreground">(4.1)</span>
                    </h4>
                    <div className="space-y-2">
                      {output.forceAnalysis.substitutionForceGradients.map((g) => (
                        <div key={g.type} className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${g.detected ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300" : "bg-muted text-muted-foreground"}`}>
                          <span>{g.label}</span>
                          <span className="text-xs font-medium">{g.detected ? "✓ Detected" : "— Not detected"}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Constraints */}
                  <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5 shadow-sm">
                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                      <Layers size={16} className="text-orange-500" /> System Constraints <span className="text-xs font-normal text-muted-foreground">(4.3)</span>
                    </h4>
                    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {output.forceAnalysis.systemConstraints.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/80 bg-background rounded-lg px-3 py-2 border border-border">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Section>

              {/* ── 8.4 Environmental Fit ── */}
              <Section title="Environmental Fit" icon={Globe} subtitle="8.4 — Where and when demand naturally emerges, with temporal modifiers">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <MetricCard label="Active Geographies" value={output.environmentalFit.activeGeographies.join(", ") || "Global"} />
                  <MetricCard label="Transaction Surface" value={output.environmentalFit.transactionSurface} />
                  <MetricCard label="Fulfillment Reality" value={output.environmentalFit.fulfillmentReality} />
                  <MetricCard label="Best Demand Windows" value={output.environmentalFit.bestDemandWindows.join(", ")} />
                </div>
                {/* Temporal Modifiers (4.4) */}
                {output.environmentalFit.temporalModifiers.length > 0 && (
                  <div className="mt-4 rounded-xl border border-border bg-background p-4 shadow-sm">
                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground text-sm">
                      <Clock size={15} className="text-violet-500" /> Temporal Activation Modifiers <span className="text-xs font-normal text-muted-foreground">(Spec 4.4 — time-varying edge modifier t)</span>
                    </h4>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {output.environmentalFit.temporalModifiers.map((tm, i) => (
                        <div key={i} className="rounded-lg border border-border p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-foreground">{tm.season}</span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                              +{Math.round(tm.activationProbabilityBoost * 100)}%
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{tm.triggerEvent}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Section>

              {/* ── 8.5 Language Map (NEW) ── */}
              <Section title="Language Map" icon={Hash} subtitle="8.5 — How users compare, validate, justify, and reject">
                <div className="grid gap-4 sm:grid-cols-2">
                  <LanguageCard title="Comparison Language" icon={ArrowLeftRight} entries={output.languageMap.comparisonLanguage} accent="border-l-blue-400" />
                  <LanguageCard title="Validation Language" icon={CheckCircle2} entries={output.languageMap.validationLanguage} accent="border-l-emerald-400" />
                  <LanguageCard title="Justification Language" icon={Lightbulb} entries={output.languageMap.justificationLanguage} accent="border-l-amber-400" />
                  <LanguageCard title="Rejection Language" icon={Ban} entries={output.languageMap.rejectionLanguage} accent="border-l-rose-400" />
                </div>
              </Section>

              {/* ── 8.6 Demand Transition Logic (NEW) ── */}
              <Section title="Demand Transition Logic" icon={Sigma} subtitle="8.6 — Transition likelihood equation P(Vi → Vj) per spec 5.1 — why transitions succeed or fail">
                <div className="space-y-4">
                  {/* Equation display */}
                  <div className="rounded-lg border-2 border-primary/10 bg-primary/5 p-4 text-center text-sm text-muted-foreground">
                    <span className="font-mono font-bold text-foreground">P(V<sub>i</sub> → V<sub>j</sub>)</span> ={" "}
                    <span className="font-mono">(t · A) / ((W<sub>sub</sub> · B) + Σ(W<sub>fric</sub> − W<sub>lang</sub>))</span>
                  </div>

                  <div className="grid gap-3">
                    {output.demandTransitionLogic.map((dt, i) => {
                      const feas = FEASIBILITY_META[dt.feasibility];
                      const FeasIcon = feas.icon;
                      const gradMeta = GRADIENT_META[dt.substitutionGradient];
                      return (
                        <div key={i} className="rounded-xl border border-border bg-background p-4 shadow-sm">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                            <div>
                              <span className="text-sm font-medium text-foreground">{dt.originState}</span>
                              <ArrowRight size={14} className="mx-2 inline text-muted-foreground" />
                              <span className="text-sm font-semibold text-primary">{dt.destinationState}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${feas.color}`}>
                                <FeasIcon size={12} />{dt.feasibility.replace("_", " ")}
                              </span>
                              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                                P={Math.round(dt.probability * 100)}%
                              </span>
                            </div>
                          </div>
                          <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                            <div><span className="font-medium text-foreground">Trigger:</span> {dt.triggerRequired}</div>
                            <div><span className="font-medium text-foreground">Gradient:</span> <span className={`${gradMeta.color} px-1.5 py-0.5 rounded`}>{gradMeta.label}</span></div>
                            <div><span className="font-medium text-foreground">Frictions:</span> {dt.frictionBarriers.map((f) => FRICTION_META[f].label).join(", ") || "none"}</div>
                          </div>
                          {dt.criticalValidation.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1 text-xs">
                              <span className="font-medium text-foreground">Critical validation:</span>
                              {dt.criticalValidation.map((v) => (
                                <span key={v} className="rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 px-2 py-0.5">{v}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Section>

              {/* ── 8.1 Pruned Zones (NEW) ── */}
              {output.prunedZones.length > 0 && (
                <Section title="Pruned Zones" icon={Ban} subtitle="8.1 — Hard Boundary Enclosure: Corridors eliminated by operational constraints (Wconst = ∞)">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {output.prunedZones.map((pz, i) => (
                      <div key={i} className="rounded-xl border-2 border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10 p-4 shadow-sm">
                        <div className="mb-2 flex items-start gap-2">
                          <Ban size={16} className="mt-0.5 shrink-0 text-red-500" />
                          <div>
                            <p className="text-sm font-semibold text-foreground">{pz.reason}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Constraint: {pz.constraint}</p>
                          </div>
                        </div>
                        <ul className="mt-2 space-y-1">
                          {pz.eliminatedCorridors.map((ec, j) => (
                            <li key={j} className="flex items-start gap-2 text-xs text-foreground/70">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                              {ec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* ── 8.2 Opportunity Corridors (ENHANCED) ── */}
              <Section title="Opportunity Corridors" icon={Target} subtitle="8.2 — Top N ranked behavioral transition pathways with temporal windows, dominant forces, and validation markers">
                <div className="grid gap-4 sm:grid-cols-2">
                  {output.opportunityCorridors.map((corridor) => {
                    const confidenceColor =
                      corridor.confidence === "high" ? "border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/10"
                        : corridor.confidence === "medium" ? "border-amber-400 bg-amber-50/50 dark:bg-amber-950/10"
                        : "border-slate-300 bg-slate-50/50 dark:bg-slate-950/10";
                    return (
                      <div key={corridor.rank} className={`rounded-xl border-2 p-5 shadow-sm ${confidenceColor}`}>
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rank #{corridor.rank}</span>
                            <h4 className="font-semibold text-foreground">{corridor.name}</h4>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${
                              corridor.confidence === "high" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                : corridor.confidence === "medium" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                                : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            }`}>{corridor.confidence}</span>
                          </div>
                        </div>

                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">Transition:</span> {corridor.transition}
                        </p>

                        <div className="grid gap-2 mb-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock size={12} className="text-violet-500" />
                            <span className="font-medium text-foreground">Temporal Window (t):</span> {corridor.temporalWindow}
                            <span className={`text-[10px] uppercase ${
                              corridor.temporalConfidence === "high" ? "text-emerald-500" : "text-amber-500"
                            }`}>({corridor.temporalConfidence})</span>
                          </div>
                          {corridor.dominantFriction && (
                            <div className="flex items-center gap-2">
                              <AlertTriangle size={12} className="text-rose-500" />
                              <span className="font-medium text-foreground">Dominant Force (W):</span> {FRICTION_META[corridor.dominantFriction].label}
                              <span className={`text-[10px] uppercase ${
                                corridor.dominantFrictionConfidence === "high" ? "text-emerald-500" : "text-amber-500"
                              }`}>({corridor.dominantFrictionConfidence})</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="mb-1.5 text-xs font-medium text-foreground">Validation Requirements (W<sub>lang</sub>):</p>
                          <div className="flex flex-wrap gap-1.5">
                            {corridor.validationLanguage.map((vl) => (
                              <span key={vl.phrase}
                                className={`rounded-full px-2 py-0.5 text-xs border ${
                                  vl.confidence === "high"
                                    ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                                    : vl.confidence === "medium"
                                    ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300"
                                    : "bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                                }`}>
                                {vl.phrase} <span className="opacity-60">({vl.confidence})</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Section>

              {/* ── 8.7 Paza Activation ── */}
              <Section title="Paza Activation Strategy" icon={Rocket} subtitle="PAZA-specific execution recommendations">
                <div className="mb-6 rounded-xl border-2 border-primary/20 bg-primary/5 p-5 shadow-sm">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary/70">Recommended Pitch</div>
                  <div className="text-xl font-bold text-foreground">{PITCH_LABELS[output.pazaActivation.bestPitch] || output.pazaActivation.bestPitch}</div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ActivationCard title="WhatsApp Hooks" icon={MessageCircle} items={output.pazaActivation.recommendedWhatsappHooks} accent="border-l-emerald-400" />
                  <ActivationCard title="Objection Handling" icon={Shield} items={output.pazaActivation.recommendedObjectionHandling} accent="border-l-rose-400" />
                  <ActivationCard title="Retargeting Angles" icon={Target} items={output.pazaActivation.recommendedRetargetingAngles} accent="border-l-blue-400" />
                  <ActivationCard title="Creator Traits" icon={Users} items={output.pazaActivation.recommendedCreatorTraits} accent="border-l-violet-400" />
                  <div className="sm:col-span-2">
                    <ActivationCard title="Campaign Angles" icon={Flag} items={output.pazaActivation.recommendedCampaignAngles} accent="border-l-amber-400" />
                  </div>
                </div>
              </Section>

              {/* ── Footer ── */}
              <div className="rounded-lg border border-border bg-muted/30 p-4 text-center text-sm text-muted-foreground">
                <BrainCircuit size={16} className="mr-1 inline-block text-primary" />
                PDE Blueprint v6.11 — Generated by the Product Demand Environment inference engine. All analysis derived from input data.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!output && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 rounded-full bg-muted p-4"><BrainCircuit size={48} className="text-muted-foreground/50" /></div>
            <h3 className="text-lg font-semibold text-foreground">Ready to analyze a product</h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Fill in the product details above or pick a preset, then click{" "}
              <span className="font-medium text-foreground">Generate PDE Blueprint</span> to see the engine in action.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Sub-components                                                     */
/* ================================================================== */

function Section({ title, icon: Icon, subtitle, children }: {
  title: string; icon: typeof Layers; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2"><Icon size={20} className="text-primary" /></div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

function BehaviorCard({ title, icon: Icon, items, accent, desc }: {
  title: string; icon: typeof ArrowRight; items: string[]; accent: string; desc: string;
}) {
  return (
    <div className={`rounded-xl border border-border bg-background p-4 shadow-sm border-l-4 ${accent}`}>
      <div className="mb-1 flex items-center gap-2">
        <Icon size={15} className="text-foreground/70" />
        <h4 className="font-semibold text-foreground text-sm">{title}</h4>
      </div>
      <p className="mb-2 text-xs text-muted-foreground">{desc}</p>
      {items.length === 0 ? <p className="text-xs italic text-muted-foreground">No items inferred</p> : (
        <ul className="space-y-1">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LanguageCard({ title, icon: Icon, entries, accent }: {
  title: string; icon: typeof Hash; entries: LanguageMapEntry[]; accent: string;
}) {
  return (
    <div className={`rounded-xl border border-border bg-background p-4 shadow-sm border-l-4 ${accent}`}>
      <div className="mb-2 flex items-center gap-2">
        <Icon size={16} className="text-foreground/70" />
        <h4 className="font-semibold text-foreground text-sm">{title}</h4>
      </div>
      {entries.length === 0 ? <p className="text-xs italic text-muted-foreground">No entries</p> : (
        <ul className="space-y-1.5">
          {entries.map((e, i) => (
            <li key={i} className="flex items-start justify-between gap-2 text-sm">
              <span className="text-foreground/80">{e.phrase}</span>
              <span className="shrink-0 text-xs text-muted-foreground">{(e.weight * 100).toFixed(0)}%</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ActivationCard({ title, icon: Icon, items, accent }: {
  title: string; icon: typeof MessageCircle; items: string[]; accent: string;
}) {
  return (
    <div className={`rounded-xl border border-border bg-background p-4 shadow-sm border-l-4 ${accent}`}>
      <div className="mb-2 flex items-center gap-2">
        <Icon size={16} className="text-foreground/70" />
        <h4 className="font-semibold text-foreground text-sm">{title}</h4>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
