import { pazaApi } from "@/lib/axiosClients";
import { ApiResponse } from "./brands";

export interface CreatorProfile {
  id: number;
  creatorname?: string;
  avatar?: string;
  preview?: string;
  about?: string;
  // ── 1. Narrative Identity
  originStory?: string; // Limit 250
  originStoryTags?: string[]; // "Self-Taught Underdog", etc.
  // ── 2. Philosophical & Value Alignment
  toneEmotional?: string[];
  toneProfessional?: string[];
  toneCultural?: string[];
  toneLifestyle?: string[];
  // ── 3. Working Style & Availability
  availabilityType?: "FIXED" | "FLEXIBLE" | "PROJECT_BASED" | "HYBRID";
  personalityTags?: string[]; // "Independent", "Adaptive", etc.
  // ── 4. Creative Capabilities
  skillLevel?: "DEVELOPING" | "PROFICIENT" | "ADVANCED" | "EXPERT";
  creatorType?: string[]; // "Visual Arts", "Music", etc.
  domainShards?: string[]; // "Hustle & Money", "Style & Gaze", etc.
  assetClassPrimary?: string; // "Distribution Pipe", "Trust Network", etc.
  valueProp?: string[]; // "Aesthetics", "Mood Stimulation", etc.
  // ── 6. Audience
  audienceLocation?: "Global" | "Regional" | "Local";
  languages?: string[];
  audienceDescription?: string;
  // ── 8. Behavioral Product Data
  dailyRoutineText?: string;
  dailyCarryText?: string;
  nostalgicProductsText?: string;
  // ── 9. Brand Affinity & Loyalty
  dreamBrandCollaboration?: string;
  alwaysRecommend?: string;
  // ── 10. Relational Intelligence
  collabMindedPeople?: string;
  dreamCollaborator?: string;
  // ── 11. Project Signature
  meaningfulProject?: string;
  primaryVerticals?: string[];
  whatPeopleComeTo?: string[]; // Pick 2
  // Legacy/Relations
  locales?: { country: string; city: string }[];
  pastProjects?: CreatorPastProject[];
}

export interface CreatorPastProject {
  id: number;
  title: string;
  period?: string;
  description?: string;
  mediaLinks?: string[];
  role?: "IP owner" | "Co-creator" | "Operator" | "Talent" | "Distributor" | "Analyst" | "Contributor";
  collaborators?: string;
  // ── Asset Declaration
  producedReusableAsset: boolean;
  assetType?: "Song" | "Video" | "Series" | "Format" | "Brand / Channel" | "Other";
  ownershipStake?: "100%" | "Shared" | "Not owned";
  rightsStatus?: "Registered" | "Unregistered" | "Licensed only";
  futureRevenuePotential?: "Yes" | "No" | "Unknown";
  // ── Commercial Evidence
  generatedMoney?: "Yes" | "No" | "Prefer not to say";
  revenueSources?: string[]; // "Brand payment", "Licensing", etc.
  revenueBand?: "<$500" | "$500-$2k" | "$2k-$10k" | "$10k+";
  proofFileUrl?: string; // Contract, Invoice, etc.
}

// ─── Profile Retrieval ───────────────────────────────────────────────────

export async function getCreatorProfile(): Promise<ApiResponse<CreatorProfile>> {
  const response = await pazaApi.get<{ message: string; profile: CreatorProfile }>("/api/creators/profile");
  // Wrap in standard ApiResponse for frontend consistency
  return {
    success: !!response.data.profile,
    message: response.data.message,
    data: response.data.profile
  };
}

// ─── Comprehensive Update ─────────────────────────────────────────────────

export async function updateFullCreatorProfile(data: Partial<CreatorProfile>): Promise<ApiResponse<CreatorProfile>> {
  const response = await pazaApi.patch<{ message: string; profile: CreatorProfile }>("/api/creators/profile/full", data);
  return {
    success: !!response.data.profile,
    message: response.data.message,
    data: response.data.profile
  };
}

// ─── Section Updates ──────────────────────────────────────────────────────

export async function updateNarrativeIdentity(data: Partial<CreatorProfile>): Promise<ApiResponse<CreatorProfile>> {
  const response = await pazaApi.patch<{ message: string; profile: CreatorProfile }>("/api/creators/profile/narrative", data);
  return {
    success: !!response.data.profile,
    message: response.data.message,
    data: response.data.profile
  };
}

export async function updateWorkingStyle(data: Partial<CreatorProfile>): Promise<ApiResponse<CreatorProfile>> {
  const response = await pazaApi.patch<{ message: string; profile: CreatorProfile }>("/api/creators/profile/working-style", data);
  return {
    success: !!response.data.profile,
    message: response.data.message,
    data: response.data.profile
  };
}

export async function updateCreativeCapabilities(data: Partial<CreatorProfile>): Promise<ApiResponse<CreatorProfile>> {
  const response = await pazaApi.patch<{ message: string; profile: CreatorProfile }>("/api/creators/profile/capabilities", data);
  return {
    success: !!response.data.profile,
    message: response.data.message,
    data: response.data.profile
  };
}

export async function updateAudience(data: Partial<CreatorProfile>): Promise<ApiResponse<CreatorProfile>> {
  const response = await pazaApi.patch<{ message: string; profile: CreatorProfile }>("/api/creators/profile/audience", data);
  return {
    success: !!response.data.profile,
    message: response.data.message,
    data: response.data.profile
  };
}

// ─── Past Projects ────────────────────────────────────────────────────────

export async function addCreatorPastProject(data: Omit<CreatorPastProject, 'id'>): Promise<ApiResponse<CreatorPastProject>> {
  const response = await pazaApi.post<{ message: string; project: CreatorPastProject }>("/api/creators/past-projects", data);
  return {
    success: !!response.data.project,
    message: response.data.message,
    data: response.data.project
  };
}

export async function listCreatorPastProjects(): Promise<ApiResponse<CreatorPastProject[]>> {
  const response = await pazaApi.get<{ message: string; projects: CreatorPastProject[] }>("/api/creators/past-projects");
  return {
    success: Array.isArray(response.data.projects),
    message: response.data.message,
    data: response.data.projects
  };
}

export async function removeCreatorPastProject(projectId: number): Promise<ApiResponse<void>> {
  const response = await pazaApi.delete<{ message: string }>(`/api/creators/past-projects/${projectId}`);
  return {
    success: response.status === 200 || response.status === 204,
    message: response.data.message,
    data: undefined
  };
}

// ─── Media Uploads ─────────────────────────────────────────────────────────

export async function uploadCreatorAvatar(file: File): Promise<ApiResponse<{ avatar: string }>> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await pazaApi.post<ApiResponse<{ avatar: string }>>(
    "/api/creators/profile/avatar",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
}

export async function uploadCreatorPreview(file: File): Promise<ApiResponse<{ preview: string }>> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await pazaApi.post<ApiResponse<{ preview: string }>>(
    "/api/creators/profile/preview",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
}
