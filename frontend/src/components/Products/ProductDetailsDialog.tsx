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
  actionVariant?:
    "primary" | "outline" | "ghost" | "danger" | "secondary" | "neon";
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
    return product.media_items.filter((item) =>
      Boolean(getProductMediaSource(item)),
    );
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
      <div className="product-detail-placeholder grid size-28 place-items-center border">
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
      <p className="product-detail-muted font-tech text-[11px] uppercase tracking-[0.14em]">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {product.color_options.map((option) => {
          const selected = option.id === selectedColorId;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              aria-pressed={selected}
              data-active={selected}
              className="product-detail-color-option inline-flex min-h-11 items-center gap-2 border px-3 py-2 text-sm transition"
            >
              <span
                className="product-detail-color-swatch size-4 rounded-full border"
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
  const safeIndex = mediaItems.length
    ? Math.min(activeIndex, mediaItems.length - 1)
    : 0;
  const activeMedia = mediaItems[safeIndex];
  const source = getProductMediaSource(activeMedia);

  return (
    <div className="relative flex h-full flex-col">
      <div className="relative flex-1 overflow-hidden p-3">
        <div className="block h-full w-full overflow-hidden">
          {source && activeMedia ? (
            isVideoMedia(activeMedia) ? (
              <video
                key={source}
                src={source}
                className="h-full w-full object-contain"
                controls
                playsInline
                preload="metadata"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={source}
                alt={activeMedia.alt_text || product.name}
                className="h-full w-full object-contain"
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
              onClick={() =>
                onChange(
                  (safeIndex - 1 + mediaItems.length) % mediaItems.length,
                )
              }
              className="product-detail-control absolute left-4 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center border transition"
              aria-label="Previous media"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onChange((safeIndex + 1) % mediaItems.length)}
              className="product-detail-control absolute right-4 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center border transition"
              aria-label="Next media"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>

      {mediaItems.length > 1 ? (
        <div className="product-detail-divider grid grid-cols-4 gap-2 border-t p-3 sm:grid-cols-5">
          {mediaItems.map((item, index) => {
            const itemSource = getProductMediaSource(item);
            const selected = index === safeIndex;

            return (
              <button
                key={`${item.id}-${index}`}
                type="button"
                onClick={() => onChange(index)}
                data-active={selected}
                aria-label={`${index + 1} / ${mediaItems.length}`}
                aria-pressed={selected}
                className="product-detail-thumbnail relative aspect-square overflow-hidden border transition"
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
  const title = product
    ? getLocalizedProductName(product, locale)
    : labels.detailsLead;
  const technicalSpecs = product
    ? getProductTechnicalSpecs(product, locale)
    : [];

  return (
    <CyberDialog open={open} onOpenChange={onOpenChange}>
      <CyberDialogContent className="product-detail-ui product-detail-dialog-shell flex h-[94svh] max-h-[94svh] flex-col gap-0 overflow-visible border-0 bg-transparent p-0 shadow-none before:hidden sm:max-w-6xl 2xl:max-w-[90rem]">
        <div className="product-detail-panel flex min-h-0 flex-1 flex-col">
          <div className="product-detail-panel__content flex min-h-0 flex-1 flex-col">
            <CyberDialogHeader className="product-detail-divider shrink-0 border-b px-6 pb-5 pt-6 sm:px-8">
              <CyberDialogDescription className="product-detail-muted font-tech type-label">
                {labels.detailsLead}
              </CyberDialogDescription>
              <CyberDialogTitle className="product-detail-heading font-display type-h2 pr-10">
                {title}
              </CyberDialogTitle>
            </CyberDialogHeader>

            {!product ? (
              <div className="product-detail-muted flex min-h-0 flex-1 items-center justify-center p-10 text-center">
                {errorText || loadingText || labels.detailsLead}
              </div>
            ) : (
              <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto]">
                <div className="grid min-h-0 gap-0 lg:grid-cols-[minmax(0,1.22fr)_minmax(360px,0.88fr)]">
                  <div className="product-detail-gallery-pane product-detail-divider relative min-h-[24rem] border-b lg:min-h-[42rem] lg:border-b-0 lg:border-r">
                    <div className="relative h-full p-4 sm:p-6">
                      <div className="product-detail-gallery-frame h-full overflow-hidden border">
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
                        {(labels.favorite || labels.removeFavorite) &&
                        onToggleFavorite ? (
                          <div className="flex flex-wrap items-center justify-end gap-3">
                            <CyberButton
                              variant="ghost"
                              size="sm"
                              onClick={onToggleFavorite}
                              data-active={favoriteActive}
                              className="product-detail-button min-w-[13rem]"
                            >
                              <Heart
                                className={cn(
                                  "size-4",
                                  favoriteActive && "fill-current",
                                )}
                                aria-hidden="true"
                              />
                              {favoriteActive
                                ? labels.removeFavorite
                                : labels.favorite}
                            </CyberButton>
                          </div>
                        ) : null}

                        <div className="space-y-3">
                          <div className="product-detail-price font-tech type-price-lg">
                            {formatProductPrice(product, locale)}
                          </div>
                          {product.old_price ? (
                            <div className="product-detail-muted font-tech type-body line-through">
                              {formatProductOldPrice(product, locale)}
                            </div>
                          ) : null}
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="product-detail-card border px-4 py-3">
                            <p className="product-detail-muted font-tech type-caption uppercase tracking-[0.12em]">
                              {labels.brandLabel}
                            </p>
                            <p className="product-detail-heading font-tech type-body mt-2">
                              {product.brand.name}
                            </p>
                          </div>
                          <div className="product-detail-card border px-4 py-3">
                            <p className="product-detail-muted font-tech type-caption uppercase tracking-[0.12em]">
                              {labels.categoryLabel}
                            </p>
                            <p className="product-detail-heading font-tech type-body mt-2">
                              {getLocalizedCategoryName(
                                product.category,
                                locale,
                              )}
                            </p>
                          </div>
                          <div className="product-detail-card border px-4 py-3">
                            <p className="product-detail-muted font-tech type-caption uppercase tracking-[0.12em]">
                              {labels.sku}
                            </p>
                            <p className="product-detail-heading font-tech type-body mt-2">
                              {product.sku}
                            </p>
                          </div>
                          <div className="product-detail-card border px-4 py-3">
                            <p className="product-detail-muted font-tech type-caption uppercase tracking-[0.12em]">
                              {labels.availabilityLabel}
                            </p>
                            <p className="product-detail-heading font-tech type-body mt-2">
                              {product.quantity_in_stock > 0
                                ? labels.inStock
                                : labels.outOfStock}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <p className="product-detail-muted font-tech type-caption uppercase tracking-[0.12em]">
                            {labels.detailsLead}
                          </p>
                          <p className="product-detail-copy font-tech type-body">
                            {product.description?.trim() ||
                              product.short_description}
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
                            <p className="product-detail-muted font-tech type-caption uppercase tracking-[0.12em]">
                              {labels.specsLabel}
                            </p>
                            <div className="grid gap-3 sm:grid-cols-2">
                              {technicalSpecs.map((spec) => (
                                <div
                                  key={spec.key}
                                  className="product-detail-card border px-4 py-3"
                                >
                                  <p className="product-detail-muted font-tech type-caption uppercase tracking-[0.12em]">
                                    {spec.label}
                                  </p>
                                  <p className="product-detail-heading font-tech type-body mt-2">
                                    {spec.value}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {product.features?.length ? (
                          <div className="space-y-3">
                            <p className="product-detail-muted font-tech type-caption uppercase tracking-[0.12em]">
                              {labels.highlightsLabel}
                            </p>
                            <div className="grid gap-3">
                              {product.features.map((feature) => (
                                <div
                                  key={feature.id}
                                  className="product-detail-card border px-4 py-3"
                                >
                                  <p className="product-detail-heading font-tech type-body">
                                    {feature.title}
                                  </p>
                                  {feature.description ? (
                                    <p className="product-detail-muted font-tech type-body-sm mt-2">
                                      {feature.description}
                                    </p>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="product-detail-footer product-detail-divider border-t px-6 py-4 sm:px-8">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <CyberButton
                          variant="ghost"
                          onClick={() => onOpenChange(false)}
                          className="product-detail-button"
                        >
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
                        <div className="product-detail-notice mt-3 border px-4 py-3 text-center text-sm">
                          {actionNotice}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CyberDialogContent>
    </CyberDialog>
  );
}
