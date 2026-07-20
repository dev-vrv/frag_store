"use client";

import Link from "next/link";
import { Bell, Heart, Menu, ShoppingCart } from "lucide-react";
import { FaUserAstronaut } from "react-icons/fa";

import { BrandLogo } from "@/components/Brand/BrandLogo";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { type Dictionary, type Locale, localizePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface MobileHeaderMenuProps {
  locale: Locale;
  dictionary: Dictionary["header"];
  pathname: string;
  favoriteCount: number;
  isAuthenticated: boolean;
}

export function MobileHeaderMenu({
  locale,
  dictionary,
  pathname,
  favoriteCount,
  isAuthenticated,
}: MobileHeaderMenuProps) {
  const primaryLinks = dictionary.nav;
  const infoLinks = dictionary.info.items;
  const actionLinks: Array<{ href: string; label: string; icon: React.ReactNode; query?: Record<string, string>; badge?: number }> = [
    ...(isAuthenticated ? [{ href: "/profile", label: locale === "en" ? "Notifications" : locale === "kg" ? "Билдирүүлөр" : "Уведомления", icon: <Bell aria-hidden="true" />, query: { tab: "notifications" } }] : []),
    {
      href: "/catalog",
      label: dictionary.favorites,
      icon: <Heart aria-hidden="true" />,
      query: { favorites: "1" },
      badge: favoriteCount,
    },
    {
      href: "/cart",
      label: dictionary.cart,
      icon: <ShoppingCart aria-hidden="true" />,
    },
  ];
  const authHref = localizePath(isAuthenticated ? "/profile" : "/auth", locale);
  const authLabel = isAuthenticated ? dictionary.profile : dictionary.auth;
  const authActive = pathname === "/auth" || pathname === "/profile";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="grid size-10 place-items-center border border-red-400/35 bg-red-500/10 text-red-100 transition hover:border-red-300/65 hover:bg-red-500/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/30"
          aria-label={dictionary.navAriaLabel}
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[86vw] border-red-500/25 bg-black/92 p-0 shadow-[0_0_44px_rgba(255,23,68,0.18)] backdrop-blur-xl"
      >
        <div className="flex min-h-full flex-col">
          <SheetHeader className="border-b border-white/10 p-5">
            <SheetTitle className="text-red-100">
              <BrandLogo className="w-[8.5rem]" imageClassName="brightness-[1.08]" />
            </SheetTitle>
          </SheetHeader>

          <nav className="grid gap-3 p-5" aria-label={dictionary.navAriaLabel}>
            {[...primaryLinks, ...infoLinks].map((item) => (
              <MobileMenuLink
                key={item.href}
                href={item.href}
                locale={locale}
                label={item.label}
                active={pathname === item.href}
              />
            ))}
          </nav>

          <div className="grid gap-3 border-t border-white/10 p-5">
            {actionLinks.map((item) => (
              <MobileMenuLink
                key={item.href}
                href={item.href}
                locale={locale}
                label={item.label}
                active={item.href === "/catalog" ? pathname === "/catalog" : pathname === item.href}
                icon={item.icon}
                query={item.query}
                badge={item.badge}
              />
            ))}
          </div>

          <div className="mt-auto border-t border-white/10 p-5">
            <SheetClose asChild>
              <Link
                href={authHref}
                className={cn(
                  "group relative flex min-h-12 items-center justify-center gap-3 overflow-hidden border px-4 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/30",
                  authActive
                    ? "border-fuchsia-300/45 bg-[linear-gradient(135deg,rgba(34,211,238,0.16),rgba(217,70,239,0.18))] shadow-[0_0_28px_rgba(217,70,239,0.14)]"
                    : "border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] hover:border-fuchsia-300/35 hover:bg-[linear-gradient(135deg,rgba(34,211,238,0.12),rgba(217,70,239,0.14))]",
                )}
              >
                <span className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-cyan-300/80 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                <FaUserAstronaut aria-hidden="true" />
                <span>{authLabel}</span>
              </Link>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MobileMenuLink({
  href,
  locale,
  label,
  active,
  icon,
  query,
  badge,
}: {
  href: string;
  locale: Locale;
  label: string;
  active: boolean;
  icon?: React.ReactNode;
  query?: Record<string, string>;
  badge?: number;
}) {
  const localizedHref = localizePath(href, locale);
  const resolvedHref =
    query && Object.keys(query).length
      ? `${localizedHref}?${new URLSearchParams(query).toString()}`
      : localizedHref;

  return (
    <SheetClose asChild>
      <Link
        href={resolvedHref}
        aria-current={active ? "page" : undefined}
        className={cn(
          "font-tech relative flex min-h-12 items-center gap-3 border border-white/10 bg-white/[0.035] px-4 text-sm font-semibold uppercase tracking-[0.08em] text-zinc-300 transition hover:border-red-400/35 hover:bg-red-500/10 hover:text-red-100 [&_svg]:size-4",
          active && "border-red-400/55 bg-red-500/14 text-red-100",
        )}
      >
        {icon}
        <span>{label}</span>
        {badge ? (
          <span className="ml-auto grid min-w-5 place-items-center rounded-full border border-lime-300/35 bg-lime-300/90 px-1 text-[10px] font-bold leading-5 text-black shadow-[0_0_18px_rgba(190,242,100,0.3)]">
            {badge > 99 ? "99+" : badge}
          </span>
        ) : null}
      </Link>
    </SheetClose>
  );
}
