"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { CyberButton } from "@/components/cyber";
import { logout } from "@/lib/auth";
import { type Locale, localizePath } from "@/lib/i18n";

export interface ProfileLogoutButtonProps {
  locale: Locale;
  label: string;
}

export function ProfileLogoutButton({ locale, label }: ProfileLogoutButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setIsPending(true);

    try {
      await logout();
      startTransition(() => {
        router.push(localizePath("/auth", locale));
        router.refresh();
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <CyberButton variant="ghost" onClick={handleLogout} loading={isPending}>
      {label}
    </CyberButton>
  );
}
