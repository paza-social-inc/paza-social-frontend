/**
 * Users API – for resolving participant names/avatars in inbox and user search.
 *
 * Expected backend:
 * - GET /api/users/:id       → user by id
 * - GET /api/users/search?q= → search users (for new conversation)
 */

import { pazaApi } from "@/lib/axiosClients";
import type { BaseUser } from "@/types/common";

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export const usersApi = {
  getById: async (id: string): Promise<BaseUser | null> => {
    try {
      const res = await pazaApi.get<ApiResponse<BaseUser>>(`/api/users/${id}`);
      return res.data.data ?? null;
    } catch {
      return null;
    }
  },

  search: async (query: string): Promise<BaseUser[]> => {
    if (!query.trim()) return [];
    try {
      const res = await pazaApi.get<ApiResponse<BaseUser[]>>("/api/users/search", {
        params: { q: query.trim() },
      });
      return res.data.data ?? [];
    } catch {
      return [];
    }
  },

  /** Resolve a registered user by exact email (GET /api/users/lookup-email). */
  lookupByEmail: async (email: string): Promise<BaseUser | null> => {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) return null;
    try {
      const res = await pazaApi.get<ApiResponse<BaseUser>>("/api/users/lookup-email", {
        params: { email: trimmed },
      });
      return res.data.data ?? null;
    } catch (e: unknown) {
      const status = (e as { response?: { status?: number } }).response?.status;
      if (status === 404) return null;
      throw e;
    }
  },

  /** Showcase teammates (GET /api/users/suggested-collaborators). */
  suggestedCollaborators: async (): Promise<BaseUser[]> => {
    try {
      const res = await pazaApi.get<ApiResponse<BaseUser[]>>("/api/users/suggested-collaborators");
      return res.data.data ?? [];
    } catch {
      return [];
    }
  },
};
