"use client";

import Link from "next/link";
import { Heart, Menu, ShoppingCart } from "lucide-react";
import { FaUserAstronaut } from "react-icons/fa";

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
}

export function MobileHeaderMenu({
  locale,
  dictionary,
  pathname,
}: MobileHeaderMenuProps) {
  const primaryLinks = dictionary.nav;
  const infoLinks = dictionary.info.items;
  const actionLinks = [
    {
      href: "/comparison",
      label: dictionary.comparison,
      icon: <Heart aria-hidden="true" />,
    },
    {
      href: "/cart",
      label: dictionary.cart,
      icon: <ShoppingCart aria-hidden="true" />,
    },
  ];

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
            <SheetTitle className="font-display text-2xl font-normal tracking-[0.08em] text-red-100">
              {dictionary.logo}
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
                active={pathname === item.href}
                icon={item.icon}
              />
            ))}
          </div>

          <div className="mt-auto border-t border-white/10 p-5">
            <SheetClose asChild>
              <Link
                href={localizePath("/auth", locale)}
                className={cn(
                  "group relative flex min-h-12 items-center justify-center gap-3 overflow-hidden border px-4 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/30",
                  pathname === "/auth" || pathname === "/profile"
                    ? "border-fuchsia-300/45 bg-[linear-gradient(135deg,rgba(34,211,238,0.16),rgba(217,70,239,0.18))] shadow-[0_0_28px_rgba(217,70,239,0.14)]"
                    : "border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] hover:border-fuchsia-300/35 hover:bg-[linear-gradient(135deg,rgba(34,211,238,0.12),rgba(217,70,239,0.14))]",
                )}
              >
                <span className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-cyan-300/80 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                <FaUserAstronaut aria-hidden="true" />
                <span>{dictionary.auth}</span>
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
}: {
  href: string;
  locale: Locale;
  label: string;
  active: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <SheetClose asChild>
      <Link
        href={localizePath(href, locale)}
        aria-current={active ? "page" : undefined}
        className={cn(
          "font-tech flex min-h-12 items-center gap-3 border border-white/10 bg-white/[0.035] px-4 text-sm font-semibold uppercase tracking-[0.08em] text-zinc-300 transition hover:border-red-400/35 hover:bg-red-500/10 hover:text-red-100 [&_svg]:size-4",
          active && "border-red-400/55 bg-red-500/14 text-red-100",
        )}
      >
        {icon}
        <span>{label}</span>
      </Link>
    </SheetClose>
  );
}
