import { pazaApi } from "@/lib/axiosClients";
import type {
  Project,
  ProjectCreateRequest,
  ProjectTeamInvite,
  ProjectTeamMember,
} from "@/types/projects/projectTypes";

/** Base path: /api/creator-projects (all require auth) */

interface ApiResponse<T> {
  message?: string;
  success?: boolean;
  data?: T;
}

export const projectsApi = {
  /** GET /api/creator-projects — list current user's showcase projects */
  getAll: async () => {
    const response = await pazaApi.get<ApiResponse<Project[]>>("/api/creator-projects");
    return response.data?.data ?? [];
  },

  /** GET /api/creator-projects?view=discover — all creators’ projects (avoids /discover matching /:id → 400) */
  getDiscover: async () => {
    const response = await pazaApi.get<ApiResponse<Project[]>>("/api/creator-projects", {
      params: { view: "discover" },
    });
    return response.data?.data ?? [];
  },

  /** GET /api/creator-projects/:id — get one project */
  getById: async (id: string) => {
    const response = await pazaApi.get<ApiResponse<Project>>(`/api/creator-projects/${id}`);
    return response.data?.data;
  },

  /** GET /api/creator-projects/collaborations/mine — projects accepted as collaborator */
  getMyCollaborations: async () => {
    const response = await pazaApi.get<ApiResponse<Project[]>>(
      "/api/creator-projects/collaborations/mine"
    );
    return response.data?.data ?? [];
  },

  /** POST /api/creator-projects — create project. Body: title, description, mediaUrls, taggedCollaboratorIds, taggedBrandIds, goals */
  create: async (data: ProjectCreateRequest) => {
    const response = await pazaApi.post<ApiResponse<Project>>("/api/creator-projects", data);
    return response.data?.data;
  },

  /** PUT /api/creator-projects/:id — update project (same body as create) */
  update: async (id: string, data: Partial<ProjectCreateRequest>) => {
    const response = await pazaApi.put<ApiResponse<Project>>(`/api/creator-projects/${id}`, data);
    return response.data?.data;
  },

  /** DELETE /api/creator-projects/:id */
  delete: async (id: string) => {
    await pazaApi.delete(`/api/creator-projects/${id}`);
  },

  /** POST /api/creator-projects/:id/members — owner adds existing user as collaborator/member */
  addMember: async (id: string, userId: number) => {
    const response = await pazaApi.post<ApiResponse<ProjectTeamMember[]>>(
      `/api/creator-projects/${id}/members`,
      { userId }
    );
    return response.data?.data ?? [];
  },

  /** GET /api/creator-projects/:id/member-invites */
  getMemberInvites: async (id: string) => {
    const response = await pazaApi.get<ApiResponse<ProjectTeamInvite[]>>(
      `/api/creator-projects/${id}/member-invites`
    );
    return response.data?.data ?? [];
  },

  /** POST /api/creator-projects/:id/member-invites */
  inviteMember: async (id: string, payload: { email: string; name?: string }) => {
    const response = await pazaApi.post<ApiResponse<ProjectTeamInvite>>(
      `/api/creator-projects/${id}/member-invites`,
      payload
    );
    return response.data?.data;
  },

  /** DELETE /api/creator-projects/:id/member-invites/:inviteId */
  cancelMemberInvite: async (id: string, inviteId: number) => {
    await pazaApi.delete(`/api/creator-projects/${id}/member-invites/${inviteId}`);
  },

  /** POST /api/creator-projects/member-invites/:token/accept */
  acceptMemberInvite: async (token: string) => {
    const response = await pazaApi.post<ApiResponse<{ projectId: number }>>(
      `/api/creator-projects/member-invites/${token}/accept`
    );
    return response.data?.data;
  },
};
