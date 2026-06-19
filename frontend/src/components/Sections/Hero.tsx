import { ChevronDown, Zap } from "lucide-react";

import { CyberBadge, CyberButton } from "@/components/cyber";
import { Section } from "@/components/Sections/Section";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import AnimatedText from "@/components/ui/animatedText";
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
      <div className="absolute left-1/2 top-1/2 -z-10 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,23,68,0.22)_0%,rgba(255,23,68,0.08)_34%,transparent_72%)] blur-3xl" />
      <div className="absolute left-1/2 top-1/2 -z-10 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-400/15" />
      <div className="absolute left-1/2 top-1/2 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/85 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-500/70 to-transparent" />

      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center text-center">
        <div className="max-w-3xl">
          <RevealOnScroll className="flex justify-center" delay={80}>
            <CyberBadge variant="red" glow>
              {content.eyebrow}
            </CyberBadge>
          </RevealOnScroll>

          <AnimatedText
            as="h1"
            text={content.title}
            delay={160}
            className="font-display mt-7 text-4xl font-normal tracking-[0.03em] text-white sm:text-5xl lg:text-7xl"
            config={{ duration: 0.34, delayStep: 18, distance: 26 }}
          />

          <AnimatedText
            as="p"
            text={content.subtitle}
            delay={420}
            className="mx-auto mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-xl sm:leading-9"
            config={{ duration: 0.28, delayStep: 8, distance: 18 }}
          />

          <AnimatedText
            as="p"
            text={content.microcopy}
            delay={560}
            className="mx-auto mt-5 max-w-xl text-sm leading-7 text-zinc-500 sm:text-base"
            config={{ duration: 0.24, delayStep: 6, distance: 14 }}
          />

          <RevealOnScroll className="mt-10 flex justify-center" delay={700}>
            <CyberButton asChild size="lg" variant="primary">
              <a href={localizePath("/catalog", locale)}>
                <Zap />
                {content.primaryCta}
              </a>
            </CyberButton>
          </RevealOnScroll>

          <RevealOnScroll
            className="mt-10 flex flex-wrap justify-center gap-2"
            delay={820}
          >
            {content.chips.map((pill) => (
              <span
                key={pill}
                className="font-tech rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-zinc-300 backdrop-blur-xl"
              >
                {pill}
              </span>
            ))}
          </RevealOnScroll>
        </div>

        <RevealOnScroll
          as="a"
          href="#loadout"
          aria-label={content.scroll}
          delay={980}
          className="hero-scroll-link absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:flex"
        >
          <span className="hero-scroll-link__pulse">
            <span className="font-tech text-xs uppercase tracking-[0.16em] text-white">
              {content.scroll}
            </span>
            <span className="hero-scroll-link__icon">
              <ChevronDown className="size-4 animate-bounce text-white" />
            </span>
          </span>
        </RevealOnScroll>
      </div>
    </Section>
  );
}
