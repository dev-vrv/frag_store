"use client";

import { ChevronLeft, ChevronRight, Heart, PackageCheck } from "lucide-react";

import {
  CyberButton,
  CyberDialog,
  CyberDialogContent,
  CyberDialogDescription,
  CyberDialogHeader,
  CyberDialogTitle,
} from "@/components/cyber";
import { type Locale } from "@/lib/i18n";
import {
  formatProductOldPrice,
  formatProductPrice,
  getLocalizedCategoryName,
  getLocalizedProductName,
  getProductTechnicalSpecs,
  type Product,
  type ProductMedia,
} from "@/lib/products";
import { cn } from "@/lib/utils";

export interface ProductDetailsDialogLabels {
  detailsLead: string;
  specsLabel: string;
  highlightsLabel: string;
  colorLabel: string;
  close: string;
  brandLabel: string;
  categoryLabel: string;
  sku: string;
  availabilityLabel: string;
  inStock: string;
  outOfStock: string;
  favorite?: string;
  removeFavorite?: string;
}

interface ProductDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: Locale;
  product: Product | null;
  labels: ProductDetailsDialogLabels;
  selectedColorId: number | null;
  onSelectColor: (colorId: number) => void;
  selectedMediaIndex: number;
  onSelectMediaIndex: (nextIndex: number) => void;
  actionLabel: string;
  actionDisabled?: boolean;
  actionVariant?: "primary" | "outline" | "ghost" | "danger" | "secondary" | "neon";
  actionClassName?: string;
  onAction: () => void;
  actionNotice?: string | null;
  loadingText?: string;
  errorText?: string;
  favoriteActive?: boolean;
  onToggleFavorite?: () => void;
}

function getProductMediaSource(media: ProductMedia | null | undefined) {
  return media?.file || media?.external_url || null;
}

function isVideoMedia(media: ProductMedia | null | undefined) {
  return media?.media_type === "video";
}

function getProductMediaGalleryItems(product: Product) {
  if (product.media_items?.length) {
    return product.media_items.filter((item) => Boolean(getProductMediaSource(item)));
  }

  if (product.primary_media && getProductMediaSource(product.primary_media)) {
    return [product.primary_media];
  }

  return [];
}

function ProductVisual({ product }: { product: Product }) {
  const media = getProductMediaGalleryItems(product)[0];
  const source = getProductMediaSource(media);

  if (source && media) {
    if (isVideoMedia(media)) {
      return (
        <video
          src={source}
          className="h-full w-full object-contain"
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
        />
      );
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={source}
        alt={media.alt_text || product.name}
        className="h-full w-full object-contain"
      />
    );
  }

  return (
    <div className="flex h-full items-center justify-center">
      <div className="grid size-28 place-items-center border border-red-300/25 bg-surface/45 text-red-100 shadow-[0_0_46px_rgba(255,23,68,0.18)]">
        <PackageCheck className="size-10" />
      </div>
    </div>
  );
}

