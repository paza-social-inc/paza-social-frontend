"use client";

import { useState, useCallback, useRef } from "react";
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
  Lightbulb,
  CheckCircle2,
  Loader2,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  DollarSign,
  Clock,
  Star,
  Hash,
  ArrowRight,
  FileText,
  Rocket,
  Flag,
  Route,
  List,
  Quote,
  Layers,
  Eye,
  Gauge,
  Upload,
  Download,
  Shield,
  BarChart3,
  Settings2,
  Box,
  Package,
  Wrench,
  Cpu,
  Percent,
  X,
  Info,
  Activity,
  ArrowLeftRight,
  Search,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ProductSummary {
  brandName: string;
  productName: string;
  category: string;
  coreJob: string;
  geography: string[];
  businessObjective: string;
}

interface DemandCorridor {
  id: string;
  situation: string;
  problem: string;
  trigger: string;
  friction: string;
  emotion: string;
  validation: string;
  community: string[];
  conversionPath: string;
  retentionLoop: string;
  opportunityScore: number;
  supportingNarrativeIds: string[];
  supportingTrendTopics: string[];
}

interface Narrative {
  theme: string;
  emotion: string;
  friction: string;
  validation: string;
  frequency: number;
  examples: string[];
  sourceSignalIds: string[];
}

interface CommunityNode {
  id: string;
  name: string;
  platform: string;
  affinitySignals: string[];
  estimatedSize?: number;
}

interface JourneyStep {
  stage: string;
  dominantNarrativeIds: string[];
  dominantChannels: string[];
  frictionAtThisStage: string;
  contentSuggestion: string;
}

interface Journey {
  productId: string;
  steps: JourneyStep[];
}

interface ShowcaseResponse {
  executiveSummary: string;
  fullReport: string;
  detailedReport?: string;
  productSummary: ProductSummary;
  demandCorridors: DemandCorridor[];
  narratives: Narrative[];
  communities: CommunityNode[];
  journey: Journey;
  generatedAt: string;

  // ── New: Competitor & differentiation data ──
  competitorIntelligence?: CompetitorIntelligenceReport | null;
  competitorTracking?: CompetitorTrackingReport | null;
  differentiators?: DifferentiatorReport | null;
  comparisonGuides?: ComparisonGuideSet | null;

  // ── New: Keyword clusters & creator discovery ──
  keywordClusters?: KeywordClusters | null;
  creatorDiscovery?: CreatorDiscoveryBlueprint | null;

  // ── New: Discovery Query Framework (8.7) ──
  discoveryQueries?: DiscoveryQuerySet | null;
  contextualAnchors?: ContextualAnchorResult[] | null;
  semanticBridges?: SemanticBridgeResult[] | null;

  // ── Signal source breakdown ──
  signalSourceBreakdown?: Record<string, number>;
  narrativeSourceBreakdown?: { narrativeIndex: number; sources: Record<string, number> }[];

  // ── Social Listener / Persona Architect (9 Pillars + CIB) ──
  cibReport?: CIBReport | null;
  personaArchitect?: PersonaArchitectOutput | null;

  // ── Search provider metadata ──
  metadata?: {
    searchProvider?: string;
    hasLiveSearch?: boolean;
    mode?: string;
    collectors?: Record<string, boolean>;
  };
}

/* ── CIB / Persona Architect Types (9 Pillars) ──────────────────── */

type NinePillar =
  | "nourishment" | "sensory" | "logic" | "economic"
  | "security" | "identity" | "hustle" | "community" | "environment";

interface PillarHeatmapEntry {
  pillar: NinePillar;
  share: number;
  signalCount: number;
  intensity: number;
  confidence: number;
  representativePhrases: string[];
}

interface PillarHeatmap {
  distribution: PillarHeatmapEntry[];
  dominantPillar: NinePillar | null;
  topThree: NinePillar[];
  concentration: "concentrated" | "moderate" | "spread";
}

interface PillarDelta {
  pillar: NinePillar;
  brandIntent: number;
  audienceReality: number;
  delta: number;
  severity: "aligned" | "slight_mismatch" | "significant_delta";
  interpretation: string;
}

interface PillarDeltaReport {
  deltas: PillarDelta[];
  biggestOpportunity: PillarDelta | null;
  biggestWaste: PillarDelta | null;
  recommendation: string;
}

interface FrictionCluster {
  theme: string;
  emotion: string;
  frequency: number;
  share: number;
  branded: boolean;
  mentionedBrands: string[];
  examples: string[];
  relatedPillars: NinePillar[];
}

interface FrictionHeatmap {
  clusters: FrictionCluster[];
  totalFrictionSignals: number;
  unbrandedShare: number;
  topFrictions: FrictionCluster[];
}

interface LinguisticVibeEntry {
  token: string;
  frequency: number;
  category: "slang" | "decision_language" | "comparison" | "validation" | "rejection" | "question";
  relatedPillars: NinePillar[];
}

interface LinguisticVibe {
  tokens: LinguisticVibeEntry[];
  topSlang: string[];
  topDecisionLanguage: string[];
  topComparisonTerms: string[];
  topValidationPhrases: string[];
  culturalShards: string[];
}

interface CreatorAlignmentEntry {
  creatorType: string;
  primaryPillar: NinePillar;
  secondaryPillars: NinePillar[];
  corridorFit: number;
  corridorName: string;
  frictionOvercome: string;
  validationLanguage: string;
  alignmentScore: number;
}

interface CreatorAlignmentMap {
  alignments: CreatorAlignmentEntry[];
  topForDominantPillar: CreatorAlignmentEntry[];
  bridgingCreators: CreatorAlignmentEntry[];
}

interface CIBReport {
  executiveSummary: string;
  generatedAt: string;
  pillarHeatmap: PillarHeatmap;
  pillarDelta: PillarDeltaReport;
  linguisticVibe: LinguisticVibe;
  frictionHeatmap: FrictionHeatmap;
  creatorAlignment: CreatorAlignmentMap;
  topRecommendations: string[];
}

interface NarrativePillarAssignment {
  narrativeId: string;
  theme: string;
  primaryPillar: NinePillar;
  pillarScores: Partial<Record<NinePillar, number>>;
}

interface CommunityPillarProfile {
  communityId: string;
  communityName: string;
  dominantPillar: NinePillar;
  pillarProfile: Partial<Record<NinePillar, number>>;
}

interface PersonaArchitectOutput {
  cib: CIBReport;
  businessObjectivePillar: NinePillar | null;
  narrativePillarAssignments: NarrativePillarAssignment[];
  communityPillarProfiles: CommunityPillarProfile[];
}

/* ── Discovery Query Framework types ──────────────────────────────── */

interface ContextualAnchorResult {
  anchor: string;
  category: string;
  confidence: number;
  rationale: string;
}

interface SemanticDiscovery {
  term: string;
  category: string;
  similarity: number;
  rationale: string;
}

interface SemanticBridgeResult {
  sourceAnchor: string;
  discoveries: SemanticDiscovery[];
}

interface DiscoveryQuery {
  query: string;
  queryType: string;
  intent?: string;
  platform?: string;
  priority?: number;
  rationale?: string;
  sourceNarratives?: string[];
  sourceCorridors?: string[];
  sourceCommunityIds?: string[];
  metadata?: Record<string, string>;
}

interface DiscoveryQuerySet {
  product: DiscoveryQuery[];
  problem: DiscoveryQuery[];
  outcome: DiscoveryQuery[];
  adjacentBehavior: DiscoveryQuery[];
  supportBehavior: DiscoveryQuery[];
  trigger: DiscoveryQuery[];
  substitution: DiscoveryQuery[];
  complementaryProduct: DiscoveryQuery[];
  friction: DiscoveryQuery[];
  decisionLanguage: DiscoveryQuery[];
  identity: DiscoveryQuery[];
  lifestyle: DiscoveryQuery[];
  competency: DiscoveryQuery[];
  community: DiscoveryQuery[];
  creatorDiscovery: DiscoveryQuery[];
  platform: DiscoveryQuery[];
  question: DiscoveryQuery[];
  conversationStarter: DiscoveryQuery[];
  boolean: DiscoveryQuery[];
  noiseFilter: DiscoveryQuery[];
  regionalVariant: DiscoveryQuery[];
  semanticExpansion: DiscoveryQuery[];
  intentExpansion: DiscoveryQuery[];
  relationship: DiscoveryQuery[];
  all: DiscoveryQuery[];
}

/* ── Competitor intelligence types ────────────────────────────────── */
interface ConsumerQuote {
  text: string;
  source: string;
  isFirstPersonUsage?: boolean;
  url?: string;
  author?: string;
  platform?: string;
}

interface CompetitorIntelligenceEntry {
  competitor: string;
  claimTheme: string;
  consumerQuotes: ConsumerQuote[];
  consumerSentiment: string;
  mentionFrequency: number;
  advantageDirection: string;
}

interface CompetitorConsumerSummary {
  competitor: string;
  totalMentions: number;
  overallSentiment: "positive" | "negative" | "neutral" | "mixed";
  consumerQuotes: ConsumerQuote[];
  mentionedThemes: string[];
  overallAdvantageDirection: string;
  praiseThemes: string[];
  criticismThemes: string[];
  sourceBreakdown: Record<string, number>;
}

interface CompetitorIntelligenceReport {
  entries: CompetitorIntelligenceEntry[];
  overallLandscape: string;
  competitorConsumerSummaries?: CompetitorConsumerSummary[];
}

/* ── Keyword cluster types ───────────────────────────────────────── */
interface KeywordClusterCategory {
  dimension: string;
  keywords: string[];
  source: string;
  relevance: number;
}
interface KeywordClusters {
  clusters: KeywordClusterCategory[];
  totalKeywords: number;
}

/* ── Creator discovery types ─────────────────────────────────────── */
interface CreatorDiscoveryBlueprint {
  recommendedArchetypes: { archetype: string; rationale: string; suggestedCreators: string[] }[];
  contentThemes: { theme: string; hook: string; format: string }[];
  outreachStrategy: string;
  priorityPlatforms: string[];
}

/* ── Competitor tracking types ─────────────────────────────────── */
interface CompetitorMentionSnapshot {
  timestamp: string;
  competitor: string;
  claimTheme: string;
  mentionCount: number;
  sentimentScore: number;
  consumerSentiment: string;
  advantageDirection: string;
  keyQuotes: string[];
}

interface SentimentShift {
  competitor: string;
  claimTheme: string;
  previousSentiment: string;
  currentSentiment: string;
  previousMentionCount: number;
  currentMentionCount: number;
  mentionDelta: number;
  sentimentDelta: number;
  shiftDirection: string;
  interpretation: string;
}

interface CompetitorTrackingReport {
  snapshots: CompetitorMentionSnapshot[];
  latestSnapshot: CompetitorMentionSnapshot[];
  shifts: SentimentShift[];
  totalCompetitorsTracked: number;
  totalThemesTracked: number;
  trackingWindow: {
    firstSnapshot: string;
    lastSnapshot: string;
    snapshotCount: number;
  };
}

/* ── Differentiator types ──────────────────────────────────────── */
interface DifferentiatorEntry {
  id: string;
  theme: string;
  claimStatement: string;
  evidence: { text: string; source: string; sentiment?: string }[];
  competitorGap: string;
  brandStrength: string;
  advantageType: string;
  strengthScore: number;
  competitorComparison: { competitor: string; competitorWeakness: string; advantageMargin: number }[];
}

interface DifferentiatorReport {
  differentiators: DifferentiatorEntry[];
  topDifferentiator: DifferentiatorEntry | null;
  summaryStatement: string;
  weaknessAreas: { theme: string; gap: string; leadingCompetitor: string }[];
}

/* ── Comparison guide types ────────────────────────────────────── */
interface ComparisonSection {
  category: string;
  brandScore: number;
  competitorScore: number;
  winner: "brand" | "competitor" | "tie";
  margin: number;
}

interface ComparisonGuide {
  competitor: string;
  productCategory: string;
  sections: ComparisonSection[];
  overallWinner: "brand" | "competitor" | "tie";
  overallBrandScore: number;
  overallCompetitorScore: number;
  brandAdvantages: string[];
  competitorAdvantages: string[];
  recommendationStatement: string;
}

interface ComparisonGuideSet {
  guides: ComparisonGuide[];
  brandName: string;
  productName: string;
  overallAssessment: string;
}

/* ------------------------------------------------------------------ */
/*  Showcase presets full data                                         */
/* ------------------------------------------------------------------ */

interface ProductPreset {
  label: string;
  icon: typeof Sparkles;
  brandName: string;
  productName: string;
  category: string;
  functionalClaim: string;
  usageTrigger: string;
  usageFrequency: string;
  price: string;
  geography: string[];
  salesChannels: string[];
  businessObjective: string;
  dependencyUnit: string;
  failureOutcome: string;
  transactionSurface: string;
  fulfillmentReality: string;
  regulatoryConstraints: string;
  customerReviews: string;
  supportTickets: string;
  faqs: string;
  marketingCopy: string;
  customerCommunications: string;
  directCompetitors: string;
  customerMentionedAlternatives: string;
  knownUserWorkarounds: string;
  technologies: string;
  observedSignals: string;
  repeatPurchaseRate: string;
  cartAbandonmentRate: string;
}

const DEFAULT_PRESET: ProductPreset = {
  label: "",
  icon: Sparkles,
  brandName: "",
  productName: "",
  category: "",
  functionalClaim: "",
  usageTrigger: "",
  usageFrequency: "",
  price: "",
  geography: [],
  salesChannels: [],
  businessObjective: "",
  dependencyUnit: "",
  failureOutcome: "",
  transactionSurface: "",
  fulfillmentReality: "",
  regulatoryConstraints: "",
  customerReviews: "",
  supportTickets: "",
  faqs: "",
  marketingCopy: "",
  customerCommunications: "",
  directCompetitors: "",
  customerMentionedAlternatives: "",
  knownUserWorkarounds: "",
  technologies: "",
  observedSignals: "",
  repeatPurchaseRate: "",
  cartAbandonmentRate: "",
};

