// Campaign-related types for campaigns, milestones, teams, and feedback

export interface CampaignTeamMember {
  id?: number;
  name: string;
  email: string;
}

export interface CampaignTeam {
  id?: number;
  name: string;
  members?: CampaignTeamMember[];
  createdAt?: string;
}

export type CampaignMilestoneStatus = "To-Do" | "In Progress" | "Completed";

export type CampaignMilestoneCategory = "Major Milestone" | "Minor Milestone";

export interface CampaignMilestone {
  /** Present when loaded from API */
  id?: number;
  title: string;
  description: string;
  objectives?: string[];
  category?: CampaignMilestoneCategory;
  start?: string;
  end?: string;
  status?: CampaignMilestoneStatus;
  budget?: string | number;
}

export interface CampaignFeedback {
  /** Present when loaded from API */
  id?: number;
  name?: string;
  email?: string;
  feedback: string;
  desc?: string;
}

export interface CampaignGoalDetail {
  goal: string;
  targetNumber?: number | null;
  deadline?: string | null;
  targetDescription?: string | null;
}

export interface Campaign {
  id: number;
  title: string;
  description?: string;
  attachments?: string[];
  goals?: string[];
  /** Structured goals with independent target + deadline per goal. */
  goalDetails?: CampaignGoalDetail[];
  /** Optional KPI target number (e.g. conversions). */
  targetNumber?: number | null;
  /** Optional campaign deadline (ISO date string from API). */
  deadline?: string | null;
  startDate?: string;
  endDate?: string;
  /** What the target number / KPI means (optional). */
  targetDescription?: string | null;
  budget?: string | number;
  active?: boolean;
  createdby?: string;
  /** Set when backend links campaign to users.id (POST /api/campaigns/create). */
  creatorId?: number | null;
  /** Populated when API includes the creator relation (avoid relying on password in payloads). */
  creator?: {
    id: number;
    email?: string;
    firstName?: string;
    lastName?: string;
    /** Individual | Business | Creator | None — use for campaign details UI */
    accountType?: string;
  };
  cocampaign?: string;
  jobId?: string;
  milestones?: CampaignMilestone[];
  teams?: CampaignTeam[];
  feedback?: CampaignFeedback[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CampaignUpdateRequest {
  milestones?: CampaignMilestone[];
  feedback?: CampaignFeedback[];
  active?: boolean;
  cocampaign?: string;
}

/** Payload for creating/updating a campaign (brand). API: POST /api/campaigns/create, PUT /api/campaigns/:id */
export interface CreateCampaignDto {
  title: string;
  description?: string;
  /** Allowed on PUT /api/campaigns/:id */
  active?: boolean;
  goals?: string[];
  /** Structured goals with independent target + deadline per goal. */
  goalDetails?: CampaignGoalDetail[];
  createdby?: string;
  objectives?: string[];
  budget?: number | string;
  startDate?: string;
  endDate?: string;
  /** Optional KPI target number. Use null on update to clear. */
  targetNumber?: number | null;
  /** Optional deadline (YYYY-MM-DD or ISO). Use null on update to clear. */
  deadline?: string | null;
  /** Optional narrative for the target / KPI. Use null on update to clear. */
  targetDescription?: string | null;
  attachments?: string[];
  /** Brand job post: what are you promoting? */
  promoting?: string;
  /** Brand job post: who is it for / when do they need it? */
  targetAndTiming?: string;
}

export interface CampaignListResponse {
  data: Campaign[];
}

export interface CampaignGetResponse extends Campaign {}
