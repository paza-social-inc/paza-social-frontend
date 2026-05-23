export interface CreatorPlatform {
    username: string;
    followers: number;
    verified: boolean;
  }

  export interface CreatorAudienceData {
    engagementRate: number;
    topLocations: string[];
    ageRanges: Record<string, number>;
    totalFollowers: number;
    growthRate: number;
  }

  export interface CreatorTags {
    niche: string[];
    style: string[];
    audience: string[];
    values: string[];
    narrative: string[];
  }
  
  export interface CreatorFlag {
    id: string;
    type: string;
    description: string;
    severity: "high" | "medium" | "low";
  }

  export interface CampaignHistoryItem {
    id: number;
    name: string;
    brand: string;
    status: string;
  }

  export interface Creator {
    id: number;
    name: string;
    email: string;
    shardId: string;
    platforms: {
      instagram: CreatorPlatform;
      tiktok: CreatorPlatform;
      youtube: CreatorPlatform;
    };
    audienceData: CreatorAudienceData;
    tags: CreatorTags;
    status: "active" | "verified" | "flagged";
    completedCampaigns: number;
    totalEarnings: number;
    lastVerified: string;
    contentSamples: string[];
    campaignHistory: CampaignHistoryItem[];
    flags: CreatorFlag[];
    averageCompletionRate: number;
  }

  export type CreatorSortField = "name" | "engagement" | "followers" | "earnings";
  export type CreatorStatusFilter = "all" | "active" | "verified" | "flagged";
