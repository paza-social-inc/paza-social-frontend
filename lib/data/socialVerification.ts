import { pazaApi, DEFAULT_API_URL } from "@/lib/axiosClients";

export type SocialPlatform = "youtube" | "facebook" | "instagram" | "tiktok" | "x" | "linkedin";

export interface ConnectedSocial {
  platform: SocialPlatform;
  isVerified: boolean;
  verifiedAt: string | null;
  platformData: Record<string, unknown>;
}

/**
 * Reads the user's auth token.
 * The token is written to localStorage under the "token" key on login/signup
 * (LoginForm.tsx / SignUpForm.tsx / GoogleCallbackPageClient.tsx).
 * Cookie fallback reads the same "token" name — previously this looked for
 * "auth_token_paza" which was never written anywhere (dead code).
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  const localToken = window.localStorage.getItem("token");
  if (localToken?.trim()) return localToken.trim();
  const cookieToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  return cookieToken ? decodeURIComponent(cookieToken) : null;
}

/** Thrown when a user tries to connect while no auth token is present. */
export class NotAuthenticatedError extends Error {
  constructor() {
    super("Please log in to connect an account.");
    this.name = "NotAuthenticatedError";
  }
}

/** Returns the token, or throws NotAuthenticatedError if none is present. */
export function requireAuthToken(): string {
  const token = getAuthToken();
  if (!token) throw new NotAuthenticatedError();
  return token;
}

/**
 * Generates the absolute URL to initiate social verification.
 * These endpoints require the JWT token as a query parameter because the
 * browser leaves the SPA (external OAuth redirect) and the backend needs to
 * know who initiated it.
 *
 * @throws {NotAuthenticatedError} if the user is not logged in.
 */
export function getSocialAuthUrl(platform: SocialPlatform): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
  const token = requireAuthToken();

  const url = new URL(`/api/social-verification/${platform}/auth`, baseUrl);
  url.searchParams.append("token", token);
  return url.toString();
}

/**
 * Fetch the list of social accounts the current user has connected.
 * Uses pazaApi (Authorization header), so the token is attached automatically.
 */
export async function getConnectedSocials(): Promise<ConnectedSocial[]> {
  const response = await pazaApi.get<{ socialVerifications: ConnectedSocial[] }>(
    "/api/social-verification"
  );
  return response.data.socialVerifications ?? [];
}

/** Disconnect (remove) a previously connected platform for the current user. */
export async function disconnectSocial(platform: SocialPlatform): Promise<void> {
  await pazaApi.delete(`/api/social-verification/${platform}`);
}
