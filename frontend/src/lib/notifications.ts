import { readApiError } from "@/lib/auth";
import { type Locale } from "@/lib/i18n";

export const NOTIFICATIONS_CHANGE_EVENT = "frag-notifications-change";

export interface SiteNotification {
  id: number;
  title: string;
  text: string;
  notification_type: "stock" | "order" | "promotion" | "system";
  status: "unread" | "read" | "archived";
  link: string;
  image_url: string;
  metadata: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
}

export async function getUnreadNotificationCount() {
  const response = await fetch("/notifications-api?summary=1", { cache: "no-store" });
  if (!response.ok) return 0;
  const payload = (await response.json()) as { count?: number };
  return payload.count ?? 0;
}

export async function getNotifications() {
  const response = await fetch("/notifications-api", { cache: "no-store" });
  if (!response.ok) throw new Error(await readApiError(response));
  const payload = (await response.json()) as SiteNotification[] | { results?: SiteNotification[] };
  return Array.isArray(payload) ? payload : payload.results ?? [];
}

export async function markNotificationRead(id: number) {
  const response = await fetch("/notifications-api", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) throw new Error(await readApiError(response));
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGE_EVENT));
  return (await response.json()) as SiteNotification;
}

export async function markAllNotificationsRead() {
  const response = await fetch("/notifications-api", { method: "POST" });
  if (!response.ok) throw new Error(await readApiError(response));
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGE_EVENT));
}

export async function subscribeToProductStock(productSlug: string, locale: Locale) {
  const response = await fetch("/stock-notifications-api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productSlug, locale }),
  });
  if (!response.ok) {
    const error = new Error(await readApiError(response));
    Object.assign(error, { status: response.status });
    throw error;
  }
}
