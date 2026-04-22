import { pazaApi } from "@/lib/axiosClients";
import { ApiResponse } from "./brands";

export interface CreatorProfile {
  id: number;
  creatorname?: string;
  avatar?: string;
  preview?: string;
  about?: string;
  originStory?: string;
  originStoryTags?: string[];
  availabilityType?: "FIXED" | "FLEXIBLE" | "PROJECT_BASED" | "HYBRID";
  personalityTags?: string[];
  purposeOrMission?: string;
  longTermGoal?: string;
  contentStyle?: string;
  skillLevel?: "DEVELOPING" | "PROFICIENT" | "ADVANCED" | "EXPERT";
  creatorType?: string[];
  domainShards?: string[];
  assetClassPrimary?: string;
  valueProp?: string[];
  languages?: string[];
  audienceDescription?: string;
  // Audience Demographics (Missing in initial interface)
  genderMale?: number;
  genderFemale?: number;
  locales?: { country: string; city: string }[];
  audienceLocale?: string;
  // Legacy/Original fields
  main?: string;
  followers?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
  facebook?: string;
  experience?: string;
  milestones?: string;
  category?: string;
  subCategory?: string[];
  topics?: string[];
}

export interface CreatorPastProject {
  id: number;
  title: string;
  period?: string;
  description?: string;
  mediaLinks?: string[];
  role?: string; // "IP Owner / Talent / Operator / Distributor / Analyst / Contributor"
  producedReusableAsset?: boolean;
  assetType?: string;
  generatedMoney?: "yes" | "no" | "prefer_not";
  proofFileUrl?: string;
}

// ─── Profile Retrieval ───────────────────────────────────────────────────

export async function getCreatorProfile(): Promise<ApiResponse<CreatorProfile>> {
  const response = await pazaApi.get<ApiResponse<CreatorProfile>>("/api/creators/profile");
  return response.data;
}

// ─── Comprehensive Update ─────────────────────────────────────────────────

export async function updateFullCreatorProfile(data: Partial<CreatorProfile>): Promise<ApiResponse<CreatorProfile>> {
  const response = await pazaApi.patch<ApiResponse<CreatorProfile>>("/api/creators/profile/full", data);
  return response.data;
}

// ─── Section Updates ──────────────────────────────────────────────────────

export async function updateNarrativeIdentity(data: { originStory: string; originStoryTags: string[] }): Promise<ApiResponse<CreatorProfile>> {
  const response = await pazaApi.patch<ApiResponse<CreatorProfile>>("/api/creators/profile/narrative", data);
  return response.data;
}

export async function updateWorkingStyle(data: { availabilityType: CreatorProfile['availabilityType']; personalityTags: string[] }): Promise<ApiResponse<CreatorProfile>> {
  const response = await pazaApi.patch<ApiResponse<CreatorProfile>>("/api/creators/profile/working-style", data);
  return response.data;
}

export async function updateCreativeCapabilities(data: Partial<CreatorProfile>): Promise<ApiResponse<CreatorProfile>> {
  const response = await pazaApi.patch<ApiResponse<CreatorProfile>>("/api/creators/profile/capabilities", data);
  return response.data;
}

export async function updateAudience(data: { audienceLocale: CreatorProfile['audienceLocale']; languages: string[]; audienceDescription: string }): Promise<ApiResponse<CreatorProfile>> {
  const response = await pazaApi.patch<ApiResponse<CreatorProfile>>("/api/creators/profile/audience", data);
  return response.data;
}

// ─── Past Projects ────────────────────────────────────────────────────────

export async function addCreatorPastProject(data: Omit<CreatorPastProject, 'id'>): Promise<ApiResponse<CreatorPastProject>> {
  const response = await pazaApi.post<ApiResponse<CreatorPastProject>>("/api/creators/past-projects", data);
  return response.data;
}

export async function listCreatorPastProjects(): Promise<ApiResponse<CreatorPastProject[]>> {
  const response = await pazaApi.get<ApiResponse<CreatorPastProject[]>>("/api/creators/past-projects");
  return response.data;
}

export async function removeCreatorPastProject(projectId: number): Promise<ApiResponse<void>> {
  const response = await pazaApi.delete<ApiResponse<void>>(`/api/creators/past-projects/${projectId}`);
  return response.data;
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
