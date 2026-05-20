import Link from "next/link";

import {
  type Locale,
  type NavDropdownDictionary,
  type NavItemDictionary,
  localizePath,
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
  "cyber-cut-small font-tech border border-transparent px-3 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-zinc-300 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-100 focus-visible:border-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/30";

export function Nav({ className, items, info, locale, ariaLabel }: NavProps) {
  return (
    <nav className={cn("flex flex-wrap items-center gap-2", className)} aria-label={ariaLabel}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={localizePath(item.href, locale)}
          className={navLinkClassName}
        >
          {item.label}
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
          <span>{info.label}</span>
          <span className="h-1.5 w-1.5 rotate-45 border-b border-r border-red-200 transition group-hover:translate-y-0.5 group-focus-within:translate-y-0.5" />
        </button>
        <div className="pointer-events-none absolute left-1/2 top-full z-20 min-w-44 -translate-x-1/2 pt-3 opacity-0 transition duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
          <div className="cyber-cut-small border border-red-500/30 bg-black/95 p-2 shadow-[0_0_28px_rgba(255,23,68,0.22)] backdrop-blur-xl">
            <div className="absolute inset-x-6 top-2 h-px bg-gradient-to-r from-transparent via-red-400/70 to-transparent" />
            {info.items.map((item) => (
              <Link
                key={item.href}
                href={localizePath(item.href, locale)}
                className="font-tech block border border-transparent px-3 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-zinc-300 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-100 focus-visible:border-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/30"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
