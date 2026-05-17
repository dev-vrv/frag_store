import * as React from "react";
import { ArrowRight, Play } from "lucide-react";

import { cn } from "@/lib/utils";
import { CyberButton } from "./cyber-button";
import { CyberBadge } from "./cyber-badge";

export interface CyberHeroAction {
  label: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: React.ComponentProps<typeof CyberButton>["variant"];
}

export interface CyberHeroProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  highlightedTitle?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: CyberHeroAction[];
  media?: React.ReactNode;
}

const CyberHero = React.forwardRef<HTMLElement, CyberHeroProps>(
  (
    { className, eyebrow, title, highlightedTitle, subtitle, actions = [], media, ...props },
    ref,
  ) => (
    <section
      ref={ref}
      className={cn(
        "relative isolate overflow-hidden bg-black px-4 py-20 text-zinc-50 sm:px-6 lg:px-8",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_20%,rgba(248,113,113,0.18),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(217,70,239,0.15),transparent_28%),linear-gradient(180deg,#09090b,#000)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(248,113,113,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(248,113,113,0.07)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-300/70 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.025)_51%,transparent_52%)] bg-[length:100%_7px] opacity-40" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative z-10 max-w-3xl">
          {eyebrow ? (
            <CyberBadge glow className="mb-6">
              {eyebrow}
            </CyberBadge>
          ) : null}
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            {title}{" "}
            {highlightedTitle ? (
              <span className="bg-gradient-to-r from-red-200 via-fuchsia-200 to-lime-200 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(248,113,113,0.25)]">
                {highlightedTitle}
              </span>
            ) : null}
          </h1>
          {subtitle ? (
            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
              {subtitle}
            </p>
          ) : null}
          {actions.length > 0 ? (
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {actions.map((action, index) => {
                const content = (
                  <>
                    {index === 0 ? <ArrowRight aria-hidden="true" /> : <Play aria-hidden="true" />}
                    {action.label}
                  </>
                );

                return action.href ? (
                  <CyberButton key={index} asChild variant={action.variant ?? "primary"} size="lg">
                    <a href={action.href}>{content}</a>
                  </CyberButton>
                ) : (
                  <CyberButton
                    key={index}
                    variant={action.variant ?? "primary"}
                    size="lg"
                    onClick={action.onClick}
                  >
                    {content}
                  </CyberButton>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="relative min-h-[320px] lg:min-h-[520px]">
          {media ?? (
            <div className="absolute inset-0 rounded-[1.4rem] border border-red-300/20 bg-[radial-gradient(circle_at_50%_20%,rgba(248,113,113,0.2),transparent_34%),linear-gradient(135deg,rgba(39,39,42,0.6),rgba(9,9,11,0.95))] shadow-[0_0_70px_rgba(248,113,113,0.18)]">
              <div className="absolute inset-4 rounded-xl border border-white/10 bg-black/35 backdrop-blur-sm" />
              <div className="absolute inset-x-12 top-16 h-28 rounded-full border border-fuchsia-300/25 bg-fuchsia-400/10 blur-sm" />
              <div className="absolute right-12 bottom-12 left-12 grid grid-cols-3 gap-3">
                {["GPU", "SYNC", "240HZ"].map((item) => (
                  <div
                    key={item}
                    className="rounded-md border border-red-300/20 bg-black/45 p-3 text-center font-mono text-xs tracking-[0.18em] text-red-100"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  ),
);
CyberHero.displayName = "CyberHero";

export { CyberHero };
