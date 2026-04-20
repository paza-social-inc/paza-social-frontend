/**
 * Decode JWT payload on the client (no verification — same as existing atob usage).
 * Adds base64 padding; many tokens fail JSON.parse without it.
 */
export function decodeJwtPayload(token: string | null | undefined): Record<string, unknown> | null {
  if (!token || typeof token !== "string") return null;
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    let b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    return JSON.parse(atob(b64)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getUserIdStringFromPayload(payload: Record<string, unknown> | null): string {
  if (!payload) return "";
  const raw = payload.userId ?? payload.id ?? payload.sub;
  if (raw == null || raw === "") return "";
  return String(raw).trim();
}

export function getEmailFromPayload(payload: Record<string, unknown> | null): string {
  if (!payload) return "";
  const e = payload.email;
  if (e == null || typeof e !== "string") return "";
  return e.trim().toLowerCase();
}

/** Backend JWT includes `accountType` (Individual | Business | Creator | None). */
export function getAccountTypeFromPayload(payload: Record<string, unknown> | null): string {
  if (!payload) return "";
  const raw = payload.accountType ?? payload.account_type;
  if (typeof raw !== "string") return "";
  return raw.trim();
}
