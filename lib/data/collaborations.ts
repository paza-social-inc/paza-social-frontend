import { pazaApi } from "@/lib/axiosClients";

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

export interface CreateCollaborationRequest {
  kind: "support" | "task" | "campaign";
  collaborationType?: string;
  reason?: string;
  fee?: string;
  timeline?: string;
  attachments?: string[];
  collaborators?: string[];
}

export const collaborationsApi = {
  createRequest: async (payload: CreateCollaborationRequest) => {
    const response = await pazaApi.post<ApiResponse<unknown>>(
      "/api/collaborations/requests",
      payload
    );
    return response.data;
  },
};

