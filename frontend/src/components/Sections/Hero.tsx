"use client";
import {
  Armchair,
  ChevronDown,
  Headphones,
  Keyboard,
  MousePointer2,
  type LucideIcon,
} from "lucide-react";
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
  icon: LucideIcon;
  accentClassName: string;
  imagePositionClassName?: string;
}

const heroImageByCategory: Record<
  string,
  {
    image: string;
    icon: LucideIcon;
    accentClassName: string;
    imagePositionClassName?: string;
  }
> = {
  keyboards: {
    image: "/images/hero/keybord.webp?v=20260715-1057",
    icon: Keyboard,
    accentClassName: "from-fuchsia-400/70 via-cyan-300/35 to-transparent",
    imagePositionClassName: "object-center",
  },
  mice: {
    image: "/images/hero/mouse.webp?v=20260715-1050",
    icon: MousePointer2,
    accentClassName: "from-cyan-300/75 via-sky-300/38 to-transparent",
    imagePositionClassName: "object-center",
  },
  headsets: {
    image: "/images/hero/headset.jpg?v=20260715-1050",
    icon: Headphones,
    accentClassName: "from-red-400/72 via-cyan-300/34 to-transparent",
    imagePositionClassName: "object-center",
  },
  "gaming-chairs": {
    image: "/images/hero/chaer.jpg?v=20260715-1050",
    icon: Armchair,
    accentClassName: "from-lime-300/70 via-cyan-300/34 to-transparent",
    imagePositionClassName: "object-center",
  },
};

export function Hero({ locale, content, categories }: HeroProps) {
  const slides = useMemo<HeroSlide[]>(() => {
    const prioritySlugs = ["keyboards", "mice", "headsets", "gaming-chairs"];
    const mapped = prioritySlugs.flatMap((slug): HeroSlide[] => {
      const category = categories.find((item) => item.slug === slug);
      const visual = heroImageByCategory[slug];

      if (!category || !visual) {
        return [];
      }

      return [
        {
          slug,
          title: getLocalizedCategoryName(category, locale),
          subtitle: getLocalizedCategoryDescription(category, locale),
          image: visual.image,
          icon: visual.icon,
          accentClassName: visual.accentClassName,
          imagePositionClassName: visual.imagePositionClassName,
        },
      ];
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
      className="theme-dark relative isolate overflow-hidden bg-transparent text-zinc-50"
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

        @keyframes hero-tab-progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .hero-category-tab__progress {
          animation: hero-tab-progress 4.6s linear forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-category-tab__progress {
            width: 100%;
            animation: none;
          }
        }
      `}</style>
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(var(--theme-surface-rgb),0.12)_0%,rgba(var(--theme-surface-rgb),0.08)_100%)]" />
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
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(var(--theme-surface-rgb),0.68)_0%,rgba(var(--theme-surface-rgb),0.42)_24%,rgba(var(--theme-surface-rgb),0.18)_46%,rgba(var(--theme-surface-rgb),0.12)_100%)]" />
          </div>
        ))}
      </div>
      <div
        className={cn(
          "absolute left-[-8%] top-[10%] -z-10 h-[28rem] w-[28rem] rounded-full bg-gradient-to-r blur-3xl",
          activeSlide.accentClassName,
        )}
      />
      <div className="absolute inset-y-0 left-0 -z-10 w-[56%] bg-[linear-gradient(90deg,rgba(var(--theme-surface-rgb),0.18)_0%,transparent_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/85 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

      <div className="mx-auto grid w-full max-w-[90rem] items-end gap-6 lg:grid-cols-[minmax(0,1.05fr)_22rem] lg:gap-8">
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

        <div className="relative self-end justify-self-stretch overflow-hidden border border-white/12 bg-[rgba(var(--theme-surface-rgb),1)]/72 p-2 shadow-[0_24px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl lg:w-[22rem] lg:justify-self-end">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent" />
          <div className="flex items-end justify-between gap-4 px-3 pb-3 pt-2">
            <div className="min-w-0">
              <p className="font-tech text-[0.65rem] uppercase tracking-[0.2em] text-cyan-200/80">
                {content.panelEyebrow}
              </p>
              <p className="mt-1 truncate font-display text-lg uppercase tracking-[0.06em] text-white">
                {content.panelTitle}
              </p>
            </div>
            <span className="font-tech shrink-0 text-xs tracking-[0.16em] text-zinc-400">
              {String(resolvedActiveIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
          </div>

          <nav
            aria-label={content.panelTitle}
            className="grid grid-cols-2 gap-1 lg:grid-cols-1"
          >
            {slides.map((slide, index) => {
              const Icon = slide.icon;
              const isActive = index === resolvedActiveIndex;

              return (
                <button
                  key={slide.slug}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={isActive}
                  className={cn(
                    "group relative flex min-h-[4.25rem] items-center gap-3 overflow-hidden border px-3 py-2.5 text-left outline-none transition duration-300 focus-visible:ring-2 focus-visible:ring-cyan-200/50 focus-visible:ring-inset",
                    isActive
                      ? "border-cyan-200/34 bg-[linear-gradient(100deg,rgba(34,211,238,0.17),rgba(var(--theme-contrast-rgb),0.055)_55%,rgba(var(--theme-contrast-rgb),0.025))] shadow-[inset_3px_0_0_rgba(103,232,249,0.9),0_10px_30px_rgba(8,145,178,0.08)]"
                      : "border-transparent bg-white/[0.025] hover:border-white/12 hover:bg-white/[0.065]",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center border transition duration-300",
                      isActive
                        ? "border-cyan-200/36 bg-cyan-200/10 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.14)]"
                        : "border-white/10 bg-surface/20 text-zinc-400 group-hover:border-white/20 group-hover:text-zinc-100",
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="font-tech block text-[0.62rem] tracking-[0.18em] text-zinc-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-display mt-0.5 block text-[0.78rem] uppercase leading-4 tracking-[0.05em] transition sm:text-sm",
                        isActive ? "text-white" : "text-zinc-300 group-hover:text-white",
                      )}
                    >
                      {slide.title}
                    </span>
                  </span>

                  <span
                    aria-hidden="true"
                    className={cn(
                      "hidden size-1.5 shrink-0 rounded-full transition sm:block",
                      isActive
                        ? "bg-cyan-200 shadow-[0_0_12px_rgba(103,232,249,0.9)]"
                        : "bg-zinc-700 group-hover:bg-zinc-500",
                    )}
                  />

                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="hero-category-tab__progress absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-cyan-300 via-white to-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.72)]"
                    />
                  ) : null}
                </button>
              );
            })}
          </nav>
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
