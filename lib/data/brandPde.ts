import axios from "axios";
import { pazaApi } from "@/lib/axiosClients";

/**
 * Base URL for the agentic backend where PDE endpoints live.
 * In dev → http://localhost:3001 (paza-agentic-backend).
 * In prod → NEXT_PUBLIC_AGENT_API_URL or the default API URL.
 */
function agenticBaseUrl(): string {
  if (typeof window === "undefined") return "http://localhost:3001";
  const isDev = process.env.NODE_ENV === "development";
  return isDev
    ? "http://localhost:3001"
    : (process.env.NEXT_PUBLIC_AGENT_API_URL ||
      process.env.NEXT_PUBLIC_AGENTIC_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "https://api.paza.social");
}

/** Axios instance pointed at the agentic backend for PDE calls. */
export const pdeApi = axios.create({ baseURL: agenticBaseUrl() });

// Attach auth token like pazaApi does
pdeApi.interceptors.request.use((config) => {
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ── Response shapes ── */

export interface BrandPDESegmentSummary {
  segmentName: string;
  segmentLabel: string;
  profileId: string;
  segmentId: string;
  summary: {
    bestPitch: string | null;
    dominantFriction: string | null;
    topCorridor: string | null;
    transitionCount: number;
  };
}

export interface BrandPDESegment {
  id: string;
  profileId: string;
  segmentName: string;
  segmentLabel: string;
  segmentDescription: string | null;
  reviewCount: number;
  ticketCount: number;
  faqCount: number;
  userCount: number;
  behavioralTopology: Record<string, unknown> | null;
  forceAnalysis: Record<string, unknown> | null;
  environmentalFit: Record<string, unknown> | null;
  opportunityCorridors: Record<string, unknown>[] | null;
  demandTransitionLogic: Record<string, unknown>[] | null;
  languageMap: Record<string, unknown> | null;
  pazaActivation: Record<string, unknown> | null;
  dominantFriction: string | null;
  topCorridor: string | null;
  corridorConfidence: string | null;
  bestPitch: string | null;
  decisionLanguage: string | null;
  substitutionGradients: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface BrandPDEProfile {
  id: string;
  businessId: string;
  productCategory: string | null;
  coreFunction: string | null;
  usageTrigger: string | null;
  usageFrequency: string | null;
  dependencyUnit: string | null;
  failureOutcome: string | null;
  pricePoint: number | null;
  dominantFrictions: string | null;
  topOpportunity: string | null;
  segments: BrandPDESegment[];
  createdAt: string;
  updatedAt: string;
}

export interface BrandPDEApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

/* ── API functions ── */

/**
 * Fetch a brand's full PDE profile with all segments.
 */
export async function getBrandPDEProfile(businessId: number | string): Promise<BrandPDEProfile | null> {
  try {
    const r = await pdeApi.get<BrandPDEApiResponse<BrandPDEProfile>>(
      `/api/brand-pde/profile/${businessId}`
    );
    if (r.data?.success && r.data?.data) return r.data.data;
    return null;
  } catch {
    return null;
  }
}

/**
 * Fetch all PDE segments for a brand.
 */
export async function getBrandPDESegments(businessId: number | string): Promise<BrandPDESegment[]> {
  try {
    const r = await pdeApi.get<BrandPDEApiResponse<BrandPDESegment[]>>(
      `/api/brand-pde/segments/${businessId}`
    );
    if (r.data?.success && Array.isArray(r.data?.data)) return r.data.data;
    return [];
  } catch {
    return [];
  }
}

/**
 * Analyse a single segment for a brand.
 */
export async function analyseBrandPDESegment(
  businessId: number | string,
  segment: { name: string; label: string; description?: string },
  data: Record<string, unknown> = {},
): Promise<{
  profileId: string;
  segmentId: string;
  blueprint: Record<string, unknown>;
} | null> {
  try {
    const r = await pdeApi.post<BrandPDEApiResponse<{
      profileId: string;
      segmentId: string;
      blueprint: Record<string, unknown>;
    }>>("/api/brand-pde/analyze", { businessId: String(businessId), segment, data });
    if (r.data?.success && r.data?.data) return r.data.data;
    return null;
  } catch {
    return null;
  }
}

/**
 * Start a full PDE analysis for a brand with product-level input data.
 * Creates a default "core customers" segment and runs the PDE pipeline.
 */
export async function startBrandPDEAnalysis(
  businessId: number | string,
  data: Record<string, unknown>,
): Promise<{
  profileId: string;
  segmentId: string;
  blueprint: Record<string, unknown>;
} | null> {
  return analyseBrandPDESegment(
    businessId,
    { name: "core-customers", label: "Core Customers", description: "Primary customer segment auto-detected from data inputs" },
    data,
  );
}

/**
 * Delete a brand's PDE profile.
 */
export async function deleteBrandPDEProfile(businessId: number | string): Promise<boolean> {
  try {
    const r = await pdeApi.delete<BrandPDEApiResponse<{ deleted: boolean }>>(
      `/api/brand-pde/profile/${businessId}`
    );
    return r.data?.success === true && r.data?.data?.deleted === true;
  } catch {
    return false;
  }
}
