"use client";

import {
  ArrowRight,
  PackageCheck,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { CyberBadge, CyberButton, CyberCard, CyberCardContent, CyberProductCard } from "@/components/cyber";
import { useCart } from "@/components/Cart/CartProvider";
import { ProductTypeIcon } from "@/components/Products/ProductTypeIcon";
import { Section } from "@/components/Sections/Section";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import AnimatedText from "@/components/ui/animatedText";
import { toggleFavorite, useFavoriteIds } from "@/lib/favorites";
import { type Dictionary, type Locale, localizePath } from "@/lib/i18n";
import {
  formatProductOldPrice,
  formatProductPrice,
  getLocalizedProductName,
  type Product,
} from "@/lib/products";

export interface FeaturedDropsProps {
  locale: Locale;
  content: Dictionary["featured"];
  products: Product[];
}

function ProductVisual({ product }: { product: Product }) {
  if (product.primary_media?.file) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={product.primary_media.file}
        alt={product.primary_media.alt_text || product.name}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-full items-center justify-center">
      <div className="grid size-24 place-items-center border border-red-300/25 bg-black/45 text-red-100 shadow-[0_0_46px_rgba(255,23,68,0.18)] sm:size-28">
        <ProductTypeIcon
          deviceType={product.category.device_type}
          className="size-10 sm:size-12"
        />
      </div>
    </div>
  );
}

