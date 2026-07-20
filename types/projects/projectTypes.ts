// Project-related types for /api/creator-projects (showcase)

/** Asset Type — what kind of ownable IP this project declares (Ownership block). */
export type AssetType =
  | "distribution_media"
  | "relationship_graph"
  | "content_system"
  | "ip_vault"
  | "data_intelligence";

export type YesNoPending = "yes" | "no" | "pending";
export type YesNo = "yes" | "no";
export type RevenueSource = "client" | "platform" | "license";
export type UseOfFundsCategory =
  | "production"
  | "marketing_distribution"
  | "legal_registration"
  | "team_collaborator_costs"
  | "licensing_acquisition";
export type DeliveryGuarantee = "strict" | "partial" | "best_effort";
export type FailureOutcome = "refund" | "replace" | "reallocate" | "no_remedy";

/**
 * Supported currency codes for money fields. Any valid ISO 4217 code will still
 * format correctly via Intl.NumberFormat, this union just drives the picker UI —
 * extend it freely as new markets are added.
 */
export type CurrencyCode =
  | "KES"
  | "USD"
  | "EUR"
  | "GBP"
  | "NGN"
  | "ZAR"
  | "GHS"
  | "UGX"
  | "TZS"
  | "INR"
  | "CAD"
  | "AUD";

/** A currency-aware amount. Replaces bare `number` fields so figures aren't assumed KES. */
export interface Money {
  amount?: number;
  currency?: CurrencyCode;
}

/** ISO (yyyy-mm-dd) date range, e.g. for "time period" style fields. */
export interface DateRange {
  start?: string;
  end?: string;
}

/** A supporting document or file attached to the showcase (proof, contracts, decks, etc.). */
export interface ProjectAttachment {
  id: string;
  name: string;
  /** Set once the file has actually been uploaded to storage. */
  url?: string;
  size?: number;
  uploadedAt?: string;
}

/** Persisted JSON for the Assets & Funding showcase tab (PUT /api/creator-projects/:id). */
export interface AssetsFunding {
  hasIP?: boolean;
  /** Type of asset this IP tab is describing — drives which asset-type card copy is shown elsewhere. */
  assetType?: AssetType;
  ownership?: {
    /** Ownership share held by the declaring party, 0–100. */
    whoOwns?: number;
    registered?: YesNoPending;
    /** Country / legal jurisdiction — free text backed by a country picker in the UI. */
    jurisdiction?: string;
  };
  revenueHistory?: {
    hasEarned?: boolean;
    /** Currency-aware figure, not free text. */
    amount?: Money;
    source?: RevenueSource;
    /** Date range the earnings cover. */
    period?: DateRange;
    /** Filename/URL of uploaded proof. Presence unlocks finance visibility elsewhere. */
    proofUrl?: string;
  };
  costLedger?: { production?: Money; marketing?: Money; legal?: Money };
  seekingFunding?: boolean;
  capitalIntent?: {
    /** Funding ask, currency-aware figure. */
    amount?: Money;
    useOfFunds?: UseOfFundsCategory;
    /** Free-text explanation of how the funds will be used, captured via a confirmation dialog. */
    useOfFundsNote?: string;
    /** Short outcome statement — capped length, not a pitch paragraph. */
    expectedOutcome?: string;
  };
  deliveryGuarantee?: DeliveryGuarantee;
  /** "no_remedy" is only a valid selection when deliveryGuarantee === "best_effort". */
  failureOutcome?: FailureOutcome;
  risk?: {
    canEarnWithoutCreator?: YesNo;
    rightsLicensable?: YesNo;
    /** Optional free text — known distributors or buyers. */
    knownDistributors?: string;
  };
  escrowRequired?: boolean;
  killSwitchEnabled?: boolean;
  /** Supporting documents — statements, contracts, decks, anything not covered by a dedicated field. */
  attachments?: ProjectAttachment[];
}

/** Stable ids for “hard no” mandate categories (showcase Guardrails tab). */
export type HardNoCategoryId =
  | "alcohol"
  | "gambling"
  | "politics"
  | "adult"
  | "tobacco"
  | "crypto";

export type BrandDelayRule = "24h" | "48h" | "72h";
export type BrandCancellationRule = "20%" | "40%" | "60%";

/** Creator rules for brand collaboration — persisted as JSON on the project. */
export interface ProjectGuardrails {
  hardNo: HardNoCategoryId[];
  creativeNonNegotiables: {
    noScriptedLines: boolean;
    noDancing: boolean;
    noProfanity: boolean;
    noMedicalClaims: boolean;
    noPaidAds: boolean;
    noRepostingToBrand: boolean;
  };
  brandDelayRule: BrandDelayRule;
  brandCancellationRule: BrandCancellationRule;
  unauthorizedUsageCharge: boolean;
}

/** One commercial / deliverable slot on the showcase (max 3 per project). */
export interface ProjectSlotItem {
  id: string;
  title: string;
  deliverables?: string;
  usageRights?: string;
  exclusivity?: string;
  budgetBand?: string;
  kpis?: string;
  reportingCadence?: string;
  proofRequired?: string;
}

export type ProjectProgressUpdate = {
  id: string;
  achieved: number;
  note?: string;
  date: string;
};

export type ProjectProgressObjective = {
  id: string;
  text: string;
  target: number;
  achieved: number;
  timeframeStart?: string;
  timeframeEnd?: string;
  history?: ProjectProgressUpdate[];
};

