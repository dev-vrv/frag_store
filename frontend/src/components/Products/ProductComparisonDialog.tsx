"use client";

import { useState } from "react";
import { PackageCheck, Scale, X } from "lucide-react";
import type { IconType } from "react-icons";
import {
  FiActivity,
  FiBox,
  FiCpu,
  FiCreditCard,
  FiGrid,
  FiHash,
  FiHeadphones,
  FiLayers,
  FiMonitor,
  FiSettings,
  FiSliders,
  FiTag,
  FiZap,
} from "react-icons/fi";

import {
  CyberBadge,
  CyberButton,
  CyberDialog,
  CyberDialogContent,
  CyberDialogDescription,
  CyberDialogHeader,
  CyberDialogTitle,
} from "@/components/cyber";
import { type Locale } from "@/lib/i18n";
import {
  formatProductPrice,
  getLocalizedCategoryName,
  getLocalizedProductName,
  getProductTechnicalSpecs,
  type Product,
  type ProductMedia,
} from "@/lib/products";
import { cn } from "@/lib/utils";

export interface ProductComparisonDialogLabels {
  badge: string;
  title: string;
  subtitle: string;
  close: string;
  clear: string;
  openProduct: string;
  removeProduct: string;
  differencesOnly: string;
  productsSelected: string;
  pickMore: string;
  categoryLabel: string;
  brandLabel: string;
  availabilityLabel: string;
  priceLabel: string;
  skuLabel: string;
  highlightsLabel: string;
  specsLabel: string;
  inStock: string;
  outOfStock: string;
  emptyValue: string;
  parameterLabel: string;
}

interface ProductComparisonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: Locale;
  products: Product[];
  labels: ProductComparisonDialogLabels;
  onOpenProduct: (product: Product) => void;
  onRemoveProduct: (productId: number) => void;
  onClear: () => void;
}

interface ComparisonRow {
  key: string;
  label: string;
  values: string[];
  different: boolean;
  icon: IconType;
}

function getComparisonRowIcon(key: string): IconType {
  if (key === "brand") {
    return FiTag;
  }

  if (key === "category") {
    return FiGrid;
  }

  if (key === "availability") {
    return FiBox;
  }

  if (key === "price") {
    return FiCreditCard;
  }

  if (key === "sku") {
    return FiHash;
  }

  if (key.startsWith("technical:connectivity")) {
    return FiZap;
  }

  if (key.startsWith("technical:compatibility") || key.startsWith("technical:form_factor")) {
    return FiLayers;
  }

  if (
    key.startsWith("technical:sensor_model") ||
    key.startsWith("technical:dpi") ||
    key.startsWith("technical:polling_rate_hz") ||
    key.startsWith("technical:response_time_ms")
  ) {
    return FiCpu;
  }

  if (
    key.startsWith("technical:switch_type") ||
    key.startsWith("technical:programmable_buttons") ||
    key.startsWith("technical:keyboard_layout") ||
    key.startsWith("technical:key_count") ||
    key.startsWith("technical:switch_profile") ||
    key.startsWith("technical:hot_swap")
  ) {
    return FiSliders;
  }

  if (
    key.startsWith("technical:driver_size_mm") ||
    key.startsWith("technical:microphone") ||
    key.startsWith("technical:surround_sound") ||
    key.startsWith("technical:frequency_response") ||
    key.startsWith("technical:impedance_ohm") ||
    key.startsWith("technical:sensitivity_db")
  ) {
    return FiHeadphones;
  }

  if (
    key.startsWith("technical:panel_type") ||
    key.startsWith("technical:resolution") ||
    key.startsWith("technical:refresh_rate_hz") ||
    key.startsWith("technical:brightness_nits") ||
    key.startsWith("technical:contrast_ratio")
  ) {
    return FiMonitor;
  }

  if (
    key.startsWith("technical:software_support") ||
    key.startsWith("technical:backlight") ||
    key.startsWith("technical:battery_life_hours") ||
    key.startsWith("technical:cable_length_m")
  ) {
    return FiActivity;
  }

  if (key.startsWith("technical:") || key.startsWith("spec:")) {
    return FiSettings;
  }

  return FiSettings;
}

function getProductMediaSource(media: ProductMedia | null | undefined) {
  return media?.file || media?.external_url || null;
}

