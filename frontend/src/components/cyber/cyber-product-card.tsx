import * as React from "react";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { CyberBadge, type CyberBadgeProps } from "./cyber-badge";
import {
  CyberCard,
  CyberCardContent,
  CyberCardFooter,
} from "./cyber-card";
import { CyberButton } from "./cyber-button";

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
  onCtaClick?: () => void;
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
      ctaLabel = "Buy now",
      onCtaClick,
      ...props
    },
    ref,
  ) => (
    <CyberCard ref={ref} variant="product" hover className={cn("h-full", className)} {...props}>
      <CyberCardContent className="relative flex h-full flex-col gap-5 p-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(248,113,113,0.22),transparent_32%),linear-gradient(135deg,rgba(113,113,122,0.28),rgba(9,9,11,0.92))]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:22px_22px] opacity-40" />
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
            <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-2">
              {badges.map((badge, index) => (
                <CyberBadge key={index} variant={badge.variant ?? "cyan"} glow>
                  {badge.label}
                </CyberBadge>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
            {description ? (
              <p className="line-clamp-2 text-sm leading-6 text-zinc-400">
                {description}
              </p>
            ) : null}
          </div>
          {typeof rating === "number" ? (
            <div className="flex items-center gap-1.5 text-sm text-zinc-400">
              <Star className="size-4 fill-lime-300 text-lime-300" aria-hidden="true" />
              <span className="font-mono text-lime-100">{rating.toFixed(1)}</span>
              <span className="text-zinc-600">/ 5</span>
            </div>
          ) : null}
          <div className="mt-auto flex items-end justify-between gap-4">
            <div>
              <div className="font-mono text-2xl font-semibold text-red-100">{price}</div>
              {oldPrice ? (
                <div className="font-mono text-sm text-zinc-600 line-through">{oldPrice}</div>
              ) : null}
            </div>
          </div>
        </div>
      </CyberCardContent>
      <CyberCardFooter className="px-4 pb-4 pt-0">
        <CyberButton className="w-full" variant="primary" onClick={onCtaClick}>
          {ctaLabel}
        </CyberButton>
      </CyberCardFooter>
    </CyberCard>
  ),
);
CyberProductCard.displayName = "CyberProductCard";

export { CyberProductCard };
