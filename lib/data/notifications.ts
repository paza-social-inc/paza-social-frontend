/**
 * Notifications API – real notification count and list from backend.
 *
 * Backend:
 * - GET  /api/notifications → { success, data: { notifications, total } }
 * - PATCH /api/notifications/:id/read
 * - POST /api/notifications/read-all
 */

import { pazaApi } from "@/lib/axiosClients";

export interface Notification {
  id: number;
  /** Short headline (maps from API `title`) */
  user: string;
  /** Detail text (maps from API `message` or `type`) */
  action: string;
  target: string;
  timestamp: string;
  unread: boolean;
  href?: string;
}

interface ApiResponse<T> {
  data?: T;
  success?: boolean;
  message?: string;
}

function formatNotificationTime(value: string): string {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

function mapApiItem(item: Record<string, unknown>): Notification {
  const title =
    item.title != null ? String(item.title) : "";
  const message =
    item.message != null ? String(item.message) : "";
  const type = String(item.type ?? "");
  const createdRaw =
    item.createdAt ?? item.created_at ?? item.timestamp ?? "";
  const created = String(createdRaw);

  const unread = item.isRead !== true && item.read !== true;

  const metadata = (item.metadata ?? null) as
    | { path?: unknown; url?: unknown; href?: unknown }
    | null;
  const directPath =
    (typeof metadata?.path === "string" && metadata.path.trim()) ||
    (typeof metadata?.url === "string" && metadata.url.trim()) ||
    (typeof metadata?.href === "string" && metadata.href.trim()) ||
    (typeof item.path === "string" && String(item.path).trim()) ||
    "";

  return {
    id: Number(item.id),
    user: title || "Notification",
    action: message || type || "",
    target: "",
    timestamp: formatNotificationTime(created),
    unread: Boolean(unread),
    href: directPath || undefined,
  };
}

function unwrapNotificationRows(raw: unknown): Record<string, unknown>[] {
  if (Array.isArray(raw)) {
    return raw as Record<string, unknown>[];
  }
  if (raw && typeof raw === "object") {
    const n = (raw as { notifications?: unknown }).notifications;
    if (Array.isArray(n)) {
      return n as Record<string, unknown>[];
    }
  }
  return [];
}

export const notificationsApi = {
  getList: async (): Promise<Notification[]> => {
    const res = await pazaApi.get<ApiResponse<unknown>>("/api/notifications");
    const rows = unwrapNotificationRows(res.data?.data);
    return rows.map(mapApiItem);
  },

  markRead: async (id: number): Promise<void> => {
    await pazaApi.patch<ApiResponse<unknown>>(`/api/notifications/${id}/read`);
  },

  markAllRead: async (): Promise<void> => {
    await pazaApi.post<ApiResponse<unknown>>("/api/notifications/read-all");
  },
};
