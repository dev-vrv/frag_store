"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className={cn("group relative", className)}>
      <button
        type="button"
        className="cyber-cut-small font-tech flex h-10 list-none cursor-pointer items-center gap-2 border border-red-400/35 bg-black/45 px-3 text-sm font-semibold uppercase tracking-[0.08em] text-red-100 outline-none transition hover:bg-red-500/10 focus-visible:ring-2 focus-visible:ring-red-300/30 [&::-webkit-details-marker]:hidden"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {localeLabels[locale]}
        <ChevronDown className={cn("size-4 transition", open && "rotate-180")} />
      </button>
      {open ? (
        <div
          className="cyber-cut-surface absolute right-0 top-[calc(100%+0.5rem)] z-50 w-32 border border-red-400/30 bg-zinc-950/95 p-2 shadow-[0_0_34px_rgba(255,23,68,0.18)]"
          role="menu"
        >
          {locales.map((item) => (
            <Link
              key={item}
              href={localizePath(basePath, item)}
              className={cn(
                "cyber-cut-small font-tech flex cursor-pointer items-center justify-between border border-transparent px-3 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-zinc-300 transition hover:border-red-400/25 hover:bg-red-500/10 hover:text-red-100",
                item === locale && "border-red-400/35 bg-red-500/10 text-red-100",
              )}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              {localeLabels[item]}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
