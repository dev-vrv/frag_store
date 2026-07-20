"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { AUTH_STATE_CHANGE_EVENT } from "@/lib/auth";
import { type Locale, localizePath } from "@/lib/i18n";
import { getUnreadNotificationCount, NOTIFICATIONS_CHANGE_EVENT } from "@/lib/notifications";

export function NotificationHeaderButton({ locale }: { locale: Locale }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let active = true;
    const sync = async () => { const next = await getUnreadNotificationCount(); if (active) setCount(next); };
    void sync();
    window.addEventListener(AUTH_STATE_CHANGE_EVENT, sync);
    window.addEventListener(NOTIFICATIONS_CHANGE_EVENT, sync);
    return () => {
      active = false;
      window.removeEventListener(AUTH_STATE_CHANGE_EVENT, sync);
      window.removeEventListener(NOTIFICATIONS_CHANGE_EVENT, sync);
    };
  }, []);
  const label = locale === "en" ? "Notifications" : locale === "kg" ? "Билдирүүлөр" : "Уведомления";
  return <Link href={`${localizePath("/profile", locale)}?tab=notifications`} aria-label={`${label}: ${count}`} className="relative grid size-10 place-items-center border border-white/15 bg-white/[0.04] text-zinc-300 transition hover:border-cyan-400/45 hover:bg-cyan-400/10 hover:text-cyan-100">
    <Bell className="size-4" />
    {count > 0 ? <span className="absolute -right-1.5 -top-1.5 grid min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-5 text-white">{count > 99 ? "99+" : count}</span> : null}
  </Link>;
}