function getComparisonRows(products: Product[], locale: Locale, labels: ProductComparisonDialogLabels) {
  const baseRows: ComparisonRow[] = [
    {
      key: "brand",
      label: labels.brandLabel,
      values: products.map((product) => product.brand.name || labels.emptyValue),
      different: false,
      icon: getComparisonRowIcon("brand"),
    },
    {
      key: "category",
      label: labels.categoryLabel,
      values: products.map((product) => getLocalizedCategoryName(product.category, locale) || labels.emptyValue),
      different: false,
      icon: getComparisonRowIcon("category"),
    },
    {
      key: "availability",
      label: labels.availabilityLabel,
      values: products.map((product) => (product.quantity_in_stock > 0 ? labels.inStock : labels.outOfStock)),
      different: false,
      icon: getComparisonRowIcon("availability"),
    },
    {
      key: "price",
      label: labels.priceLabel,
      values: products.map((product) => formatProductPrice(product, locale)),
      different: false,
      icon: getComparisonRowIcon("price"),
    },
    {
      key: "sku",
      label: labels.skuLabel,
      values: products.map((product) => product.sku || labels.emptyValue),
      different: false,
      icon: getComparisonRowIcon("sku"),
    },
  ];

  const specsByKey = new Map<
    string,
    {
      label: string;
      values: string[];
    }
  >();

  products.forEach((product, productIndex) => {
    getProductTechnicalSpecs(product, locale).forEach((spec) => {
      const current = specsByKey.get(spec.key) ?? {
        label: spec.label,
        values: Array.from({ length: products.length }, () => labels.emptyValue),
      };
      current.values[productIndex] = spec.value || labels.emptyValue;
      specsByKey.set(spec.key, current);
    });
  });

  const specRows = [...specsByKey.entries()]
    .map(([key, value]) => ({
      key,
      label: value.label,
      values: value.values,
      different: false,
      icon: getComparisonRowIcon(key),
    }))
    .sort((left, right) => left.label.localeCompare(right.label, locale === "en" ? "en" : "ru"));

  return [...baseRows, ...specRows].map((row) => {
    const normalizedValues = row.values.map((value) => value.trim().toLowerCase());
    const firstValue = normalizedValues[0] ?? "";
    const different = normalizedValues.some((value) => value !== firstValue);

    return {
      ...row,
      different,
    };
  });
}

function ProductPreview({ product }: { product: Product }) {
  const source = getProductMediaSource(product.primary_media);

  if (source) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={source}
        alt={product.primary_media?.alt_text || product.name}
        className="h-full w-full object-contain"
      />
    );
  }

  return (
    <div className="flex h-full items-center justify-center">
      <div className="grid size-20 place-items-center rounded-md border border-white/12 bg-black/35 text-cyan-100">
        <PackageCheck className="size-8" aria-hidden="true" />
      </div>
    </div>
  );
}

