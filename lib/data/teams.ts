import { pazaApi } from "@/lib/axiosClients";
import { ApiResponse } from "./brands";

export interface Team {
  id: number;
  name: string;
  occupation?: string;
  description?: string;
  website?: string;
  ownerId: number;
  createdAt: string;
}

export async function createTeam(data: {
  name: string;
  occupation?: string;
  description?: string;
  website?: string;
}): Promise<ApiResponse<Team>> {
  const response = await pazaApi.post<ApiResponse<Team>>("/api/teams", data);
  return response.data;
}

export async function getTeams(): Promise<ApiResponse<Team[]>> {
  const response = await pazaApi.get<ApiResponse<Team[]>>("/api/teams");
  return response.data;
}

export async function getTeamById(id: number): Promise<ApiResponse<Team>> {
  const response = await pazaApi.get<ApiResponse<Team>>(`/api/teams/${id}`);
  return response.data;
}

export async function updateTeam(id: number, data: Partial<Team>): Promise<ApiResponse<Team>> {
  const response = await pazaApi.patch<ApiResponse<Team>>(`/api/teams/${id}`, data);
  return response.data;
}

export async function deleteTeam(id: number): Promise<ApiResponse<void>> {
  const response = await pazaApi.delete<ApiResponse<void>>(`/api/teams/${id}`);
  return response.data;
}
