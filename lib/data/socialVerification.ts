import { pazaApi, DEFAULT_API_URL } from "@/lib/axiosClients";

export type SocialPlatform = "youtube" | "facebook" | "instagram" | "tiktok" | "x" | "linkedin";

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  const localToken = window.localStorage.getItem("token");
  if (localToken?.trim()) return localToken.trim();
  const cookieToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("auth_token_paza="))
    ?.split("=")[1];
  return cookieToken ? decodeURIComponent(cookieToken) : null;
}

/**
 * Generates the absolute URL to initiate social verification.
 * These endpoints require the JWT token to be passed as a query parameter 
 * because they involve an external redirect.
 */
export function getSocialAuthUrl(platform: SocialPlatform): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
  const token = getAuthToken();
  
  // Construct the URL: [BASE]/api/social-verification/[PLATFORM]/auth?token=[JWT]
  const url = new URL(`/api/social-verification/${platform}/auth`, baseUrl);
  if (token) {
    url.searchParams.append("token", token);
  }
  
  return url.toString();
}

/**
 * Handle callback verification for platforms that might use a client-side callback 
 * (though usually handled by backend redirecting back to /dashboard with status).
 */
export async function verifySocialCallback(platform: SocialPlatform, code: string): Promise<Record<string, unknown>> {
    const response = await pazaApi.get(`/api/social-verification/${platform}/callback`, {
        params: { code }
    });
    return response.data;
}
