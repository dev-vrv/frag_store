import {
  ChevronDown,
  Headphones,
  Mouse,
  RadioTower,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { CyberBadge, CyberButton } from "@/components/cyber";
import { Section } from "@/components/Sections/Section";
import { type Dictionary, type Locale, localizePath } from "@/lib/i18n";

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

            <div className="cyber-reveal cyber-reveal-delay-3 mt-7 flex flex-wrap gap-2">
              {content.featurePills.map((pill) => (
                <span
                  key={pill}
                  className="font-tech rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.14em] text-cyan-100"
                >
                  {pill}
                </span>
              ))}
            </div>

            <div className="cyber-reveal cyber-reveal-delay-4 mt-9 flex flex-col gap-3 sm:flex-row">
              <CyberButton asChild size="lg" variant="primary">
                <a href={localizePath("/catalog", locale)}>
                  <Zap />
                  {content.primaryCta}
                </a>
              </CyberButton>
              <CyberButton asChild size="lg" variant="outline">
                <a href={localizePath("/comparison", locale)}>
                <RadioTower />
                {content.secondaryCta}
                </a>
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

          <div className="cyber-hero-device relative min-h-[420px] lg:min-h-[560px]">
            <div className="absolute inset-0 rounded-[1.75rem] border border-red-400/25 bg-[linear-gradient(135deg,rgba(39,39,42,0.72),rgba(20,6,8,0.96))] shadow-[0_0_90px_rgba(255,23,68,0.18)] backdrop-blur-xl" />
            <div className="absolute inset-5 rounded-[1.25rem] border border-white/10 bg-black/45" />
            <div className="absolute inset-x-8 top-8 bottom-8 flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CyberBadge variant="red" glow>
                    {content.showcaseEyebrow}
                  </CyberBadge>
                  <h2 className="font-display mt-5 text-3xl tracking-[0.04em] text-white">
                    {content.showcaseTitle}
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-7 text-zinc-400">
                    {content.showcaseSubtitle}
                  </p>
                </div>
                <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2">
                  <Sparkles className="size-4 text-cyan-100" />
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[1.5rem] border border-red-400/18 bg-[linear-gradient(180deg,rgba(255,23,68,0.08),rgba(255,255,255,0.03))] p-6 shadow-[inset_0_0_30px_rgba(255,23,68,0.08)]">
                  <div className="flex items-center justify-between">
                    <Headphones className="size-8 text-red-100" />
                    <div className="h-px w-20 bg-gradient-to-r from-transparent via-red-300/80 to-transparent" />
                  </div>
                  <div className="mt-8 space-y-4">
                    {content.showcaseSpecs.map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between gap-4 border-b border-white/8 pb-4"
                      >
                        <span className="font-tech text-xs uppercase tracking-[0.14em] text-zinc-500">
                          {label}
                        </span>
                        <span className="font-tech text-sm uppercase tracking-[0.1em] text-red-100">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[1.4rem] border border-cyan-300/16 bg-cyan-300/[0.06] p-5 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
                    <ShieldCheck className="size-5 text-cyan-100" />
                    <div className="font-tech mt-5 text-xs uppercase tracking-[0.14em] text-zinc-500">
                      {content.spotlightLabel}
                    </div>
                    <div className="font-display mt-2 text-2xl text-white">
                      {content.spotlightValue}
                    </div>
                  </div>

                  <div className="rounded-[1.4rem] border border-violet-300/16 bg-violet-300/[0.06] p-5 shadow-[0_0_30px_rgba(167,139,250,0.08)]">
                    <Mouse className="size-5 text-violet-100" />
                    <div className="font-tech mt-5 text-xs uppercase tracking-[0.14em] text-zinc-500">
                      {content.availabilityLabel}
                    </div>
                    <div className="font-display mt-2 text-2xl text-white">
                      {content.availabilityValue}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto overflow-hidden rounded-2xl border border-red-400/20 bg-[linear-gradient(90deg,rgba(255,23,68,0.12),rgba(34,211,238,0.1),rgba(167,139,250,0.08))] p-4">
                <div className="font-tech flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-zinc-200">
                  <span className="rounded-full border border-red-300/20 bg-black/20 px-3 py-1">
                    Ranked Ready
                  </span>
                  <span className="rounded-full border border-cyan-300/20 bg-black/20 px-3 py-1">
                    FPS / MMO / Stream
                  </span>
                  <span className="rounded-full border border-violet-300/20 bg-black/20 px-3 py-1">
                    Zero dead zones
                  </span>
                </div>
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
