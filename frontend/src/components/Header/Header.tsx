"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { FaUserAstronaut } from "react-icons/fa";

import { BrandLogo } from "@/components/Brand/BrandLogo";
import { CyberButton } from "@/components/cyber/cyber-button";
import { HeaderActionLink } from "@/components/Header/HeaderActionLink";
import { LocaleSwitcher } from "@/components/Header/LocaleSwitcher";
import { MobileHeaderMenu } from "@/components/Header/MobileHeaderMenu";
import { NotificationHeaderButton } from "@/components/Notifications/NotificationHeaderButton";
import { Nav } from "@/components/Nav/Nav";
import { useCart } from "@/components/Cart/CartProvider";
import { ThemeToggle } from "@/components/Theme/ThemeToggle";
import { AUTH_STATE_CHANGE_EVENT, getAuthSessionState } from "@/lib/auth";
import { useFavoriteIds } from "@/lib/favorites";
import { type Dictionary, type Locale, localizePath, stripLocaleFromPath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface HeaderProps {
  locale: Locale;
  dictionary: Dictionary["header"];
}

export function Header(props: HeaderProps) {
  return (
    <Suspense fallback={<div className="theme-dark fixed inset-x-0 top-0 z-50 h-20 border-b border-red-500/15 bg-zinc-950/80 backdrop-blur-xl" />}>
      <HeaderContent {...props} />
    </Suspense>
  );
}

function HeaderContent({ locale, dictionary }: HeaderProps) {
  const pathname = stripLocaleFromPath(usePathname() || "/");
  const searchParams = useSearchParams();
  const { quantityTotal } = useCart();
  const favoriteIds = useFavoriteIds();
  const [isHidden, setIsHidden] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartIndicatorPulse, setCartIndicatorPulse] = useState(false);
  const lastScrollYRef = useRef(0);
  const previousQuantityTotalRef = useRef(quantityTotal);
  const cartPulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFavoritesCatalogView = pathname === "/catalog" && searchParams.get("favorites") === "1";

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
    let active = true;

    async function syncAuthState() {
      const nextState = await getAuthSessionState();

      if (active) {
        setIsAuthenticated(nextState);
      }
    }

    void syncAuthState();
    window.addEventListener(AUTH_STATE_CHANGE_EVENT, syncAuthState);
    window.addEventListener("focus", syncAuthState);

    return () => {
      active = false;
      window.removeEventListener(AUTH_STATE_CHANGE_EVENT, syncAuthState);
      window.removeEventListener("focus", syncAuthState);
    };
  }, []);

  useEffect(() => {
    if (previousQuantityTotalRef.current === quantityTotal) {
      return;
    }

    previousQuantityTotalRef.current = quantityTotal;
    setIsHidden(false);
    setCartIndicatorPulse(true);

    if (cartPulseTimeoutRef.current) {
      clearTimeout(cartPulseTimeoutRef.current);
    }

    cartPulseTimeoutRef.current = setTimeout(() => {
      setCartIndicatorPulse(false);
      cartPulseTimeoutRef.current = null;
    }, 1400);
  }, [quantityTotal]);

  useEffect(() => {
    return () => {
      if (cartPulseTimeoutRef.current) {
        clearTimeout(cartPulseTimeoutRef.current);
      }
    };
  }, []);

  const authHref = localizePath(isAuthenticated ? "/profile" : "/auth", locale);
  const authLabel = isAuthenticated ? dictionary.profile : dictionary.auth;
  const authActive = pathname === "/auth" || pathname === "/profile";

  return (
    <header
      className={cn(
        "theme-dark fixed inset-x-0 top-0 z-50 border-b border-red-500/15 bg-zinc-950/80 backdrop-blur-xl transition-transform duration-300",
        isHidden ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <div className="mx-auto flex min-h-20 w-full max-w-[90rem] items-center gap-3 px-4 sm:gap-5 sm:px-6 lg:px-8">
        <Link
          href={localizePath("/", locale)}
          className="shrink-0 px-1 py-2 sm:px-2"
          aria-label="Frag Store"
        >
          <BrandLogo
            className="w-[6.6rem] sm:w-[8.2rem]"
            imageClassName="brightness-[1.08] saturate-[1.02]"
            priority
          />
        </Link>

        <Nav
          className="hidden flex-1 justify-center lg:flex"
          items={dictionary.nav}
          info={dictionary.info}
          locale={locale}
          ariaLabel={dictionary.navAriaLabel}
        />

        <div className="ml-auto hidden items-center gap-4 lg:flex">
          <ThemeToggle locale={locale} />
          <LocaleSwitcher locale={locale} label="Сменить язык" />
          {isAuthenticated ? <NotificationHeaderButton locale={locale} /> : null}
          <HeaderActionLink
            href="/catalog"
            locale={locale}
            label={dictionary.favorites}
            active={isFavoritesCatalogView}
            badge={favoriteIds.length}
            query={{ favorites: "1" }}
          >
            <Heart aria-hidden="true" />
          </HeaderActionLink>
          <HeaderActionLink
            href="/cart"
            locale={locale}
            label={dictionary.cart}
            active={pathname === "/cart"}
            badge={quantityTotal}
            highlighted={cartIndicatorPulse}
          >
            <ShoppingCart aria-hidden="true" />
          </HeaderActionLink>
          <CyberButton
            asChild
            variant="danger"
            size="sm"
            className={cn(
              "h-10 border-red-400/55 bg-zinc-950/70 px-4 text-xs uppercase tracking-[0.14em] text-zinc-100 shadow-[0_0_18px_rgba(127,29,29,0.14)] backdrop-blur-md hover:border-red-300/75 hover:bg-red-950/75 hover:text-on-accent hover:shadow-[0_0_24px_rgba(185,28,28,0.22)]",
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
        </div>
        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          {isAuthenticated ? <NotificationHeaderButton locale={locale} /> : null}
          <ThemeToggle locale={locale} />
          <LocaleSwitcher locale={locale} label="Сменить язык" className="shrink-0" />
          <MobileHeaderMenu
            locale={locale}
            dictionary={dictionary}
            pathname={pathname}
            favoriteCount={favoriteIds.length}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
    </header>
  );
}
