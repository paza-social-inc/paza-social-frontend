import { pazaApi } from "@/lib/axiosClients";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
}

export interface BrandProfile {
  id: number;
  businessId: number;
  brandname?: string;
  displayName?: string;
  logo?: string;
  coverImage?: string;
  tagline?: string;
  description?: string;
  primaryContactChannel?: string;
  subcategory?: string[];
  restrictedCategory?: boolean;
  operatingRegions?: Array<{ country: string; city: string }>;
  knownFor?: string[];
  narrativePrompts?: string;
  disallowedAdjacency?: string[];
  contextualAnchor?: string[];
  emotionalOutcome?: string;
  jobStatementSituation?: string;
  jobStatementProgress?: string;
  jobStatementOutcome?: string;
  ipPublisherEnabled?: boolean;
  products?: BrandProduct[];
  pastProjects?: BrandPastProject[];
}

export interface BrandProduct {
  id: number;
  productName: string;
  priceTier?: "low" | "mid" | "premium";
  purchaseCycle?: "impulse" | "weekly" | "monthly" | "annual";
  channel?: string[];
}

export interface BrandPastProject {
  id: number;
  title: string;
  period?: string;
  description?: string;
  mediaLinks?: string[];
  participationRole?: string;
  paidSpend?: "yes" | "no" | "prefer_not";
  spendBand?: string;
}

// ─── Profile Retrieval ───────────────────────────────────────────────────

export async function getBrandProfile(businessId: number): Promise<ApiResponse<BrandProfile>> {
  const response = await pazaApi.get<ApiResponse<BrandProfile>>(`/api/brands/${businessId}/profile`);
  return response.data;
}

// ─── Identity + Narrative ────────────────────────────────────────────────

export async function updateBrandIdentity(businessId: number, data: Partial<BrandProfile>): Promise<ApiResponse<BrandProfile>> {
  const response = await pazaApi.patch<ApiResponse<BrandProfile>>(`/api/brands/${businessId}/profile/identity`, data);
  return response.data;
}

export async function updateBrandNarrative(businessId: number, data: Partial<BrandProfile>): Promise<ApiResponse<BrandProfile>> {
  const response = await pazaApi.patch<ApiResponse<BrandProfile>>(`/api/brands/${businessId}/profile/narrative`, data);
  return response.data;
}

// ─── Products ────────────────────────────────────────────────────────────

export async function addBrandProduct(businessId: number, data: Omit<BrandProduct, 'id'>): Promise<ApiResponse<BrandProduct>> {
  const response = await pazaApi.post<ApiResponse<BrandProduct>>(`/api/brands/${businessId}/products`, data);
  return response.data;
}

export async function removeBrandProduct(businessId: number, productId: number): Promise<ApiResponse<void>> {
  const response = await pazaApi.delete<ApiResponse<void>>(`/api/brands/${businessId}/products/${productId}`);
  return response.data;
}

// ─── IP Declaration ──────────────────────────────────────────────────────

export interface IpDeclarationPayload {
  ownershipBasis: "we_own_it" | "we_licensed_it" | "we_represent_owner";
  proofFileUrl?: string;
  territory: string;
  duration: string;
  channels: string[];
  enforcementAccepted: boolean;
}

export async function submitIpDeclaration(businessId: number, data: IpDeclarationPayload): Promise<ApiResponse<void>> {
  const response = await pazaApi.post<ApiResponse<void>>(`/api/brands/${businessId}/ip-declaration`, data);
  return response.data;
}

// ─── Past Projects ─────────────────────────────────────────────────────────

export async function addBrandPastProject(businessId: number, data: Omit<BrandPastProject, 'id'>): Promise<ApiResponse<BrandPastProject>> {
  const response = await pazaApi.post<ApiResponse<BrandPastProject>>(`/api/brands/${businessId}/past-projects`, data);
  return response.data;
}

export async function listBrandPastProjects(businessId: number): Promise<ApiResponse<BrandPastProject[]>> {
  const response = await pazaApi.get<ApiResponse<BrandPastProject[]>>(`/api/brands/${businessId}/past-projects`);
  return response.data;
}

export async function removeBrandPastProject(businessId: number, projectId: number): Promise<ApiResponse<void>> {
  const response = await pazaApi.delete<ApiResponse<void>>(`/api/brands/${businessId}/past-projects/${projectId}`);
  return response.data;
}

// ─── Media Uploads (Convenience wrappers if needed, otherwise use shared upload) ───

export async function uploadBrandLogo(businessId: number, file: File): Promise<ApiResponse<{ logo: string }>> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await pazaApi.post<ApiResponse<{ logo: string }>>(
    `/api/brands/${businessId}/profile/logo`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
}

export async function uploadBrandCoverImage(businessId: number, file: File): Promise<ApiResponse<{ coverImage: string }>> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await pazaApi.post<ApiResponse<{ coverImage: string }>>(
    `/api/brands/${businessId}/profile/cover-image`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
}
