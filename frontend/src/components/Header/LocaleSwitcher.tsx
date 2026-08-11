"use client";

import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
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
        className="font-tech relative flex h-10 list-none cursor-pointer items-center gap-2 overflow-hidden border border-red-300/40 bg-surface/30 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-red-100 outline-none [clip-path:polygon(0_0,calc(100%-7px)_0,100%_7px,100%_100%,7px_100%,0_calc(100%-7px))] transition-[transform,background-color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(110deg,transparent_20%,rgba(var(--theme-contrast-rgb),0.12)_50%,transparent_80%)] before:opacity-0 before:transition-opacity before:duration-200 after:pointer-events-none after:absolute after:inset-x-3 after:bottom-0 after:h-px after:origin-center after:scale-x-0 after:bg-red-200/80 after:transition-transform after:duration-200 after:ease-out hover:border-red-200/65 hover:bg-red-500/12 hover:shadow-[0_0_24px_rgba(255,23,68,0.16)] hover:before:opacity-100 hover:after:scale-x-100 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-red-300/35 motion-reduce:transition-none motion-reduce:hover:transform-none motion-reduce:before:transition-none motion-reduce:after:transition-none [&::-webkit-details-marker]:hidden"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="relative z-10">{localeLabels[locale]}</span>
        <ChevronDown className={cn("relative z-10 size-4 transition", open && "rotate-180")} />
      </button>
      {open ? (
        <div
          className="absolute right-0 top-[calc(100%+0.65rem)] z-50 w-40 overflow-hidden border border-red-300/35 bg-surface/95 p-2 shadow-[0_18px_48px_rgba(0,0,0,0.42),0_0_34px_rgba(255,23,68,0.16)] backdrop-blur-xl [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))]"
          role="menu"
        >
          <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-red-300/90 to-transparent shadow-[0_0_14px_rgba(248,113,113,0.65)]" />
          <div className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-red-500/10 blur-2xl" />
          <div className="relative z-10 grid gap-1">
            {locales.map((item) => {
              const isActive = item === locale;

              return (
                <Link
                  key={item}
                  href={localizePath(basePath, item)}
                  className={cn(
                    "font-tech group/item relative flex min-h-10 cursor-pointer items-center gap-2.5 overflow-hidden border border-transparent px-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-300 outline-none [clip-path:polygon(0_0,calc(100%-6px)_0,100%_6px,100%_100%,6px_100%,0_calc(100%-6px))] transition-[background-color,border-color,color,transform,box-shadow] duration-300 before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/3 before:w-1/4 before:-translate-x-full before:-skew-x-12 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:opacity-0 before:transition-[transform,opacity] before:duration-500 hover:translate-x-0.5 hover:border-red-300/35 hover:bg-red-500/10 hover:text-red-100 hover:shadow-[inset_2px_0_0_rgba(248,113,113,0.65)] hover:before:translate-x-[650%] hover:before:opacity-100 focus-visible:border-red-300/55 focus-visible:ring-2 focus-visible:ring-red-300/25",
                    isActive &&
                      "border-red-300/50 bg-red-500/14 text-red-100 shadow-[inset_2px_0_0_rgba(248,113,113,0.85),0_0_18px_rgba(255,23,68,0.1)]",
                  )}
                  role="menuitem"
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span
                    className={cn(
                      "relative z-10 grid size-5 place-items-center border transition",
                      isActive
                        ? "border-red-300/55 bg-red-500/18 text-red-100"
                        : "border-white/10 bg-white/[0.025] text-zinc-600 group-hover/item:border-red-300/30 group-hover/item:text-red-200",
                    )}
                  >
                    {isActive ? <Check className="size-3" aria-hidden="true" /> : null}
                  </span>
                  <span className="relative z-10">{localeLabels[item]}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