export type ProjectProgressGoal = {
  id: string;
  title: string;
  objectives: ProjectProgressObjective[];
  progressNote?: string;
};

export interface ProjectProgress {
  reachTarget?: string;
  reachAchieved?: string;
  reachPercent?: number;
  completed?: boolean;
  goals?: ProjectProgressGoal[];
}

export interface ProjectQaPost {
  id: number;
  projectId: number;
  parentId: number | null;
  body: string | null;
  isHidden: boolean;
  isDeleted: boolean;
  createdAt: string;
  author: {
    id: number;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  replies: ProjectQaPost[];
}

export interface ProjectSlots {
  items?: (ProjectSlotItem | null)[];
  /** @deprecated Legacy flat lists — migrated into `items` when loading if `items` is absent */
  deliverables?: string[];
  usageRights?: string[];
  exclusivity?: string;
  budgetBand?: string;
  kpis?: string[];
  reportingCadence?: string;
  proofRequired?: string[];
}

export interface ProjectCreateRequest {
  title: string;
  description?: string;
  mediaUrls?: string[];
  taggedCollaboratorIds?: string[];
  taggedBrandIds?: string[];
  goals?: string[];
  category?: string | null;
  subCategory?: string;
  location?: string | null;
  tags?: string[] | null;
  sourceCampaignId?: string;
  isPublic?: boolean;
  assetsFunding?: AssetsFunding | null;
  slots?: ProjectSlots | null;
  progress?: ProjectProgress | null;
  guardrails?: ProjectGuardrails | null;
}

export interface ProjectCreatorProfileRef {
  creatorname?: string | null;
  about?: string | null;
  main?: string | null;
  avatar?: string | null;
  preview?: string | null;
  profileUrl?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  twitter?: string | null;
  youtube?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
  followers?: string | null;
  category?: string | null;
  topics?: string[] | null;
  experience?: string | null;
  // ── 1. Narrative Identity ────────────────────────────────────────────────
  originStory?: string | null;
  originStoryTags?: string[] | null;
  // ── 2. Philosophical & Value Alignment ────────────────────────────────────
  coreValues?: string[] | null;
  toneEmotional?: string[] | null;
  toneProfessional?: string[] | null;
  toneCultural?: string[] | null;
  toneLifestyle?: string[] | null;
  // ── 3. Working Style & Availability ───────────────────────────────────────
  availabilityType?: string | null;
  personalityTags?: string[] | null;
  preferredCommunication?: string | null;
  engagementType?: string[] | null;
  deliverables?: string[] | null;
  equipmentAndSoftware?: string | null;
  // ── 4. Creative Capabilities ──────────────────────────────────────────────
  skillLevel?: string | null;
  creatorType?: string[] | null;
  domainShards?: string[] | null;
  assetClassPrimary?: string | null;
  valueProp?: string[] | null;
  whatPeopleComeTo?: string[] | null;
  // ── 6. Audience ─────────────────────────────────────────────────────────
  audienceLocale?: string | null;
  languages?: string[] | null;
  audienceDescription?: string | null;
  genderMale?: number | null;
  genderFemale?: number | null;
  locales?: { country: string; city?: string }[] | null;
  // ── 8. Behavioral Product Data ─────────────────────────────────────────
  dailyRoutineText?: string | null;
  dailyCarryText?: string | null;
  nostalgicProductsText?: string | null;
  // ── 9. Brand Affinity & Loyalty ────────────────────────────────────────
  dreamBrandCollaboration?: string[] | null;
  alwaysRecommend?: string[] | null;
  // ── 10. Relational Intelligence ────────────────────────────────────────
  collabMindedPeople?: string | null;
  dreamCollaborator?: string | null;
  // ── 11. Project Signature ──────────────────────────────────────────────
  meaningfulProject?: string | null;
  primaryVerticals?: string[] | null;
}

export interface ProjectCreatorRef {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  city?: string;
  createdAt?: string;
  creatorProfile?: ProjectCreatorProfileRef | null;
  showcaseStats?: { projectsTotal?: number };
}

export interface ProjectTeamMember {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  isVerified?: boolean;
  accountType?: string;
  avatarUrl?: string | null;
  role?: string;
  joinedAt?: string;
  proposalId?: number | null;
}

export interface ProjectTeamInvite {
  id: number;
  email: string;
  name?: string | null;
  status: string;
  token: string;
  createdAt?: string;
  expiresAt?: string | null;
  emailSent?: boolean;
}

export interface Project {
  id: string;
  _id?: string;
  creatorId?: string | number;
  creator?: ProjectCreatorRef;
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  tags?: string[];
  mediaUrls?: string[];
  images?: string[];
  goals?: string[];
  sourceCampaignId?: string;
  campaign_id?: number | null;
  campaign?: { id: number; title?: string; attachments?: string[] | null } | null;
  isPublic?: boolean;
  goalCount?: number;
  interestedCount?: number;
  tasksReceivedCount?: number;
  collaboratorsCount?: number;
  teamMembers?: ProjectTeamMember[];
  values?: Record<string, unknown>;
  proposals?: unknown[];
  milestones?: unknown[];
  assetsFunding?: AssetsFunding | null;
  slots?: ProjectSlots | null;
  progress?: ProjectProgress | null;
  guardrails?: ProjectGuardrails | null;
  reachTarget?: string;
  reachAchieved?: string;
  reachPercent?: number;
  completed?: boolean;
}

export interface ProjectCreateResponse {
  message?: string;
  success?: boolean;
  project?: Project;
}

export type ProjectGetResponse = Project;
