import { pazaApi } from "@/lib/axiosClients";

export interface AuthMeUser {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  /** Individual | Business | Creator | None */
  accountType?: string;
  isVerified?: boolean;
  businessId?: number;
  avatar?: string;
}

/**
 * Current user + accountType from DB (works even with old JWTs missing accountType).
 * Uses /api/users/me first (reliable); falls back to /api/auth/me for older backends.
 */
export async function fetchAuthMe(): Promise<AuthMeUser | null> {
  try {
    const r = await pazaApi.get<{ message?: string; data: AuthMeUser }>("/api/users/me");
    return r.data?.data ?? null;
  } catch {
    try {
      const r = await pazaApi.get<{ message?: string; data: AuthMeUser }>("/api/auth/me");
      return r.data?.data ?? null;
    } catch {
      return null;
    }
  }
}
