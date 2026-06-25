import { ChevronDown, Zap } from "lucide-react";

import { CyberBadge, CyberButton } from "@/components/cyber";
import { HeroMediaRotator } from "@/components/Sections/HeroMediaRotator";
import { Section } from "@/components/Sections/Section";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import AnimatedText from "@/components/ui/animatedText";
import { getHeroMediaPaths } from "@/lib/hero-media";
import { type Dictionary, type Locale, localizePath } from "@/lib/i18n";

export interface HeroProps {
  locale: Locale;
  content: Dictionary["hero"];
}

export async function Hero({ locale, content }: HeroProps) {
  const heroImages = await getHeroMediaPaths();

  return (
    <Section
      fullWidth
      className="relative isolate overflow-hidden bg-black text-zinc-50"
      containerClassName="section-hero relative"
    >
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_18%_24%,rgba(255,23,68,0.3),transparent_31%),radial-gradient(circle_at_78%_18%,rgba(127,29,29,0.42),transparent_30%),radial-gradient(circle_at_58%_78%,rgba(217,70,239,0.08),transparent_24%),linear-gradient(180deg,#050507_0%,#120507_48%,#000_100%)]" />
      <HeroMediaRotator images={heroImages} />
      <div className="cyber-grid absolute inset-0 -z-20 opacity-70" />
      <div className="cyber-scanline absolute inset-0 -z-10 opacity-35" />
      <div className="absolute left-1/2 top-1/2 -z-10 h-[21rem] w-[21rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,23,68,0.22)_0%,rgba(255,23,68,0.08)_34%,transparent_72%)] blur-3xl sm:h-[26rem] sm:w-[26rem] lg:h-[32rem] lg:w-[32rem]" />
      <div className="absolute left-1/2 top-1/2 -z-10 h-[13rem] w-[13rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-400/15 sm:h-[16rem] sm:w-[16rem] lg:h-[20rem] lg:w-[20rem]" />
      <div className="absolute left-1/2 top-1/2 -z-10 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10 sm:h-[22rem] sm:w-[22rem] lg:h-[28rem] lg:w-[28rem]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/85 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-500/70 to-transparent" />

      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center text-center">
        <div className="max-w-3xl px-1 sm:px-0">
          <RevealOnScroll className="flex justify-center" delay={80}>
            <CyberBadge variant="red" glow>
              {content.eyebrow}
            </CyberBadge>
          </RevealOnScroll>

          <AnimatedText
            as="h1"
            text={content.title}
            delay={160}
            className="font-display mt-6 text-[2rem] font-normal leading-[1.04] tracking-[0.02em] text-white sm:mt-7 sm:text-5xl lg:text-7xl"
            config={{ duration: 0.34, delayStep: 18, distance: 26 }}
          />

          <AnimatedText
            as="p"
            text={content.subtitle}
            delay={420}
            className="mx-auto mt-5 max-w-2xl text-[0.95rem] leading-7 text-zinc-300 sm:mt-6 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9"
            config={{ duration: 0.28, delayStep: 8, distance: 18 }}
          />

          <AnimatedText
            as="p"
            text={content.microcopy}
            delay={560}
            className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-500 sm:mt-5 sm:text-[0.95rem] sm:leading-7"
            config={{ duration: 0.24, delayStep: 6, distance: 14 }}
          />

          <RevealOnScroll className="mt-8 flex w-full justify-center sm:mt-10" delay={700}>
            <CyberButton asChild size="lg" variant="primary" className="w-full sm:w-auto">
              <a href={localizePath("/catalog", locale)}>
                <Zap />
                {content.primaryCta}
              </a>
            </CyberButton>
          </RevealOnScroll>

          <RevealOnScroll
            className="mt-7 flex flex-wrap justify-center gap-2 sm:mt-9"
            delay={820}
          >
            {content.chips.map((pill) => (
              <span
                key={pill}
                className="font-tech rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1.5 text-[10px] uppercase tracking-[0.16em] text-zinc-300 backdrop-blur-xl sm:px-3 sm:text-[11px] sm:tracking-[0.18em]"
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
