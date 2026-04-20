import { pazaApi } from "@/lib/axiosClients";
import type { ProjectQaPost } from "@/types/projects/projectTypes";

interface ApiResponse<T> {
  data?: T;
  message?: string;
}

export const projectQaApi = {
  list: async (projectId: string): Promise<ProjectQaPost[]> => {
    const r = await pazaApi.get<ApiResponse<ProjectQaPost[]>>(
      `/api/creator-projects/${projectId}/qa/posts`
    );
    return r.data?.data ?? [];
  },

  create: async (
    projectId: string,
    payload: { body: string; parentId?: number | null }
  ): Promise<ProjectQaPost> => {
    const r = await pazaApi.post<ApiResponse<ProjectQaPost>>(
      `/api/creator-projects/${projectId}/qa/posts`,
      payload
    );
    const row = r.data?.data;
    if (!row) throw new Error("No data returned");
    return row;
  },

  moderate: async (
    projectId: string,
    postId: number,
    payload: { isHidden?: boolean; isDeleted?: boolean }
  ): Promise<void> => {
    await pazaApi.patch(
      `/api/creator-projects/${projectId}/qa/posts/${postId}/moderate`,
      payload
    );
  },
};
