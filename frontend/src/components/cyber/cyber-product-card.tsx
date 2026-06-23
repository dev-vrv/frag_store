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
  ctaHref?: string;
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
      ctaHref,
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
        className={cn("flex h-full flex-col", className)}
        {...props}
      >
        <CyberCardContent className="relative flex flex-1 flex-col gap-4 p-3 sm:gap-5 sm:p-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-cyan-200/12 bg-[radial-gradient(circle_at_24%_18%,rgba(34,211,238,0.20),transparent_30%),radial-gradient(circle_at_78%_16%,rgba(244,63,94,0.16),transparent_26%),linear-gradient(145deg,rgba(8,15,28,0.92),rgba(3,6,14,0.98))]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.07)_1px,transparent_1px)] bg-[size:22px_22px] opacity-40" />
            {typeof image === "string" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt=""
                className="relative z-10 h-full w-full object-cover"
              />
            ) : image ? (
              <div className="relative z-10 h-full w-full">{image}</div>
            ) : (
              <div className="relative z-10 flex h-full items-center justify-center">
                <div className="h-24 w-40 rounded-[1rem] border border-red-200/25 bg-black/40 shadow-[0_0_42px_rgba(248,113,113,0.22)]" />
              </div>
            )}
            {badges.length > 0 ? (
              <div className="absolute left-2.5 top-2.5 z-20 flex flex-wrap gap-1.5 sm:left-3 sm:top-3 sm:gap-2">
                {badges.map((badge, index) => (
                  <CyberBadge key={index} variant={badge.variant ?? "cyan"} glow>
                    {badge.label}
                  </CyberBadge>
                ))}
              </div>
            ) : null}
            <button
              type="button"
              onClick={onFavoriteClick}
              aria-label={favoriteLabel ?? labels.favorite}
              className="absolute right-2.5 top-2.5 z-20 grid size-9 place-items-center border border-white/15 bg-black/55 text-zinc-200 backdrop-blur transition hover:border-red-300/55 hover:bg-red-500/12 hover:text-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/30 sm:right-3 sm:top-3 sm:size-10"
            >
              <Heart className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex flex-1 flex-col gap-2">
              <h3 className="min-h-[3.2rem] text-balance font-display text-[1.2rem] font-normal leading-tight tracking-[0.03em] text-white sm:min-h-[3.6rem] sm:text-[1.45rem]">
                {title}
              </h3>
              {description ? (
                <p className="line-clamp-2 min-h-12 text-sm leading-6 text-zinc-400">
                  {description}
                </p>
              ) : null}
            </div>
            {typeof rating === "number" ? (
              <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                <Star className="size-4 fill-lime-300 text-lime-300" aria-hidden="true" />
                <span className="font-tech text-lime-100">{rating.toFixed(1)}</span>
                <span className="text-zinc-600">/ 5</span>
              </div>
            ) : null}
            <div className="flex min-h-[3.5rem] items-end justify-between gap-4">
              <div>
                <div className="font-display text-[1.7rem] font-normal text-lime-100 sm:text-3xl">{price}</div>
                {oldPrice ? (
                  <div className="font-tech text-sm text-zinc-600 line-through sm:text-base">{oldPrice}</div>
                ) : null}
              </div>
            </div>
          </div>
        </CyberCardContent>
        <CyberCardFooter className="mt-auto grid grid-cols-2 gap-2 px-3 pb-3 pt-0 sm:gap-3 sm:px-4 sm:pb-4">
          {detailsHref ? (
            <a
              href={detailsHref}
              className={cn(cyberButtonVariants({ variant: "ghost" }), "w-full")}
            >
              <span className="relative z-10 inline-flex items-center gap-2 px-3 py-1">
                {detailsLabel ?? labels.details}
              </span>
            </a>
          ) : (
            <CyberButton className="w-full px-4" variant="ghost" onClick={onDetailsClick}>
              {detailsLabel ?? labels.details}
            </CyberButton>
          )}
          {ctaHref ? (
            <a
              href={ctaHref}
              className={cn(cyberButtonVariants({ variant: "primary" }), "w-full")}
            >
              <span className="relative z-10 inline-flex items-center gap-2 px-3 py-1">
                {ctaLabel ?? labels.cta}
              </span>
            </a>
          ) : (
            <CyberButton className="w-full px-4" variant="primary" onClick={onCtaClick}>
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
