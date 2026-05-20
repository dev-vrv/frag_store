"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { FaUserAstronaut } from "react-icons/fa";

import { CyberButton } from "@/components/cyber";
import { LocaleSwitcher } from "@/components/Header/LocaleSwitcher";
import { MobileHeaderMenu } from "@/components/Header/MobileHeaderMenu";
import { Nav } from "@/components/Nav/Nav";
import { type Dictionary, type Locale, localizePath, stripLocaleFromPath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface HeaderProps {
  locale: Locale;
  dictionary: Dictionary["header"];
}

export function Header({ locale, dictionary }: HeaderProps) {
  const pathname = stripLocaleFromPath(usePathname() || "/");

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-red-500/15 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        <Link
          href={localizePath("/", locale)}
          className="cyber-cut-small font-display border border-red-400/35 bg-red-500/10 px-4 py-2 text-xl font-normal tracking-[0.08em] text-red-100 shadow-[0_0_24px_rgba(255,23,68,0.18)]"
          aria-label="Frag Store"
        >
          {dictionary.logo}
        </Link>

        <Nav
          className="hidden lg:flex"
          items={dictionary.nav}
          info={dictionary.info}
          locale={locale}
          ariaLabel={dictionary.navAriaLabel}
        />

        <div className="hidden items-center gap-3 lg:flex">
          <LocaleSwitcher locale={locale} label="Сменить язык" />
          <HeaderIconLink
            href="/comparison"
            locale={locale}
            label={dictionary.comparison}
            active={pathname === "/comparison"}
          >
            <Heart aria-hidden="true" />
          </HeaderIconLink>
          <HeaderIconLink
            href="/cart"
            locale={locale}
            label={dictionary.cart}
            active={pathname === "/cart"}
          >
            <ShoppingCart aria-hidden="true" />
          </HeaderIconLink>
          <CyberButton asChild variant="primary" size="sm">
            <Link href={localizePath("/auth", locale)}>
              <FaUserAstronaut aria-hidden="true" />
              <span>{dictionary.auth}</span>
            </Link>
          </CyberButton>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <LocaleSwitcher locale={locale} label="Сменить язык" />
          <MobileHeaderMenu
            locale={locale}
            dictionary={dictionary}
            pathname={pathname}
          />
        </div>
      </div>
    </header>
  );
}

function HeaderIconLink({
  href,
  locale,
  label,
  active,
  children,
}: {
  href: string;
  locale: Locale;
  label: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={localizePath(href, locale)}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "grid size-10 place-items-center border border-white/15 bg-white/[0.04] text-zinc-300 transition hover:border-red-400/45 hover:bg-red-500/10 hover:text-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/30 [&_svg]:size-4",
        active &&
          "border-red-400/55 bg-red-500/14 text-red-100 shadow-[0_0_18px_rgba(255,23,68,0.18)]",
      )}
    >
      {children}
    </Link>
  );
}
