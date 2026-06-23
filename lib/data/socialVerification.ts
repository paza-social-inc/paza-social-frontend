import { DEFAULT_API_URL } from "@/lib/axiosClients";

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

// ────────────────────────────────────────────────────────────────────
// NOTE: getConnectedSocials and disconnectSocial intentionally use raw
// fetch() instead of pazaApi (axios).  pazaApi has a response interceptor
// that calls `localStorage.removeItem("token")` and redirects to /login on
// ANY 401 — which is fine for normal API calls, but catastrophic here:
//   • The polling loop (called every 3 s while the user completes OAuth in
//     another tab) would trigger the interceptor and kick the user out mid-
//     flow if the token happened to be stale.
//   • A transient 401 during or right after an OAuth dance should NOT nuke
//     the entire session — the user just completed a connect, they should
//     stay logged in.
// Using fetch keeps these calls independent of the global interceptor.
// ────────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;

async function authedFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = getAuthToken();
  const headers = new Headers(init?.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  return fetch(`${API_BASE}${path}`, { ...init, headers });
}

/**
 * Fetch the list of social accounts the current user has connected.
 * Returns the array (empty on failure so the UI stays usable).
 * Throws on non-retryable errors so the caller can decide what to show.
 */
export async function getConnectedSocials(): Promise<ConnectedSocial[]> {
  const res = await authedFetch("/api/social-verification");

  if (res.status === 401) {
    // Token is genuinely expired — return empty (caller can show "log in").
    // Crucially we do NOT clear localStorage or redirect here.
    return [];
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET /api/social-verification failed (${res.status}): ${text}`);
  }

  const data = await res.json() as { socialVerifications: ConnectedSocial[] };
  return data.socialVerifications ?? [];
}

/** Disconnect (remove) a previously connected platform for the current user. */
export async function disconnectSocial(platform: SocialPlatform): Promise<void> {
  const res = await authedFetch(`/api/social-verification/${platform}`, { method: "DELETE" });

  if (res.status === 401) {
    throw new NotAuthenticatedError();
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`DELETE failed (${res.status}): ${text}`);
  }
}
