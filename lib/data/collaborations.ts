import { pazaApi } from "@/lib/axiosClients";
import { ApiResponse } from "./brands";

export interface CollaborationInvitation {
  id: number;
  collaborationType: "Campaign" | "Business" | "Project" | "Referral";
  entityId: number;
  inviterId: number;
  inviteeId?: number;
  inviteeEmail?: string;
  role: string;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "expired";
  token?: string;
  expiresAt?: string;
  createdAt: string;
  // Included relations if any
  entityName?: string;
  inviterName?: string;
}

export interface Collaborator {
  id: number;
  userId: number;
  entityId: number;
  entityType: string;
  role: string;
  joinedAt: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
}

export async function createInvitation(data: {
  collaborationType: CollaborationInvitation['collaborationType'];
  entityId: number;
  role: string;
  inviteeEmail?: string;
  inviteeId?: number;
  message?: string;
  expiresIn?: number;
}): Promise<ApiResponse<CollaborationInvitation>> {
  const response = await pazaApi.post<ApiResponse<CollaborationInvitation>>("/api/collaborations/invite", data);
  return response.data;
}

export async function acceptInvitation(invitationId: number): Promise<ApiResponse<void>> {
  const response = await pazaApi.post<ApiResponse<void>>("/api/collaborations/accept", { invitationId });
  return response.data;
}

export async function rejectInvitation(invitationId: number): Promise<ApiResponse<void>> {
  const response = await pazaApi.post<ApiResponse<void>>("/api/collaborations/reject", { invitationId });
  return response.data;
}

export async function getMyInvitations(): Promise<ApiResponse<CollaborationInvitation[]>> {
  const response = await pazaApi.get<ApiResponse<CollaborationInvitation[]>>("/api/collaborations/my-invitations");
  return response.data;
}

export async function getPendingInvitations(): Promise<ApiResponse<CollaborationInvitation[]>> {
  const response = await pazaApi.get<ApiResponse<CollaborationInvitation[]>>("/api/collaborations/pending");
  return response.data;
}

export async function getCampaignCollaborators(campaignId: number): Promise<ApiResponse<Collaborator[]>> {
  const response = await pazaApi.get<ApiResponse<Collaborator[]>>(`/api/collaborations/campaign/${campaignId}`);
  return response.data;
}

export async function getBusinessCollaborators(businessId: number): Promise<ApiResponse<Collaborator[]>> {
  const response = await pazaApi.get<ApiResponse<Collaborator[]>>(`/api/collaborations/business/${businessId}`);
  return response.data;
}

export async function updateCollaboratorRole(collaborationId: number, role: string): Promise<ApiResponse<void>> {
  const response = await pazaApi.put<ApiResponse<void>>(`/api/collaborations/${collaborationId}/role`, { role });
  return response.data;
}

export async function removeCollaborator(collaborationId: number): Promise<ApiResponse<void>> {
  const response = await pazaApi.delete<ApiResponse<void>>(`/api/collaborations/${collaborationId}`);
  return response.data;
}

export async function verifyInvitationToken(token: string): Promise<ApiResponse<CollaborationInvitation>> {
  const response = await pazaApi.get<ApiResponse<CollaborationInvitation>>(`/api/collaborations/verify/${token}`);
  return response.data;
}
