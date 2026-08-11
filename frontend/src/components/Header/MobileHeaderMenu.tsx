"use client";

import Link from "next/link";
import { Bell, Heart, Menu, ShoppingCart } from "lucide-react";
import { FaUserAstronaut } from "react-icons/fa";

import { BrandLogo } from "@/components/Brand/BrandLogo";
import { CyberButton } from "@/components/cyber/cyber-button";
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
          className="group relative grid size-10 place-items-center overflow-hidden border border-red-300/45 bg-red-500/10 text-red-100 outline-none [clip-path:polygon(0_0,calc(100%-7px)_0,100%_7px,100%_100%,7px_100%,0_calc(100%-7px))] transition-[transform,background-color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(110deg,transparent_20%,rgba(var(--theme-contrast-rgb),0.12)_50%,transparent_80%)] before:opacity-0 before:transition-opacity before:duration-200 after:pointer-events-none after:absolute after:inset-x-2 after:bottom-0 after:h-px after:origin-center after:scale-x-0 after:bg-red-200 after:transition-transform after:duration-200 after:ease-out hover:border-red-200/70 hover:bg-red-500/18 hover:shadow-[0_0_26px_rgba(255,23,68,0.2)] hover:before:opacity-100 hover:after:scale-x-100 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-red-300/35 motion-reduce:transition-none motion-reduce:hover:transform-none motion-reduce:before:transition-none motion-reduce:after:transition-none"
          aria-label={dictionary.navAriaLabel}
        >
          <Menu className="relative z-10 size-5" aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[86vw] border-red-500/25 bg-surface/92 p-0 shadow-[0_0_44px_rgba(255,23,68,0.18)] backdrop-blur-xl"
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
              <CyberButton
                asChild
                variant="danger"
                size="md"
                className={cn(
                  "w-full border-red-400/55 bg-zinc-950/70 text-sm uppercase tracking-[0.12em] text-zinc-100 shadow-[0_0_18px_rgba(127,29,29,0.14)] backdrop-blur-md hover:border-red-300/75 hover:bg-red-950/75 hover:text-on-accent hover:shadow-[0_0_24px_rgba(185,28,28,0.22)]",
                  authActive &&
                    "border-red-300/75 bg-red-950/75 text-white shadow-[0_0_22px_rgba(185,28,28,0.20)]",
                )}
              >
                <Link href={authHref} aria-current={authActive ? "page" : undefined}>
                  <FaUserAstronaut
                    aria-hidden="true"
                    className="relative z-10 text-red-300 transition-colors duration-300 group-hover:text-on-accent"
                  />
                  <span className="relative z-10">{authLabel}</span>
                </Link>
              </CyberButton>
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
          "font-tech group relative flex min-h-12 items-center gap-3 overflow-hidden border border-white/10 bg-white/[0.035] px-4 text-sm font-semibold uppercase tracking-[0.08em] text-zinc-300 outline-none [clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,8px_100%,0_calc(100%-8px))] transition-[clip-path,transform,background-color,border-color,color,box-shadow] duration-300 before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/3 before:w-1/4 before:-translate-x-full before:-skew-x-12 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:opacity-0 before:transition-[transform,opacity] before:duration-500 after:pointer-events-none after:absolute after:inset-y-2 after:left-0 after:w-px after:origin-center after:scale-y-0 after:bg-red-200 after:transition-transform after:duration-300 hover:border-red-300/45 hover:bg-red-500/10 hover:text-red-100 hover:shadow-[0_0_22px_rgba(255,23,68,0.1)] hover:before:translate-x-[650%] hover:before:opacity-100 hover:after:scale-y-100 focus-visible:ring-2 focus-visible:ring-red-300/30 motion-reduce:transition-none motion-reduce:hover:transform-none [&_svg]:relative [&_svg]:z-10 [&_svg]:size-4",
          active &&
            "border-red-300/60 bg-red-500/14 text-red-100 shadow-[inset_3px_0_0_rgba(248,113,113,0.8),0_0_22px_rgba(255,23,68,0.14)]",
        )}
      >
        {icon}
        <span className="relative z-10">{label}</span>
        {badge ? (
          <span className="ml-auto grid min-w-5 place-items-center rounded-full border border-lime-300/35 bg-lime-300/90 px-1 text-[10px] font-bold leading-5 text-on-lime shadow-[0_0_18px_rgba(190,242,100,0.3)]">
            {badge > 99 ? "99+" : badge}
          </span>
        ) : null}
      </Link>
    </SheetClose>
  );
}
