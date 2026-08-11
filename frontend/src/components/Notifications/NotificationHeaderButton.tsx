"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

import { HeaderActionLink } from "@/components/Header/HeaderActionLink";
import { AUTH_STATE_CHANGE_EVENT } from "@/lib/auth";
import { type Locale } from "@/lib/i18n";
import { getUnreadNotificationCount, NOTIFICATIONS_CHANGE_EVENT } from "@/lib/notifications";

export function NotificationHeaderButton({ locale }: { locale: Locale }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;

    const sync = async () => {
      const next = await getUnreadNotificationCount();

      if (active) {
        setCount(next);
      }
    };

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

  return (
    <HeaderActionLink
      href="/profile"
      locale={locale}
      label={`${label}: ${count}`}
      accent="cyan"
      badge={count}
      badgeTone="red"
      query={{ tab: "notifications" }}
    >
      <Bell aria-hidden="true" />
    </HeaderActionLink>
  );
}
