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
  const ts = Date.now();
  try {
    const r = await pazaApi.get<{ message?: string; data: AuthMeUser }>(`/api/users/me?t=${ts}`);
    return r.data?.data ?? null;
  } catch {
    try {
      const r = await pazaApi.get<{ message?: string; data: AuthMeUser }>(`/api/auth/me?t=${ts}`);
      return r.data?.data ?? null;
    } catch {
      return null;
    }
  }
}

/** Verify an email using the token from the verification email link. */
export async function verifyEmailToken(
  token: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const r = await pazaApi.get<{ message?: string }>(`/api/auth/verify/${token}`);
    return { success: true, message: r.data?.message ?? "Email verified successfully" };
  } catch (err) {
    const e = err as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: e.response?.data?.message ?? "Verification failed. The link may be invalid or expired.",
    };
  }
}

/** Resend the verification email for an unverified account. */
export async function resendVerificationEmail(
  email: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const r = await pazaApi.post<{ message?: string }>(`/api/auth/resend-verification`, { email });
    return { success: true, message: r.data?.message ?? "Verification email sent" };
  } catch (err) {
    const e = err as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: e.response?.data?.message ?? "Could not resend verification email.",
    };
  }
}
