import { pazaApi } from "@/lib/axiosClients";
import { ApiResponse } from "./brands";

export interface ServiceRequest {
  id: number;
  campaignId: number;
  postedBy_id: number;
  serviceType: string;
  description: string;
  skills: string[];
  tools: string[];
  budget?: string;
  deliverables?: string;
  deadline?: string;
  status: "Open" | "In Progress" | "Completed" | "Closed";
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequestPayload {
  campaignId: number;
  serviceType: string;
  description: string;
  skills?: string[];
  tools?: string[];
  budget?: string;
  deliverables?: string;
  deadline?: string;
  tags?: string[];
}

export const serviceRequestsApi = {
  /**
   * Create a new service request
   */
  create: async (data: CreateServiceRequestPayload): Promise<ApiResponse<ServiceRequest>> => {
    const response = await pazaApi.post<ApiResponse<ServiceRequest>>("/api/service-requests", data);
    return response.data;
  },

  /**
   * Get all service requests for a campaign
   */
  getByCampaign: async (campaignId: number): Promise<ApiResponse<ServiceRequest[]>> => {
    const response = await pazaApi.get<ApiResponse<ServiceRequest[]>>(`/api/service-requests/campaign/${campaignId}`);
    return response.data;
  },

  /**
   * Get a single service request
   */
  getById: async (id: number): Promise<ApiResponse<ServiceRequest>> => {
    const response = await pazaApi.get<ApiResponse<ServiceRequest>>(`/api/service-requests/${id}`);
    return response.data;
  },

  /**
   * Get service requests posted by the current user
   */
  getMyRequests: async (): Promise<ApiResponse<ServiceRequest[]>> => {
    const response = await pazaApi.get<ApiResponse<ServiceRequest[]>>("/api/service-requests/my/me");
    return response.data;
  },

  /**
   * Search service requests by type
   */
  search: async (serviceType: string, campaignId?: number): Promise<ApiResponse<ServiceRequest[]>> => {
    const response = await pazaApi.get<ApiResponse<ServiceRequest[]>>("/api/service-requests/search", {
      params: { serviceType, campaignId },
    });
    return response.data;
  },

  /**
   * Get all open service requests
   */
  getOpen: async (): Promise<ApiResponse<ServiceRequest[]>> => {
    const response = await pazaApi.get<ApiResponse<ServiceRequest[]>>("/api/service-requests/open");
    return response.data;
  },

  /**
   * Update a service request
   */
  update: async (id: number, data: Partial<CreateServiceRequestPayload>): Promise<ApiResponse<ServiceRequest>> => {
    const response = await pazaApi.put<ApiResponse<ServiceRequest>>(`/api/service-requests/${id}`, data);
    return response.data;
  },

  /**
   * Update service request status (optionally triggers escrow if In Progress)
   */
  updateStatus: async (id: number, status: ServiceRequest["status"], creatorId?: number): Promise<ApiResponse<ServiceRequest>> => {
    const response = await pazaApi.put<ApiResponse<ServiceRequest>>(`/api/service-requests/${id}/status`, {
      status,
      creatorId,
    });
    return response.data;
  },

  /**
   * Delete a service request
   */
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await pazaApi.delete<ApiResponse<void>>(`/api/service-requests/${id}`);
    return response.data;
  },
};
