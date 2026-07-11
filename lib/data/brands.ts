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
  // ── Identity + Compliance
  brandname?: string; // Legal name
  displayName?: string;
  website?: string;
  primaryContactChannel?: string;
  industry?: string;
  subcategory?: string[];
  restrictedCategory?: boolean;
  operatingRegions?: Array<{ country: string; city: string }>;
  ipPublisherEnabled?: boolean;
  // ── Media
  logo?: string;
  coverImage?: string;
  // ── Narrative
  tagline?: string;
  description?: string;
  knownFor?: string[]; // 1-3 tags
  narrativePrompts?: string;
  disallowedAdjacency?: string[]; // Guardrails
  contextualAnchor?: string[]; // Up to 2
  identitySignal?: string[]; // Up to 2
  emotionalOutcome?: string; // Select 1
  jobStatementSituation?: string;
  jobStatementProgress?: string;
  jobStatementOutcome?: string;
  // ── Voice & Tone (Philosophical Alignment)
  collaborationStyle?: string[];
  idealBuyerProfile?: string;
  toneEmotional?: string[];
  toneProfessional?: string[];
  toneCultural?: string[];
  toneLifestyle?: string[];
  riskConstraints?: {
    regulatedCategory?: boolean;
    youthSensitive?: boolean;
    politicalSensitivity?: boolean;
    claimRestrictions?: boolean;
    competitorExclusivity?: boolean;
    usageRightsStrict?: boolean;
  };
  // ── Brand Prompts
  admiredCreator?: string;
  coCreationPartner?: string;
  productBefore?: string;
  productAfter?: string;
  idealBuyerDescription?: string;
  avoidedAssociation?: string;
  // ── Relations
  products?: BrandProduct[];
  pastProjects?: BrandPastProject[];
  creatorPreferences?: BrandCreatorPreference;
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
  participationRole?: "Sponsor" | "Co-creator" | "Content licensee" | "Distribution partner" | "IP owner";
  collaborators?: string;
  // ── Commercial Evidence (Financials)
  paidSpend?: "yes" | "no" | "prefer_not";
  spendTypes?: string[]; // "Creator fees", "Media spend", etc.
  spendBand?: "<$500" | "$500-$2k" | "$2k-$10k" | "$10k+";
  outcomeTypes?: string[]; // "Awareness", "Traffic", etc.
  measurementSource?: "Platform ads manager" | "CRM / sales system" | "Promo code" | "Short link / UTM" | "Not measured";
}

// ─── Normalization Helper ───────────────────────────────────────────────

/**
 * Normalizes backend responses that might come in different shapes.
 * Handles both { success, data, message } and { message, profile/product/etc }
 */
function normalizeApiResponse<T>(res: Record<string, unknown>, key?: string): ApiResponse<T> {
  // If it already fits the ApiResponse pattern perfectly
  if (res && typeof res.success === 'boolean' && res.data !== undefined) {
    return res as unknown as ApiResponse<T>;
  }

  // Fallback for legacy format: { message, profile: {...} } or { message, product: {...} }
  let data: T;
  if (key && req_has(res, key)) {
    data = res[key] as T;
  } else if (req_has(res, 'profile')) {
    data = res.profile as T;
  } else if (req_has(res, 'product')) {
    data = res.product as T;
  } else if (req_has(res, 'projects')) {
    data = res.projects as T;
  } else if (req_has(res, 'data')) {
    data = res.data as T;
  } else {
    data = res as unknown as T;
  }
  
  return {
    success: true,
    data: data,
    message: typeof res.message === 'string' ? res.message : undefined
  };
}

/** Helper to check property existence on unknown record */
function req_has<K extends string>(obj: Record<string, unknown>, key: K): obj is Record<string, unknown> & Record<K, unknown> {
  return key in obj && obj[key] !== undefined;
}

// ─── Profile Retrieval ───────────────────────────────────────────────────

export async function getBrandProfile(businessId: number): Promise<ApiResponse<BrandProfile>> {
  const response = await pazaApi.get<Record<string, unknown>>(`/api/brands/${businessId}/profile`);
  return normalizeApiResponse<BrandProfile>(response.data, 'profile');
}

// ─── Identity + Narrative ────────────────────────────────────────────────

export async function updateBrandIdentity(businessId: number, data: Partial<BrandProfile>): Promise<ApiResponse<BrandProfile>> {
  const response = await pazaApi.patch<Record<string, unknown>>(`/api/brands/${businessId}/profile/identity`, data);
  return normalizeApiResponse<BrandProfile>(response.data, 'profile');
}

