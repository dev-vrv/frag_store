"use client";

import {
  ArrowRight,
  Cpu,
  Gamepad2,
  Headphones,
  Keyboard,
  Mouse,
  PackageCheck,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { CyberBadge, CyberButton, CyberProductCard } from "@/components/cyber";
import { Section } from "@/components/Sections/Section";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import AnimatedText from "@/components/ui/animatedText";
import { type Dictionary, type Locale, localizePath } from "@/lib/i18n";

export interface FeaturedDropsProps {
  locale: Locale;
  content: Dictionary["featured"];
}

function ProductVisual({ category }: { category: Dictionary["featured"]["products"][number]["visual"] }) {
  const Icon =
    category === "mice"
      ? Mouse
      : category === "keyboards"
        ? Keyboard
        : category === "headsets"
          ? Headphones
          : category === "components"
            ? Cpu
            : category === "setups"
              ? PackageCheck
              : Gamepad2;

  return (
    <div className="flex h-full items-center justify-center">
      <div className="grid size-24 place-items-center border border-red-300/25 bg-black/45 text-red-100 shadow-[0_0_46px_rgba(255,23,68,0.18)] sm:size-28">
        <Icon className="size-10 sm:size-12" aria-hidden="true" />
      </div>
    </div>
  );
}

export function FeaturedDrops({ locale, content }: FeaturedDropsProps) {
  const catalogHref = localizePath("/catalog", locale);
  const blogHref = localizePath("/blog", locale);
  const laneRef = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const autoDirectionRef = useRef(1);
  const [isDragging, setIsDragging] = useState(false);
  const marqueeProducts = useMemo(
    () => [...content.products, ...content.products, ...content.products],
    [content.products],
  );

  useEffect(() => {
    const lane = laneRef.current;

    if (!lane) {
      return;
    }

    const setWidth = lane.scrollWidth / 3;

    if (!setWidth) {
      return;
    }

    lane.scrollLeft = setWidth;

    const speed = 0.45;

    function normalizeScroll() {
      if (!lane || !setWidth) {
        return;
      }

      if (lane.scrollLeft <= 0) {
        lane.scrollLeft += setWidth;
      } else if (lane.scrollLeft >= setWidth * 2) {
        lane.scrollLeft -= setWidth;
      }
    }

    function tick() {
      if (!isDraggingRef.current && !isHoveredRef.current) {
        lane.scrollLeft += speed * autoDirectionRef.current;
        normalizeScroll();
      }

      animationFrameRef.current = window.requestAnimationFrame(tick);
    }

    animationFrameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [content.products]);

  function normalizeAfterDrag() {
    const lane = laneRef.current;

    if (!lane) {
      return;
    }

    const setWidth = lane.scrollWidth / 3;

    if (!setWidth) {
      return;
    }

    if (lane.scrollLeft <= 0) {
      lane.scrollLeft += setWidth;
    } else if (lane.scrollLeft >= setWidth * 2) {
      lane.scrollLeft -= setWidth;
    }
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const lane = laneRef.current;

    if (!lane) {
      return;
    }

    pointerIdRef.current = event.pointerId;
    dragStartXRef.current = event.clientX;
    lastPointerXRef.current = event.clientX;
    dragStartScrollRef.current = lane.scrollLeft;
    isDraggingRef.current = true;
    setIsDragging(true);
    lane.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const lane = laneRef.current;

    if (!lane || !isDraggingRef.current) {
      return;
    }

    const deltaX = event.clientX - dragStartXRef.current;
    const stepDeltaX = event.clientX - lastPointerXRef.current;
    lane.scrollLeft = dragStartScrollRef.current - deltaX;
    if (stepDeltaX !== 0) {
      autoDirectionRef.current = stepDeltaX > 0 ? -1 : 1;
      lastPointerXRef.current = event.clientX;
    }
    normalizeAfterDrag();
  }

  function stopDragging() {
    isDraggingRef.current = false;
    setIsDragging(false);
    pointerIdRef.current = null;
    normalizeAfterDrag();
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const lane = laneRef.current;

    if (pointerIdRef.current !== event.pointerId) {
      return;
    }

    if (lane?.hasPointerCapture(event.pointerId)) {
      lane.releasePointerCapture(event.pointerId);
    }

    stopDragging();
  }

  return (
    <Section
      fullWidth
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#050507_0%,#0a0a0e_40%,#040405_100%)] text-zinc-50"
    >
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.12),transparent_26%),radial-gradient(circle_at_78%_16%,rgba(255,23,68,0.16),transparent_28%),radial-gradient(circle_at_48%_100%,rgba(217,70,239,0.1),transparent_28%)]" />
      <div className="cyber-grid absolute inset-0 -z-10 opacity-25" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/75 to-transparent" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 sm:gap-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <RevealOnScroll as="div" delay={80}>
            <CyberBadge variant="cyan" glow>
              {content.eyebrow}
            </CyberBadge>
          </RevealOnScroll>
          <AnimatedText
            as="h2"
            text={content.title}
            delay={180}
            className="font-display mt-6 text-[2rem] font-normal leading-[1.08] tracking-[0.02em] text-white sm:text-[2.6rem] lg:text-5xl"
            config={{ duration: 0.32, delayStep: 16, distance: 24 }}
          />
          <AnimatedText
            as="p"
            text={content.subtitle}
            delay={340}
            className="mt-5 max-w-2xl text-[0.95rem] leading-7 text-zinc-400 sm:text-base sm:leading-8 lg:text-lg"
            config={{ duration: 0.24, delayStep: 7, distance: 16 }}
          />
          <RevealOnScroll
            className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row"
            delay={520}
          >
            <CyberButton asChild variant="secondary" className="w-full sm:w-auto">
              <a href={catalogHref}>
                <ArrowRight />
                {content.primaryCta}
              </a>
            </CyberButton>
            <CyberButton asChild variant="ghost" className="w-full sm:w-auto">
              <a href={blogHref}>{content.secondaryCta}</a>
            </CyberButton>
          </RevealOnScroll>
        </div>
      </div>

      <div
        className="featured-marquee-shell mt-8 sm:mt-10"
        data-dragging={isDragging}
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
      >
        <div className="featured-marquee-mask">
          <div
            ref={laneRef}
            className="featured-marquee-lane"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={stopDragging}
            onPointerLeave={(event) => {
              if (pointerIdRef.current === event.pointerId) {
                handlePointerUp(event);
              }
            }}
          >
            <div className="featured-marquee-track">
              {marqueeProducts.map((product, index) => {
                const inPrimarySet =
                  index >= content.products.length &&
                  index < content.products.length * 2;

                return (
                  <div
                    key={`${product.name}-${index}`}
                    className="featured-marquee-slide"
                    aria-hidden={!inPrimarySet}
                  >
                    <CyberProductCard
                      image={<ProductVisual category={product.visual} />}
                      title={product.name}
                      description={product.description}
                      price={product.price}
                      oldPrice={product.oldPrice}
                      badges={product.badges}
                      detailsLabel={content.detailsCta}
                      ctaLabel={content.productCta}
                      detailsHref={catalogHref}
                      ctaHref={catalogHref}
                      favoriteLabel={content.favoriteLabel}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

    </Section>
  );
}