function ProductColorPicker({
  product,
  selectedColorId,
  onSelect,
  label,
}: {
  product: Product;
  selectedColorId: number | null;
  onSelect: (colorId: number) => void;
  label: string;
}) {
  if (!product.color_options.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      <p className="font-tech text-[11px] uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {product.color_options.map((option) => {
          const selected = option.id === selectedColorId;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              aria-pressed={selected}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 border px-3 py-2 text-sm text-zinc-200 transition",
                selected
                  ? "border-lime-300/55 bg-lime-300/12 text-lime-50 shadow-[0_0_26px_rgba(190,242,100,0.12)]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]",
              )}
            >
              <span
                className="size-4 rounded-full border border-white/20"
                style={{ backgroundColor: option.hex_code || "#ffffff" }}
                aria-hidden="true"
              />
              <span>{option.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProductMediaGallery({
  product,
  activeIndex,
  onChange,
}: {
  product: Product;
  activeIndex: number;
  onChange: (nextIndex: number) => void;
}) {
  const mediaItems = getProductMediaGalleryItems(product);
  const safeIndex = mediaItems.length ? Math.min(activeIndex, mediaItems.length - 1) : 0;
  const activeMedia = mediaItems[safeIndex];
  const source = getProductMediaSource(activeMedia);

  return (
    <div className="relative flex h-full flex-col">
      <div className="relative flex-1 overflow-hidden rounded-md bg-transparent p-3">
        <div className="block h-full w-full overflow-hidden rounded-md">
          {source && activeMedia ? (
            isVideoMedia(activeMedia) ? (
              <video
                key={source}
                src={source}
                className="h-full w-full rounded-md object-contain"
                controls
                playsInline
                preload="metadata"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={source}
                alt={activeMedia.alt_text || product.name}
                className="h-full w-full rounded-md object-contain"
              />
            )
          ) : (
            <ProductVisual product={product} />
          )}
        </div>

        {mediaItems.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => onChange((safeIndex - 1 + mediaItems.length) % mediaItems.length)}
              className="absolute left-4 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/16 bg-surface/55 text-white backdrop-blur-md transition hover:border-white/30 hover:bg-surface/70"
              aria-label="Previous media"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onChange((safeIndex + 1) % mediaItems.length)}
              className="absolute right-4 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/16 bg-surface/55 text-white backdrop-blur-md transition hover:border-white/30 hover:bg-surface/70"
              aria-label="Next media"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>

      {mediaItems.length > 1 ? (
        <div className="grid grid-cols-4 gap-2 border-t border-white/10 bg-transparent p-3 sm:grid-cols-5">
          {mediaItems.map((item, index) => {
            const itemSource = getProductMediaSource(item);
            const selected = index === safeIndex;

            return (
              <button
                key={`${item.id}-${index}`}
                type="button"
                onClick={() => onChange(index)}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-md border bg-transparent transition",
                  selected
                    ? "border-cyan-200/45 shadow-[0_0_24px_rgba(34,211,238,0.16)]"
                    : "border-white/10 hover:border-white/24",
                )}
              >
                {itemSource ? (
                  isVideoMedia(item) ? (
                    <video
                      src={itemSource}
                      className="h-full w-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={itemSource}
                      alt={item.alt_text || product.name}
                      className="h-full w-full object-cover"
                    />
                  )
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function ProductDetailsDialog({
  open,
  onOpenChange,
  locale,
  product,
  labels,
  selectedColorId,
  onSelectColor,
  selectedMediaIndex,
  onSelectMediaIndex,
  actionLabel,
  actionDisabled = false,
  actionVariant = "primary",
  actionClassName,
  onAction,
  actionNotice,
  loadingText,
  errorText,
  favoriteActive = false,
  onToggleFavorite,
}: ProductDetailsDialogProps) {
  const title = product ? getLocalizedProductName(product, locale) : labels.detailsLead;
  const technicalSpecs = product ? getProductTechnicalSpecs(product, locale) : [];

  return (
    <CyberDialog open={open} onOpenChange={onOpenChange}>
      <CyberDialogContent className="flex h-[94svh] max-h-[94svh] flex-col overflow-hidden border-white/12 bg-[radial-gradient(circle_at_top_left,rgba(255,23,68,0.12),transparent_22%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.05),transparent_18%),linear-gradient(180deg,rgba(var(--theme-surface-rgb),0.985),rgba(var(--theme-surface-rgb),0.995))] p-0 sm:max-w-6xl 2xl:max-w-[90rem]">
        <CyberDialogHeader className="shrink-0 border-b border-white/10 px-6 pb-5 pt-6 sm:px-8">
          <CyberDialogDescription className="font-tech type-label text-cyan-200/70">
            {labels.detailsLead}
          </CyberDialogDescription>
          <CyberDialogTitle className="font-display type-h2 pr-10 text-white">
            {title}
          </CyberDialogTitle>
        </CyberDialogHeader>

        {!product ? (
          <div className="flex min-h-0 flex-1 items-center justify-center p-10 text-center text-zinc-400">
            {errorText || loadingText || labels.detailsLead}
          </div>
        ) : (
          <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto]">
            <div className="grid min-h-0 gap-0 lg:grid-cols-[minmax(0,1.22fr)_minmax(360px,0.88fr)]">
              <div className="relative min-h-[24rem] border-b border-white/10 bg-[radial-gradient(circle_at_24%_18%,rgba(255,23,68,0.18),transparent_30%),radial-gradient(circle_at_78%_16%,rgba(251,191,36,0.10),transparent_26%),linear-gradient(145deg,rgba(var(--theme-surface-rgb),0.99),rgba(var(--theme-surface-rgb),1))] lg:min-h-[42rem] lg:border-b-0 lg:border-r">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--theme-contrast-rgb),0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--theme-contrast-rgb),0.03)_1px,transparent_1px)] bg-[size:28px_28px] opacity-30" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,23,68,0.12),transparent_54%)]" />
                <div className="relative z-10 h-full p-4 sm:p-6">
                  <div className="h-full overflow-hidden rounded-md border border-cyan-200/14 bg-transparent shadow-[0_0_46px_rgba(34,211,238,0.10)]">
                    <ProductMediaGallery
                      product={product}
                      activeIndex={selectedMediaIndex}
                      onChange={onSelectMediaIndex}
                    />
                  </div>
                </div>
              </div>

              <div className="flex min-h-0 flex-col">
                <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
                  <div className="flex flex-col gap-6">
                    {(labels.favorite || labels.removeFavorite) && onToggleFavorite ? (
                      <div className="flex flex-wrap items-center justify-end gap-3">
                        <CyberButton
                          variant={favoriteActive ? "danger" : "ghost"}
                          size="sm"
                          onClick={onToggleFavorite}
                          className="min-w-[13rem]"
                        >
                          <Heart className={cn("size-4", favoriteActive && "fill-current")} aria-hidden="true" />
                          {favoriteActive ? labels.removeFavorite : labels.favorite}
                        </CyberButton>
                      </div>
                    ) : null}

                    <div className="space-y-3">
                      <div className="font-tech type-price-lg text-lime-100">
                        {formatProductPrice(product, locale)}
                      </div>
                      {product.old_price ? (
                        <div className="font-tech type-body text-zinc-500 line-through">
                          {formatProductOldPrice(product, locale)}
                        </div>
                      ) : null}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="border border-white/10 bg-white/[0.03] px-4 py-3">
                        <p className="font-tech type-caption uppercase tracking-[0.12em] text-zinc-500">{labels.brandLabel}</p>
                        <p className="font-tech type-body mt-2 text-zinc-100">{product.brand.name}</p>
                      </div>
                      <div className="border border-white/10 bg-white/[0.03] px-4 py-3">
                        <p className="font-tech type-caption uppercase tracking-[0.12em] text-zinc-500">{labels.categoryLabel}</p>
                        <p className="font-tech type-body mt-2 text-zinc-100">{getLocalizedCategoryName(product.category, locale)}</p>
                      </div>
                      <div className="border border-white/10 bg-white/[0.03] px-4 py-3">
                        <p className="font-tech type-caption uppercase tracking-[0.12em] text-zinc-500">{labels.sku}</p>
                        <p className="font-tech type-body mt-2 text-zinc-100">{product.sku}</p>
                      </div>
                      <div className="border border-white/10 bg-white/[0.03] px-4 py-3">
                        <p className="font-tech type-caption uppercase tracking-[0.12em] text-zinc-500">{labels.availabilityLabel}</p>
                        <p className="font-tech type-body mt-2 text-zinc-100">
                          {product.quantity_in_stock > 0 ? labels.inStock : labels.outOfStock}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="font-tech type-caption uppercase tracking-[0.12em] text-zinc-500">{labels.detailsLead}</p>
                      <p className="font-tech type-body text-zinc-300">
                        {product.description?.trim() || product.short_description}
                      </p>
                    </div>

                    <ProductColorPicker
                      product={product}
                      selectedColorId={selectedColorId}
                      onSelect={onSelectColor}
                      label={labels.colorLabel}
                    />

                    {technicalSpecs.length ? (
                      <div className="space-y-3">
                        <p className="font-tech type-caption uppercase tracking-[0.12em] text-zinc-500">{labels.specsLabel}</p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {technicalSpecs.map((spec) => (
                            <div key={spec.key} className="border border-white/10 bg-white/[0.03] px-4 py-3">
                              <p className="font-tech type-caption uppercase tracking-[0.12em] text-zinc-500">{spec.label}</p>
                              <p className="font-tech type-body mt-2 text-zinc-100">{spec.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {product.features?.length ? (
                      <div className="space-y-3">
                        <p className="font-tech type-caption uppercase tracking-[0.12em] text-zinc-500">{labels.highlightsLabel}</p>
                        <div className="grid gap-3">
                          {product.features.map((feature) => (
                            <div key={feature.id} className="border border-white/10 bg-white/[0.03] px-4 py-3">
                              <p className="font-tech type-body text-zinc-100">{feature.title}</p>
                              {feature.description ? (
                                <p className="font-tech type-body-sm mt-2 text-zinc-400">{feature.description}</p>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(var(--theme-surface-rgb),0.76),rgba(var(--theme-surface-rgb),0.94))] px-6 py-4 backdrop-blur-xl sm:px-8">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <CyberButton variant="ghost" onClick={() => onOpenChange(false)}>
                      {labels.close}
                    </CyberButton>
                    <CyberButton
                      variant={actionVariant}
                      onClick={onAction}
                      className={actionClassName}
                      disabled={actionDisabled}
                    >
                      {actionLabel}
                    </CyberButton>
                  </div>
                  {actionNotice ? (
                    <div className="mt-3 border border-lime-300/18 bg-lime-300/[0.08] px-4 py-3 text-center text-sm text-lime-100 shadow-[0_0_24px_rgba(190,242,100,0.12)]">
                      {actionNotice}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}
      </CyberDialogContent>
    </CyberDialog>
  );
}
