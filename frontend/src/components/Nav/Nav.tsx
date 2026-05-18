import Link from "next/link";

import { type Locale, type NavItemDictionary, localizePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface NavProps {
  items: NavItemDictionary[];
  locale: Locale;
  ariaLabel: string;
  className?: string;
}

export function Nav({ className, items, locale, ariaLabel }: NavProps) {
  return (
    <nav className={cn("flex flex-wrap items-center gap-2", className)} aria-label={ariaLabel}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={localizePath(item.href, locale)}
          className="cyber-cut-small font-tech border border-transparent px-3 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-zinc-300 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-100 focus-visible:border-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/30"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