export function ProductComparisonDialog({
  open,
  onOpenChange,
  locale,
  products,
  labels,
  onOpenProduct,
  onRemoveProduct,
  onClear,
}: ProductComparisonDialogProps) {
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);
  const hasCompactPreview = products.length <= 2;
  const comparisonRows = getComparisonRows(products, locale, labels);
  const visibleRows = showDifferencesOnly
    ? comparisonRows.filter((row) => row.different)
    : comparisonRows;

  return (
    <CyberDialog open={open} onOpenChange={onOpenChange}>
      <CyberDialogContent className="flex h-[94svh] max-h-[94svh] w-[calc(100vw-1rem)] max-w-[96rem] flex-col overflow-hidden border-white/12 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_24%),radial-gradient(circle_at_top_right,rgba(255,23,68,0.10),transparent_20%),linear-gradient(180deg,rgba(8,9,12,0.99),rgba(3,4,6,1))] p-0">
        <CyberDialogHeader className="shrink-0 border-b border-white/10 px-5 pb-5 pt-5 sm:px-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <CyberDialogDescription className="font-tech text-[11px] uppercase tracking-[0.16em] text-cyan-200/70">
                {labels.badge}
              </CyberDialogDescription>
              <div className="space-y-2">
                <CyberDialogTitle className="pr-10 font-display text-2xl uppercase tracking-[0.04em] text-white sm:text-3xl">
                  {labels.title}
                </CyberDialogTitle>
                <p className="max-w-3xl text-sm leading-6 text-zinc-300 sm:text-[15px] sm:leading-7">
                  {labels.subtitle}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pr-10 lg:justify-end lg:pr-14">
              <CyberBadge variant="cyan" glow className="min-h-10 px-4">
                <Scale className="mr-2 size-4" aria-hidden="true" />
                {products.length} {labels.productsSelected}
              </CyberBadge>
              <CyberButton
                variant={showDifferencesOnly ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setShowDifferencesOnly((current) => !current)}
              >
                {labels.differencesOnly}
              </CyberButton>
              <CyberButton variant="ghost" size="sm" onClick={onClear} disabled={!products.length}>
                {labels.clear}
              </CyberButton>
            </div>
          </div>
        </CyberDialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-6 px-5 py-5 sm:px-7 sm:py-6">
            <div className={cn("overflow-x-auto", hasCompactPreview && "overflow-x-visible")}>
              <div
                className={cn(
                  hasCompactPreview ? "flex flex-wrap items-start gap-4" : "grid gap-4",
                  hasCompactPreview
                    ? products.length === 1
                      ? "max-w-[28rem]"
                      : ""
                    : "min-w-[52rem]",
                )}
                style={
                  hasCompactPreview
                    ? undefined
                    : { gridTemplateColumns: `repeat(${Math.max(products.length, 1)}, minmax(0, 1fr))` }
                }
              >
                {products.map((product) => (
                  <section
                    key={product.id}
                    className={cn(
                      "flex h-full flex-col overflow-hidden rounded-md border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]",
                      hasCompactPreview && "w-full max-w-[28rem] shrink-0 self-start",
                    )}
                  >
                    <div
                      className={cn(
                        "relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_24%_18%,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_80%_14%,rgba(255,23,68,0.1),transparent_24%),linear-gradient(145deg,rgba(10,11,15,0.995),rgba(5,6,8,1))] p-4",
                        hasCompactPreview ? "aspect-[1.45/0.62]" : "aspect-[1.1/0.82]",
                      )}
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] opacity-25" />
                      <div
                        className={cn(
                          "relative z-10 h-full",
                          hasCompactPreview && "max-w-[15.5rem]",
                        )}
                      >
                        <ProductPreview product={product} />
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-4 p-4">
                      <div className="space-y-2">
                        <p className="font-tech text-[11px] uppercase tracking-[0.14em] text-cyan-200/70">
                          {getLocalizedCategoryName(product.category, locale)}
                        </p>
                        <h3 className="font-display text-2xl leading-tight text-white">
                          {getLocalizedProductName(product, locale)}
                        </h3>
                        <p className="text-sm leading-6 text-zinc-400">{product.short_description}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="font-display text-3xl text-lime-100">
                          {formatProductPrice(product, locale)}
                        </div>
                        <div className="font-tech text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                          {product.quantity_in_stock > 0 ? labels.inStock : labels.outOfStock}
                        </div>
                      </div>

                      {product.technical_highlights.length ? (
                        <div className="space-y-2">
                          <p className="font-tech text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                            {labels.highlightsLabel}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {product.technical_highlights.slice(0, 4).map((item) => (
                              <CyberBadge key={`${product.id}-${item.label}-${item.value}`} variant="warning">
                                {item.label}: {item.value}
                              </CyberBadge>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      <div className="mt-auto grid gap-2 sm:grid-cols-2">
                        <CyberButton variant="ghost" onClick={() => onOpenProduct(product)}>
                          {labels.openProduct}
                        </CyberButton>
                        <CyberButton variant="outline" onClick={() => onRemoveProduct(product.id)}>
                          <X className="size-4" aria-hidden="true" />
                          {labels.removeProduct}
                        </CyberButton>
                      </div>
                    </div>
                  </section>
                ))}
              </div>
            </div>

            <section className="overflow-hidden rounded-md border border-white/10 bg-black/25">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
                <div>
                  <p className="font-display text-xl uppercase tracking-[0.05em] text-white">
                    {labels.specsLabel}
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    {products.length > 1 ? labels.pickMore : labels.emptyValue}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-[64rem] table-fixed border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="sticky left-0 z-20 w-56 bg-zinc-950/95 px-4 py-4 text-left font-tech text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                        {labels.parameterLabel}
                      </th>
                      {products.map((product) => (
                        <th
                          key={product.id}
                          className="min-w-64 border-l border-white/10 bg-zinc-950/75 px-4 py-4 text-left font-tech text-[11px] uppercase tracking-[0.14em] text-cyan-100/80"
                        >
                          {getLocalizedProductName(product, locale)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRows.map((row) => (
                      <tr key={row.key} className="border-b border-white/6 align-top">
                        <th
                          className={cn(
                            "sticky left-0 z-10 bg-zinc-950/92 px-4 py-4 text-left font-tech text-[11px] uppercase tracking-[0.12em]",
                            row.different ? "text-cyan-100" : "text-zinc-500",
                          )}
                        >
                          <span className="inline-flex items-center gap-2">
                            <row.icon className="size-3.5 shrink-0" aria-hidden="true" />
                            <span>{row.label}</span>
                          </span>
                        </th>
                        {row.values.map((value, index) => (
                          <td
                            key={`${row.key}-${products[index]?.id ?? index}`}
                            className={cn(
                              "border-l border-white/6 px-4 py-4 text-sm leading-6 text-zinc-200",
                              row.different && "bg-cyan-300/[0.04] text-white",
                            )}
                          >
                            {value || labels.emptyValue}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>

        <div className="shrink-0 border-t border-white/10 bg-[linear-gradient(180deg,rgba(9,10,12,0.84),rgba(4,4,6,0.96))] px-5 py-4 sm:px-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <CyberButton variant="ghost" onClick={() => onOpenChange(false)}>
              {labels.close}
            </CyberButton>
          </div>
        </div>
      </CyberDialogContent>
    </CyberDialog>
  );
}
