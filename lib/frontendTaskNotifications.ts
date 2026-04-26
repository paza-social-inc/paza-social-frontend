/**
 * Task-related notifications stored only in the browser (localStorage).
 * Shown together with API notifications in the nav menu and /notifications — no backend.
 */

export const FRONTEND_TASK_NOTIFICATIONS_QUERY_KEY = [
  "frontend-task-notifications",
] as const;

const STORAGE_KEY = "paza-frontend-task-notifications-v1";
const MAX_ITEMS = 80;

const CHANGED_EVENT = "paza-frontend-task-notifications-changed";

export type FrontendTaskNotificationRow = {
  id: string;
  sortAt: number;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  unread: boolean;
  href?: string;
};

function formatNotificationTime(value: string): string {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

function isRow(v: unknown): v is FrontendTaskNotificationRow {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.sortAt === "number" &&
    typeof o.user === "string" &&
    typeof o.action === "string" &&
    typeof o.target === "string" &&
    typeof o.timestamp === "string" &&
    typeof o.unread === "boolean"
  );
}

function load(): FrontendTaskNotificationRow[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isRow);
  } catch {
    return [];
  }
}

function save(rows: FrontendTaskNotificationRow[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows.slice(0, MAX_ITEMS)));
}

function emitChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CHANGED_EVENT));
}

/** For useQuery — newest first */
export function getFrontendTaskNotifications(): FrontendTaskNotificationRow[] {
  return [...load()].sort((a, b) => b.sortAt - a.sortAt);
}

export function appendFrontendTaskNotification(params: {
  user?: string;
  action: string;
  target?: string;
  href?: string;
}): void {
  const sortAt = Date.now();
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? `ftn-${crypto.randomUUID()}`
      : `ftn-${sortAt}`;
  const row: FrontendTaskNotificationRow = {
    id,
    sortAt,
    user: params.user?.trim() || "Task",
    action: params.action,
    target: params.target?.trim() || "",
    timestamp: formatNotificationTime(new Date(sortAt).toISOString()),
    unread: true,
    href: params.href ?? "/tasks",
  };
  const next = [row, ...load()].slice(0, MAX_ITEMS);
  save(next);
  emitChanged();
}

export function markFrontendTaskNotificationRead(id: string): void {
  const rows = load().map((r) => (r.id === id ? { ...r, unread: false } : r));
  save(rows);
  emitChanged();
}

export function markAllFrontendTaskNotificationsRead(): void {
  const rows = load().map((r) => ({ ...r, unread: false }));
  save(rows);
  emitChanged();
}

export function subscribeFrontendTaskNotifications(
  onChange: () => void
): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => onChange();
  window.addEventListener(CHANGED_EVENT, handler);
  return () => window.removeEventListener(CHANGED_EVENT, handler);
}
