// Project-related types for /api/creator-projects (showcase)

/** Persisted JSON for the Assets & Funding showcase tab (PUT /api/creator-projects/:id). */
export interface AssetsFunding {
  hasIP?: boolean;
  ownership?: { whoOwns?: string; registered?: string; jurisdiction?: string };
  revenueHistory?: { hasEarned?: boolean; amount?: string; source?: string; period?: string };
  costLedger?: { production?: string; marketing?: string; legal?: string };
  seekingFunding?: boolean;
  capitalIntent?: { amount?: string; useOfFunds?: string; expectedOutcome?: string };
  deliveryGuarantee?: string;
  failureOutcome?: string;
  risk?: { canEarnWithoutCreator?: string; rightsLicensable?: string };
  escrowRequired?: boolean;
  killSwitchEnabled?: boolean;
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
  /** Stable id for edit/delete in the UI */
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

/** One goal on the Progress tab (creator-defined, with optional timeframe). */
export interface ProjectProgressGoal {
  id: string;
  title: string;
  objective?: string;
  /** Optional measurable target for this specific goal (e.g. 100K impressions). */
  target?: string;
  /** ISO date string (YYYY-MM-DD) */
  timeframeStart?: string;
  /** ISO date string (YYYY-MM-DD) */
  timeframeEnd?: string;
}

/** Persisted JSON for the Progress showcase tab (PUT /api/creator-projects/:id `progress`). */
export interface ProjectProgress {
  reachTarget?: string;
  reachAchieved?: string;
  reachPercent?: number;
  completed?: boolean;
  goals?: ProjectProgressGoal[];
}

/** One node in the threaded Q&A tree (GET /api/creator-projects/:id/qa/posts). */
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

/** Persisted JSON for the Slots showcase tab (deliverables, usage, KPIs, etc.). */
export interface ProjectSlots {
  /**
   * Up to 3 slots, one per grid column. Use `null` for an empty column so positions stay fixed.
   */
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

/** Create/update body: POST /api/creator-projects, PUT /api/creator-projects/:id */
export interface ProjectCreateRequest {
  title: string;
  description?: string;
  /** Photos, videos, audio, or links */
  mediaUrls?: string[];
  taggedCollaboratorIds?: string[];
  taggedBrandIds?: string[];
  goals?: string[];
  /** Optional high-level category (e.g. "Design"). Use `null` on update to clear. */
  category?: string | null;
  /** Optional sub-category or more specific label */
  subCategory?: string;
  /** Location label for showcase filters (e.g. "Nairobi, Kenya"). Use `null` on update to clear. */
  location?: string | null;
  /** Keyword tags for showcase discovery filters. Use `null` on update to clear. */
  tags?: string[] | null;
  /** Link project back to a campaign when created from a campaign */
  sourceCampaignId?: string;
  /** When true, project can appear in public showcase discovery */
  isPublic?: boolean;
  /** IP, funding, escrow — showcase Assets & Funding tab */
  assetsFunding?: AssetsFunding | null;
  /** Slots tab — what the brand gets, commercial range, KPIs */
  slots?: ProjectSlots | null;
  /** Progress tab — reach summary and structured goals */
  progress?: ProjectProgress | null;
  /** Guardrails tab */
  guardrails?: ProjectGuardrails | null;
}

/** Subset of `creator_profiles` returned on creator project payloads. */
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
}

/** Nested creator from GET /api/creator-projects/:id (when API includes relation). */
export interface ProjectCreatorRef {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  city?: string;
  createdAt?: string;
  creatorProfile?: ProjectCreatorProfileRef | null;
  /** Present on single-project responses: total showcase projects for this creator */
  showcaseStats?: { projectsTotal?: number };
}

/** Approved team member (e.g. after creator accepts a collaboration proposal). */
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
  /** Populated when API loads `creator` relation */
  creator?: ProjectCreatorRef;
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  tags?: string[];
  mediaUrls?: string[];
  images?: string[];
  goals?: string[];
  /** Set when project is created from a campaign */
  sourceCampaignId?: string;
  /** Backend FK (same meaning as sourceCampaignId) */
  campaign_id?: number | null;
  /** Linked campaign (list/detail) — attachments used as card cover fallback when mediaUrls empty */
  campaign?: { id: number; title?: string; attachments?: string[] | null } | null;
  /** Owner: visible in public showcase discovery when true */
  isPublic?: boolean;
  /** For My Projects card display */
  goalCount?: number;
  interestedCount?: number;
  tasksReceivedCount?: number;
  collaboratorsCount?: number;
  /** From GET /api/creator-projects/:id — users who joined via accepted proposals */
  teamMembers?: ProjectTeamMember[];
  values?: Record<string, unknown>;
  proposals?: unknown[];
  milestones?: unknown[];
  /** From GET /api/creator-projects/:id — Assets & Funding tab */
  assetsFunding?: AssetsFunding | null;
  /** Slots tab */
  slots?: ProjectSlots | null;
  /** Progress tab */
  progress?: ProjectProgress | null;
  /** Guardrails tab — mandates, creative rules, recourse */
  guardrails?: ProjectGuardrails | null;
  /** Legacy / mock summary fields when `progress` JSON is absent */
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

export interface ProjectGetResponse extends Project {}