export async function updateBrandNarrative(businessId: number, data: Partial<BrandProfile>): Promise<ApiResponse<BrandProfile>> {
  const response = await pazaApi.patch<Record<string, unknown>>(`/api/brands/${businessId}/profile/narrative`, data);
  return normalizeApiResponse<BrandProfile>(response.data, 'profile');
}

// ─── Products ────────────────────────────────────────────────────────────

export async function addBrandProduct(businessId: number, data: Omit<BrandProduct, 'id'>): Promise<ApiResponse<BrandProduct>> {
  const response = await pazaApi.post<Record<string, unknown>>(`/api/brands/${businessId}/products`, data);
  return normalizeApiResponse<BrandProduct>(response.data, 'product');
}

export async function removeBrandProduct(businessId: number, productId: number): Promise<ApiResponse<void>> {
  const response = await pazaApi.delete<Record<string, unknown>>(`/api/brands/${businessId}/products/${productId}`);
  return normalizeApiResponse<void>(response.data);
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
  const response = await pazaApi.post<Record<string, unknown>>(`/api/brands/${businessId}/ip-declaration`, data);
  return normalizeApiResponse<void>(response.data);
}

// ─── Past Projects ─────────────────────────────────────────────────────────

export async function addBrandPastProject(businessId: number, data: Omit<BrandPastProject, 'id'>): Promise<ApiResponse<BrandPastProject>> {
  const response = await pazaApi.post<Record<string, unknown>>(`/api/brands/${businessId}/past-projects`, data);
  return normalizeApiResponse<BrandPastProject>(response.data, 'project');
}

export async function listBrandPastProjects(businessId: number): Promise<ApiResponse<BrandPastProject[]>> {
  const response = await pazaApi.get<Record<string, unknown>>(`/api/brands/${businessId}/past-projects`);
  return normalizeApiResponse<BrandPastProject[]>(response.data, 'projects');
}

export async function removeBrandPastProject(businessId: number, projectId: number): Promise<ApiResponse<void>> {
  const response = await pazaApi.delete<Record<string, unknown>>(`/api/brands/${businessId}/past-projects/${projectId}`);
  return normalizeApiResponse<void>(response.data);
}

// ─── Media Uploads (Convenience wrappers if needed, otherwise use shared upload) ───

export async function uploadBrandLogo(businessId: number, file: File): Promise<ApiResponse<{ logo: string }>> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await pazaApi.post<Record<string, unknown>>(
    `/api/brands/${businessId}/profile/logo`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return normalizeApiResponse<{ logo: string }>(response.data);
}

export async function uploadBrandCoverImage(businessId: number, file: File): Promise<ApiResponse<{ coverImage: string }>> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await pazaApi.post<Record<string, unknown>>(
    `/api/brands/${businessId}/profile/cover-image`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return normalizeApiResponse<{ coverImage: string }>(response.data);
}

// ─── Voice & Tone ────────────────────────────────────────────────────────

export async function updateBrandVoice(businessId: number, data: Partial<BrandProfile>): Promise<ApiResponse<BrandProfile>> {
  const response = await pazaApi.patch<Record<string, unknown>>(`/api/brands/${businessId}/profile/voice`, data);
  return normalizeApiResponse<BrandProfile>(response.data, 'profile');
}

// ─── H. Brand Creator Preferences ─────────────────────────────────────────

export interface BrandCreatorPreference {
  id?: number;
  creatorCategories?: string[];
  preferredContentFormats?: string[];
  preferredAudienceSizes?: string[];
  preferredCharacteristics?: string[];
  previouslyWorkedWith?: string[];
  desiredCollaborations?: string[];
  avoidCreators?: string[];
  brandSafetyRequirements?: string;
  brandSafetyTopics?: string[];
}

export async function getCreatorPreferences(businessId: number): Promise<ApiResponse<BrandCreatorPreference | null>> {
  const response = await pazaApi.get<Record<string, unknown>>(`/api/brands/${businessId}/creator-preferences`);
  return normalizeApiResponse<BrandCreatorPreference | null>(response.data, 'data');
}

export async function updateCreatorPreferences(
  businessId: number,
  data: Partial<BrandCreatorPreference>
): Promise<ApiResponse<BrandCreatorPreference>> {
  const response = await pazaApi.patch<Record<string, unknown>>(`/api/brands/${businessId}/creator-preferences`, data);
  return normalizeApiResponse<BrandCreatorPreference>(response.data, 'data');
}

// ─── Past Project Media ──────────────────────────────────────────────────

export async function appendPastProjectMedia(
  businessId: number,
  projectId: number,
  files: File[]
): Promise<ApiResponse<{ mediaLinks: string[] }>> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  const response = await pazaApi.post<Record<string, unknown>>(
    `/api/brands/${businessId}/past-projects/${projectId}/media`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return normalizeApiResponse<{ mediaLinks: string[] }>(response.data);
}