const PRESETS: ProductPreset[] = [
  {
    ...DEFAULT_PRESET,
    label: "Nuvita Baby Diapers",
    icon: Sparkles,
    brandName: "Nuvita",
    productName: "Baby Diapers",
    category: "baby diapers",
    functionalClaim: "Absorbs urine and keeps babies dry",
    usageTrigger: "Baby needs a diaper change",
    usageFrequency: "Multiple times per day",
    price: "KES 1,200 per pack",
    geography: ["Kenya"],
    salesChannels: ["Supermarkets", "Pharmacies"],
    businessObjective: "Increase first-time purchases",
    dependencyUnit: "1 pack of 30 diapers",
    failureOutcome: "Baby stays wet — leads to rashes, discomfort, and sleepless nights",
    transactionSurface: "Physical Retail",
    fulfillmentReality: "48-72 Hours",
    regulatoryConstraints: "KEBS certification\nBaby product safety compliance",
    customerReviews: [
      "My baby sleeps through the night now, no more leaks!",
      "Switched because the other brand caused rashes on my son.",
      "A bit pricey but worth paying extra for the comfort.",
    ].join("\n"),
    supportTickets: "Late delivery to rural area\nPackaging was damaged on arrival",
    directCompetitors: "Pampers, Huggies, Molfix",
    customerMentionedAlternatives: "Cloth diapers, local unbranded diapers",
    knownUserWorkarounds: "Putting two diapers at night for heavy wetters\nAir drying reusable diaper covers",
    technologies: "ecommerce, whatsapp, delivery logistics",
  },
  {
    ...DEFAULT_PRESET,
    label: "African Beauty Brand",
    icon: Star,
    brandName: "GlowSkin",
    productName: "Radiance Serum",
    category: "Natural Skincare",
    functionalClaim: "Brightens skin tone and reduces dark spots",
    usageTrigger: "Morning skincare routine",
    usageFrequency: "Daily",
    price: "$29",
    geography: ["Nigeria", "Kenya", "Ghana", "South Africa"],
    salesChannels: ["Online", "WhatsApp", "Instagram"],
    businessObjective: "Increase first-time purchases",
    dependencyUnit: "1 bottle (30ml)",
    failureOutcome: "Users lose confidence and revert to old skincare routines",
    transactionSurface: "WhatsApp",
    fulfillmentReality: "48-72 Hours",
    regulatoryConstraints: "NAFDAC compliance\nCosmetic registration",
    customerReviews: [
      "My dark spots are fading after just two weeks!",
      "The product is great but delivery takes too long.",
      "Love the smell but wish it was cheaper.",
      "Been using it for a month and my skin has never looked better.",
    ].join("\n"),
    supportTickets: "Where is my order?\nProduct arrived leaking\nHow long until results show?",
    faqs: "Do you ship internationally?\nAre there side effects?\nIs it safe for sensitive skin?",
    marketingCopy: "DM to order\nLink in bio\nLimited drop\nCreator collaboration",
    directCompetitors: "L'Oréal, Cecred, Neutrogena",
    customerMentionedAlternatives: "DIY turmeric masks, local shea butter",
    knownUserWorkarounds: "Mixing with coconut oil for extra moisture\nUsing only on weekends to make it last longer",
    technologies: "whatsapp, instagram, paystack, shopify",
    repeatPurchaseRate: "35",
    cartAbandonmentRate: "60",
  },
  {
    ...DEFAULT_PRESET,
    label: "Meal Prep Delivery",
    icon: ShoppingCart,
    brandName: "FreshEats",
    productName: "Weekly Meal Plan",
    category: "Food Delivery & Meal Prep",
    functionalClaim: "Delivers fresh pre-cooked meals weekly",
    usageTrigger: "End of week — no time to cook",
    usageFrequency: "Weekly",
    price: "$45/week",
    geography: ["Nigeria", "Ghana"],
    salesChannels: ["WhatsApp", "Online", "Physical Pickup"],
    businessObjective: "Competitor switching",
    dependencyUnit: "1 weekly subscription",
    failureOutcome: "Customers revert to cooking from scratch or ordering from unverified local vendors",
    transactionSurface: "WhatsApp",
    fulfillmentReality: "<24 Hours",
    regulatoryConstraints: "Food safety certification\nNAFDAC\nVendor health permits",
    customerReviews: [
      "The meals are amazing but sometimes late.",
      "Best meal prep in Lagos — saved my work week.",
      "I wish there were more vegetarian options.",
    ].join("\n"),
    supportTickets: "Missed delivery window\nWrong meal delivered\nHow to skip a week",
    faqs: "Do you deliver on weekends?\nCan I customize my meals?\nWhat's the cancelation policy?",
    marketingCopy: "Fresh meals delivered\nOrder via WhatsApp\nWeekly meal plans\nHealthy eating made easy",
    directCompetitors: "HelloFresh, local meal prep services",
    customerMentionedAlternatives: "Cooking in bulk on Sundays, local food vendors",
    knownUserWorkarounds: "Buying ingredients and cooking in bulk on Sundays\nRotating between local food vendors",
    technologies: "whatsapp, paystack, delivery tracking",
    repeatPurchaseRate: "60",
    cartAbandonmentRate: "30",
  },
  {
    ...DEFAULT_PRESET,
    label: "Fashion E‑commerce",
    icon: Eye,
    brandName: "UrbanThreads",
    productName: "Premium Cotton Tee",
    category: "Fashion & Apparel",
    functionalClaim: "Premium quality everyday basics",
    usageTrigger: "Need a reliable everyday outfit",
    usageFrequency: "As needed",
    price: "$59",
    geography: ["South Africa", "Nigeria", "Kenya"],
    salesChannels: ["Online", "Shopify", "Instagram"],
    businessObjective: "Competitor switching",
    dependencyUnit: "1 t-shirt",
    failureOutcome: "Potential buyers lose trust and revert to fast-fashion alternatives with faster shipping",
    transactionSurface: "Shopify",
    fulfillmentReality: "48-72 Hours",
    customerReviews: [
      "The fabric is amazing — so soft!",
      "Love the new collection but sizing runs small.",
      "Best t-shirt I've ever owned, ordering more colors.",
      "Took two weeks to arrive, but worth the wait.",
    ].join("\n"),
    supportTickets: "Size exchange request\nOrder not received\nWrong color delivered",
    faqs: "What's your return policy?\nDo you ship internationally?\nHow do I find my size?",
    marketingCopy: "New collection drop\nShop the look\nLimited edition\nInfluencer collaboration",
    directCompetitors: "Zara, Shein, H&M",
    customerMentionedAlternatives: "Shein for faster delivery, local thrift stores",
    knownUserWorkarounds: "Buying from Shein for faster delivery\nAsking friends in other countries to ship items",
    technologies: "shopify, instagram, tiktok, printful",
    repeatPurchaseRate: "45",
    cartAbandonmentRate: "55",
  },
];

/* ------------------------------------------------------------------ */
/*  Emotion → colour mapping                                           */
/* ------------------------------------------------------------------ */

