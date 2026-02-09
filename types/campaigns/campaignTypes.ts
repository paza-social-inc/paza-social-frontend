// Campaign-related types for campaigns, milestones, teams, and feedback

export interface CampaignTeamMember {
  name: string;
  email: string;
}

export interface CampaignTeam {
  name: string;
  members?: CampaignTeamMember[];
}

export type CampaignMilestoneStatus = "In Progress" | "Completed";

export type CampaignMilestoneCategory = "Major Milestone" | "Minor Milestone";

export interface CampaignMilestone {
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
  name?: string;
  email?: string;
  feedback: string;
  desc?: string;
}

export interface Campaign {
  id: number;
  title: string;
  description?: string;
  goals?: string[];
  budget?: string | number;
  active?: boolean;
  createdby?: string;
  cocampaign?: string;
  jobId?: string;
  milestones?: CampaignMilestone[];
  teams?: CampaignTeam[];
  feedback?: CampaignFeedback[];
}

export interface CampaignUpdateRequest {
  milestones?: CampaignMilestone[];
  feedback?: CampaignFeedback[];
  active?: boolean;
  cocampaign?: string;
}

export interface CampaignListResponse {
  data: Campaign[];
}

export interface CampaignGetResponse extends Campaign { }


