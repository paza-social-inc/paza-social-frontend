import { pazaApi } from "@/lib/axiosClients";
import type { CreateOpeningRequest, Opening } from "@/types/openings";

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
    return response.data?.data ?? [];
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
};
