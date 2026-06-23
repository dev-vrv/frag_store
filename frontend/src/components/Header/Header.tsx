"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { FaUserAstronaut } from "react-icons/fa";

import { LocaleSwitcher } from "@/components/Header/LocaleSwitcher";
import { MobileHeaderMenu } from "@/components/Header/MobileHeaderMenu";
import { Nav } from "@/components/Nav/Nav";
import { AUTH_STATE_CHANGE_EVENT, hasAuthCookies } from "@/lib/auth";
import { type Dictionary, type Locale, localizePath, stripLocaleFromPath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface HeaderProps {
  locale: Locale;
  dictionary: Dictionary["header"];
}

export function Header({ locale, dictionary }: HeaderProps) {
  const pathname = stripLocaleFromPath(usePathname() || "/");
  const [isHidden, setIsHidden] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;

      if (currentScrollY <= 24) {
        setIsHidden(false);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      const scrollDelta = currentScrollY - lastScrollY;
      if (Math.abs(scrollDelta) < 8) {
        return;
      }

      setIsHidden(scrollDelta > 0);
      lastScrollYRef.current = currentScrollY;
    }

    lastScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function syncAuthState() {
      setIsAuthenticated(hasAuthCookies());
    }

    syncAuthState();
    window.addEventListener(AUTH_STATE_CHANGE_EVENT, syncAuthState);
    window.addEventListener("focus", syncAuthState);

    return () => {
      window.removeEventListener(AUTH_STATE_CHANGE_EVENT, syncAuthState);
      window.removeEventListener("focus", syncAuthState);
    };
  }, []);

  const authHref = localizePath(isAuthenticated ? "/profile" : "/auth", locale);
  const authLabel = isAuthenticated ? dictionary.profile : dictionary.auth;
  const authActive = pathname === "/auth" || pathname === "/profile";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-red-500/15 bg-black/70 backdrop-blur-xl transition-transform duration-300",
        isHidden ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-3sm:gap-5">
        <Link
          href={localizePath("/", locale)}
          className="cyber-cut-small font-display shrink-0 border border-red-400/35 bg-red-500/10 px-3 py-2 text-lg font-normal tracking-[0.08em] text-red-100 shadow-[0_0_24px_rgba(255,23,68,0.18)] sm:px-4 sm:text-xl"
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
          <Link
            href={authHref}
            className={cn(
              "group relative inline-flex h-10 items-center gap-2 overflow-hidden border px-4 text-sm uppercase tracking-[0.1em] text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2",
              authActive
                ? "border-fuchsia-300/45 bg-[linear-gradient(135deg,rgba(34,211,238,0.16),rgba(217,70,239,0.18))] shadow-[0_0_28px_rgba(217,70,239,0.16)] focus-visible:ring-fuchsia-300/35"
                : "border-white/14 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] hover:border-fuchsia-300/35 hover:bg-[linear-gradient(135deg,rgba(34,211,238,0.12),rgba(217,70,239,0.14))] hover:shadow-[0_0_22px_rgba(217,70,239,0.12)] focus-visible:ring-fuchsia-300/30",
            )}
          >
            <span className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-cyan-300/80 to-transparent opacity-70 transition-opacity group-hover:opacity-100" />
            <FaUserAstronaut aria-hidden="true" className="text-cyan-200" />
            <span>{authLabel}</span>
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <LocaleSwitcher locale={locale} label="Сменить язык" className="shrink-0" />
          <MobileHeaderMenu
            locale={locale}
            dictionary={dictionary}
            pathname={pathname}
            isAuthenticated={isAuthenticated}
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