const EMOTION_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  frustration: { bg: "bg-rose-50 dark:bg-rose-950/20", text: "text-rose-700 dark:text-rose-300", border: "border-rose-200 dark:border-rose-800" },
  trust: { bg: "bg-blue-50 dark:bg-blue-950/20", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800" },
  relief: { bg: "bg-emerald-50 dark:bg-emerald-950/20", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-800" },
  fear: { bg: "bg-violet-50 dark:bg-violet-950/20", text: "text-violet-700 dark:text-violet-300", border: "border-violet-200 dark:border-violet-800" },
  anxiety: { bg: "bg-amber-50 dark:bg-amber-950/20", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-800" },
  embarrassment: { bg: "bg-orange-50 dark:bg-orange-950/20", text: "text-orange-700 dark:text-orange-300", border: "border-orange-200 dark:border-orange-800" },
  excitement: { bg: "bg-purple-50 dark:bg-purple-950/20", text: "text-purple-700 dark:text-purple-300", border: "border-purple-200 dark:border-purple-800" },
  pride: { bg: "bg-sky-50 dark:bg-sky-950/20", text: "text-sky-700 dark:text-sky-300", border: "border-sky-200 dark:border-sky-800" },
};

const EMOTION_ICONS: Record<string, typeof AlertTriangle> = {
  frustration: AlertTriangle,
  trust: Shield,
  relief: CheckCircle2,
  fear: AlertTriangle,
  anxiety: AlertTriangle,
  embarrassment: AlertTriangle,
  excitement: Star,
  pride: Star,
};

/* ------------------------------------------------------------------ */
/*  Nine Pillars → display helpers                                     */
/* ------------------------------------------------------------------ */

const PILLAR_LABELS: Record<NinePillar, string> = {
  nourishment: "Nourishment — physical health, sustenance, basic needs",
  sensory: "Sensory — pleasure, entertainment, mood, experience",
  logic: "Logic — practicality, efficiency, performance, functionality",
  economic: "Economic — cost, value, savings, financial utility",
  security: "Security — safety, trust, protection, risk-reduction",
  identity: "Identity — status, social signaling, self-image",
  hustle: "Hustle — self-improvement, ambition, growth, productivity",
  community: "Community — social connection, collective identity",
  environment: "Environment — sustainability, eco-consciousness, ethics",
};

const PILLAR_SHORT: Record<NinePillar, string> = {
  nourishment: "Nourishment",
  sensory: "Sensory",
  logic: "Logic",
  economic: "Economic",
  security: "Security",
  identity: "Identity",
  hustle: "Hustle",
  community: "Community",
  environment: "Environment",
};

const PILLAR_COLORS: Record<NinePillar, { bar: string; badge: string; bg: string }> = {
  nourishment:  { bar: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300", bg: "bg-emerald-50" },
  sensory:      { bar: "bg-violet-500",  badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300", bg: "bg-violet-50" },
  logic:        { bar: "bg-blue-500",    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300", bg: "bg-blue-50" },
  economic:     { bar: "bg-amber-500",   badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", bg: "bg-amber-50" },
  security:     { bar: "bg-rose-500",    badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300", bg: "bg-rose-50" },
  identity:     { bar: "bg-purple-500",   badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300", bg: "bg-purple-50" },
  hustle:       { bar: "bg-orange-500",   badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300", bg: "bg-orange-50" },
  community:    { bar: "bg-pink-500",     badge: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300", bg: "bg-pink-50" },
  environment:  { bar: "bg-teal-500",     badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300", bg: "bg-teal-50" },
};

/* ------------------------------------------------------------------ */
/*  Signal source → display mapping                                    */
/* ------------------------------------------------------------------ */

const SOURCE_META: Record<string, { label: string; icon: typeof MessageCircle; color: string }> = {
  search_intent: { label: "Search Intent", icon: Search, color: "bg-blue-500" },
  reddit_forum: { label: "Reddit", icon: MessageCircle, color: "bg-orange-500" },
  review: { label: "Reviews", icon: Star, color: "bg-amber-500" },
  tiktok: { label: "TikTok", icon: Hash, color: "bg-pink-500" },
  facebook: { label: "Facebook", icon: Globe, color: "bg-blue-600" },
  x: { label: "X / Twitter", icon: MessageCircle, color: "bg-slate-600" },
  youtube: { label: "YouTube", icon: Hash, color: "bg-red-500" },
  website: { label: "Website", icon: Globe, color: "bg-teal-500" },
  hiring: { label: "Hiring", icon: Users, color: "bg-purple-500" },
  ads: { label: "Ads", icon: DollarSign, color: "bg-emerald-500" },
  whatsapp: { label: "WhatsApp", icon: MessageCircle, color: "bg-green-500" },
  sales_data: { label: "Sales Data", icon: TrendingUp, color: "bg-cyan-500" },
};

const STAGE_LABELS: Record<string, string> = {
  research: "Research",
  comparison: "Comparison",
  validation: "Validation",
  purchase: "Purchase",
  usage: "Usage",
  review: "Review",
  repeat_purchase: "Repeat Purchase",
  advocacy: "Advocacy",
};

const STAGE_COLORS: Record<string, string> = {
  research: "border-l-blue-400", comparison: "border-l-amber-400", validation: "border-l-emerald-400",
  purchase: "border-l-violet-400", usage: "border-l-teal-400", review: "border-l-rose-400",
  repeat_purchase: "border-l-orange-400", advocacy: "border-l-purple-400",
};

/* ================================================================== */
/*  Simple markdown renderer                                           */
/* ================================================================== */

function MarkdownBlock({ content }: { content: string }) {
  const lines = content.split("\n");
  const sections: { level: number; text: string; lines: string[] }[] = [];
  let currentSection: { level: number; text: string; lines: string[] } | null = null;

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      if (currentSection) sections.push(currentSection);
      currentSection = { level: headingMatch[1].length, text: headingMatch[2], lines: [] };
    } else if (currentSection) {
      currentSection.lines.push(line);
    }
  }
  if (currentSection) sections.push(currentSection);

  if (sections.length === 0) {
    return <p className="text-sm text-muted-foreground">{content}</p>;
  }

  return (
    <div className="space-y-5">
      {sections.map((section, si) => (
        <div key={si}>
          <h3 className={`font-bold text-foreground mb-2 ${section.level === 1 ? "text-lg" : "text-base"}`}>
            {section.text}
          </h3>
          <div className="space-y-1.5">
            {section.lines.map((line, li) => {
              if (!line.trim()) return <div key={li} className="h-2" />;
              const bulletMatch = line.match(/^[\s]*[-*]\s+(.+)$/);
              if (bulletMatch) return <BulletItem key={li} text={bulletMatch[1]} />;
              const quoteMatch = line.match(/^>\s*(.+)$/);
              if (quoteMatch) return (
                <blockquote key={li} className="border-l-2 border-primary/30 pl-3 italic text-sm text-muted-foreground">
                  <FormatInline text={quoteMatch[1]} />
                </blockquote>
              );
              if (line.includes("**Current scores consider")) return null;
              return <p key={li} className="text-sm text-foreground/80"><FormatInline text={line} /></p>;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function BulletItem({ text }: { text: string }) {
  const colonIdx = text.indexOf(": ");
  if (colonIdx > 0) {
    const key = text.slice(0, colonIdx);
    const val = text.slice(colonIdx + 2);
    return (
      <div className="flex items-start gap-2 text-sm">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
        <span className="text-foreground/80"><FormatInline text={key} />: <span className="text-foreground font-medium"><FormatInline text={val} /></span></span>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
      <span className="text-foreground/80"><FormatInline text={text} /></span>
    </div>
  );
}

function FormatInline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return <>
    {parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
        : <span key={i}>{part}</span>
    )}
  </>;
}

/* ================================================================== */
/*  Select helper                                                      */
/* ================================================================== */

function FormSelect({ label, value, options, onChange, icon: Icon, placeholder }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void; icon?: typeof ChevronDown; placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
        {Icon && <Icon size={14} />}{label}
      </label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

/* ================================================================== */
/*  File upload helpers                                                */
/* ================================================================== */

/**
 * Upload a file to the PDE S3 upload endpoint.
 */
async function uploadPdeFile(
  businessId: number | string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<{ url: string; key: string; fileName: string; size: number } | null> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("businessId", String(businessId));

  const isDev = process.env.NODE_ENV === "development";
  const baseUrl = isDev
    ? "http://localhost:3001"
    : (process.env.NEXT_PUBLIC_API_URL || "https://api.paza.social");

  try {
    const xhr = new XMLHttpRequest();
    const result = await new Promise<{ url: string; key: string; fileName: string; size: number } | null>(
      (resolve, reject) => {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable && onProgress) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        });
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              if (data.success && data.data) resolve(data.data);
              else resolve(null);
            } catch { resolve(null); }
          } else resolve(null);
        });
        xhr.addEventListener("error", () => reject(new Error("Network error")));
        xhr.open("POST", `${baseUrl}/api/pde-upload/upload`);
        xhr.withCredentials = true;
        xhr.send(formData);
      }
    );
    return result;
  } catch {
    return null;
  }
}

/**
 * Parse a CSV file and return rows as arrays of strings.
 * Handles quoted fields, commas within quotes, and different line endings.
 */
async function parseCSV(file: File): Promise<string[][]> {
  const text = await file.text();
  const lines: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      current.push(field.trim());
      field = "";
    } else if ((ch === "\n" || (ch === "\r" && next === "\n")) && !inQuotes) {
      if (ch === "\r") i++;
      current.push(field.trim());
      if (current.some((f) => f.length > 0)) lines.push(current);
      current = [];
      field = "";
    } else if (ch === "\r" && next !== "\n" && !inQuotes) {
      current.push(field.trim());
      if (current.some((f) => f.length > 0)) lines.push(current);
      current = [];
      field = "";
    } else {
      field += ch;
    }
  }
  // Last field
  current.push(field.trim());
  if (current.some((f) => f.length > 0)) lines.push(current);

  return lines;
}

/** Flatten CSV rows into a single text block, one line per row (first column only by default, or all joined). */
function csvRowsToText(rows: string[][], useColumn: number = 0): string {
  return rows
    .map((row) => {
      if (row.length === 0) return "";
      const col = useColumn < row.length ? row[useColumn] : row[0];
      // Trim leading quote remnants
      return col.replace(/^["']|["']$/g, "").trim();
    })
    .filter(Boolean)
    .join("\n");
}

/* ================================================================== */
/*  MAIN PAGE                                                          */
/* ================================================================== */

export default function PDEShowcasePage() {
  // ── Form state ──
  const [brandName, setBrandName] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [functionalClaim, setFunctionalClaim] = useState("");
  const [usageTrigger, setUsageTrigger] = useState("");
  const [usageFrequency, setUsageFrequency] = useState("");
  const [price, setPrice] = useState("");
  const [geographyText, setGeographyText] = useState("");
  const [salesChannelsText, setSalesChannelsText] = useState("");
  const [businessObjective, setBusinessObjective] = useState("");

  // ── Spec 6.1 Product Reality ──
  const [dependencyUnit, setDependencyUnit] = useState("");
  const [failureOutcome, setFailureOutcome] = useState("");

  // ── Spec 6.2 Operational Constraints ──
  const [transactionSurface, setTransactionSurface] = useState("");
  const [fulfillmentReality, setFulfillmentReality] = useState("");
  const [regulatoryConstraintsText, setRegulatoryConstraintsText] = useState("");

  // ── Raw Business Artifacts ──
  const [reviewsText, setReviewsText] = useState("");
  const [supportTicketsText, setSupportTicketsText] = useState("");
  const [faqsText, setFaqsText] = useState("");
  const [marketingCopyText, setMarketingCopyText] = useState("");
  const [customerCommunicationsText, setCustomerCommunicationsText] = useState("");

  // ── Substitution Seeds ──
  const [directCompetitorsText, setDirectCompetitorsText] = useState("");
  const [alternativesText, setAlternativesText] = useState("");
  const [workaroundsText, setWorkaroundsText] = useState("");

  // ── Technology Stack ──
  const [technologiesText, setTechnologiesText] = useState("");
  const [observedSignalsText, setObservedSignalsText] = useState("");

  // ── Business Metrics ──
  const [repeatPurchaseRate, setRepeatPurchaseRate] = useState("");
  const [cartAbandonmentRate, setCartAbandonmentRate] = useState("");

  // ── File upload ──
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadPreview, setUploadPreview] = useState<string[]>([]);
  const [uploadTarget, setUploadTarget] = useState<"reviews" | "supportTickets" | "faqs" | "marketingCopy" | "customerCommunications">("reviews");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadedFileTextRef = useRef("");

  // ── S3 Upload ──
  const [s3UploadUrls, setS3UploadUrls] = useState<Record<string, string[]>>({});
  const [s3Uploading, setS3Uploading] = useState(false);
  const [s3Progress, setS3Progress] = useState<Record<string, number>>({});
  const s3FileInputRef = useRef<HTMLInputElement>(null);
  const [s3Target, setS3Target] = useState<"customerReviews" | "faqs" | "supportTickets" | "marketingCopy" | "customerCommunications">("customerReviews");

  // ── UI state ──
  const [output, setOutput] = useState<ShowcaseResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showInput, setShowInput] = useState(true);
  const [detailed, setDetailed] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [showFullReport, setShowFullReport] = useState(false);
  const [downloading, setDownloading] = useState<"full" | "detailed" | null>(null);
  const downloadingRef = useRef<"full" | "detailed" | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    identity: true,
    reality: false,
    constraints: false,
    artifacts: false,
    substitution: false,
    tech: false,
    fileupload: false,
    s3upload: false,
  });

  const toggleSection = (key: string) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // ── Convert markdown to styled HTML for PDF ──
  const mdToStyledHTML = useCallback((md: string): string => {
    let html = md
      .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
      .replace(/^### (.+)$/gm, "<h3>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
      .replace(/^>\s*(.+)$/gm, '<blockquote><p>$1</p></blockquote>')
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/---/g, "<hr />")
      .split("\n")
      .map((line) => {
        const t = line.trim();
        if (/^[-*]\s+/.test(t)) return `<li>${t.replace(/^[-*]\s+/, "")}</li>`;
        if (t.startsWith("<h") || t.startsWith("<blockquote") || t.startsWith("<li") ||
            t.startsWith("</") || t.startsWith("<pr") || t.startsWith("<co") ||
            t.startsWith("<hr") || t === "")
          return t;
        if (!t.startsWith("<")) return `<p>${t}</p>`;
        return t;
      })
      .join("\n");
    // Wrap consecutive <li> in <ul>
    html = html.replace(/((?:<li>.*?<\/li>\n?)+)/g, "<ul>\n$1</ul>");
    return html;
  }, []);

  // ── Download report as PDF via browser print engine ──
  const downloadAsPDF = useCallback(async (content: string, filename: string, type: "full" | "detailed") => {
    // Guard against concurrent downloads (per-type)
    if (downloadingRef.current) return;
    downloadingRef.current = type;
    setDownloading(type);

    try {
      const bodyHTML = mdToStyledHTML(content);

      const printHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${filename}</title>
<style>
  @page { margin: 12mm 15mm; size: A4; }
  @media print { html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    color: #111;
    line-height: 1.7;
    background: #fff;
    padding: 0;
    max-width: 800px;
    margin: 0 auto;
  }
  h1 { font-size: 24px; font-weight: 700; margin: 28px 0 12px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; color: #111; page-break-after: avoid; }
  h2 { font-size: 20px; font-weight: 700; margin: 24px 0 10px; color: #1f2937; page-break-after: avoid; }
  h3 { font-size: 16px; font-weight: 700; margin: 20px 0 8px; color: #374151; page-break-after: avoid; }
  h4 { font-size: 14px; font-weight: 700; margin: 16px 0 6px; color: #4b5563; page-break-after: avoid; }
  p { margin: 8px 0; font-size: 12.5px; color: #333; orphans: 3; widows: 3; }
  ul, ol { margin: 6px 0 6px 22px; }
  li { margin: 4px 0; font-size: 12.5px; color: #333; }
  blockquote { margin: 12px 0; padding: 10px 18px; border-left: 4px solid #d1d5db; background: #f9fafb; font-style: italic; color: #4b5563; border-radius: 0 6px 6px 0; }
  strong { font-weight: 700; color: #000; }
  code { background: #f3f4f6; padding: 1px 5px; border-radius: 4px; font-size: 12px; font-family: 'Cascadia Code', 'Fira Code', Consolas, monospace; }
  pre { background: #1f2937; color: #f3f4f6; padding: 14px 18px; border-radius: 8px; margin: 12px 0; overflow-x: auto; page-break-inside: avoid; }
  pre code { background: transparent; padding: 0; color: inherit; font-size: 11.5px; }
  hr { border: none; border-top: 1px solid #e5e7eb; margin: 20px 0; }
  img { max-width: 100%; height: auto; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 12px; }
  th, td { border: 1px solid #d1d5db; padding: 6px 10px; text-align: left; }
  th { background: #f3f4f6; font-weight: 600; }
  .report-header { text-align: center; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 3px solid #2563eb; }
  .report-header h1 { font-size: 26px; border: none; margin: 0 0 4px; color: #1e40af; }
  .report-header p { font-size: 13px; color: #6b7280; }
</style>
</head>
<body>
  <div class="report-header">
    <h1>PDE Blueprint Report</h1>
    <p>Generated ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
  </div>
  ${bodyHTML}
</body>
</html>`;

      // Create the iframe ON-SCREEN (opacity:0) instead of off-screen.
      // When the iframe is off-screen (left:-9999px), Chrome's print engine
      // may not connect to it properly — the afterprint event can fail to
      // fire, leaving the spinner stuck forever.
      const iframe = document.createElement("iframe");
      iframe.style.cssText = "position:fixed!important;left:0!important;top:0!important;width:800px!important;height:1px!important;opacity:0!important;pointer-events:none!important;border:none!important;z-index:-1!important;";
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument!;
      iframeDoc.open();
      iframeDoc.write(printHTML);
      iframeDoc.close();

      // Wait for fonts and layout to settle inside the iframe
      const loadPromise = iframeDoc.fonts
        ? iframeDoc.fonts.ready
        : Promise.resolve();
      await Promise.all([loadPromise, new Promise((r) => setTimeout(r, 500))]);

      // Show instruction before the (modal) print dialog opens
      toast("Select 'Save as PDF' in the print dialog.", { icon: "🖨️", duration: 5000 });

      // Open the browser's native print dialog — user picks "Save as PDF"
      const printWindow = iframe.contentWindow!;
      printWindow.focus();
      printWindow.print();

      // ── Cleanup: the afterprint event can go missing when the iframe
      //    was created dynamically or when the user cancels quickly.  Use
      //    THREE signals to ensure the spinner always stops. ──
      let cleanedUp = false;
      const cleanup = () => {
        if (cleanedUp) return;
        cleanedUp = true;
        if (document.body.contains(iframe)) document.body.removeChild(iframe);
        downloadingRef.current = null;
        setDownloading(null);
      };

      // 1) afterprint — fires natively when the print dialog closes
      printWindow.addEventListener("afterprint", cleanup, { once: true });

      // 2) Main-window focus — the print dialog is modal; when it closes
      //    the main window regains focus.  Skip the initial focus burst
      //    that happens right after print() is called.
      const MIN_PRINT_MS = 2000;
      const printStarted = Date.now();
      const onFocus = () => {
        if (Date.now() - printStarted >= MIN_PRINT_MS) cleanup();
        else window.addEventListener("focus", onFocus, { once: true });
      };
      window.addEventListener("focus", onFocus, { once: true });

      // 3) Hard timeout — 30s safety net if both events above are lost
      setTimeout(cleanup, 30_000);
    } catch (e) {
      console.error("Failed to open print dialog", e);
      toast.error("Could not open print dialog. Please try Chrome/Edge.");
      downloadingRef.current = null;
      setDownloading(null);
    }
  }, [mdToStyledHTML]);

  // ── Load preset ──
  const loadPreset = useCallback((preset: ProductPreset) => {
    setBrandName(preset.brandName);
    setProductName(preset.productName);
    setCategory(preset.category);
    setFunctionalClaim(preset.functionalClaim);
    setUsageTrigger(preset.usageTrigger);
    setUsageFrequency(preset.usageFrequency);
    setPrice(preset.price);
    setGeographyText(preset.geography.join(", "));
    setSalesChannelsText(preset.salesChannels.join(", "));
    setBusinessObjective(preset.businessObjective);
    setDependencyUnit(preset.dependencyUnit);
    setFailureOutcome(preset.failureOutcome);
    setTransactionSurface(preset.transactionSurface);
    setFulfillmentReality(preset.fulfillmentReality);
    setRegulatoryConstraintsText(preset.regulatoryConstraints);
    setReviewsText(preset.customerReviews);
    setSupportTicketsText(preset.supportTickets);
    setFaqsText(preset.faqs);
    setMarketingCopyText(preset.marketingCopy);
    setCustomerCommunicationsText(preset.customerCommunications);
    setDirectCompetitorsText(preset.directCompetitors);
    setAlternativesText(preset.customerMentionedAlternatives);
    setWorkaroundsText(preset.knownUserWorkarounds);
    setTechnologiesText(preset.technologies);
    setObservedSignalsText(preset.observedSignals);
    setRepeatPurchaseRate(preset.repeatPurchaseRate);
    setCartAbandonmentRate(preset.cartAbandonmentRate);
    setOutput(null);
    setError("");
    setUploadedFileName("");
    setUploadPreview([]);
    setS3UploadUrls({});
    setS3Progress({});
  }, []);

  // ── File upload handler ──
  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setUploadPreview([]);

    try {
      // Read the full text and store in ref so applyUpload can use it
      // even after the file input is cleared (for re-select support).
      let fullText = "";
      if (file.name.endsWith(".csv")) {
        const rows = await parseCSV(file);
        const texts = rows.map((row) => row[0] || row.join(" | ")).filter(Boolean);
        setUploadPreview(texts.slice(0, 10));
        fullText = texts.join("\n");
      } else {
        fullText = await file.text();
        const lines = fullText.split("\n").filter((l) => l.trim());
        setUploadPreview(lines.slice(0, 20));
      }
      uploadedFileTextRef.current = fullText;
    } catch {
      setUploadedFileName(`Failed to parse ${file.name}`);
      uploadedFileTextRef.current = "";
    }

    // Reset the input so re-uploading same file triggers change
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  // ── Apply uploaded data to target field ──
  const applyUpload = useCallback(async () => {
    const text = uploadedFileTextRef.current;
    if (!text) return;

    const setter: Record<string, (v: string) => void> = {
      reviews: setReviewsText,
      supportTickets: setSupportTicketsText,
      faqs: setFaqsText,
      marketingCopy: setMarketingCopyText,
      customerCommunications: setCustomerCommunicationsText,
    };

    const current = {
      reviews: reviewsText,
      supportTickets: supportTicketsText,
      faqs: faqsText,
      marketingCopy: marketingCopyText,
      customerCommunications: customerCommunicationsText,
    };

    // Append: keep existing text, add uploaded content after a separator
    const existing = current[uploadTarget]?.trim();
    setter[uploadTarget](existing ? existing + "\n" + text : text);
    setUploadedFileName(`Imported ${uploadTarget}`);
    setUploadPreview([]);
    uploadedFileTextRef.current = "";

    // Clear file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [uploadTarget, reviewsText, supportTicketsText, faqsText, marketingCopyText, customerCommunicationsText]);

  // ── S3 file upload handler (uploads to S3 and stores the URL) ──
  const handleS3Upload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setS3Uploading(true);
    const businessId = brandName.trim().toLowerCase().replace(/\s+/g, "-") || "showcase-demo";
    const uploaded: { url: string; key: string; fileName: string; size: number }[] = [];

    for (const file of Array.from(files)) {
      const fileKey = `${s3Target}:${file.name}`;
      const result = await uploadPdeFile(businessId, file, (pct) => {
        setS3Progress((prev) => ({ ...prev, [fileKey]: pct }));
      });
      if (result) {
        uploaded.push(result);
      }
    }

    if (uploaded.length > 0) {
      const urls = uploaded.map((u) => u.url);
      setS3UploadUrls((prev) => ({
        ...prev,
        [s3Target]: [...(prev[s3Target] || []), ...urls],
      }));
    }

    setS3Progress({});
    setS3Uploading(false);
    if (s3FileInputRef.current) s3FileInputRef.current.value = "";
  }, [s3Target, brandName]);

  // ── Remove a single S3 uploaded file ──
  const removeS3Upload = useCallback((category: string, index: number) => {
    setS3UploadUrls((prev) => {
      const existing = prev[category] || [];
      return { ...prev, [category]: existing.filter((_, i) => i !== index) };
    });
  }, []);

  // ── Generate ──
  const generate = useCallback(async () => {
    setError("");
    setLoading(true);
    setOutput(null);

    const payload: Record<string, unknown> = {
      brandName: brandName.trim(),
      productName: productName.trim(),
      category: category.trim(),
      functionalClaim: functionalClaim.trim(),
      usageTrigger: usageTrigger.trim() || undefined,
      usageFrequency: usageFrequency.trim() || undefined,
      price: price.trim() || undefined,
      geography: geographyText.split(",").map((s) => s.trim()).filter(Boolean),
      salesChannels: salesChannelsText.split(",").map((s) => s.trim()).filter(Boolean),
      businessObjective: businessObjective.trim() || undefined,

      // Spec 6.1
      dependencyUnit: dependencyUnit.trim() || undefined,
      failureOutcome: failureOutcome.trim() || undefined,

      // Spec 6.2
      transactionSurface: transactionSurface || undefined,
      fulfillmentReality: fulfillmentReality || undefined,
      regulatoryConstraints: regulatoryConstraintsText.split("\n").map((s) => s.trim()).filter(Boolean),

      // Substitution
      directCompetitors: directCompetitorsText.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean),
      customerMentionedAlternatives: alternativesText.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean),
      knownUserWorkarounds: workaroundsText.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean),

      // Technology
      technologies: technologiesText.split(",").map((s) => s.trim()).filter(Boolean),
      observedSignals: observedSignalsText.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean),

      // Metrics
      repeatPurchaseRate: repeatPurchaseRate ? Number(repeatPurchaseRate) : undefined,
      cartAbandonmentRate: cartAbandonmentRate ? Number(cartAbandonmentRate) : undefined,

      // Business Artifacts
      customerReviews: reviewsText.split("\n").map((s) => s.trim()).filter(Boolean),
      supportTickets: supportTicketsText.split("\n").map((s) => s.trim()).filter(Boolean),
      faqs: faqsText.split("\n").map((s) => s.trim()).filter(Boolean),
      marketingCopy: marketingCopyText.split("\n").map((s) => s.trim()).filter(Boolean),
      customerCommunications: customerCommunicationsText.split("\n").map((s) => s.trim()).filter(Boolean),

      // S3 upload URLs (files uploaded to S3 instead of inline)
      ...(Object.keys(s3UploadUrls).length > 0 ? { s3UploadUrls } : {}),
    };

    if (detailed) {
      payload.detailed = true;
    }

    try {
      const isDev = process.env.NODE_ENV === "development";
      const apiUrl = isDev
        ? "http://localhost:3001"
        : (process.env.NEXT_PUBLIC_AGENT_API_URL ||
          process.env.NEXT_PUBLIC_AGENTIC_API_URL ||
          process.env.NEXT_PUBLIC_API_URL ||
          "https://api.paza.social");

      const res = await fetch(`${apiUrl}/api/pde/showcase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(
          (errBody as { error?: string; details?: string }).details ||
          (errBody as { error?: string }).error ||
          `Server error ${res.status}`
        );
      }

      const json = await res.json();
      setOutput(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate PDE blueprint");
    } finally {
      setLoading(false);
    }
  }, [brandName, productName, category, functionalClaim, usageTrigger, usageFrequency, price, geographyText, salesChannelsText, businessObjective, dependencyUnit, failureOutcome, transactionSurface, fulfillmentReality, regulatoryConstraintsText, reviewsText, supportTicketsText, faqsText, marketingCopyText, customerCommunicationsText, directCompetitorsText, alternativesText, workaroundsText, technologiesText, observedSignalsText, repeatPurchaseRate, cartAbandonmentRate, detailed]);

  const hasRequired = brandName.trim() && productName.trim() && category.trim() && functionalClaim.trim();

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div className="min-h-screen bg-background">
      {/* ──────── Hero ──────── */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-orange-50 via-background to-amber-50 dark:from-orange-950/10 dark:via-background dark:to-amber-950/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.705_0.213_47.604/0.06),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <BrainCircuit size={16} />
              Product Demand Environment — Blueprint Engine
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              PDE Showcase
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Analyze your product against real customer signals. Enter product details
              and customer data to generate a full demand environment blueprint —
              narratives, opportunity corridors, customer journey, and strategic recommendations.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* ──────── Presets ──────── */}
        <div className="mb-8">
          <p className="mb-3 text-sm font-medium text-muted-foreground">Quick demo — pick a preset:</p>
          <div className="flex flex-wrap gap-3">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => loadPreset(p)}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm hover:border-primary/40 hover:bg-primary/5 hover:shadow-md transition-all"
              >
                <p.icon size={16} className="text-primary" />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ──────── Product Input ──────── */}
        <button
          onClick={() => setShowInput((s) => !s)}
          className="mb-4 flex w-full items-center justify-between rounded-lg border border-border bg-card px-5 py-3 text-left shadow-sm hover:bg-muted/50 transition-colors"
        >
          <span className="flex items-center gap-2 font-semibold text-foreground">
            <FileText size={18} className="text-primary" />
            Product Input Data
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {showInput ? "shown" : "hidden"}
            </span>
          </span>
          {showInput ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
        </button>

        <AnimatePresence>
          {showInput && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mb-8 space-y-5">

                {/* ── Section A: Product Identity (always visible) ── */}
                <CollapsibleSection
                  title="Product Identity"
                  icon={Layers}
                  expanded={expandedSections.identity}
                  onToggle={() => toggleSection("identity")}
                  required
                >
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <TextField label="Brand Name *" value={brandName} onChange={setBrandName} placeholder="e.g. Nuvita" icon={Sparkles} />
                    <TextField label="Product Name *" value={productName} onChange={setProductName} placeholder="e.g. Baby Diapers" icon={Layers} />
                    <TextField label="Category *" value={category} onChange={setCategory} placeholder="e.g. baby diapers" icon={Hash} />
                    <TextField label="Price" value={price} onChange={setPrice} placeholder="e.g. $29 / KES 1,200" icon={DollarSign} />
                    <div className="sm:col-span-2 lg:col-span-2">
                      <TextField label="Functional Claim *" value={functionalClaim} onChange={setFunctionalClaim} placeholder="e.g. Absorbs urine and keeps babies dry" icon={Zap} />
                    </div>
                    <TextField label="Business Objective" value={businessObjective} onChange={setBusinessObjective} placeholder="e.g. Increase first-time purchases" icon={Flag} />
                    <TextField label="Geography (comma-separated)" value={geographyText} onChange={setGeographyText} placeholder="e.g. Kenya, Nigeria, Ghana" icon={Globe} />
                    <TextField label="Sales Channels (comma-separated)" value={salesChannelsText} onChange={setSalesChannelsText} placeholder="e.g. Supermarkets, Pharmacies" icon={ShoppingCart} />
                  </div>
                </CollapsibleSection>

                {/* ── Section B: Product Reality ── */}
                <CollapsibleSection title="Product Reality" icon={Package} expanded={expandedSections.reality} onToggle={() => toggleSection("reality")}>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <TextField label="Usage Trigger" value={usageTrigger} onChange={setUsageTrigger} placeholder="e.g. Baby needs a diaper change" icon={Zap} />
                    <TextField label="Usage Frequency" value={usageFrequency} onChange={setUsageFrequency} placeholder="e.g. Daily / Weekly / As needed" icon={Clock} />
                    <TextField label="Dependency Unit" value={dependencyUnit} onChange={setDependencyUnit} placeholder="e.g. 1 pack of 30 diapers" icon={Box} />
                    <div className="lg:col-span-2">
                      <TextField label="Failure Outcome" value={failureOutcome} onChange={setFailureOutcome} placeholder="What happens if the product is absent or fails?" icon={AlertTriangle} multiline rows={2} />
                    </div>
                    <FormSelect label="Transaction Surface" value={transactionSurface} onChange={setTransactionSurface}
                      options={["Shopify", "WhatsApp", "Physical Retail", "Mobile App", "Custom Web"]}
                      icon={ShoppingCart} placeholder="Select transaction surface" />
                    <FormSelect label="Fulfillment Reality" value={fulfillmentReality} onChange={setFulfillmentReality}
                      options={["Instant Retail", "<24 Hours", "48-72 Hours", ">7 Days"]}
                      icon={Clock} placeholder="Select fulfillment time" />
                  </div>
                </CollapsibleSection>

                {/* ── Section C: Operational Constraints ── */}
                <CollapsibleSection title="Operational Constraints" icon={Shield} expanded={expandedSections.constraints} onToggle={() => toggleSection("constraints")}>
                  <div className="grid gap-5">
                    <TextField label="Regulatory Constraints (one per line)" value={regulatoryConstraintsText} onChange={setRegulatoryConstraintsText}
                      placeholder="NAFDAC compliance&#10;KEBS certification&#10;GDPR" icon={Shield} multiline rows={3} />
                  </div>
                </CollapsibleSection>

                {/* ── Section D: Raw Business Artifacts ── */}
                <CollapsibleSection title="Business Artifacts" icon={FileText} expanded={expandedSections.artifacts} onToggle={() => toggleSection("artifacts")}>
                  <p className="mb-4 text-xs text-muted-foreground">These fuel the narrative extraction engine. The more data you provide, the richer the analysis.</p>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <TextField label="Customer Reviews (one per line)" value={reviewsText} onChange={setReviewsText}
                      placeholder="My baby sleeps through the night now, no more leaks!" icon={MessageCircle} multiline rows={5} />
                    <TextField label="Support Tickets (one per line)" value={supportTicketsText} onChange={setSupportTicketsText}
                      placeholder="Where is my order?&#10;Product arrived damaged" icon={AlertTriangle} multiline rows={5} />
                    <TextField label="FAQs (one per line)" value={faqsText} onChange={setFaqsText}
                      placeholder="Do you ship internationally?&#10;What ingredients do you use?" icon={Info} multiline rows={4} />
                    <TextField label="Marketing Copy (one per line)" value={marketingCopyText} onChange={setMarketingCopyText}
                      placeholder="DM to order&#10;Limited drop&#10;Creator collaboration" icon={Quote} multiline rows={4} />
                    <div className="sm:col-span-2">
                      <TextField label="Customer Communications (chat logs, emails — one per line)" value={customerCommunicationsText} onChange={setCustomerCommunicationsText}
                        placeholder="Thanks for your order! Your delivery is on the way..." icon={MessageCircle} multiline rows={4} />
                    </div>
                  </div>
                </CollapsibleSection>

                {/* ── Section E: Substitution Seeds ── */}
                <CollapsibleSection title="Substitution & Competition" icon={Wrench} expanded={expandedSections.substitution} onToggle={() => toggleSection("substitution")}>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <TextField label="Direct Competitors (one per line)" value={directCompetitorsText} onChange={setDirectCompetitorsText}
                      placeholder="Pampers&#10;Huggies&#10;Molfix" icon={Target} multiline rows={4} />
                    <TextField label="Customer-Mentioned Alternatives (one per line)" value={alternativesText} onChange={setAlternativesText}
                      placeholder="Cloth diapers&#10;Local unbranded diapers&#10;DIY solutions" icon={ArrowLeftRight} multiline rows={4} />
                    <TextField label="Known User Workarounds (one per line)" value={workaroundsText} onChange={setWorkaroundsText}
                      placeholder="Putting two diapers at night&#10;Air drying reusable covers" icon={Wrench} multiline rows={4} />
                  </div>
                </CollapsibleSection>

                {/* ── Section F: Technology & Metrics ── */}
                <CollapsibleSection title="Technology & Metrics" icon={BarChart3} expanded={expandedSections.tech} onToggle={() => toggleSection("tech")}>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="lg:col-span-2">
                      <TextField label="Technology Stack (comma-separated)" value={technologiesText} onChange={setTechnologiesText}
                        placeholder="whatsapp, shopify, paystack, instagram" icon={Cpu} />
                    </div>
                    <TextField label="Observed Signals (one per line)" value={observedSignalsText} onChange={setObservedSignalsText}
                      placeholder="instagram creator activity&#10;whatsapp commerce&#10;link in bio traffic" icon={Activity} multiline rows={3} />
                    <TextField label="Repeat Purchase Rate (%)" value={repeatPurchaseRate} onChange={setRepeatPurchaseRate}
                      placeholder="e.g. 35" icon={Percent} type="number" />
                    <TextField label="Cart Abandonment Rate (%)" value={cartAbandonmentRate} onChange={setCartAbandonmentRate}
                      placeholder="e.g. 60" icon={Percent} type="number" />
                  </div>
                </CollapsibleSection>

                {/* ── Section G: File Upload ── */}
                <CollapsibleSection title="Bulk Import (CSV / PDF)" icon={Upload} expanded={expandedSections.fileupload} onToggle={() => toggleSection("fileupload")}>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Upload a CSV or PDF file to bulk-import reviews, support tickets, FAQs, or marketing copy.
                    For CSV, the first column is used. Data is appended to the target field.
                  </p>
                  <div className="rounded-xl border-2 border-dashed border-border bg-background p-5">
                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,.pdf,.txt"
                            onChange={handleFileUpload}
                            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer cursor-pointer"
                          />
                          <select
                            value={uploadTarget}
                            onChange={(e) => setUploadTarget(e.target.value as typeof uploadTarget)}
                            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                          >
                            <option value="reviews">→ Reviews</option>
                            <option value="supportTickets">→ Support Tickets</option>
                            <option value="faqs">→ FAQs</option>
                            <option value="marketingCopy">→ Marketing Copy</option>
                            <option value="customerCommunications">→ Communications</option>
                          </select>
                          <button
                            onClick={applyUpload}
                            disabled={!uploadedFileName}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            <Download size={14} />
                            Import
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Upload preview */}
                    {uploadedFileName && uploadPreview.length === 0 && (
                      <p className="mt-3 text-xs text-emerald-600 dark:text-emerald-400">{uploadedFileName}</p>
                    )}
                    {uploadPreview.length > 0 && (
                      <div className="mt-4 rounded-lg border border-border bg-muted/30 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium text-foreground">
                            Preview of {uploadedFileName} ({uploadPreview.length} lines shown):
                          </p>
                          <button
                            onClick={() => { setUploadPreview([]); setUploadedFileName(""); }}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <pre className="max-h-32 overflow-y-auto text-xs text-muted-foreground whitespace-pre-wrap">
                          {uploadPreview.map((line, i) => (
                            <div key={i} className="truncate">{line}</div>
                          ))}
                        </pre>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    CSV: first column used. PDF: text content extracted (best-effort for text-based PDFs).
                    After importing, review and edit the target field above.
                  </p>
                </CollapsibleSection>

                {/* ── Section H: S3 Cloud Upload ── */}
                <CollapsibleSection title="S3 Cloud Upload (Large Files)" icon={Upload} expanded={expandedSections.s3upload} onToggle={() => toggleSection("s3upload")}>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Ideal for large datasets (thousands of rows).
                    Files are processed server-side by the PDE pipeline, no payload limits.
                  </p>
                  <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/[0.02] p-5">
                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <input
                            ref={s3FileInputRef}
                            type="file"
                            accept=".csv,.txt,.json,.jsonl"
                            multiple
                            onChange={handleS3Upload}
                            disabled={s3Uploading}
                            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer cursor-pointer"
                          />
                          <select
                            value={s3Target}
                            onChange={(e) => setS3Target(e.target.value as typeof s3Target)}
                            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            disabled={s3Uploading}
                          >
                            <option value="customerReviews">→ Customer Reviews</option>
                            <option value="supportTickets">→ Support Tickets</option>
                            <option value="faqs">→ FAQs</option>
                            <option value="marketingCopy">→ Marketing Copy</option>
                            <option value="customerCommunications">→ Communications</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Upload progress */}
                    {s3Uploading && Object.keys(s3Progress).length > 0 && (
                      <div className="mt-4 space-y-1.5">
                        {Object.entries(s3Progress).map(([key, pct]) => (
                          <div key={key} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Loader2 size={12} className="animate-spin text-primary" />
                            <span className="truncate max-w-[200px]">{key.split(":")[1] || key}</span>
                            <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="w-10 text-right">{pct}%</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Uploaded files list */}
                    {Object.keys(s3UploadUrls).length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-xs font-medium text-foreground">Files stored in S3:</p>
                        {Object.entries(s3UploadUrls).map(([category, urls]) =>
                          urls.map((url, i) => (
                            <div key={`${category}-${i}`} className="flex items-center gap-2 text-xs bg-background rounded px-2.5 py-1.5 border">
                              <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                              <span className="font-medium text-foreground capitalize">{category.replace(/([A-Z])/g, " $1")}:</span>
                              <span className="text-muted-foreground truncate flex-1">{url.split("/").pop()}</span>
                              <button
                                type="button"
                                onClick={() => removeS3Upload(category, i)}
                                className="text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </CollapsibleSection>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ──────── Generate Button & Detailed Toggle ──────── */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm hover:border-primary/40 hover:bg-primary/5 transition-all select-none">
            <input
              type="checkbox"
              checked={detailed}
              onChange={(e) => setDetailed(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <FileText size={16} className="text-primary" />
            Detailed report with evidence &amp; competitor context
          </label>
          <button
            onClick={generate}
            disabled={loading || !hasRequired}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <><Loader2 size={20} className="animate-spin" /> Generating PDE Blueprint…</>
            ) : (
              <><BrainCircuit size={20} /> Generate PDE Blueprint</>
            )}
          </button>
        </div>

        {/* ──────── Error ──────── */}
        {error && (
          <div className="mb-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/30 dark:bg-red-900/10 dark:text-red-400">
            {error}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════ */}
        {/*  OUTPUT                                                     */}
        {/* ════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {output && (
            <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 32 }} className="space-y-8">

              {/* ── Executive Summary ── */}
              <Section title="Executive Summary" icon={FileText} subtitle="High-level insights and key findings from the PDE analysis">
                <div className="rounded-xl border border-primary/10 bg-primary/[0.03] p-5">
                  <MarkdownBlock content={output.executiveSummary} />
                </div>
              </Section>

              {/* ── Signal Source Breakdown ── */}
              {output.signalSourceBreakdown && Object.keys(output.signalSourceBreakdown).length > 0 && (
                <Section
                  title="Signal Sources"
                  icon={Search}
                  subtitle={sourceFilter ? `Filtered by: ${sourceFilter} — click again to clear` : "Consumer signals collected by platform — click a source to filter narratives"}
                >
                  <div className="space-y-4">
                    {/* Total signals bar */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-foreground min-w-[90px]">Total</span>
                      <div className="h-8 flex-1 rounded-lg overflow-hidden flex">
                        {(() => {
                          const total = Object.values(output.signalSourceBreakdown).reduce((a, b) => a + b, 0);
                          const entries = Object.entries(output.signalSourceBreakdown)
                            .filter(([_, c]) => c > 0)
                            .sort(([, a], [, b]) => b - a);
                          return entries.map(([source, count]) => {
                            const info = SOURCE_META[source] || { label: source, icon: Hash, color: "bg-slate-400" };
                            const pct = (count / total) * 100;
                            return pct > 2 ? (
                              <div
                                key={source}
                                className={`${info.color} h-full flex items-center justify-center text-[10px] font-bold text-white first:rounded-l-lg last:rounded-r-lg cursor-pointer transition-opacity hover:opacity-80 ${sourceFilter === source ? "ring-2 ring-primary ring-offset-1" : ""}`}
                                style={{ width: `${pct}%` }}
                                title={`${info.label}: ${count} (${pct.toFixed(0)}%)`}
                                onClick={() => setSourceFilter(sourceFilter === source ? null : source)}
                              >
                                {pct > 10 ? info.label : ""}
                              </div>
                            ) : null;
                          });
                        })()}
                      </div>
                    </div>

                    {/* Individual source cards */}
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {Object.entries(output.signalSourceBreakdown)
                        .filter(([_, count]) => count > 0)
                        .sort(([, a], [, b]) => b - a)
                        .map(([source, count]) => {
                          const total = Object.values(output.signalSourceBreakdown!).reduce((a, b) => a + b, 0);
                          const pct = ((count / total) * 100).toFixed(0);
                          const info = SOURCE_META[source] || { label: source.replace(/_/g, " "), icon: Hash, color: "bg-slate-400" };
                          const Icon = info.icon;
                          const isActive = sourceFilter === source;
                          return (
                            <button
                              key={source}
                              onClick={() => setSourceFilter(isActive ? null : source)}
                              className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                                isActive
                                  ? "border-primary bg-primary/5 shadow-md"
                                  : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className={`rounded-lg p-1.5 ${info.color.replace("bg-", "bg-").replace(/\S+$/, "")}/10`}>
                                    <Icon size={16} className={info.color.replace("bg-", "text-")} />
                                  </div>
                                  <span className="font-semibold text-foreground text-sm capitalize">{info.label}</span>
                                </div>
                                <span className={`text-lg font-bold ${isActive ? "text-primary" : "text-foreground"}`}>
                                  {count}
                                </span>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                <div className={`h-full rounded-full transition-all ${info.color}`} style={{ width: `${pct}%` }} />
                              </div>
                              <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                                <span>{pct}% of all signals</span>
                                {isActive && <span className="text-primary font-medium">Filtering</span>}
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </Section>
              )}

              {/* ── Provider & mode indicator ── */}
              {output.metadata && (
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
                    <Search size={13} className="text-primary/70" />
                    {output.metadata.hasLiveSearch ? (
                      <>
                        Live search via{" "}
                        <strong className="text-foreground">
                          {output.metadata.searchProvider === "tavily" ? "Tavily" : output.metadata.searchProvider || "default"}
                        </strong>
                      </>
                    ) : output.metadata.mode === "dry-run" ? (
                      <span>Dry mode <span className="text-muted-foreground/60">(no live search)</span></span>
                    ) : (
                      <span>Static analysis</span>
                    )}
                  </div>
                  {output.metadata.collectors && Object.entries(output.metadata.collectors).filter(([, v]) => v).map(([k]) => (
                    <span key={k} className="rounded-full bg-primary/5 border border-primary/10 px-2 py-0.5 text-[10px] text-primary/70 font-medium">
                      {k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
                    </span>
                  ))}
                </div>
              )}

              {/* ── Product Summary ── */}
              <Section title="Product Summary" icon={Layers} subtitle="Core product identity as used by the PDE engine">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <MetricCard label="Brand" value={output.productSummary.brandName} />
                  <MetricCard label="Product" value={output.productSummary.productName} />
                  <MetricCard label="Category" value={output.productSummary.category} />
                  <MetricCard label="Core Job" value={output.productSummary.coreJob} />
                  <MetricCard label="Geography" value={output.productSummary.geography.join(", ")} />
                  <MetricCard label="Business Objective" value={output.productSummary.businessObjective} />
                </div>
              </Section>

              {/* ── Narratives ── */}
              {output.narratives.length > 0 && (
                <Section title="Customer Narratives" icon={MessageCircle} subtitle={
                  sourceFilter
                    ? `Showing narratives from ${SOURCE_META[sourceFilter]?.label || sourceFilter} signals only`
                    : "Key themes, emotions, and frictions extracted from customer signals"
                }>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {output.narratives
                      .filter((_, i) => {
                        if (!sourceFilter) return true;
                        const nsb = output.narrativeSourceBreakdown?.find((n) => n.narrativeIndex === i);
                        return nsb ? !!nsb.sources[sourceFilter] : true;
                      })
                      .map((narrative, fi) => {
                        const origIndex = output.narratives.indexOf(narrative);
                        const nsb = output.narrativeSourceBreakdown?.find((n) => n.narrativeIndex === origIndex);
                        const emotionColor = EMOTION_COLORS[narrative.emotion] || EMOTION_COLORS.frustration;
                        const EmotionIcon = EMOTION_ICONS[narrative.emotion] || AlertTriangle;
                        return (
                          <div key={origIndex} className={`rounded-xl border-2 p-5 shadow-sm transition-all ${emotionColor.border} ${sourceFilter ? (nsb?.sources[sourceFilter] ? "" : "opacity-30") : ""}`}>
                            <div className="mb-3 flex items-start justify-between">
                              <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Theme</span>
                                <h4 className="text-lg font-bold text-foreground capitalize">{narrative.theme.replace(/_/g, " ")}</h4>
                              </div>
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${emotionColor.bg} ${emotionColor.text}`}>
                                <EmotionIcon size={12} />{narrative.emotion}
                              </span>
                            </div>
                            <div className="mb-2"><span className="text-xs font-medium text-muted-foreground">Friction</span><p className="text-sm text-foreground/80">{narrative.friction}</p></div>
                            <div className="mb-3"><span className="text-xs font-medium text-muted-foreground">Validation</span><p className="text-sm text-foreground/80">{narrative.validation}</p></div>
                            <div className="mb-3">
                              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                <span>Signal frequency</span>
                                <span className="font-semibold text-foreground">{narrative.frequency} mentions</span>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, (narrative.frequency / Math.max(...output.narratives.map((n) => n.frequency), 1)) * 100)}%` }} />
                              </div>
                            </div>

                            {/* Source badges */}
                            {nsb && Object.keys(nsb.sources).length > 0 && (
                              <div className="mb-2 flex flex-wrap gap-1">
                                {Object.entries(nsb.sources).sort(([, a], [, b]) => b - a).map(([src, count]) => {
                                  const meta = SOURCE_META[src] || { label: src, icon: Hash, color: "bg-slate-400" };
                                  return (
                                    <button
                                      key={src}
                                      onClick={(e) => { e.stopPropagation(); setSourceFilter(sourceFilter === src ? null : src); }}
                                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-all ${
                                        sourceFilter === src
                                          ? "bg-primary text-primary-foreground"
                                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                                      }`}
                                    >
                                      {count}
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {narrative.examples.length > 0 && (
                              <div>
                                <span className="text-xs font-medium text-muted-foreground mb-1 block">Example Signals</span>
                                <div className="space-y-1">
                                  {narrative.examples.slice(0, 2).map((ex, j) => (
                                    <div key={j} className="flex items-start gap-2 text-xs text-foreground/70 bg-muted/50 rounded-lg p-2">
                                      <Quote size={10} className="mt-0.5 shrink-0 text-muted-foreground" />
                                      <span>&ldquo;{ex}&rdquo;</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>

                  {/* No matching narratives message */}
                  {sourceFilter && output.narratives.filter((_, i) => {
                    const nsb = output.narrativeSourceBreakdown?.find((n) => n.narrativeIndex === i);
                    return nsb ? !!nsb.sources[sourceFilter] : true;
                  }).length === 0 && (
                    <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4 text-center text-sm text-muted-foreground">
                      No narratives found from {SOURCE_META[sourceFilter]?.label || sourceFilter}. Try a different source.
                    </div>
                  )}
                </Section>
              )}

              {/* ── Demand Corridors ── */}
              {output.demandCorridors.length > 0 && (
                <Section title="Demand Corridors" icon={Target} subtitle="Opportunity corridors identified — problem → trigger → conversion path">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {output.demandCorridors.map((corridor, i) => {
                      const scoreColor = corridor.opportunityScore >= 35
                        ? "border-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/10"
                        : corridor.opportunityScore >= 30
                        ? "border-amber-400 bg-amber-50/30 dark:bg-amber-950/10"
                        : "border-slate-300 bg-slate-50/30 dark:bg-slate-950/10";
                      const emotionColor = EMOTION_COLORS[corridor.emotion] || EMOTION_COLORS.frustration;
                      return (
                        <div key={corridor.id} className={`rounded-xl border-2 p-5 shadow-sm ${scoreColor}`}>
                          <div className="mb-3 flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Corridor #{i + 1}</span>
                              <h4 className="text-sm font-semibold text-foreground mt-0.5">{corridor.situation}</h4>
                            </div>
                            <div className="flex flex-col items-end gap-1 ml-3 shrink-0">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${corridor.opportunityScore >= 35 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : corridor.opportunityScore >= 30 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>
                                {corridor.opportunityScore}/100
                              </span>
                              <span className={`text-[10px] font-medium capitalize px-1.5 py-0.5 rounded ${emotionColor.bg} ${emotionColor.text}`}>{corridor.emotion}</span>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div><span className="text-xs font-medium text-muted-foreground">Problem</span><p className="text-foreground/80">{corridor.problem}</p></div>
                            <div><span className="text-xs font-medium text-muted-foreground">Trigger</span><p className="text-foreground/80">{corridor.trigger}</p></div>
                            <div><span className="text-xs font-medium text-muted-foreground">Validation</span><p className="text-foreground/80">{corridor.validation}</p></div>
                            <div className="pt-2 border-t border-border">
                              <span className="text-xs font-medium text-muted-foreground">Conversion Path</span>
                              <p className="text-foreground/80 mt-0.5">{corridor.conversionPath}</p>
                            </div>
                            <div><span className="text-xs font-medium text-muted-foreground">Retention Loop</span><p className="text-foreground/70 text-xs mt-0.5">{corridor.retentionLoop}</p></div>
                            {corridor.community.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                <Users size={12} className="text-muted-foreground" />
                                {corridor.community.map((cId) => (
                                  <span key={cId} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{cId.replace(/_/g, " ")}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Section>
              )}

              {/* ── Communities ── */}
              {output.communities.length > 0 && (
                <Section title="Identified Communities" icon={Users} subtitle="Communities where product discussions are happening">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {output.communities.map((community) => (
                      <div key={community.id} className="rounded-xl border border-border bg-background p-5 shadow-sm">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="rounded-lg bg-primary/10 p-2"><Users size={18} className="text-primary" /></div>
                          <div><h4 className="font-semibold text-foreground">{community.name}</h4><p className="text-xs text-muted-foreground">{community.platform}</p></div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {community.affinitySignals.map((signal) => (
                            <span key={signal} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{signal}</span>
                          ))}
                        </div>
                        {community.estimatedSize && <p className="mt-2 text-xs text-muted-foreground">Est. size: {community.estimatedSize.toLocaleString()}</p>}
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* ── Customer Journey ── */}
              {output.journey.steps.length > 0 && (
                <Section title="Customer Journey" icon={Route} subtitle="The customer's path from first awareness to advocacy">
                  <div className="relative">
                    <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-border hidden sm:block" />
                    <div className="space-y-4">
                      {output.journey.steps
                        .filter((step) => step.stage !== "research" || step.dominantChannels.length > 0 || step.dominantNarrativeIds.length > 0)
                        .map((step) => {
                          const stageLabel = STAGE_LABELS[step.stage] || step.stage;
                          const stageColor = STAGE_COLORS[step.stage] || "border-l-slate-400";
                          return (
                            <div key={step.stage} className="relative flex items-start gap-4">
                              <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card z-10">
                                <div className="h-3 w-3 rounded-full bg-primary" />
                              </div>
                              <div className={`flex-1 rounded-xl border border-border bg-background p-4 shadow-sm border-l-4 ${stageColor}`}>
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-foreground capitalize">{stageLabel}</h4>
                                  {step.dominantChannels.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {step.dominantChannels.map((ch) => (
                                        <span key={ch} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{ch.replace(/_/g, " ")}</span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                {step.dominantNarrativeIds.length > 0 && (
                                  <div className="mb-2 flex flex-wrap gap-1">
                                    {step.dominantNarrativeIds.map((nid) => (
                                      <span key={nid} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{nid.replace(/_/g, " ")}</span>
                                    ))}
                                  </div>
                                )}
                                {step.frictionAtThisStage && (
                                  <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 mb-1.5">
                                    <AlertTriangle size={12} /><span>{step.frictionAtThisStage}</span>
                                  </div>
                                )}
                                <p className="text-sm text-foreground/70">{step.contentSuggestion}</p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </Section>
              )}

              {/* ── Full Report ── */}
              <Section title="Full PDE Blueprint Report" icon={FileText} subtitle="Complete formatted analysis">
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => setShowFullReport((s) => !s)}
                    className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                  >
                    {showFullReport ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    {showFullReport ? "Hide full report" : "Show full report"}
                  </button>
                  <button
                    onClick={() => downloadAsPDF(output.fullReport, "PDE-Full-Blueprint-Report.pdf", "full")}
                    disabled={downloading === "full"}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {downloading === "full" ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                    {downloading === "full" ? "Preparing…" : "Download PDF"}
                  </button>
                </div>
                <AnimatePresence>
                  {showFullReport && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-2">
                      <div className="rounded-xl border border-border bg-background p-5 max-h-[600px] overflow-y-auto"
                      >
                        <MarkdownBlock content={output.fullReport} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Section>

              {/* ── Detailed Report ── */}
              {output.detailedReport && (
                <Section title="Detailed PDE Blueprint Report" icon={FileText} subtitle="Evidence-backed narrative report with competitor intelligence and full source attribution">
                  <div className="flex items-center justify-end mb-3">
                    <button
                      onClick={() => downloadAsPDF(output.detailedReport!, "PDE-Detailed-Blueprint-Report.pdf", "detailed")}
                      disabled={downloading === "detailed"}
                      className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloading === "detailed" ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                      {downloading === "detailed" ? "Preparing…" : "Download PDF"}
                    </button>
                  </div>
                  <div>
                    <DetailedMarkdown content={output.detailedReport} />
                  </div>
                </Section>
              )}

              {/* ── Competitor Tracking ── */}
              {output.competitorTracking && (
                <Section title="Competitor Tracking" icon={Activity} subtitle="Time-series competitor sentiment monitoring across consumer signals">
                  <div className="space-y-4">
                    {/* Tracking summary */}
                    <div className="grid gap-3 sm:grid-cols-4">
                      <MetricCard label="Competitors Tracked" value={String(output.competitorTracking.totalCompetitorsTracked)} />
                      <MetricCard label="Themes Tracked" value={String(output.competitorTracking.totalThemesTracked)} />
                      <MetricCard label="Snapshots" value={String(output.competitorTracking.trackingWindow.snapshotCount)} />
                      <MetricCard label="Latest" value={output.competitorTracking.trackingWindow.lastSnapshot.slice(0, 10)} />
                    </div>

                    {/* Latest snapshot summary */}
                    {output.competitorTracking.latestSnapshot.length > 0 && (
                      <div className="overflow-x-auto rounded-lg border border-border">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-muted/50 border-b border-border">
                              <th className="px-3 py-2 text-left font-semibold text-foreground">Competitor</th>
                              <th className="px-3 py-2 text-left font-semibold text-foreground">Theme</th>
                              <th className="px-3 py-2 text-center font-semibold text-foreground">Mentions</th>
                              <th className="px-3 py-2 text-center font-semibold text-foreground">Sentiment</th>
                              <th className="px-3 py-2 text-center font-semibold text-foreground">Advantage</th>
                            </tr>
                          </thead>
                          <tbody>
                            {output.competitorTracking.latestSnapshot.slice(0, 12).map((snap, i) => (
                              <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                                <td className="px-3 py-1.5 font-medium text-foreground">{snap.competitor}</td>
                                <td className="px-3 py-1.5 text-foreground/80 capitalize">{snap.claimTheme.replace(/_/g, " ")}</td>
                                <td className="px-3 py-1.5 text-center text-foreground/80">{snap.mentionCount}</td>
                                <td className="px-3 py-1.5 text-center">
                                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                                    snap.consumerSentiment === "positive" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                    : snap.consumerSentiment === "negative" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                    : snap.consumerSentiment === "mixed" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                  }`}>{snap.consumerSentiment}</span>
                                </td>
                                <td className="px-3 py-1.5 text-center">
                                  <span className={`text-xs font-medium ${
                                    snap.advantageDirection === "brand" ? "text-emerald-600 dark:text-emerald-400"
                                    : snap.advantageDirection === "competitor" ? "text-red-600 dark:text-red-400"
                                    : "text-muted-foreground"
                                  }`}>{snap.advantageDirection}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Detected shifts */}
                    {output.competitorTracking.shifts.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                          <Activity size={14} className="text-primary" />
                          Detected Sentiment Shifts ({output.competitorTracking.shifts.length})
                        </h4>
                        <div className="space-y-2">
                          {output.competitorTracking.shifts.slice(0, 5).map((shift, i) => (
                            <div key={i} className="rounded-lg border border-border bg-background p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm text-foreground">{shift.competitor}</span>
                                <span className="text-xs text-muted-foreground">/</span>
                                <span className="text-xs capitalize text-foreground/70">{shift.claimTheme.replace(/_/g, " ")}</span>
                                <span className={`ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                                  shift.shiftDirection === "improving" ? "bg-emerald-100 text-emerald-700"
                                  : shift.shiftDirection === "declining" ? "bg-red-100 text-red-700"
                                  : shift.shiftDirection === "volatile" ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-100 text-slate-500"
                                }`}>{shift.shiftDirection}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">{shift.interpretation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Section>
              )}

              {/* ── Differentiators ── */}
              {output.differentiators && output.differentiators.differentiators.length > 0 && (
                <Section title="Differentiators" icon={Star} subtitle="Unique brand strengths identified from consumer signals and competitive gaps">
                  <div className="space-y-4">
                    {/* Summary */}
                    <div className="rounded-lg border border-primary/10 bg-primary/[0.02] p-4 text-sm text-foreground/80">
                      {output.differentiators.summaryStatement}
                    </div>

                    {/* Top differentiator highlight */}
                    {output.differentiators.topDifferentiator && (
                      <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/10 p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Star size={18} className="text-emerald-600 dark:text-emerald-400" />
                          <h4 className="font-bold text-foreground">Top Differentiator</h4>
                          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                            {output.differentiators.topDifferentiator.strengthScore}/100
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground mb-2 capitalize">
                          {output.differentiators.topDifferentiator.theme.replace(/_/g, " ")}
                        </p>
                        <p className="text-sm text-foreground/70 mb-2">{output.differentiators.topDifferentiator.claimStatement}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary capitalize">{output.differentiators.topDifferentiator.advantageType}</span>
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{output.differentiators.topDifferentiator.competitorGap}</span>
                        </div>
                      </div>
                    )}

                    {/* All differentiators */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      {output.differentiators.differentiators.slice(0, 6).map((diff) => (
                        <div key={diff.id} className="rounded-lg border border-border bg-background p-4">
                          <div className="flex items-start justify-between mb-1">
                            <h5 className="text-sm font-semibold text-foreground capitalize">{diff.theme.replace(/_/g, " ")}</h5>
                            <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{diff.strengthScore}/100</span>
                          </div>
                          <p className="text-xs text-foreground/70 mb-2">{diff.brandStrength}</p>
                          {diff.competitorComparison.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {diff.competitorComparison.slice(0, 3).map((comp, ci) => (
                                <span key={ci} className="rounded-full bg-red-50 dark:bg-red-950/20 px-2 py-0.5 text-[10px] text-red-600 dark:text-red-400">
                                  vs {comp.competitor} (+{comp.advantageMargin}%)
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Weakness areas */}
                    {output.differentiators.weaknessAreas.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                          <AlertTriangle size={14} className="text-amber-500" />
                          Areas to Address ({output.differentiators.weaknessAreas.length})
                        </h4>
                        <div className="space-y-2">
                          {output.differentiators.weaknessAreas.map((wa, i) => (
                            <div key={i} className="rounded-lg border border-amber-200 dark:border-amber-800/30 bg-amber-50/30 dark:bg-amber-950/10 p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold text-foreground capitalize">{wa.theme.replace(/_/g, " ")}</span>
                                <span className="text-[10px] text-muted-foreground">leading: {wa.leadingCompetitor}</span>
                              </div>
                              <p className="text-xs text-foreground/70">{wa.gap}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Section>
              )}

              {/* ── Comparison Guides ── */}
              {output.comparisonGuides && output.comparisonGuides.guides.length > 0 && (
                <Section title="Competitor Comparison Guides" icon={ArrowLeftRight} subtitle="Side-by-side scoring across key dimensions, derived from consumer signals">
                  <div className="space-y-4">
                    <div className="rounded-lg border border-primary/10 bg-primary/[0.02] p-4 text-sm text-foreground/80">
                      {output.comparisonGuides.overallAssessment}
                    </div>

                    {output.comparisonGuides.guides.map((guide, gi) => (
                      <div key={gi} className="rounded-xl border border-border bg-background p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Target size={16} className="text-primary" />
                            <h4 className="font-semibold text-foreground">vs {guide.competitor}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-foreground/70">Brand: <strong className="text-foreground">{guide.overallBrandScore}</strong></span>
                            <span className="text-xs text-muted-foreground">|</span>
                            <span className="text-xs text-foreground/70">{guide.competitor}: <strong className="text-foreground">{guide.overallCompetitorScore}</strong></span>
                            <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-bold ${
                              guide.overallWinner === "brand" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                              : guide.overallWinner === "competitor" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            }`}>
                              {guide.overallWinner === "brand" ? "Brand Wins"
                                : guide.overallWinner === "competitor" ? "Competitor Wins"
                                : "Tie"}
                            </span>
                          </div>
                        </div>

                        {/* Dimension scores */}
                        <div className="space-y-2 mb-4">
                          {guide.sections.map((section, si) => {
                            const maxScore = Math.max(section.brandScore, section.competitorScore, 1);
                            return (
                              <div key={si}>
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="text-xs font-medium text-foreground/80">{section.category}</span>
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className={section.winner === "brand" ? "font-bold text-emerald-600 dark:text-emerald-400" : "text-foreground/70"}>{section.brandScore}</span>
                                    <span className="text-muted-foreground">vs</span>
                                    <span className={section.winner === "competitor" ? "font-bold text-red-600 dark:text-red-400" : "text-foreground/70"}>{section.competitorScore}</span>
                                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                                      section.winner === "brand" ? "bg-emerald-100 text-emerald-700"
                                      : section.winner === "competitor" ? "bg-red-100 text-red-700"
                                      : "bg-slate-100 text-slate-500"
                                    }`}>{section.margin}%</span>
                                  </div>
                                </div>
                                {/* Visual bar */}
                                <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex">
                                  <div
                                    className="h-full bg-emerald-400 dark:bg-emerald-500 transition-all"
                                    style={{ width: `${(section.brandScore / maxScore) * 50}%` }}
                                  />
                                  <div
                                    className="h-full bg-red-400 dark:bg-red-500 transition-all ml-auto"
                                    style={{ width: `${(section.competitorScore / maxScore) * 50}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Advantages summary */}
                        <div className="grid gap-3 sm:grid-cols-2 text-xs">
                          {guide.brandAdvantages.length > 0 && (
                            <div className="rounded-lg bg-emerald-50/50 dark:bg-emerald-950/10 p-3">
                              <span className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1 block">Brand advantages</span>
                              <ul className="space-y-0.5 text-foreground/70">
                                {guide.brandAdvantages.slice(0, 4).map((adv, ai) => (
                                  <li key={ai} className="truncate">+ {adv}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {guide.competitorAdvantages.length > 0 && (
                            <div className="rounded-lg bg-red-50/50 dark:bg-red-950/10 p-3">
                              <span className="font-semibold text-red-700 dark:text-red-300 mb-1 block">Competitor advantages</span>
                              <ul className="space-y-0.5 text-foreground/70">
                                {guide.competitorAdvantages.slice(0, 4).map((adv, ai) => (
                                  <li key={ai} className="truncate">+ {adv}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {guide.recommendationStatement && (
                          <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3 text-xs text-foreground/70">
                            <span className="font-semibold text-foreground">Recommendation: </span>
                            {guide.recommendationStatement}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* ── Competitor Intelligence ── */}
              {output.competitorIntelligence && (
                <Section title="Competitor Intelligence" icon={Target} subtitle="What consumers are saying about competing brands, aggregated across all signals">
                  <div className="space-y-4">

                    {/* Overall landscape */}
                    <div className="rounded-xl border border-primary/10 bg-primary/[0.03] p-5">
                      <MarkdownBlock content={output.competitorIntelligence.overallLandscape} />
                    </div>

                    {/* Theme-anchored entries table */}
                    {output.competitorIntelligence.entries.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                          <ArrowLeftRight size={14} className="text-primary" />
                          Theme-Level Competitive Dynamics
                        </h4>
                        <div className="overflow-x-auto rounded-lg border border-border">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-muted/50 border-b border-border">
                                <th className="px-3 py-2 text-left font-semibold text-foreground">Competitor</th>
                                <th className="px-3 py-2 text-left font-semibold text-foreground">Theme</th>
                                <th className="px-3 py-2 text-center font-semibold text-foreground">Mentions</th>
                                <th className="px-3 py-2 text-center font-semibold text-foreground">Sentiment</th>
                                <th className="px-3 py-2 text-center font-semibold text-foreground">Advantage</th>
                              </tr>
                            </thead>
                            <tbody>
                              {output.competitorIntelligence.entries.map((entry, i) => (
                                <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                                  <td className="px-3 py-1.5 font-medium text-foreground">{entry.competitor}</td>
                                  <td className="px-3 py-1.5 text-foreground/80 capitalize">{entry.claimTheme.replace(/_/g, " ")}</td>
                                  <td className="px-3 py-1.5 text-center text-foreground/80">{entry.mentionFrequency}</td>
                                  <td className="px-3 py-1.5 text-center">
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                                      entry.consumerSentiment === "positive" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                      : entry.consumerSentiment === "negative" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                      : entry.consumerSentiment === "mixed" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                    }`}>{entry.consumerSentiment}</span>
                                  </td>
                                  <td className="px-3 py-1.5 text-center">
                                    <span className={`text-xs font-medium ${
                                      entry.advantageDirection === "brand" ? "text-emerald-600 dark:text-emerald-400"
                                      : entry.advantageDirection === "competitor" ? "text-red-600 dark:text-red-400"
                                      : "text-muted-foreground"
                                    }`}>{entry.advantageDirection}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Per-competitor consumer summaries */}
                    {output.competitorIntelligence.competitorConsumerSummaries && output.competitorIntelligence.competitorConsumerSummaries.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                          <Users size={14} className="text-primary" />
                          What Consumers Say About Each Competitor Brand
                        </h4>
                        <div className="grid gap-4">
                          {output.competitorIntelligence.competitorConsumerSummaries.map((cs, i) => {
                            const sentimentColor = cs.overallSentiment === "positive"
                              ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/10"
                              : cs.overallSentiment === "negative"
                              ? "border-red-300 dark:border-red-700 bg-red-50/30 dark:bg-red-950/10"
                              : cs.overallSentiment === "mixed"
                              ? "border-amber-300 dark:border-amber-700 bg-amber-50/30 dark:bg-amber-950/10"
                              : "border-slate-300 dark:border-slate-600 bg-background";
                            const sentimentIcon = cs.overallSentiment === "positive" ? "👍"
                              : cs.overallSentiment === "negative" ? "👎"
                              : cs.overallSentiment === "mixed" ? "⚠️" : "➖";
                            return (
                              <div key={i} className={`rounded-xl border-2 p-5 shadow-sm ${sentimentColor}`}>
                                {/* Header */}
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{sentimentIcon}</span>
                                    <h5 className="text-base font-bold text-foreground">{cs.competitor}</h5>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs">
                                    <span className="text-muted-foreground">{cs.totalMentions} mentions</span>
                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                      cs.overallAdvantageDirection === "brand"
                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                        : cs.overallAdvantageDirection === "competitor"
                                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                    }`}>
                                      {cs.overallAdvantageDirection === "brand" ? "Brand Advantage"
                                        : cs.overallAdvantageDirection === "competitor" ? "Competitor Advantage"
                                        : "Neutral"}
                                    </span>
                                  </div>
                                </div>

                                {/* Mentioned themes */}
                                {cs.mentionedThemes.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mb-3">
                                    {cs.mentionedThemes.map((theme) => (
                                      <span key={theme} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary capitalize">
                                        {theme.replace(/_/g, " ")}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Praise & Criticism */}
                                <div className="grid gap-3 sm:grid-cols-2 mb-3">
                                  {cs.praiseThemes.length > 0 && (
                                    <div className="rounded-lg bg-emerald-50/50 dark:bg-emerald-950/10 p-3">
                                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 block mb-1">👍 What consumers praise</span>
                                      <ul className="space-y-0.5">
                                        {cs.praiseThemes.slice(0, 3).map((p, pi) => (
                                          <li key={pi} className="text-xs text-foreground/70">&ldquo;{p}&rdquo;</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {cs.criticismThemes.length > 0 && (
                                    <div className="rounded-lg bg-red-50/50 dark:bg-red-950/10 p-3">
                                      <span className="text-xs font-semibold text-red-700 dark:text-red-300 block mb-1">👎 What consumers criticize</span>
                                      <ul className="space-y-0.5">
                                        {cs.criticismThemes.slice(0, 3).map((c, ci) => (
                                          <li key={ci} className="text-xs text-foreground/70">&ldquo;{c}&rdquo;</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>

                                {/* Key consumer quotes */}
                                {cs.consumerQuotes.length > 0 && (
                                  <div className="mb-3">
                                    <span className="text-xs font-medium text-muted-foreground block mb-1.5">Representative consumer quotes</span>
                                    <div className="space-y-1.5">
                                      {cs.consumerQuotes.slice(0, 4).map((q, qi) => (
                                        <div key={qi} className="flex items-start gap-2 text-xs text-foreground/70 bg-background/50 rounded-lg border border-border p-2.5">
                                          <Quote size={10} className="mt-0.5 shrink-0 text-muted-foreground" />
                                          <div className="flex-1 min-w-0">
                                            <span>&ldquo;{q.text.length > 150 ? q.text.slice(0, 150) + "…" : q.text}&rdquo;</span>
                                            <div className="flex gap-2 mt-0.5">
                                              {q.source && <span className="text-[10px] text-muted-foreground capitalize">{q.source}</span>}
                                              {q.platform && <span className="text-[10px] text-muted-foreground">via {q.platform}</span>}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Source breakdown */}
                                {Object.keys(cs.sourceBreakdown).length > 0 && (
                                  <div>
                                    <span className="text-xs font-medium text-muted-foreground block mb-1">Source distribution</span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {Object.entries(cs.sourceBreakdown).map(([src, count]) => (
                                        <span key={src} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                                          {src.replace(/_/g, " ")}: {count}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </Section>
              )}

              {/* ── Discovery Queries (8.7) ── */}
              {(() => {
                const discoveryQuerySet = output.discoveryQueries;
                if (!discoveryQuerySet) return null;

                return (
                  <div className="mb-4">
                    <Section title="Discovery Queries" icon={Search} subtitle="25-type structured search intelligence — product, problem, adjacent behavior, community, and more">
                      <div className="space-y-4">
                        {(
                          [
                            ["product", "Product & Feature", Box],
                            ["problem", "Problem & Pain Point", AlertTriangle],
                            ["outcome", "Outcome & Benefit", Star],
                            ["adjacentBehavior", "Adjacent Behavior", ArrowLeftRight],
                            ["supportBehavior", "Support Behavior", Users],
                            ["trigger", "Trigger & Situation", Zap],
                            ["substitution", "Substitution & Workaround", Wrench],
                            ["complementaryProduct", "Complementary Product", ShoppingCart],
                            ["friction", "Friction & Objection", AlertTriangle],
                            ["decisionLanguage", "Decision Language", MessageCircle],
                            ["identity", "Identity & Role", Users],
                            ["lifestyle", "Lifestyle & Context", Globe],
                            ["competency", "Competency & Skill", Sparkles],
                            ["community", "Community & Tribe", Users],
                            ["creatorDiscovery", "Creator Discovery", Star],
                            ["platform", "Platform-Native", Hash],
                            ["question", "Question & FAQ", Info],
                            ["conversationStarter", "Conversation Starter", MessageCircle],
                            ["relationship", "Relationship / Domain Intersection", ArrowLeftRight],
                            ["regionalVariant", "Regional Variant", Globe],
                            ["semanticExpansion", "Semantic Expansion", Search],
                            ["intentExpansion", "Intent Expansion", Target],
                          ] as const
                        ).map(([key, label, Icon_]) => {
                          const qs = discoveryQuerySet[key as keyof DiscoveryQuerySet];
                          if (!qs || !Array.isArray(qs) || qs.length === 0) return null;
                          return (
                            <div key={key} className="rounded-lg border border-border bg-background p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <Icon_ size={16} className="text-primary" />
                                <h4 className="text-sm font-semibold text-foreground">{label}</h4>
                                <span className="text-xs text-muted-foreground">({qs.length} queries)</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {qs.slice(0, 8).map((q: DiscoveryQuery, j: number) => (
                                  <span key={j} className="group relative rounded-full bg-muted/50 px-3 py-1 text-xs text-foreground/80 border border-border hover:border-primary/30 hover:bg-primary/[0.03] transition-colors cursor-default">
                                    {q.query}
                                    {q.rationale && (
                                      <span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-56 rounded-lg border border-border bg-background p-2 text-[10px] text-foreground/70 shadow-lg z-10 whitespace-normal text-center">
                                        {q.rationale}
                                      </span>
                                    )}
                                  </span>
                                ))}
                                {qs.length > 8 && (
                                  <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                                    +{qs.length - 8} more
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Section>
                  </div>
                );
              })()}

              {/* ── Contextual Anchors (Step 1) ── */}
              {output.contextualAnchors && output.contextualAnchors.length > 0 && (
                <Section title="Contextual Anchors" icon={Target} subtitle="Lifestyle, behavioral, and transactional contexts extracted from the product">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {output.contextualAnchors.map((anchor, i) => (
                      <div key={i} className="rounded-lg border border-border bg-background p-4 shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-foreground text-sm capitalize">{anchor.anchor}</h4>
                          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            anchor.category === "lifestyle" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                            : anchor.category === "behavioral" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            : anchor.category === "friction" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                            : anchor.category === "transactional" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                            : anchor.category === "role" ? "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          }`}>{anchor.category}</span>
                        </div>
                        <p className="text-xs text-foreground/70 line-clamp-3">{anchor.rationale}</p>
                        <div className="mt-2 flex items-center gap-1.5">
                          <span className="text-[10px] text-muted-foreground">Confidence</span>
                          <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${anchor.confidence * 100}%` }} />
                          </div>
                          <span className="text-[10px] font-medium text-foreground">{(anchor.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* ── Semantic Bridge Discovery (Steps 2-3) ── */}
              {output.semanticBridges && output.semanticBridges.length > 0 && (
                <Section title="Semantic Bridge Discovery" icon={ArrowLeftRight} subtitle="Cross-category intersections — behavioral vectors bridging from the product context to adjacent domains">
                  <div className="space-y-4">
                    {output.semanticBridges.map((bridge, i) => (
                      <div key={i} className="rounded-lg border border-border bg-background p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <ArrowRight size={14} className="text-primary" />
                          <span className="text-sm font-semibold text-foreground capitalize">{bridge.sourceAnchor.replace(/_/g, " ")}</span>
                          <span className="text-xs text-muted-foreground">→ {bridge.discoveries.length} bridges</span>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {bridge.discoveries.map((d, j) => (
                            <div key={j} className="rounded-lg border border-primary/10 bg-primary/[0.02] p-3">
                              <div className="flex items-start justify-between mb-1">
                                <span className="text-sm font-medium text-foreground">{d.term}</span>
                                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                  d.category === "creator_niche" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                  : d.category === "keyword" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                  : d.category === "community" ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                                  : d.category === "adjacent_category" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                                  : d.category === "lifestyle" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                }`}>{d.category.replace(/_/g, " ")}</span>
                              </div>
                              <p className="text-xs text-foreground/70 mb-2">{d.rationale}</p>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-muted-foreground">Similarity</span>
                                <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                                  <div className="h-full rounded-full bg-primary" style={{ width: `${d.similarity * 100}%` }} />
                                </div>
                                <span className="text-[10px] font-medium text-foreground">{(d.similarity * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* ════════════════════════════════════════════════════════════ */}
              {/*  SOCIAL LISTENER — 9 PILLARS + CIB                        */}
              {/* ════════════════════════════════════════════════════════════ */}
              {output.cibReport && (
                <>
                  {/* ── CIB: Executive Summary ── */}
                  <Section title="Creator Intelligence Brief (CIB)" icon={BrainCircuit} subtitle="Social Listener — 9 Pillars analysis mapping PDE signals to creator-ready audience intelligence">
                    <div className="rounded-xl border border-primary/10 bg-primary/[0.03] p-5 mb-4">
                      <p className="text-sm text-foreground/90 leading-relaxed">{output.cibReport.executiveSummary}</p>
                    </div>

                    {/* ── CIB: Pillar Heatmap ── */}
                    <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-1.5">
                      <BarChart3 size={16} className="text-primary" />
                      Pillar Heatmap
                      <span className="ml-auto text-xs font-normal text-muted-foreground">
                        Dominant: <strong className="text-foreground">{output.cibReport.pillarHeatmap.dominantPillar ? PILLAR_LABELS[output.cibReport.pillarHeatmap.dominantPillar] : "N/A"}</strong> &middot;
                        Concentration: <strong className="text-foreground">{output.cibReport.pillarHeatmap.concentration}</strong>
                      </span>
                    </h3>
                    <div className="space-y-2 mb-5">
                      {output.cibReport.pillarHeatmap.distribution.map((entry) => {
                        const color = PILLAR_COLORS[entry.pillar] || PILLAR_COLORS.nourishment;
                        return (
                          <div key={entry.pillar} className="flex items-center gap-3">
                            <span className="w-28 shrink-0 text-xs font-medium text-foreground/80 truncate" title={PILLAR_LABELS[entry.pillar]}>
                              {PILLAR_SHORT[entry.pillar]}
                            </span>
                            <div className="flex-1 h-5 rounded-md bg-muted overflow-hidden relative">
                              <div
                                className={`h-full rounded-md transition-all ${color.bar}`}
                                style={{ width: `${entry.share}%` }}
                              />
                              {entry.share > 8 && (
                                <span className="absolute inset-0 flex items-center px-2 text-[10px] font-bold text-white">
                                  {entry.share.toFixed(0)}%
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 w-28 shrink-0 justify-end">
                              <span className="text-[10px] text-muted-foreground">
                                intensity <strong className="text-foreground">{(entry.intensity * 100).toFixed(0)}%</strong>
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                conf <strong className="text-foreground">{(entry.confidence * 100).toFixed(0)}%</strong>
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="text-xs text-muted-foreground">Top 3: </span>
                      {output.cibReport.pillarHeatmap.topThree.map((p) => (
                        <span key={p} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          {PILLAR_SHORT[p]}
                        </span>
                      ))}
                    </div>

                    {/* ── CIB: Pillar Delta Report ── */}
                    <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-1.5 mt-6">
                      <ArrowLeftRight size={16} className="text-primary" />
                      Pillar Delta — Brand Intent vs Audience Reality
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">{output.cibReport.pillarDelta.recommendation}</p>

                    <div className="overflow-x-auto rounded-lg border border-border mb-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border">
                            <th className="px-3 py-2 text-left font-semibold text-foreground">Pillar</th>
                            <th className="px-3 py-2 text-center font-semibold text-foreground">Brand</th>
                            <th className="px-3 py-2 text-center font-semibold text-foreground">Audience</th>
                            <th className="px-3 py-2 text-center font-semibold text-foreground">Δ</th>
                            <th className="px-3 py-2 text-left font-semibold text-foreground">Severity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {output.cibReport.pillarDelta.deltas.map((d) => {
                            const arrow = d.delta > 0 ? "↑" : d.delta < 0 ? "↓" : "→";
                            const isOpp = d.delta === output.cibReport!.pillarDelta.biggestOpportunity?.delta;
                            const isWaste = d.delta === output.cibReport!.pillarDelta.biggestWaste?.delta;
                            return (
                              <tr key={d.pillar} className={`${isOpp ? "bg-emerald-50/50 dark:bg-emerald-950/10" : isWaste ? "bg-amber-50/50 dark:bg-amber-950/10" : d.severity === "significant_delta" ? "bg-red-50/30 dark:bg-red-950/10" : ""} border-b border-border last:border-0`}>
                                <td className="px-3 py-1.5 font-medium text-foreground text-xs">{PILLAR_SHORT[d.pillar]}</td>
                                <td className="px-3 py-1.5 text-center text-foreground/80">{d.brandIntent}%</td>
                                <td className="px-3 py-1.5 text-center text-foreground/80">{d.audienceReality}%</td>
                                <td className={`px-3 py-1.5 text-center font-bold text-sm ${d.delta > 0 ? "text-emerald-600 dark:text-emerald-400" : d.delta < 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}>
                                  {arrow} {d.delta > 0 ? "+" : ""}{d.delta}
                                </td>
                                <td className="px-3 py-1.5">
                                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                                    d.severity === "aligned" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                    : d.severity === "slight_mismatch" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                  }`}>{d.severity.replace(/_/g, " ")}</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Opportunity / Waste callouts */}
                    {output.cibReport.pillarDelta.biggestOpportunity && (
                      <div className="rounded-lg border border-emerald-200 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-950/10 p-3 mb-3">
                        <div className="flex items-start gap-2">
                          <Rocket size={14} className="text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                          <div>
                            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Biggest Opportunity</span>
                            <p className="text-xs text-foreground/70 mt-0.5">{output.cibReport.pillarDelta.biggestOpportunity.interpretation}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {output.cibReport.pillarDelta.biggestWaste && (
                      <div className="rounded-lg border border-amber-200 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-950/10 p-3 mb-2">
                        <div className="flex items-start gap-2">
                          <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                          <div>
                            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Biggest Waste</span>
                            <p className="text-xs text-foreground/70 mt-0.5">{output.cibReport.pillarDelta.biggestWaste.interpretation}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </Section>

                  {/* ── CIB: Friction Heatmap ── */}
                  <Section title="Friction Heatmap" icon={AlertTriangle} subtitle="Unbranded objections reveal gaps competitors haven't addressed">
                    <div className="grid gap-3 sm:grid-cols-3 mb-4">
                      <MetricCard label="Total Friction Signals" value={String(output.cibReport.frictionHeatmap.totalFrictionSignals)} />
                      <MetricCard label="Unbranded Share" value={`${output.cibReport.frictionHeatmap.unbrandedShare.toFixed(1)}%`} />
                      <MetricCard label="Active Clusters" value={String(output.cibReport.frictionHeatmap.clusters.length)} />
                    </div>

                    <h4 className="text-sm font-semibold text-foreground mb-3">Top 3 Frictions</h4>
                    <div className="grid gap-3 sm:grid-cols-3 mb-4">
                      {output.cibReport.frictionHeatmap.topFrictions.map((f, i) => {
                        const emoColor = EMOTION_COLORS[f.emotion] || EMOTION_COLORS.frustration;
                        return (
                          <div key={i} className={`rounded-xl border-2 p-4 ${f.branded ? "border-slate-300 dark:border-slate-600" : "border-amber-300 dark:border-amber-700"} ${emoColor.bg}`}>
                            <div className="flex items-start justify-between mb-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">#{i + 1}</span>
                              <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${emoColor.bg} ${emoColor.text}`}>
                                {f.emotion}
                              </span>
                            </div>
                            <h5 className="text-sm font-bold text-foreground mb-1 capitalize">{f.theme.replace(/_/g, " ")}</h5>
                            <div className="text-xs text-muted-foreground mb-2">
                              {f.share.toFixed(0)}% of friction signals
                              {f.branded ? (
                                <span className="ml-2 text-purple-600 dark:text-purple-400">(branded: {f.mentionedBrands.join(", ")})</span>
                              ) : (
                                <span className="ml-2 text-emerald-600 dark:text-emerald-400">(unbranded — open gap)</span>
                              )}
                            </div>
                            {f.examples.length > 0 && (
                              <div className="rounded-lg bg-background/50 border border-border p-2">
                                <p className="text-xs text-foreground/70 italic">&ldquo;{f.examples[0]}&rdquo;</p>
                              </div>
                            )}
                            {f.relatedPillars.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {f.relatedPillars.slice(0, 3).map((p) => (
                                  <span key={p} className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary">
                                    {PILLAR_SHORT[p]}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Full cluster table */}
                    {output.cibReport.frictionHeatmap.clusters.length > 3 && (
                      <div className="overflow-x-auto rounded-lg border border-border">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-muted/50 border-b border-border">
                              <th className="px-3 py-2 text-left font-semibold text-foreground">Theme</th>
                              <th className="px-3 py-2 text-center font-semibold text-foreground">Share</th>
                              <th className="px-3 py-2 text-center font-semibold text-foreground">Emotion</th>
                              <th className="px-3 py-2 text-center font-semibold text-foreground">Branded</th>
                              <th className="px-3 py-2 text-left font-semibold text-foreground">Related Pillars</th>
                            </tr>
                          </thead>
                          <tbody>
                            {output.cibReport.frictionHeatmap.clusters.map((f, i) => (
                              <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                                <td className="px-3 py-1.5 font-medium text-foreground capitalize text-xs">{f.theme}</td>
                                <td className="px-3 py-1.5 text-center text-foreground/80">{f.share.toFixed(0)}%</td>
                                <td className="px-3 py-1.5 text-center text-foreground/80 capitalize text-xs">{f.emotion}</td>
                                <td className="px-3 py-1.5 text-center">
                                  <span className={`text-xs font-medium ${f.branded ? "text-purple-600 dark:text-purple-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                                    {f.branded ? "Yes" : "No"}
                                  </span>
                                </td>
                                <td className="px-3 py-1.5">
                                  <div className="flex flex-wrap gap-1">
                                    {f.relatedPillars.slice(0, 3).map((p) => (
                                      <span key={p} className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">{PILLAR_SHORT[p]}</span>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Section>

                  {/* ── CIB: Linguistic Vibe ── */}
                  <Section title="Linguistic Vibe" icon={Quote} subtitle="Consumer vocabulary, slang, decision language, and validation phrases extracted from signals">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {output.cibReport.linguisticVibe.topSlang.length > 0 && (
                        <div className="rounded-lg border border-border bg-background p-4">
                          <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                            <Hash size={12} className="text-primary" /> Top Slang / Vernacular
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {output.cibReport.linguisticVibe.topSlang.map((s) => (
                              <span key={s} className="rounded-full bg-violet-50 dark:bg-violet-950/20 px-2.5 py-1 text-xs font-medium text-violet-700 dark:text-violet-300">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {output.cibReport.linguisticVibe.topDecisionLanguage.length > 0 && (
                        <div className="rounded-lg border border-border bg-background p-4">
                          <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                            <Zap size={12} className="text-primary" /> Decision Language
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {output.cibReport.linguisticVibe.topDecisionLanguage.map((d) => (
                              <span key={d} className="rounded-full bg-blue-50 dark:bg-blue-950/20 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {output.cibReport.linguisticVibe.topComparisonTerms.length > 0 && (
                        <div className="rounded-lg border border-border bg-background p-4">
                          <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                            <ArrowLeftRight size={12} className="text-primary" /> Comparison Terms
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {output.cibReport.linguisticVibe.topComparisonTerms.map((c) => (
                              <span key={c} className="rounded-full bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 mt-4">
                      {output.cibReport.linguisticVibe.topValidationPhrases.length > 0 && (
                        <div className="rounded-lg border border-border bg-background p-4">
                          <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                            <CheckCircle2 size={12} className="text-primary" /> Validation Phrases
                          </h4>
                          <div className="space-y-1">
                            {output.cibReport.linguisticVibe.topValidationPhrases.map((v, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-foreground/70">
                                <span className="text-emerald-500">+</span>
                                <span>&ldquo;{v}&rdquo;</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {output.cibReport.linguisticVibe.culturalShards.length > 0 && (
                        <div className="rounded-lg border border-border bg-background p-4">
                          <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                            <Globe size={12} className="text-primary" /> Cultural Shards
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {output.cibReport.linguisticVibe.culturalShards.map((c) => (
                              <span key={c} className="rounded-full bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Top frequency tokens */}
                    {output.cibReport.linguisticVibe.tokens.length > 0 && (
                      <div className="mt-4 rounded-lg border border-border bg-background p-4">
                        <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                          <Activity size={12} className="text-primary" /> Top Frequency Tokens
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {output.cibReport.linguisticVibe.tokens.slice(0, 20).map((t) => (
                            <span key={t.token} className="group relative inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-foreground/80 hover:bg-primary/10 hover:text-primary transition-colors cursor-default">
                              <span>{t.token}</span>
                              <span className="text-[9px] text-muted-foreground">({t.frequency})</span>
                              <span className="hidden group-hover:inline absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap rounded border border-border bg-background px-2 py-0.5 text-[9px] text-muted-foreground shadow-lg">
                                {t.category.replace(/_/g, " ")}
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </Section>

                  {/* ── CIB: Creator Alignment ── */}
                  <Section title="Creator Alignment" icon={Users} subtitle="Which creator types map to the dominant pillars and demand corridors">
                    {output.cibReport.creatorAlignment.topForDominantPillar.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                          <Star size={14} className="text-primary" />
                          Top Creators for Dominant Pillar ({PILLAR_SHORT[output.cibReport.pillarHeatmap.dominantPillar || "logic"]})
                        </h4>
                        <div className="grid gap-3 sm:grid-cols-3">
                          {output.cibReport.creatorAlignment.topForDominantPillar.map((c, i) => (
                            <div key={i} className="rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/10 p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="text-sm font-bold text-foreground">{c.creatorType}</h5>
                                <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                                  {(c.alignmentScore * 100).toFixed(0)}%
                                </span>
                              </div>
                              <p className="text-xs text-foreground/70 mb-2 line-clamp-2">
                                Corridor: <strong>{c.corridorName}</strong>
                              </p>
                              <p className="text-xs text-foreground/60 mb-2">Overcomes: {c.frictionOvercome}</p>
                              {c.validationLanguage && (
                                <div className="rounded-lg bg-background/50 border border-border p-2 mt-2">
                                  <span className="text-[10px] text-muted-foreground">Key language: </span>
                                  <span className="text-[10px] text-foreground/70 italic">&ldquo;{c.validationLanguage}&rdquo;</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {output.cibReport.creatorAlignment.bridgingCreators.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                          <Users size={14} className="text-primary" />
                          Bridging Creators (cross-pillar reach)
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {output.cibReport.creatorAlignment.bridgingCreators.map((c, i) => (
                            <div key={i} className="rounded-lg border border-border bg-background p-3 flex items-center gap-3">
                              <div>
                                <span className="text-sm font-semibold text-foreground">{c.creatorType}</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {c.secondaryPillars.slice(0, 3).map((p) => (
                                    <span key={p} className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary">{PILLAR_SHORT[p]}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Full alignment table */}
                    <h4 className="text-sm font-semibold text-foreground mb-3">Full Creator-Pillar Alignment</h4>
                    <div className="overflow-x-auto rounded-lg border border-border">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border">
                            <th className="px-3 py-2 text-left font-semibold text-foreground">Creator Type</th>
                            <th className="px-3 py-2 text-left font-semibold text-foreground">Primary Pillar</th>
                            <th className="px-3 py-2 text-center font-semibold text-foreground">Alignment</th>
                            <th className="px-3 py-2 text-center font-semibold text-foreground">Corridor Fit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {output.cibReport.creatorAlignment.alignments.slice(0, 10).map((c, i) => (
                            <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                              <td className="px-3 py-1.5 font-medium text-foreground text-xs">{c.creatorType}</td>
                              <td className="px-3 py-1.5">
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${PILLAR_COLORS[c.primaryPillar]?.badge || "bg-slate-100 text-slate-600"}`}>
                                  {PILLAR_SHORT[c.primaryPillar]}
                                </span>
                              </td>
                              <td className="px-3 py-1.5 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${c.alignmentScore * 100}%` }} />
                                  </div>
                                  <span className="text-xs font-medium text-foreground">{(c.alignmentScore * 100).toFixed(0)}%</span>
                                </div>
                              </td>
                              <td className="px-3 py-1.5 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${c.corridorFit * 100}%` }} />
                                  </div>
                                  <span className="text-xs font-medium text-foreground">{(c.corridorFit * 100).toFixed(0)}%</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Section>

                  {/* ── CIB: Recommendations ── */}
                  <Section title="CIB Recommendations" icon={Rocket} subtitle="Top actionable recommendations from the Social Listener / Persona Architect">
                    <div className="space-y-3">
                      {output.cibReport.topRecommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-background p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground/90 leading-relaxed"><FormatInline text={rec} /></p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                </>
              )}

              {/* ── Footer ── */}
              <div className="rounded-lg border border-border bg-muted/30 p-4 text-center text-sm text-muted-foreground">
                <BrainCircuit size={16} className="mr-1 inline-block text-primary" />
                PDE Blueprint Report — Generated {new Date(output.generatedAt).toLocaleString()}. All analysis derived from input data.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!output && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 rounded-full bg-muted p-4"><BrainCircuit size={48} className="text-muted-foreground/50" /></div>
            <h3 className="text-lg font-semibold text-foreground">Ready to analyze a product</h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Enter your product details and data above, or pick a preset, then click{" "}
              <span className="font-medium text-foreground">Generate PDE Blueprint</span> to run the full demand environment analysis.
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
        <div><h2 className="text-xl font-bold text-foreground">{title}</h2>{subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}</div>
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

function CollapsibleSection({ title, icon: Icon, expanded, onToggle, required, children }: {
  title: string; icon: typeof Layers; expanded: boolean; onToggle: () => void; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <button onClick={onToggle} className="flex w-full items-center justify-between px-5 py-3 text-left hover:bg-muted/30 transition-colors">
        <span className="flex items-center gap-2 font-semibold text-foreground text-sm">
          <Icon size={16} className="text-primary" />
          {title}
          {required && <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">required</span>}
        </span>
        {expanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-5 pb-5 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TextField({ label, value, onChange, placeholder, icon: Icon, multiline, rows, type }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; icon?: typeof Layers; multiline?: boolean; rows?: number; type?: string;
}) {
  const cls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none";
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
        {Icon && <Icon size={14} />}{label}
      </label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows || 3} className={cls} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} type={type || "text"} className={cls} />
      )}
    </div>
  );
}

/* ================================================================== */
/*  Detailed Markdown Renderer                                         */
/* ================================================================== */

function DetailedMarkdown({ content, className }: { content: string; className?: string }) {
  const lines = content.split("\n");
  const blocks: { type: string; content: string; level?: number }[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Horizontal rule
    if (/^---\s*$/.test(trimmed)) {
      blocks.push({ type: "hr", content: "" });
      i++;
      continue;
    }

    // Heading
    const headingMatch = trimmed.match(/^(#{2,3})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({ type: "heading", content: headingMatch[2], level: headingMatch[1].length });
      i++;
      continue;
    }

    // Blockquote — collect consecutive quote lines
    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({ type: "blockquote", content: quoteLines.join("\n") });
      continue;
    }

    // Table row (starts with |)
    if (trimmed.startsWith("|")) {
      const tableRows: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableRows.push(lines[i].trim());
        i++;
      }
      blocks.push({ type: "table", content: tableRows.join("\n") });
      continue;
    }

    // Unordered list
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const listItems: string[] = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        if (t.startsWith("- ") || t.startsWith("* ")) {
          listItems.push(t.replace(/^[-*]\s+/, ""));
          i++;
        } else if (t === "") {
          i++;
          break;
        } else {
          break;
        }
      }
      blocks.push({ type: "list", content: listItems.join("\n") });
      continue;
    }

    // ASCII bar chart line (e.g., "████████░░ 80%")
    if (/^[█▇▆▅▄▃▂▁░]+/.test(trimmed) && /\d+%/.test(trimmed)) {
      const barLines: string[] = [];
      while (i < lines.length) {
        const t = lines[i];
        if (/[█▇▆▅▄▃▂▁░]/.test(t) && /\d+%/.test(t)) {
          barLines.push(t);
          i++;
        } else {
          break;
        }
      }
      blocks.push({ type: "barchart", content: barLines.join("\n") });
      continue;
    }

    // Empty line
    if (trimmed === "") {
      i++;
      continue;
    }

    // Regular paragraph — collect until next empty line or heading/rule
    const paraLines: string[] = [];
    while (i < lines.length) {
      const t = lines[i].trim();
      if (t === "" || /^#{2,3}\s/.test(t) || /^---\s*$/.test(t)) break;
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push({ type: "paragraph", content: paraLines.join("\n") });
  }

  return (
    <div className={`max-h-[900px] overflow-y-auto rounded-xl border border-border bg-background p-6 space-y-4 ${className || ""}`}>
      {blocks.map((block, bi) => {
        switch (block.type) {
          case "heading": {
            const HeadingTag = block.level === 2 ? "h2" : "h3";
            const headingCls = block.level === 2
              ? "text-lg font-bold text-foreground border-b border-border pb-1.5 mt-8 first:mt-0"
              : "text-base font-semibold text-foreground mt-5";
            return (
              <HeadingTag key={bi} className={headingCls}>
                <FormatInline text={block.content} />
              </HeadingTag>
            );
          }

          case "paragraph":
            return <p key={bi} className="text-sm text-foreground/80 leading-relaxed"><FormatInline text={block.content} /></p>;

          case "blockquote":
            return (
              <blockquote key={bi} className="border-l-2 border-primary/30 pl-4 py-1.5 text-sm text-muted-foreground italic space-y-1">
                {block.content.split("\n").filter(Boolean).map((qLine, qi) => (
                  <div key={qi}><FormatInline text={qLine} /></div>
                ))}
              </blockquote>
            );

          case "list":
            return (
              <ul key={bi} className="space-y-1 list-disc list-inside text-sm text-foreground/80">
                {block.content.split("\n").filter(Boolean).map((item, li) => (
                  <li key={li}><FormatInline text={item} /></li>
                ))}
              </ul>
            );

          case "table": {
            const rows = block.content.split("\n").filter((r) => r.trim());
            if (rows.length === 0) return null;

            // Parse header from first row
            const headerRow = rows[0];
            const headers = headerRow.split("|").filter((h) => h.trim()).map((h) => h.trim());

            // Check if there's a second row that's a separator
            const hasSeparator = rows.length > 1 && /^[\s|:-]+$/.test(rows[1]);

            // Data rows (skip header + separator)
            const dataRows = hasSeparator
              ? rows.slice(2).filter((r) => !/^[\s|:-]+$/.test(r))
              : rows.filter((r) => !/^[\s|:-]+$/.test(r));

            return (
              <div key={bi} className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  {hasSeparator && (
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        {headers.map((h, hi) => (
                          <th key={hi} className="px-3 py-2 text-left font-semibold text-foreground border-r border-border last:border-r-0">
                            <FormatInline text={h} />
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {dataRows.map((row, ri) => {
                      const cells = row.split("|").filter((c) => c.trim()).map((c) => c.trim());
                      return (
                        <tr key={ri} className={ri % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                          {cells.map((cell, ci) => (
                            <td key={ci} className="px-3 py-1.5 text-foreground/80 border-r border-border last:border-r-0">
                              <FormatInline text={cell} />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          }

          case "barchart":
            return (
              <div key={bi} className="font-mono text-xs text-foreground/70 whitespace-pre leading-relaxed bg-muted/30 rounded-lg p-3 overflow-x-auto">
                {block.content.split("\n").map((barLine, bli) => (
                  <div key={bli} className="truncate">{barLine}</div>
                ))}
              </div>
            );

          case "hr":
            return <hr key={bi} className="border-t border-border my-6" />;

          default:
            return <p key={bi} className="text-sm text-foreground/80"><FormatInline text={block.content} /></p>;
        }
      })}
    </div>
  );
}
