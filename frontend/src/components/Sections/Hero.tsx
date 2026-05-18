import {
  ChevronDown,
  Keyboard,
  MousePointer2,
  RadioTower,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { CyberBadge, CyberButton } from "@/components/cyber";
import { Section } from "@/components/Sections/Section";
import { type Dictionary, type Locale, localizePath } from "@/lib/i18n";

const heroSystemCards: Array<[LucideIcon, string, string]> = [
  [MousePointer2, "", ""],
  [Keyboard, "", ""],
];

export interface HeroProps {
  locale: Locale;
  content: Dictionary["hero"];
}

export function Hero({ locale, content }: HeroProps) {
  return (
    <Section
      fullWidth
      className="relative isolate overflow-hidden bg-black text-zinc-50"
      containerClassName="section-hero relative"
    >
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_18%_24%,rgba(255,23,68,0.3),transparent_31%),radial-gradient(circle_at_78%_18%,rgba(127,29,29,0.42),transparent_30%),radial-gradient(circle_at_58%_78%,rgba(217,70,239,0.08),transparent_24%),linear-gradient(180deg,#050507_0%,#120507_48%,#000_100%)]" />
      <div className="cyber-grid absolute inset-0 -z-20 opacity-70" />
      <div className="cyber-scanline absolute inset-0 -z-10 opacity-35" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/85 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-500/70 to-transparent" />

      <div className="mx-auto flex w-full max-w-7xl flex-col justify-center">
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-3xl">
            <div className="cyber-reveal cyber-reveal-delay-1">
              <CyberBadge variant="red" glow>
                {content.eyebrow}
              </CyberBadge>
            </div>

            <h1 className="cyber-reveal cyber-reveal-delay-2 font-display mt-7 max-w-4xl text-5xl font-normal tracking-[0.03em] text-white sm:text-4xl lg:text-6xl">
              {content.titleStart}{" "}
              <span className="cyber-glitch-text bg-gradient-to-r from-red-200 via-rose-400 to-red-600 bg-clip-text text-transparent">
                {content.titleHighlight}
              </span>
            </h1>

            <p className="cyber-reveal cyber-reveal-delay-3 mt-6 max-w-2xl text-lg leading-9 text-zinc-400 sm:text-xl">
              {content.subtitle}
            </p>

            <div className="cyber-reveal cyber-reveal-delay-4 mt-9 flex flex-col gap-3 sm:flex-row">
              <CyberButton asChild size="lg" variant="primary">
                <a href={localizePath("/catalog", locale)}>
                  <Zap />
                  {content.primaryCta}
                </a>
              </CyberButton>
              <CyberButton size="lg" variant="outline">
                <RadioTower />
                {content.secondaryCta}
              </CyberButton>
            </div>

            <div className="cyber-reveal cyber-reveal-delay-5 mt-10 grid max-w-xl grid-cols-3 gap-3">
              {content.metrics.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg border border-white/10 bg-white/[0.055] p-3 backdrop-blur-xl"
                >
                  <div className="font-tech text-sm uppercase tracking-[0.1em] text-zinc-500">
                    {label}
                  </div>
                  <div className="font-tech mt-1 text-xl font-bold text-red-100">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cyber-hero-device relative min-h-[360px] lg:min-h-[560px]">
            <div className="absolute inset-0 rounded-[1.75rem] border border-red-400/25 bg-[linear-gradient(135deg,rgba(39,39,42,0.72),rgba(20,6,8,0.96))] shadow-[0_0_90px_rgba(255,23,68,0.18)] backdrop-blur-xl" />
            <div className="absolute inset-5 rounded-[1.25rem] border border-white/10 bg-black/45" />
            <div className="absolute left-10 right-10 top-10 flex items-center justify-between">
              <CyberBadge variant="red" glow>
                {content.loadoutCore}
              </CyberBadge>
              <div className="h-2 w-28 rounded-full bg-gradient-to-r from-red-600 via-red-300 to-rose-500 shadow-[0_0_26px_rgba(255,23,68,0.38)]" />
            </div>
            <div className="absolute inset-x-12 top-28 grid gap-4 sm:grid-cols-2">
              {heroSystemCards.map(([Icon], index) => {
                const [label, value] = content.systemCards[index] ?? ["", ""];

                return (
                <div
                  key={String(label)}
                  className="rounded-xl border border-red-400/18 bg-white/[0.055] p-5 shadow-[inset_0_0_24px_rgba(255,23,68,0.06)]"
                >
                  <Icon className="size-5 text-red-200" />
                  <div className="font-tech mt-5 text-sm uppercase tracking-[0.1em] text-zinc-500">
                    {label}
                  </div>
                  <div className="font-display mt-2 text-3xl font-normal text-white">{value}</div>
                </div>
                );
              })}
            </div>
            <div className="absolute bottom-12 left-12 right-12 overflow-hidden rounded-2xl border border-red-400/22 bg-red-500/10 p-5 shadow-[0_0_50px_rgba(255,23,68,0.14)]">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-tech text-sm uppercase tracking-[0.1em] text-red-100">
                  {content.timeline}
                </span>
                <span className="font-tech text-sm text-red-200">{content.live}</span>
              </div>
              <div className="space-y-3">
                {[82, 54, 92].map((width, index) => (
                  <div key={index} className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-700 via-red-400 to-rose-300 shadow-[0_0_18px_rgba(255,23,68,0.34)]"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="cyber-reveal cyber-reveal-delay-5 absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-zinc-500 sm:flex">
          <span className="font-tech text-xs uppercase tracking-[0.16em]">
            {content.scroll}
          </span>
          <ChevronDown className="size-4 animate-bounce text-red-200" />
        </div>
      </div>
    </Section>
  );
}
