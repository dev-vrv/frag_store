"use client";

import * as React from "react";
import { Heart, Star } from "lucide-react";
import { usePathname } from "next/navigation";

import { getLocaleFromPathname } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { CyberBadge, type CyberBadgeProps } from "./cyber-badge";
import { cyberButtonVariants } from "./cyber-button";
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
  },
  en: {
    cta: "Buy now",
    details: "Details",
    favorite: "Add to favorites",
  },
  kg: {
    cta: "Сатып алуу",
    details: "Кененирээк",
    favorite: "Тандалгандарга",
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
  favoriteActive?: boolean;
  ctaHref?: string;
  ctaDisabled?: boolean;
  detailsHref?: string;
  onCtaClick?: () => void;
  onDetailsClick?: () => void;
  onFavoriteClick?: () => void;
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
      favoriteActive = false,
      ctaHref,
      ctaDisabled,
      detailsHref,
      onCtaClick,
      onDetailsClick,
      onFavoriteClick,
      ...props
    },
    ref,
  ) => {
    const pathname = usePathname();
    const locale = getLocaleFromPathname(pathname);
    const labels = productCardLabels[locale];

    return (
      <CyberCard
        ref={ref}
        variant="product"
        hover
        className={cn(
          "flex h-full min-h-[35rem] flex-col overflow-hidden !rounded-[1.2rem] border-white/12 bg-[radial-gradient(circle_at_top_left,rgba(255,94,77,0.18),transparent_24%),radial-gradient(circle_at_top_right,rgba(251,146,60,0.12),transparent_22%),linear-gradient(180deg,rgba(18,10,11,0.98),rgba(9,7,8,0.99))] shadow-[0_22px_54px_rgba(0,0,0,0.36)]",
          className,
        )}
        {...props}
      >
        <CyberCardContent className="relative flex flex-1 flex-col gap-4 p-3.5 sm:gap-5 sm:p-4">
          <div className="relative aspect-[1/1] overflow-hidden rounded-[0.95rem] border border-white/10 bg-[radial-gradient(circle_at_18%_16%,rgba(255,94,77,0.28),transparent_26%),radial-gradient(circle_at_82%_12%,rgba(251,146,60,0.18),transparent_24%),linear-gradient(145deg,rgba(20,10,12,0.99),rgba(8,5,6,1))]">
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
                <div className="h-28 w-44 rounded-[0.9rem] border border-red-200/25 bg-black/40 shadow-[0_0_42px_rgba(248,113,113,0.22)]" />
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
          </div>

          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <h3 className="min-h-[3.3rem] text-balance font-display text-[1.2rem] font-normal leading-[1.02] tracking-[0.035em] text-white sm:min-h-[3.7rem] sm:text-[1.45rem]">
                {title}
              </h3>
              {description ? (
                <p className="line-clamp-3 min-h-[3.9rem] text-[13px] leading-6 text-zinc-400 sm:text-[14px]">
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

            <div className="rounded-[0.95rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-3.5 py-3">
              <div className="flex min-h-[4.25rem] items-end justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-tech text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                    {labels.cta}
                  </div>
                  <div className="font-display text-[1.9rem] font-normal leading-none text-amber-100 sm:text-[2.15rem]">
                    {price}
                  </div>
                </div>
                {oldPrice ? (
                  <div className="pb-0.5 text-right">
                    <div className="font-tech text-xs text-zinc-500 line-through sm:text-sm">{oldPrice}</div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </CyberCardContent>
        <CyberCardFooter className="mt-auto grid grid-cols-1 gap-2.5 border-t border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] px-3.5 pb-3.5 pt-3 sm:grid-cols-2 sm:px-4 sm:pb-4">
          {detailsHref ? (
            <a
              href={detailsHref}
              className={cn(
                cyberButtonVariants({ variant: "ghost", size: "md" }),
                "h-11 w-full border-white/14 bg-white/[0.02] text-zinc-200 hover:border-amber-200/35 hover:text-white",
              )}
            >
              <span className="relative z-10 inline-flex items-center justify-center gap-2 px-4 py-1">
                {detailsLabel ?? labels.details}
              </span>
            </a>
          ) : (
            <CyberButton
              className="h-11 w-full border-white/14 bg-white/[0.02] px-4 text-zinc-200 hover:border-amber-200/35 hover:text-white"
              variant="ghost"
              onClick={onDetailsClick}
            >
              {detailsLabel ?? labels.details}
            </CyberButton>
          )}
          {ctaHref ? (
            <a
              href={ctaHref}
              className={cn(
                cyberButtonVariants({ variant: "primary", size: "md" }),
                "h-11 w-full border-lime-300/75 bg-[linear-gradient(135deg,rgba(163,230,53,0.18),rgba(163,230,53,0.05))] text-lime-100 hover:bg-lime-300 hover:text-zinc-950",
              )}
            >
              <span className="relative z-10 inline-flex items-center justify-center gap-2 px-4 py-1">
                {ctaLabel ?? labels.cta}
              </span>
            </a>
          ) : (
            <CyberButton
              className="h-11 w-full border-lime-300/75 bg-[linear-gradient(135deg,rgba(163,230,53,0.18),rgba(163,230,53,0.05))] px-4 text-lime-100 hover:bg-lime-300 hover:text-zinc-950"
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
