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
      className="relative isolate overflow-hidden bg-transparent text-zinc-50"
      containerClassName="section-hero relative"
    >
      <HeroMediaRotator images={heroImages} />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(90%_58%_at_-10%_18%,rgba(255,23,68,0.13),transparent_62%),radial-gradient(84%_54%_at_112%_14%,rgba(34,211,238,0.11),transparent_60%),linear-gradient(112deg,rgba(255,23,68,0.05)_0%,transparent_34%,transparent_68%,rgba(34,211,238,0.05)_100%),linear-gradient(180deg,rgba(1,1,3,0.08)_0%,rgba(2,2,4,0.22)_26%,rgba(2,2,4,0.18)_64%,rgba(1,1,3,0.06)_100%)]" />
      <div className="cyber-scanline absolute inset-0 -z-10 opacity-35" />
      <div className="absolute -left-[16%] top-[10%] -z-10 h-[22rem] w-[30rem] bg-[radial-gradient(ellipse,rgba(255,23,68,0.12)_0%,rgba(255,23,68,0.05)_38%,transparent_74%)] blur-3xl sm:h-[28rem] sm:w-[38rem] lg:h-[34rem] lg:w-[46rem]" />
      <div className="absolute -right-[18%] top-[6%] -z-10 h-[22rem] w-[28rem] bg-[radial-gradient(ellipse,rgba(34,211,238,0.1)_0%,rgba(34,211,238,0.04)_40%,transparent_76%)] blur-3xl sm:h-[28rem] sm:w-[36rem] lg:h-[34rem] lg:w-[44rem]" />
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
