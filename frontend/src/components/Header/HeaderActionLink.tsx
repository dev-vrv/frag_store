import Link from "next/link";
import { type ReactNode } from "react";

import { type Locale, localizePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type HeaderActionAccent = "cyan" | "red";
type HeaderActionBadgeTone = "lime" | "red";

interface HeaderActionLinkProps {
  href: string;
  locale: Locale;
  label: string;
  children: ReactNode;
  accent?: HeaderActionAccent;
  active?: boolean;
  badge?: number;
  badgeTone?: HeaderActionBadgeTone;
  highlighted?: boolean;
  query?: Record<string, string>;
}

const accentClassName: Record<HeaderActionAccent, string> = {
  cyan:
    "hover:border-cyan-300/60 hover:bg-cyan-300/10 hover:text-cyan-100 hover:shadow-[0_0_26px_rgba(34,211,238,0.16)] focus-visible:ring-cyan-300/35",
  red:
    "hover:border-red-300/60 hover:bg-red-500/12 hover:text-red-100 hover:shadow-[0_0_26px_rgba(255,23,68,0.16)] focus-visible:ring-red-300/35",
};

const activeClassName: Record<HeaderActionAccent, string> = {
  cyan:
    "border-cyan-300/60 bg-cyan-300/12 text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.18)]",
  red:
    "border-red-300/60 bg-red-500/14 text-red-100 shadow-[0_0_24px_rgba(255,23,68,0.2)]",
};

const badgeClassName: Record<HeaderActionBadgeTone, string> = {
  lime:
    "border-lime-200/45 bg-lime-300 text-on-lime shadow-[0_0_18px_rgba(190,242,100,0.34)]",
  red:
    "border-red-200/45 bg-red-500 text-on-accent shadow-[0_0_18px_rgba(255,23,68,0.34)]",
};

export function HeaderActionLink({
  href,
  locale,
  label,
  children,
  accent = "red",
  active = false,
  badge,
  badgeTone = "lime",
  highlighted = false,
  query,
}: HeaderActionLinkProps) {
  const localizedHref = localizePath(href, locale);
  const resolvedHref =
    query && Object.keys(query).length
      ? `${localizedHref}?${new URLSearchParams(query).toString()}`
      : localizedHref;

  return (
    <div className="relative shrink-0">
      <Link
        href={resolvedHref}
        aria-label={label}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group relative grid size-10 place-items-center overflow-hidden border border-white/15 bg-surface/30 text-zinc-300 outline-none [clip-path:polygon(0_0,calc(100%-7px)_0,100%_7px,100%_100%,7px_100%,0_calc(100%-7px))] transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(110deg,transparent_20%,rgba(var(--theme-contrast-rgb),0.12)_50%,transparent_80%)] before:opacity-0 before:transition-opacity before:duration-200 after:pointer-events-none after:absolute after:inset-x-2 after:bottom-0 after:h-px after:origin-center after:scale-x-0 after:bg-current after:opacity-70 after:transition-transform after:duration-200 after:ease-out hover:before:opacity-100 hover:after:scale-x-100 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 motion-reduce:transition-none motion-reduce:hover:transform-none motion-reduce:before:transition-none motion-reduce:after:transition-none [&_svg]:relative [&_svg]:z-10 [&_svg]:size-4",
          accentClassName[accent],
          active && activeClassName[accent],
          highlighted &&
            "border-lime-300/70 bg-lime-300/14 text-lime-100 shadow-[0_0_30px_rgba(190,242,100,0.28)]",
        )}
      >
        {children}
      </Link>
      {badge ? (
        <span
          className={cn(
            "pointer-events-none absolute -right-1.5 -top-1.5 z-20 grid min-w-5 place-items-center rounded-full border px-1 text-[10px] font-bold leading-5",
            badgeClassName[badgeTone],
            highlighted && "animate-bounce",
          )}
        >
          <span key={badge} className={cn("transition duration-300", highlighted && "scale-110")}>
            {badge > 99 ? "99+" : badge}
          </span>
        </span>
      ) : null}
    </div>
  );
}
