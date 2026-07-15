"use client";

import * as React from "react";
import { Heart, Scale, Star } from "lucide-react";
import { usePathname } from "next/navigation";

import { getLocaleFromPathname } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { CyberBadge, type CyberBadgeProps } from "./cyber-badge";
import {
  CyberCard,
  CyberCardContent,
  CyberCardFooter,
} from "./cyber-card";
import { CyberButton } from "./cyber-button";

const productCardLabels = {
  ru: {
    cta: "Купить",
    details: "Подробнее",
    favorite: "В избранное",
    price: "Цена",
    oldPrice: "Было",
  },
  en: {
    cta: "Buy now",
    details: "Details",
    favorite: "Add to favorites",
    price: "Price",
    oldPrice: "Was",
  },
  kg: {
    cta: "Сатып алуу",
    details: "Кененирээк",
    favorite: "Тандалгандарга",
    price: "Баасы",
    oldPrice: "Мурун",
  },
} as const;

export interface CyberProductBadge {
  label: React.ReactNode;
  variant?: CyberBadgeProps["variant"];
}

export interface CyberProductCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  image?: React.ReactNode | string;
  title: React.ReactNode;
  description?: React.ReactNode;
  price: React.ReactNode;
  oldPrice?: React.ReactNode;
  badges?: CyberProductBadge[];
  rating?: number;
  ctaLabel?: React.ReactNode;
  detailsLabel?: React.ReactNode;
  favoriteLabel?: string;
  compareLabel?: string;
  favoriteActive?: boolean;
  compareActive?: boolean;
  ctaHref?: string;
  ctaDisabled?: boolean;
  ctaClassName?: string;
  detailsHref?: string;
  compareDisabled?: boolean;
  onCtaClick?: () => void;
  onDetailsClick?: () => void;
  onFavoriteClick?: () => void;
  onCompareClick?: () => void;
  hoverPanel?: React.ReactNode;
  radius?: "default" | "compact";
  tone?: "default" | "featured" | "catalog";
  liftOnHover?: boolean;
  stackActions?: boolean;
}

