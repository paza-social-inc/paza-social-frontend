import { pazaApi } from "@/lib/axiosClients";
import type {
  ApplyToOpeningRequest,
  MyOpeningApplication,
  OpeningApplication,
  CreateOpeningRequest,
  Opening,
} from "@/types/openings";

interface ApiResponse<T> {
  message?: string;
  success?: boolean;
  data?: T;
}

/**
 * Project openings API.
 * Base: /api/creator-projects/:projectId/openings (assumed; adjust if your backend differs).
 */
export const openingsApi = {
  /** GET /api/creator-projects/:projectId/openings — list openings for a project */
  getByProjectId: async (projectId: string): Promise<Opening[]> => {
    const response = await pazaApi.get<ApiResponse<Opening[]>>(
      `/api/creator-projects/${projectId}/openings`
    );
    const rows = response.data?.data ?? [];
    const pid = String(projectId).trim();
    return rows.filter((row) => {
      const rowProjectId = String(row.projectId ?? "").trim();
      // Defensive guard: never leak openings from another project in UI.
      return !rowProjectId || rowProjectId === pid;
    });
  },

  /** POST /api/creator-projects/:projectId/openings — create an opening */
  create: async (
    projectId: string,
    data: CreateOpeningRequest
  ): Promise<Opening> => {
    const response = await pazaApi.post<ApiResponse<Opening>>(
      `/api/creator-projects/${projectId}/openings`,
      data
    );
    return response.data?.data as Opening;
  },

  /** POST apply to opening (supports backend route variants) */
  apply: async (
    projectId: string,
    openingId: string,
    payload: ApplyToOpeningRequest
  ): Promise<OpeningApplication> => {
    const routes = [
      `/api/creator-projects/${projectId}/openings/${openingId}/apply`,
      `/api/creator-projects/${projectId}/openings/${openingId}/applications`,
      `/api/openings/${openingId}/apply`,
      `/api/openings/${openingId}/applications`,
    ];
    let lastErr: unknown;
    for (const route of routes) {
      try {
        const response = await pazaApi.post<ApiResponse<OpeningApplication>>(
          route,
          payload
        );
        return (response.data?.data ?? {}) as OpeningApplication;
      } catch (err: unknown) {
        lastErr = err;
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 404) continue;
        throw err;
      }
    }
    throw lastErr instanceof Error ? lastErr : new Error("Opening apply endpoint not available.");
  },

  getApplicants: async (projectId: string, openingId: string) => {
    const response = await pazaApi.get<
      ApiResponse<
        Array<{
          id: number | string;
          name?: string;
          email?: string;
          avatarUrl?: string | null;
          status?: string;
        }>
      >
    >(`/api/creator-projects/${projectId}/openings/${openingId}/applications`);
    return response.data?.data ?? [];
  },

  updateApplicantStatus: async (
    projectId: string,
    openingId: string,
    applicationId: string,
    status: "accepted" | "rejected"
  ) => {
    const response = await pazaApi.put<ApiResponse<{ id: number | string; status: string }>>(
      `/api/creator-projects/${projectId}/openings/${openingId}/applications/${applicationId}`,
      { status }
    );
    return response.data?.data;
  },

  getMyApplications: async (projectId: string): Promise<MyOpeningApplication[]> => {
    const response = await pazaApi.get<ApiResponse<MyOpeningApplication[]>>(
      `/api/creator-projects/${projectId}/openings/applications/mine`
    );
    return response.data?.data ?? [];
  },
};
