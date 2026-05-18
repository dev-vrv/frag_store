"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  type Locale,
  localeLabels,
  locales,
  localizePath,
  stripLocaleFromPath,
} from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface LocaleSwitcherProps {
  locale: Locale;
  label?: string;
  className?: string;
}

export function LocaleSwitcher({ locale, label = "Language", className }: LocaleSwitcherProps) {
  const pathname = usePathname();
  const basePath = stripLocaleFromPath(pathname);

  return (
    <details className={cn("group relative", className)}>
      <summary
        className="cyber-cut-small font-tech flex h-10 list-none cursor-pointer items-center gap-2 border border-red-400/35 bg-black/45 px-3 text-sm font-semibold uppercase tracking-[0.08em] text-red-100 outline-none transition hover:bg-red-500/10 focus-visible:ring-2 focus-visible:ring-red-300/30 [&::-webkit-details-marker]:hidden"
        aria-label={label}
      >
        {localeLabels[locale]}
        <ChevronDown className="size-4 transition group-open:rotate-180" />
      </summary>
      <div className="cyber-cut-surface absolute right-0 top-[calc(100%+0.5rem)] z-50 w-32 border border-red-400/30 bg-zinc-950/95 p-2 shadow-[0_0_34px_rgba(255,23,68,0.18)]">
        {locales.map((item) => (
          <Link
            key={item}
            href={localizePath(basePath, item)}
            className={cn(
              "cyber-cut-small font-tech flex cursor-pointer items-center justify-between border border-transparent px-3 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-zinc-300 transition hover:border-red-400/25 hover:bg-red-500/10 hover:text-red-100",
              item === locale && "border-red-400/35 bg-red-500/10 text-red-100",
            )}
          >
            {localeLabels[item]}
          </Link>
        ))}
      </div>
    </details>
  );
}