const CyberProductCard = React.forwardRef<HTMLDivElement, CyberProductCardProps>(
  (
    {
      className,
      image,
      title,
      description,
      price,
      oldPrice,
      badges = [],
      rating,
      ctaLabel,
      detailsLabel,
      favoriteLabel,
      compareLabel,
      favoriteActive = false,
      compareActive = false,
      ctaHref,
      ctaDisabled,
      ctaClassName,
      detailsHref,
      compareDisabled = false,
      onCtaClick,
      onDetailsClick,
      onFavoriteClick,
      onCompareClick,
      hoverPanel,
      radius = "default",
      tone = "default",
      liftOnHover = true,
      stackActions = false,
      ...props
    },
    ref,
  ) => {
    const pathname = usePathname();
    const locale = getLocaleFromPathname(pathname);
    const labels = productCardLabels[locale];
    const isCompactRadius = radius === "compact";
    const isFeaturedTone = tone === "featured";
    const isCatalogTone = tone === "catalog";

    return (
      <CyberCard
        ref={ref}
        variant="product"
        hover={liftOnHover}
        className={cn(
          "flex h-full min-h-[35rem] flex-col overflow-hidden border-white/12 shadow-[0_22px_54px_rgba(0,0,0,0.36)]",
          isFeaturedTone
            ? "border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,23,68,0.12),transparent_22%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_20%),linear-gradient(180deg,rgba(8,8,10,0.985),rgba(4,5,7,0.995))] hover:border-red-300/18 hover:shadow-[0_18px_44px_rgba(0,0,0,0.34)]"
            : isCatalogTone
              ? "border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,23,68,0.08),transparent_22%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.06),transparent_20%),linear-gradient(180deg,rgba(10,10,12,0.99),rgba(5,5,7,1))] hover:border-white/16 hover:shadow-[0_18px_44px_rgba(0,0,0,0.32)]"
              : "bg-[radial-gradient(circle_at_top_left,rgba(255,94,77,0.18),transparent_24%),radial-gradient(circle_at_top_right,rgba(251,146,60,0.12),transparent_22%),linear-gradient(180deg,rgba(18,10,11,0.98),rgba(9,7,8,0.99))]",
          isCompactRadius ? "!rounded-md" : "!rounded-md",
          className,
        )}
        {...props}
      >
        <CyberCardContent className="relative flex flex-1 flex-col gap-3 p-3.5 sm:gap-4 sm:p-4">
          <div
            className={cn(
              "relative aspect-[1/1] overflow-hidden border border-white/10",
              isFeaturedTone
                ? "bg-[radial-gradient(circle_at_18%_16%,rgba(255,23,68,0.16),transparent_24%),radial-gradient(circle_at_82%_12%,rgba(34,211,238,0.1),transparent_22%),linear-gradient(145deg,rgba(10,11,14,0.995),rgba(5,6,8,1))]"
                : isCatalogTone
                  ? "bg-[radial-gradient(circle_at_18%_16%,rgba(255,23,68,0.12),transparent_24%),radial-gradient(circle_at_82%_12%,rgba(168,85,247,0.08),transparent_22%),linear-gradient(145deg,rgba(12,12,16,0.995),rgba(6,6,9,1))]"
                  : "bg-[radial-gradient(circle_at_18%_16%,rgba(255,94,77,0.28),transparent_26%),radial-gradient(circle_at_82%_12%,rgba(251,146,60,0.18),transparent_24%),linear-gradient(145deg,rgba(20,10,12,0.99),rgba(8,5,6,1))]",
              isCompactRadius ? "rounded-md" : "rounded-md",
            )}
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:24px_24px] opacity-35" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.54))]" />
            <div className="absolute inset-y-0 left-0 w-20 bg-[linear-gradient(90deg,rgba(255,255,255,0.06),transparent)] opacity-40" />
            {typeof image === "string" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt=""
                className="relative z-10 h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
              />
            ) : image ? (
              <div className="relative z-10 h-full w-full">{image}</div>
            ) : (
              <div className="relative z-10 flex h-full items-center justify-center">
                <div
                  className={cn(
                    "h-28 w-44 border bg-black/40",
                    isFeaturedTone
                      ? "rounded-md border-white/12 shadow-[0_0_36px_rgba(255,23,68,0.12)]"
                      : isCatalogTone
                        ? "rounded-md border-white/12 shadow-[0_0_36px_rgba(0,0,0,0.28)]"
                        : "rounded-md border-red-200/25 shadow-[0_0_42px_rgba(248,113,113,0.22)]",
                  )}
                />
              </div>
            )}
            {badges.length > 0 ? (
              <div className="absolute left-3 top-3 z-20 flex max-w-[72%] flex-wrap gap-1.5">
                {badges.map((badge, index) => (
                  <CyberBadge
                    key={index}
                    variant={badge.variant ?? "red"}
                    glow
                    className="px-2.5 py-1 text-[10px] tracking-[0.14em]"
                  >
                    {badge.label}
                  </CyberBadge>
                ))}
              </div>
            ) : null}
            <button
              type="button"
              onClick={onFavoriteClick}
              aria-pressed={favoriteActive}
              aria-label={favoriteLabel ?? labels.favorite}
              className={cn(
                "absolute right-3 top-3 z-20 grid size-10 place-items-center rounded-full border backdrop-blur-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/30",
                favoriteActive
                  ? "border-red-300/55 bg-red-500/18 text-red-100 shadow-[0_0_24px_rgba(255,94,77,0.16)]"
                  : "border-white/12 bg-black/55 text-zinc-200 hover:border-red-300/55 hover:bg-red-500/12 hover:text-red-100",
              )}
            >
              <Heart className={cn("size-4", favoriteActive && "fill-current")} aria-hidden="true" />
            </button>
            {onCompareClick ? (
              <button
                type="button"
                onClick={onCompareClick}
                aria-pressed={compareActive}
                aria-label={compareLabel}
                disabled={compareDisabled}
                className={cn(
                  "absolute right-3 top-14 z-20 grid size-10 place-items-center rounded-full border backdrop-blur-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-45",
                  compareActive
                    ? "border-cyan-300/55 bg-cyan-400/16 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.16)]"
                    : "border-white/12 bg-black/55 text-zinc-200 hover:border-cyan-300/45 hover:bg-cyan-400/10 hover:text-cyan-50",
                )}
              >
                <Scale className="size-4" aria-hidden="true" />
              </button>
            ) : null}
            {hoverPanel ? (
              <div
                className={cn(
                  "pointer-events-none absolute inset-x-3 bottom-3 z-20 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 max-md:hidden",
                )}
              >
                <div className="rounded-md border border-white/16 bg-black/88 px-3 py-3 shadow-[0_20px_40px_rgba(0,0,0,0.45)] backdrop-blur-md">
                  {hoverPanel}
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-1 flex-col gap-2.5">
            <div className="flex flex-col gap-1.5">
              <h3 className="font-tech type-h4 min-h-[2.9rem] text-balance tracking-[0.01em] text-white sm:min-h-[3.2rem]">
                {title}
              </h3>
              {description ? (
                <p className="font-tech type-body-sm line-clamp-3 min-h-[3rem] text-zinc-400 sm:min-h-[3.2rem]">
                  {description}
                </p>
              ) : null}
            </div>

            {typeof rating === "number" ? (
              <div className="inline-flex w-max items-center gap-1.5 rounded-full border border-lime-300/14 bg-lime-300/[0.07] px-2.5 py-1 text-xs text-zinc-300">
                <Star className="size-4 fill-lime-300 text-lime-300" aria-hidden="true" />
                <span className="font-tech text-lime-100">{rating.toFixed(1)}</span>
                <span className="text-zinc-600">/ 5</span>
              </div>
            ) : null}

            <div
              className={cn(
                "border-t border-white/10 px-0 pt-3",
                isFeaturedTone
                  ? "bg-transparent"
                  : "bg-transparent",
              )}
            >
              <div className="flex min-h-[3.2rem] items-end justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="font-tech type-caption uppercase tracking-[0.12em] text-zinc-500">
                    {labels.price}
                  </div>
                  <div
                    className={cn(
                      "font-tech type-price",
                      isFeaturedTone || isCatalogTone ? "text-white" : "text-amber-100",
                    )}
                  >
                    {price}
                  </div>
                </div>
                {oldPrice ? (
                  <div className="pb-0.5 text-right">
                    <div className="font-tech type-caption uppercase tracking-[0.12em] text-zinc-500">
                      {labels.oldPrice}
                    </div>
                    <div className="font-tech type-body-sm mt-1 text-zinc-500 line-through">{oldPrice}</div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </CyberCardContent>
        <CyberCardFooter
          className={cn(
            "mt-auto grid grid-cols-1 gap-2.5 border-t border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4",
            !stackActions && (isCatalogTone ? "2xl:grid-cols-2" : "sm:grid-cols-2"),
          )}
        >
          {detailsHref ? (
            <CyberButton
              asChild
              className={cn(
                isFeaturedTone
                  ? "h-11 w-full border-white/12 bg-white/[0.03] text-zinc-200 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                  : "h-11 w-full border-white/14 bg-white/[0.02] text-zinc-200 hover:border-amber-200/35 hover:text-white",
              )}
              variant="ghost"
            >
              <a href={detailsHref}>
                <span className="relative z-10 inline-flex items-center justify-center gap-2 px-4 py-1">
                  {detailsLabel ?? labels.details}
                </span>
              </a>
            </CyberButton>
          ) : (
            <CyberButton
              className={cn(
                "h-11 w-full px-4",
                isFeaturedTone
                  ? "border-white/12 bg-white/[0.03] text-zinc-200 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                  : "border-white/14 bg-white/[0.02] text-zinc-200 hover:border-amber-200/35 hover:text-white",
              )}
              variant="ghost"
              onClick={onDetailsClick}
            >
              {detailsLabel ?? labels.details}
            </CyberButton>
          )}
          {ctaHref ? (
            <CyberButton
              asChild
              className={cn(
                isFeaturedTone
                  ? "h-11 w-full border-lime-300/70 bg-[linear-gradient(135deg,rgba(163,230,53,0.18),rgba(163,230,53,0.05))] text-lime-100 hover:border-lime-200/80 hover:bg-lime-300 hover:text-zinc-950"
                  : "h-11 w-full border-lime-300/75 bg-[linear-gradient(135deg,rgba(163,230,53,0.18),rgba(163,230,53,0.05))] text-lime-100 hover:bg-lime-300 hover:text-zinc-950",
                ctaClassName,
              )}
              variant="primary"
            >
              <a href={ctaHref}>
                <span className="relative z-10 inline-flex items-center justify-center gap-2 px-4 py-1">
                  {ctaLabel ?? labels.cta}
                </span>
              </a>
            </CyberButton>
          ) : (
            <CyberButton
              className={cn(
                "h-11 w-full px-4",
                isFeaturedTone
                  ? "border-lime-300/70 bg-[linear-gradient(135deg,rgba(163,230,53,0.18),rgba(163,230,53,0.05))] text-lime-100 hover:border-lime-200/80 hover:bg-lime-300 hover:text-zinc-950"
                  : "border-lime-300/75 bg-[linear-gradient(135deg,rgba(163,230,53,0.18),rgba(163,230,53,0.05))] text-lime-100 hover:bg-lime-300 hover:text-zinc-950",
                ctaClassName,
              )}
              variant="primary"
              onClick={onCtaClick}
              disabled={ctaDisabled}
            >
              {ctaLabel ?? labels.cta}
            </CyberButton>
          )}
        </CyberCardFooter>
      </CyberCard>
    );
  },
);
CyberProductCard.displayName = "CyberProductCard";

export { CyberProductCard };
