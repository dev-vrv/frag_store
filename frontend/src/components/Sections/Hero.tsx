"use client";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { CyberBadge, CyberButton } from "@/components/cyber";
import { Section } from "@/components/Sections/Section";
import { type Dictionary, type Locale, localizePath } from "@/lib/i18n";
import {
  getLocalizedCategoryDescription,
  getLocalizedCategoryName,
  type ProductCategory,
} from "@/lib/products";
import { cn } from "@/lib/utils";

export interface HeroProps {
  locale: Locale;
  content: Dictionary["hero"];
  categories: ProductCategory[];
}

interface HeroSlide {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  accentClassName: string;
  imagePositionClassName?: string;
}

const heroImageByCategory: Record<
  string,
  { image: string; accentClassName: string; imagePositionClassName?: string }
> = {
  keyboards: {
    image: "/images/hero/keybord.webp?v=20260715-1057",
    accentClassName: "from-fuchsia-400/70 via-cyan-300/35 to-transparent",
    imagePositionClassName: "object-center",
  },
  mice: {
    image: "/images/hero/mouse.webp?v=20260715-1050",
    accentClassName: "from-cyan-300/75 via-sky-300/38 to-transparent",
    imagePositionClassName: "object-center",
  },
  headsets: {
    image: "/images/hero/headset.jpg?v=20260715-1050",
    accentClassName: "from-red-400/72 via-cyan-300/34 to-transparent",
    imagePositionClassName: "object-center",
  },
  accessories: {
    image: "/images/hero/chaer.jpg?v=20260715-1050",
    accentClassName: "from-lime-300/70 via-cyan-300/34 to-transparent",
    imagePositionClassName: "object-center",
  },
};

export function Hero({ locale, content, categories }: HeroProps) {
  const slides = useMemo<HeroSlide[]>(() => {
    const prioritySlugs = ["keyboards", "mice", "headsets", "accessories"];
    const mapped = prioritySlugs.flatMap((slug): HeroSlide[] => {
        const category = categories.find((item) => item.slug === slug);
        const visual = heroImageByCategory[slug];

        if (!category || !visual) {
          return [];
        }

        return [{
          slug,
          title: getLocalizedCategoryName(category, locale),
          subtitle: getLocalizedCategoryDescription(category, locale),
          image: visual.image,
          accentClassName: visual.accentClassName,
          imagePositionClassName: visual.imagePositionClassName,
        }];
      });

    return mapped.length ? mapped : [];
  }, [categories, locale]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4600);

    return () => window.clearTimeout(timeoutId);
  }, [activeIndex, slides.length]);

  const resolvedActiveIndex = slides.length ? activeIndex % slides.length : 0;
  const activeSlide = slides[resolvedActiveIndex] ?? null;

  if (!activeSlide) {
    return null;
  }

  return (
    <Section
      fullWidth
      className="relative isolate overflow-hidden bg-transparent text-zinc-50"
      containerClassName="section-hero relative"
    >
      <style jsx>{`
        @keyframes hero-slide-drift {
          0% {
            transform: scale(1.04) translate3d(0, 0, 0);
          }
          50% {
            transform: scale(1.08) translate3d(18px, -10px, 0);
          }
          100% {
            transform: scale(1.05) translate3d(-12px, 14px, 0);
          }
        }
      `}</style>
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(8,10,18,0.12)_0%,rgba(8,10,18,0.08)_100%)]" />
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.slug}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              index === resolvedActiveIndex ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.image}
              alt={slide.title}
              className={cn(
                "absolute inset-0 h-full w-full object-cover",
                slide.imagePositionClassName ?? "object-center",
                index === resolvedActiveIndex && "animate-[hero-slide-drift_14s_ease-in-out_infinite_alternate]",
              )}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,10,18,0.68)_0%,rgba(7,10,18,0.42)_24%,rgba(7,10,18,0.18)_46%,rgba(7,10,18,0.12)_100%)]" />
          </div>
        ))}
      </div>
      <div
        className={cn(
          "absolute left-[-8%] top-[10%] -z-10 h-[28rem] w-[28rem] rounded-full bg-gradient-to-r blur-3xl",
          activeSlide.accentClassName,
        )}
      />
      <div className="absolute inset-y-0 left-0 -z-10 w-[56%] bg-[linear-gradient(90deg,rgba(7,10,18,0.18)_0%,transparent_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/85 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

      <div className="mx-auto grid w-full max-w-[90rem] items-end gap-6 lg:grid-cols-[minmax(0,1.05fr)_20rem] lg:gap-8">
        <div className="flex min-h-[22rem] max-w-3xl flex-col justify-end sm:min-h-[24rem] lg:min-h-[27rem]">
          <CyberBadge variant="cyan" glow>
            {content.eyebrow}
          </CyberBadge>

          <h1 className="font-display type-display mt-4 min-h-[4rem] uppercase text-white sm:min-h-[6.8rem] lg:min-h-[9rem]">
            {activeSlide.title}
          </h1>

          <p className="font-tech type-body-lg mt-3 min-h-[4.5rem] max-w-2xl text-zinc-100 sm:min-h-[5rem] lg:min-h-[5.5rem]">
            {activeSlide.subtitle}
          </p>

          <p className="font-tech type-body-sm mt-3 min-h-[2.5rem] max-w-xl text-zinc-200/88 sm:min-h-[3rem]">
            {content.microcopy}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <CyberButton asChild size="lg" variant="primary" className="w-full sm:w-auto">
              <a href={`${localizePath("/catalog", locale)}?category=${activeSlide.slug}`}>
                {content.primaryCta}
              </a>
            </CyberButton>
          </div>
        </div>

        <div className="justify-self-end self-end rounded-md border border-white/12 bg-[#0f121a]/58 p-3.5 backdrop-blur-md lg:w-[20rem]">
          <div className="flex items-center justify-between gap-3">
            <span className="font-tech type-ui uppercase tracking-[0.12em] text-zinc-200">
              {resolvedActiveIndex + 1}/{slides.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveIndex((current) => (current - 1 + slides.length) % slides.length)}
                className="grid size-11 place-items-center border border-white/12 bg-white/5 text-zinc-100 transition hover:border-cyan-300/34 hover:bg-white/10"
                aria-label="Previous hero slide"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setActiveIndex((current) => (current + 1) % slides.length)}
                className="grid size-11 place-items-center border border-white/12 bg-white/5 text-zinc-100 transition hover:border-cyan-300/34 hover:bg-white/10"
                aria-label="Next hero slide"
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-3 flex min-h-[6.5rem] flex-wrap content-start gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.slug}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "font-tech type-caption rounded-full border px-3 py-1.5 uppercase tracking-[0.12em] transition",
                  index === resolvedActiveIndex
                    ? "border-cyan-300/40 bg-cyan-300/12 text-white"
                    : "border-white/12 bg-white/[0.04] text-zinc-300 hover:border-white/22 hover:text-white",
                )}
              >
                {slide.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <a
        href="#featured"
        aria-label={content.scroll}
        className="hero-scroll-link absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:flex"
      >
        <span className="hero-scroll-link__pulse">
          <span className="font-tech type-caption uppercase tracking-[0.12em] text-white">
            {content.scroll}
          </span>
          <span className="hero-scroll-link__icon">
            <ChevronDown className="size-4 text-white" />
          </span>
        </span>
      </a>
    </Section>
  );
}
