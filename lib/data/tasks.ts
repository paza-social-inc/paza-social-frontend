import { pazaApi } from "@/lib/axiosClients";

interface ApiResponse<T> {
  message?: string;
  data: T;
  success?: boolean;
}

export interface TaskCreateRequest {
  campaignId: number;
  taskName: string;
  assigneeId?: number | null;
  assigneeEmail?: string | null;
  priority: string;
  status: string;
  startDate: string;
  dueDate: string;
  recurTask?: boolean;
  repeat?: string;
  description?: string;
  budgetKsh?: string;
  attachmentName?: string;
}

export interface TaskCreateResponse {
  id: number;
  title?: string;
  [key: string]: unknown;
}

export type TaskListItem = {
  id: number;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high" | string;
  status?: string;
  startDate: string;
  dueDate: string;
  budgetKsh?: string | null;
  attachmentName?: string | null;
  assignee?: {
    id?: number;
    firstname?: string;
    lastname?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
  } | null;
  createdBy?: {
    id?: number;
    firstname?: string;
    lastname?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
  } | null;
  campaign?: {
    id?: number;
    title?: string;
  } | null;
  recurTask?: boolean;
  repeatFrequency?: string | null;
  /** ISO strings from API (serialized task row) */
  createdAt?: string;
  updatedAt?: string;
};

/** Partial body for PUT /api/tasks/:id (owner only) */
export type TaskUpdatePayload = {
  taskName?: string;
  assigneeId?: number | null;
  assigneeEmail?: string | null;
  priority?: string;
  status?: string;
  startDate?: string;
  dueDate?: string;
  recurTask?: boolean;
  repeat?: string;
  description?: string;
  budgetKsh?: string | null;
  attachmentName?: string | null;
};

function getAxiosStatus(err: unknown): number | undefined {
  return (err as { response?: { status?: number } })?.response?.status;
}

export const tasksApi = {
  getByCampaign: async (campaignId: number): Promise<TaskListItem[]> => {
    const response = await pazaApi.get<ApiResponse<TaskListItem[]>>(
      `/api/tasks/campaign/${campaignId}`
    );
    const inner = response.data?.data;
    return Array.isArray(inner) ? inner : [];
  },

  getMine: async (): Promise<TaskListItem[]> => {
    try {
      const response = await pazaApi.get<ApiResponse<TaskListItem[]>>("/api/tasks");
      const inner = response.data?.data;
      return Array.isArray(inner) ? inner : [];
    } catch (error: unknown) {
      const status = getAxiosStatus(error);
      if (status === 404) {
        try {
          const fallback = await pazaApi.get<ApiResponse<TaskListItem[]>>(
            "http://localhost:5001/api/tasks"
          );
          const inner = fallback.data?.data;
          return Array.isArray(inner) ? inner : [];
        } catch {
          throw error;
        }
      }
      throw error;
    }
  },

  create: async (payload: TaskCreateRequest): Promise<TaskCreateResponse> => {
    const body = { ...payload };
    if (body.assigneeId == null || Number.isNaN(Number(body.assigneeId))) {
      delete body.assigneeId;
    }
    try {
      const response = await pazaApi.post<ApiResponse<TaskCreateResponse>>("/api/tasks", body);
      return response.data.data;
    } catch (error: unknown) {
      const status = getAxiosStatus(error);
      if (status === 404) {
        const fallback = await pazaApi.post<ApiResponse<TaskCreateResponse>>(
          "http://localhost:5001/api/tasks",
          body
        );
        return fallback.data.data;
      }
      throw error;
    }
  },

  update: async (id: number, payload: TaskUpdatePayload): Promise<TaskListItem> => {
    const response = await pazaApi.put<ApiResponse<TaskListItem>>(`/api/tasks/${id}`, payload);
    const row = response.data?.data;
    if (!row) {
      throw new Error("Invalid response from server");
    }
    return row;
  },

  delete: async (id: number): Promise<void> => {
    await pazaApi.delete<ApiResponse<unknown>>(`/api/tasks/${id}`);
  },
};
