"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  type Locale,
  type NavDropdownDictionary,
  type NavItemDictionary,
  localizePath,
  stripLocaleFromPath,
} from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface NavProps {
  items: NavItemDictionary[];
  info: NavDropdownDictionary;
  locale: Locale;
  ariaLabel: string;
  className?: string;
}

const navLinkClassName =
  "font-tech relative overflow-hidden border border-transparent px-5 py-3 text-[15px] font-bold tracking-[0.045em] text-zinc-100 outline-none [clip-path:polygon(0_0,calc(100%-7px)_0,100%_7px,100%_100%,7px_100%,0_calc(100%-7px))] transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(110deg,transparent_20%,rgba(var(--theme-contrast-rgb),0.1)_50%,transparent_80%)] before:opacity-0 before:transition-opacity before:duration-200 after:pointer-events-none after:absolute after:inset-x-4 after:bottom-0 after:h-px after:origin-center after:scale-x-0 after:bg-red-200/85 after:transition-transform after:duration-200 after:ease-out hover:border-red-400/45 hover:bg-red-500/12 hover:text-white hover:shadow-[0_0_20px_rgba(255,23,68,0.12)] hover:before:opacity-100 hover:after:scale-x-100 active:translate-y-0 active:scale-[0.98] focus-visible:border-red-300 focus-visible:ring-2 focus-visible:ring-red-300/30 motion-reduce:transition-none motion-reduce:hover:transform-none motion-reduce:before:transition-none motion-reduce:after:transition-none";

export function Nav({ className, items, info, locale, ariaLabel }: NavProps) {
  const pathname = stripLocaleFromPath(usePathname() || "/");

  return (
    <nav className={cn("flex flex-wrap items-center gap-3", className)} aria-label={ariaLabel}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={localizePath(item.href, locale)}
          aria-current={pathname === item.href ? "page" : undefined}
          className={cn(
            navLinkClassName,
            pathname === item.href &&
              "border-red-400/45 bg-red-500/14 text-red-100 shadow-[0_0_18px_rgba(255,23,68,0.16)]",
          )}
        >
          <span className="relative z-10">{item.label}</span>
        </Link>
      ))}
      <div className="group relative">
        <button
          type="button"
          className={cn(
            navLinkClassName,
            "flex items-center gap-2 bg-transparent",
          )}
          aria-haspopup="true"
        >
          <span className="relative z-10">{info.label}</span>
          <span className="relative z-10 h-1.5 w-1.5 rotate-45 border-b border-r border-red-200 transition group-hover:translate-y-0.5 group-focus-within:translate-y-0.5" />
        </button>
        <div className="pointer-events-none absolute left-1/2 top-full z-20 min-w-56 -translate-x-1/2 pt-3 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
          <div className="relative overflow-hidden border border-red-300/35 bg-surface/95 p-2 shadow-[0_18px_48px_rgba(0,0,0,0.42),0_0_34px_rgba(255,23,68,0.16)] backdrop-blur-xl [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))]">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-red-300/90 to-transparent shadow-[0_0_14px_rgba(248,113,113,0.65)]" />
            <div className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-red-500/10 blur-2xl" />
            <div className="relative z-10 grid gap-1">
              {info.items.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={localizePath(item.href, locale)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "font-tech group/item relative flex min-h-11 items-center justify-between gap-4 overflow-hidden border border-transparent px-4 text-sm font-bold tracking-[0.05em] text-zinc-200 outline-none [clip-path:polygon(0_0,calc(100%-7px)_0,100%_7px,100%_100%,7px_100%,0_calc(100%-7px))] transition-[background-color,border-color,color,transform,box-shadow] duration-300 before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/3 before:w-1/4 before:-translate-x-full before:-skew-x-12 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:opacity-0 before:transition-[transform,opacity] before:duration-500 hover:translate-x-0.5 hover:border-red-300/35 hover:bg-red-500/10 hover:text-white hover:shadow-[inset_2px_0_0_rgba(248,113,113,0.65)] hover:before:translate-x-[650%] hover:before:opacity-100 focus-visible:border-red-300/55 focus-visible:ring-2 focus-visible:ring-red-300/25",
                      isActive &&
                        "border-red-300/50 bg-red-500/14 text-red-100 shadow-[inset_2px_0_0_rgba(248,113,113,0.85),0_0_18px_rgba(255,23,68,0.1)]",
                    )}
                  >
                    <span className="relative z-10">{item.label}</span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "relative z-10 h-px w-5 origin-left bg-current opacity-30 transition-transform duration-300",
                        isActive ? "scale-x-100" : "scale-x-50 group-hover/item:scale-x-100",
                      )}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
