import { pazaApi } from "@/lib/axiosClients";

/**
 * Upload a single file to the backend and return its public URL.
 * Tries the generic endpoint first, then narrower routes for older backends.
 */
export async function uploadPublicFileUrl(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const endpoints = ["/api/uploads/file", "/api/uploads/image", "/api/uploads/video", "/api/uploads/document"];

  let lastErr: unknown;
  for (const endpoint of endpoints) {
    try {
      const res = await pazaApi.post(endpoint, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res?.data?.data?.url;
      if (typeof url === "string" && url.trim()) {
        return url.trim();
      }
      throw new Error("Upload succeeded but no file URL was returned.");
    } catch (err: unknown) {
      lastErr = err;
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 404) {
        continue;
      }
      throw err;
    }
  }

  throw lastErr instanceof Error ? lastErr : new Error("Upload endpoint not available on this backend.");
}
