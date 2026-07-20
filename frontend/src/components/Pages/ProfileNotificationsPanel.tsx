"use client";

import { Bell, CheckCheck, ChevronRight, PackageCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { CyberBadge, CyberButton, CyberCard, CyberCardContent } from "@/components/cyber";
import { type Locale, localizePath } from "@/lib/i18n";
import { getNotifications, markAllNotificationsRead, markNotificationRead, type SiteNotification } from "@/lib/notifications";
import { cn } from "@/lib/utils";

const copy = {
  ru: { title: "Уведомления", unread: "не просмотрено", empty: "Уведомлений пока нет", select: "Выберите уведомление, чтобы увидеть подробности", allRead: "Прочитать все", open: "Перейти" },
  en: { title: "Notifications", unread: "unread", empty: "No notifications yet", select: "Select a notification to see details", allRead: "Mark all read", open: "Open" },
  kg: { title: "Билдирүүлөр", unread: "окулбаган", empty: "Азырынча билдирүүлөр жок", select: "Толук маалымат үчүн билдирүүнү тандаңыз", allRead: "Баарын окуу", open: "Өтүү" },
} as const;

export function ProfileNotificationsPanel({ locale }: { locale: Locale }) {
  const [items, setItems] = useState<SiteNotification[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const text = copy[locale];
  const unreadCount = useMemo(() => items.filter((item) => item.status === "unread").length, [items]);
  const selected = items.find((item) => item.id === selectedId) ?? null;

  useEffect(() => {
    getNotifications()
      .then(setItems)
      .catch((error: Error) => setErrorMessage(error.message))
      .finally(() => setLoading(false));
  }, []);

  async function selectNotification(item: SiteNotification) {
    setSelectedId(item.id);
    if (item.status !== "unread") return;
    const updated = await markNotificationRead(item.id);
    setItems((current) => current.map((entry) => entry.id === updated.id ? updated : entry));
  }

  async function markAllRead() {
    await markAllNotificationsRead();
    setItems((current) => current.map((item) => ({ ...item, status: item.status === "unread" ? "read" : item.status })));
  }

  return <CyberCard variant="glass" className="border-white/10 bg-zinc-950/80">
    <CyberCardContent className="p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <CyberBadge variant="cyan"><Bell className="mr-2 size-3.5" />{text.title}</CyberBadge>
          <p className="mt-3 font-display text-2xl uppercase tracking-[0.06em] text-white">{unreadCount} {text.unread}</p>
        </div>
        {unreadCount ? <CyberButton size="sm" variant="outline" onClick={markAllRead}><CheckCheck />{text.allRead}</CyberButton> : null}
      </div>
      {loading ? <p className="py-12 text-center text-zinc-400">...</p> : errorMessage ? (
        <div className="mt-5 rounded-md border border-red-300/25 bg-red-500/10 p-4 text-red-100">{errorMessage}</div>
      ) : items.length ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className="grid content-start gap-2">
            {items.map((item) => <button key={item.id} type="button" onClick={() => selectNotification(item)} className={cn("flex items-center gap-3 rounded-md border p-3 text-left transition", selectedId === item.id ? "border-cyan-300/40 bg-cyan-300/10" : "border-white/10 bg-black/25 hover:border-white/20")}>
              <span className={cn("grid size-10 shrink-0 place-items-center rounded-full", item.status === "unread" ? "bg-red-500/15 text-red-100" : "bg-white/[0.04] text-zinc-400")}><PackageCheck className="size-4" /></span>
              <span className="min-w-0 flex-1"><span className="block truncate font-semibold text-white">{item.title}</span><span className="mt-1 block text-xs text-zinc-500">{new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.created_at))}</span></span>
              {item.status === "unread" ? <span className="size-2 rounded-full bg-red-400" /> : null}<ChevronRight className="size-4 text-zinc-500" />
            </button>)}
          </div>
          <div className="min-h-64 rounded-md border border-white/10 bg-black/25 p-5 sm:p-6">
            {selected ? <div>
              {selected.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selected.image_url} alt="" className="mb-5 max-h-64 w-full rounded-md object-contain" />
              ) : null}
              <div className="flex flex-wrap gap-2"><CyberBadge variant="neutral">{selected.notification_type}</CyberBadge><CyberBadge variant={selected.status === "unread" ? "red" : "cyan"}>{selected.status}</CyberBadge></div>
              <h3 className="mt-4 font-display text-2xl uppercase tracking-[0.04em] text-white">{selected.title}</h3>
              <p className="mt-4 whitespace-pre-wrap leading-7 text-zinc-300">{selected.text}</p>
              <p className="mt-4 text-xs text-zinc-500">{new Intl.DateTimeFormat(locale, { dateStyle: "long", timeStyle: "short" }).format(new Date(selected.created_at))}</p>
              {selected.link ? <CyberButton asChild className="mt-6"><Link href={selected.link.startsWith("/") ? localizePath(selected.link, locale) : selected.link}>{text.open}<ChevronRight /></Link></CyberButton> : null}
            </div> : <div className="grid min-h-52 place-items-center text-center text-zinc-500">{text.select}</div>}
          </div>
        </div>
      ) : <div className="grid min-h-52 place-items-center text-center text-zinc-500">{text.empty}</div>}
    </CyberCardContent>
  </CyberCard>;
}