export function FeaturedDrops({ locale, content, products }: FeaturedDropsProps) {
  const { addItem, hasItem } = useCart();
  const favoriteIds = useFavoriteIds();
  const catalogHref = localizePath("/catalog", locale);
  const newArrivalsHref = `${catalogHref}?newArrival=1`;
  const laneRef = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const isHoverPausedRef = useRef(false);
  const autoDirectionRef = useRef(1);
  const [isDragging, setIsDragging] = useState(false);
  const [setRepeatFactor, setSetRepeatFactor] = useState(1);
  const repeatedProducts = useMemo(
    () => Array.from({ length: setRepeatFactor }, () => products).flat(),
    [products, setRepeatFactor],
  );
  const marqueeProducts = useMemo(
    () => [...repeatedProducts, ...repeatedProducts, ...repeatedProducts],
    [repeatedProducts],
  );
  const favoriteIdSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  useEffect(() => {
    const lane = laneRef.current;

    if (!lane || !products.length) {
      return;
    }

    const activeLane = lane;

    function ensureScrollableSetWidth() {
      const singleSetWidth = activeLane.scrollWidth / 3;

      if (!singleSetWidth) {
        return;
      }

      const minimumSetWidth = activeLane.clientWidth + 64;

      if (singleSetWidth > minimumSetWidth || setRepeatFactor >= 12) {
        return;
      }

      const requiredFactor = Math.ceil(minimumSetWidth / singleSetWidth) * setRepeatFactor;
      setSetRepeatFactor(Math.min(12, requiredFactor));
    }

    ensureScrollableSetWidth();

    const resizeObserver = new ResizeObserver(() => {
      ensureScrollableSetWidth();
    });

    resizeObserver.observe(activeLane);

    return () => {
      resizeObserver.disconnect();
    };
  }, [products, setRepeatFactor]);

  useEffect(() => {
    const lane = laneRef.current;

    if (!lane || !repeatedProducts.length) {
      return;
    }

    const activeLane = lane;

    const setWidth = activeLane.scrollWidth / 3;

    if (!setWidth || activeLane.scrollWidth <= activeLane.clientWidth) {
      return;
    }

    activeLane.scrollLeft = setWidth;

    const speed = 0.45;

    function normalizeScroll() {
      if (!setWidth) {
        return;
      }

      if (activeLane.scrollLeft <= 0) {
        activeLane.scrollLeft += setWidth;
      } else if (activeLane.scrollLeft >= setWidth * 2) {
        activeLane.scrollLeft -= setWidth;
      }
    }

    function tick() {
      if (!isDraggingRef.current && !isHoverPausedRef.current) {
        activeLane.scrollLeft += speed * autoDirectionRef.current;
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
  }, [repeatedProducts]);

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

    const target = event.target as HTMLElement | null;

    if (target?.closest("a, button, input, select, textarea, [role='button']")) {
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
      id="featured"
      fullWidth
      className="relative isolate overflow-hidden bg-transparent text-zinc-50"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(88%_52%_at_-12%_28%,rgba(34,211,238,0.1),transparent_62%),radial-gradient(92%_54%_at_114%_72%,rgba(255,23,68,0.1),transparent_64%),linear-gradient(126deg,rgba(34,211,238,0.04)_0%,transparent_38%,transparent_64%,rgba(255,23,68,0.04)_100%),linear-gradient(180deg,rgba(1,1,3,0.04)_0%,rgba(2,2,4,0.18)_22%,rgba(2,2,4,0.18)_78%,rgba(1,1,3,0.04)_100%)]" />
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
            className="font-display type-h2-display mt-6 text-white"
            config={{ duration: 0.32, delayStep: 16, distance: 24 }}
          />
          <AnimatedText
            as="p"
            text={content.subtitle}
            delay={340}
            className="font-tech type-body-lg mt-5 max-w-2xl text-zinc-400"
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
              <a href={newArrivalsHref}>{content.secondaryCta}</a>
            </CyberButton>
          </RevealOnScroll>
        </div>
      </div>

      {products.length ? (
        <div
          className="featured-marquee-shell mt-8 sm:mt-10"
          data-dragging={isDragging}
        >
          <div className="featured-marquee-mask">
            <div
              ref={laneRef}
              className="featured-marquee-lane"
              onPointerEnter={() => {
                isHoverPausedRef.current = true;
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={stopDragging}
              onPointerLeave={(event) => {
                isHoverPausedRef.current = false;
                if (pointerIdRef.current === event.pointerId) {
                  handlePointerUp(event);
                }
              }}
            >
              <div className="featured-marquee-track">
                {marqueeProducts.map((product, index) => {
                  const inPrimarySet =
                    index >= repeatedProducts.length &&
                    index < repeatedProducts.length * 2;
                  const defaultColorId = product.color_options[0]?.id ?? null;
                  const cardAlreadyInCart = hasItem(product.id, defaultColorId);

                  const badges = [];
                  if (product.is_new_arrival) {
                    badges.push({ label: content.badgeNew, variant: "cyan" as const });
                  }
                  if (product.is_best_seller) {
                    badges.push({ label: content.badgeHit, variant: "red" as const });
                  }
                  if (product.has_discount) {
                    badges.push({ label: `-${product.discount_percent}%`, variant: "warning" as const });
                  }

                  return (
                    <div
                      key={`${product.slug}-${index}`}
                      className="featured-marquee-slide"
                      aria-hidden={!inPrimarySet}
                    >
                      <CyberProductCard
                        radius="compact"
                        tone="featured"
                        liftOnHover
                        className="min-h-[26.5rem] hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(0,0,0,0.36)]"
                        image={<ProductVisual product={product} />}
                        title={getLocalizedProductName(product, locale)}
                        description={product.short_description}
                        price={formatProductPrice(product, locale)}
                        oldPrice={formatProductOldPrice(product, locale)}
                        badges={badges}
                        detailsLabel={content.detailsCta}
                        ctaLabel={cardAlreadyInCart ? content.alreadyInCart : content.productCta}
                        detailsHref={`${catalogHref}?product=${product.slug}`}
                        onCtaClick={() => addItem(product.id, 1, defaultColorId)}
                        ctaDisabled={product.quantity_in_stock <= 0 || cardAlreadyInCart}
                        ctaClassName={
                          cardAlreadyInCart
                            ? "border-cyan-300/60 bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(34,211,238,0.06))] text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.12)] hover:border-cyan-300/60 hover:bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(34,211,238,0.06))] hover:text-cyan-50 disabled:opacity-100"
                            : undefined
                        }
                        favoriteLabel={content.favoriteLabel}
                        favoriteActive={favoriteIdSet.has(product.id)}
                        onFavoriteClick={() => toggleFavorite(product.id)}
                        stackActions
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto mt-8 w-full max-w-7xl sm:mt-10">
          <CyberCard variant="glass" className="overflow-hidden border-cyan-300/15 bg-black/35">
            <CyberCardContent className="flex flex-col items-center justify-center gap-5 p-8 text-center sm:p-10">
              <div className="grid size-18 place-items-center rounded-full border border-cyan-300/20 bg-cyan-300/8 text-cyan-100 shadow-[0_0_34px_rgba(34,211,238,0.14)]">
                <PackageCheck className="size-8" />
              </div>
              <div className="space-y-3">
                <h3 className="font-display text-3xl tracking-[0.04em] text-white">
                  {content.loadingTitle}
                </h3>
                <p className="mx-auto max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                  {content.loadingSubtitle}
                </p>
              </div>
            </CyberCardContent>
          </CyberCard>
        </div>
      )}
    </Section>
  );
}
