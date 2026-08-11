"use client";

import * as React from "react";
import { Eye, Heart, Scale, ShoppingCart, Star } from "lucide-react";
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

const productDetailsButtonClassName =
  "product-details-button h-11 w-full px-0 !text-[10px] font-medium uppercase tracking-[0.04em] shadow-[0_8px_20px_rgba(0,0,0,0.24)] before:hidden hover:shadow-[0_10px_24px_rgba(0,0,0,0.32)] focus-visible:ring-zinc-500/40 [&_svg]:size-[18px]";

const productCtaButtonClassName =
  "h-11 w-full border-lime-300 bg-lime-300 px-0 !text-[10px] font-medium uppercase tracking-[0.04em] text-zinc-950 shadow-[0_0_24px_rgba(190,242,100,0.24)] hover:border-lime-200 hover:bg-lime-200 hover:text-zinc-950 hover:shadow-[0_0_34px_rgba(190,242,100,0.4)] focus-visible:ring-lime-300/45 [&_svg]:size-[18px]";

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
    const isFeaturedTone = tone === "featured";
    const isCatalogTone = tone === "catalog";

    return (
      <CyberCard
        ref={ref}
        data-radius={radius}
        variant="product"
        hover={liftOnHover}
        className={cn(
          "flex h-full min-h-[35rem] flex-col overflow-hidden border-white/10 shadow-[var(--product-card-shadow)] hover:border-white/16 hover:shadow-[var(--product-card-hover-shadow)]",
          "!rounded-none",
          className,
        )}
        {...props}
      >
        <CyberCardContent className="relative flex flex-1 flex-col gap-2.5 p-3 sm:gap-3 sm:p-3.5">
          <div
            className="relative aspect-[1/1] overflow-hidden rounded-none border border-white/10 bg-surface"
          >
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
                    "h-28 w-44 border bg-surface/40",
                    isFeaturedTone
                      ? "rounded-none border-white/12 shadow-[0_0_36px_rgba(255,23,68,0.12)]"
                      : isCatalogTone
                        ? "rounded-none border-white/12 shadow-[0_0_36px_rgba(0,0,0,0.28)]"
                        : "rounded-none border-red-200/25 shadow-[0_0_42px_rgba(248,113,113,0.22)]",
                  )}
                />
              </div>
            )}
            {badges.length > 0 ? (
              <div className="absolute left-2.5 top-2.5 z-20 flex max-w-[72%] flex-wrap gap-1">
                {badges.map((badge, index) => (
                  <CyberBadge
                    key={index}
                    variant={badge.variant ?? "red"}
                    glow
                    className="px-2 py-0.5 text-[10px] tracking-[0.12em]"
                  >
                    {badge.label}
                  </CyberBadge>
                ))}
              </div>
            ) : null}
            <CyberButton
              type="button"
              size="icon"
              variant={favoriteActive ? "danger" : "ghost"}
              onClick={onFavoriteClick}
              aria-pressed={favoriteActive}
              aria-label={favoriteLabel ?? labels.favorite}
              className={cn(
                "absolute right-2.5 top-2.5 z-20 size-10 border bg-zinc-950/75 p-0 backdrop-blur-md focus-visible:ring-red-300/30 [&_svg]:size-5",
                favoriteActive
                  ? "border-red-300/75 bg-red-500/25 text-red-100 shadow-[0_0_24px_rgba(248,113,113,0.22)]"
                  : "border-white/15 text-zinc-300 hover:border-red-300/65 hover:bg-red-500/18 hover:text-white",
              )}
            >
              <Heart className={cn("size-5", favoriteActive && "fill-current")} aria-hidden="true" />
            </CyberButton>
            {onCompareClick ? (
              <CyberButton
                type="button"
                size="icon"
                variant={compareActive ? "secondary" : "ghost"}
                onClick={onCompareClick}
                aria-pressed={compareActive}
                aria-label={compareLabel}
                data-active={compareActive}
                disabled={compareDisabled}
                className="product-compare-toggle absolute right-2.5 top-14 z-20 size-10 border p-0 backdrop-blur-md [&_svg]:size-5"
              >
                <Scale className="size-5" aria-hidden="true" />
              </CyberButton>
            ) : null}
            {hoverPanel ? (
              <div
                className={cn(
                  "pointer-events-none absolute inset-x-2.5 bottom-2.5 z-20 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 max-md:hidden",
                )}
              >
                <div className="rounded-none border border-white/16 bg-surface/88 p-2.5 shadow-[0_20px_40px_rgba(0,0,0,0.45)] backdrop-blur-md">
                  {hoverPanel}
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-1">
              <h3 className="font-tech min-h-[2.6rem] text-balance text-center text-base font-bold leading-5 tracking-[0.01em] text-white">
                {title}
              </h3>
              {description ? (
                <p className="font-tech line-clamp-2 min-h-10 text-center text-xs leading-5 text-zinc-400">
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
                "border-t border-white/10 px-0 pt-2.5",
                isFeaturedTone
                  ? "bg-transparent"
                  : "bg-transparent",
              )}
            >
              <div className="flex min-h-[2.8rem] items-end justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-tech type-caption uppercase tracking-[0.12em] text-zinc-500">
                    {labels.price}
                  </div>
                  <div
                    className={cn(
                      "font-tech text-xl font-bold leading-none sm:text-[1.375rem]",
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
                    <div className="font-tech mt-0.5 text-xs leading-4 text-zinc-500 line-through">
                      {oldPrice}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </CyberCardContent>
        <CyberCardFooter
          className={cn(
            "mt-auto grid grid-cols-1 gap-2 border-t border-white/8 bg-transparent px-3 pb-3 pt-2.5 sm:px-3.5 sm:pb-3.5",
            !stackActions && (isCatalogTone ? "2xl:grid-cols-2" : "sm:grid-cols-2"),
          )}
        >
          {detailsHref ? (
            <CyberButton
              asChild
              className={productDetailsButtonClassName}
              variant="primary"
            >
              <a href={detailsHref}>
                <span className="relative z-10 inline-flex items-center justify-center gap-1.5 px-3 py-0">
                  <Eye aria-hidden="true" />
                  {detailsLabel ?? labels.details}
                </span>
              </a>
            </CyberButton>
          ) : (
            <CyberButton
              className={productDetailsButtonClassName}
              variant="primary"
              onClick={onDetailsClick}
            >
              <Eye aria-hidden="true" />
              {detailsLabel ?? labels.details}
            </CyberButton>
          )}
          {ctaHref ? (
            <CyberButton
              asChild
              className={cn(
                productCtaButtonClassName,
                ctaClassName,
              )}
              variant="primary"
            >
              <a href={ctaHref}>
                <span className="relative z-10 inline-flex items-center justify-center gap-1.5 px-3 py-0">
                  <ShoppingCart aria-hidden="true" />
                  {ctaLabel ?? labels.cta}
                </span>
              </a>
            </CyberButton>
          ) : (
            <CyberButton
              className={cn(
                productCtaButtonClassName,
                ctaClassName,
              )}
              variant="primary"
              onClick={onCtaClick}
              disabled={ctaDisabled}
            >
              <ShoppingCart aria-hidden="true" />
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
