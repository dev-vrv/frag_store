import { CyberProductCard } from "@/components/cyber/cyber-product-card";
import { ProductTypeIcon } from "@/components/Products/ProductTypeIcon";
import { type Locale } from "@/lib/i18n";
import {
  formatProductOldPrice,
  formatProductPrice,
  getLocalizedProductName,
  type Product,
  type ProductMedia,
  type ProductTechnicalHighlight,
} from "@/lib/products";

export interface CatalogProductCardLabels {
  badgeHit: string;
  badgeNew: string;
  cta: string;
  details: string;
  favorite: string;
  hoverSpecs: string;
  compare?: string;
}

interface CatalogProductCardProps {
  product: Product;
  locale: Locale;
  labels: CatalogProductCardLabels;
  alreadyInCart: boolean;
  favoriteActive: boolean;
  onCtaClick: () => void;
  onFavoriteClick: () => void;
  ctaDisabled?: boolean;
  detailsHref?: string;
  onDetailsClick?: () => void;
  compareActive?: boolean;
  onCompareClick?: () => void;
  stackActions?: boolean;
}

const alreadyInCartClassName =
  "border-cyan-300/60 bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(34,211,238,0.06))] text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.12)] hover:border-cyan-300/60 hover:bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(34,211,238,0.06))] hover:text-cyan-50 disabled:opacity-100";

function getProductMediaSource(media: ProductMedia | null | undefined) {
  return media?.file || media?.external_url || null;
}

function isVideoMedia(media: ProductMedia | null | undefined) {
  if (!media) {
    return false;
  }

  if (media.media_type === "video") {
    return true;
  }

  const source = getProductMediaSource(media);

  return source ? /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(source) : false;
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

function getExpandedTechnicalHighlights(product: Product): ProductTechnicalHighlight[] {
  const items = [...product.technical_highlights];
  const details = product.technical_details;

  if (!details) {
    return items;
  }

  const extendedFields: Array<[string, string | number | boolean | null | undefined, string?]> = [
    ["Подключение", details.connectivity],
    ["Форм-фактор", details.form_factor],
    ["Совместимость", details.compatibility],
    ["ПО", details.software_support],
    ["Автономность", details.battery_life_hours, " ч"],
    ["Клавиш", details.key_count],
    ["Подсветка", details.backlight],
    ["Кнопок", details.programmable_buttons],
    ["Чувствительность", details.sensitivity_db, " дБ"],
    ["Сопротивление", details.impedance_ohm, " Ом"],
    ["Яркость", details.brightness_nits, " нит"],
    ["Контраст", details.contrast_ratio],
    ["Материал", details.material],
    ["Дополнительно", details.extra_notes],
  ];

  for (const [label, rawValue, suffix = ""] of extendedFields) {
    if (rawValue === null || rawValue === undefined || rawValue === "" || rawValue === false) {
      continue;
    }

    if (items.some((item) => item.label === label)) {
      continue;
    }

    items.push({ label, value: `${rawValue}${suffix}` });
  }

  return items;
}

function ProductVisual({ product }: { product: Product }) {
  const media = getProductMediaGalleryItems(product)[0];
  const source = getProductMediaSource(media);

  if (source && media) {
    if (isVideoMedia(media)) {
      return (
        <video
          src={source}
          className="h-full w-full scale-[1.1] object-contain"
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
        className="h-full w-full scale-[1.1] object-contain"
      />
    );
  }

  return (
    <div className="flex h-full items-center justify-center">
      <div className="grid size-28 place-items-center border border-red-300/25 bg-black/45 text-red-100 shadow-[0_0_46px_rgba(255,23,68,0.18)]">
        <ProductTypeIcon deviceType={product.category.device_type} className="size-5" />
      </div>
    </div>
  );
}

function ProductHoverSpecs({ product, title }: { product: Product; title: string }) {
  const items = getExpandedTechnicalHighlights(product);

  if (!items.length) {
    return null;
  }

  return (
    <div className="space-y-2.5">
      <p className="font-tech text-[10px] uppercase tracking-[0.16em] text-zinc-500">
        {title}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {items.slice(0, 4).map((item) => (
          <div
            key={`${item.label}-${item.value}`}
            className="min-w-0 rounded-none border border-white/10 bg-white/[0.045] px-2.5 py-2"
          >
            <p className="line-clamp-2 font-tech text-[9px] uppercase leading-4 tracking-[0.1em] text-zinc-500">
              {item.label}
            </p>
            <p className="mt-1 line-clamp-2 text-[12px] font-semibold leading-4 text-white">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CatalogProductCard({
  product,
  locale,
  labels,
  alreadyInCart,
  favoriteActive,
  onCtaClick,
  onFavoriteClick,
  ctaDisabled,
  detailsHref,
  onDetailsClick,
  compareActive,
  onCompareClick,
  stackActions,
}: CatalogProductCardProps) {
  const badges = [];

  if (product.is_new_arrival) {
    badges.push({ label: labels.badgeNew, variant: "cyan" as const });
  }
  if (product.is_best_seller) {
    badges.push({ label: labels.badgeHit, variant: "red" as const });
  }
  if (product.has_discount) {
    badges.push({ label: `-${product.discount_percent}%`, variant: "warning" as const });
  }

  return (
    <CyberProductCard
      className="!min-h-[30rem] translate-y-0 transition-transform duration-500 hover:-translate-y-1"
      tone="catalog"
      image={<ProductVisual product={product} />}
      hoverPanel={<ProductHoverSpecs product={product} title={labels.hoverSpecs} />}
      title={getLocalizedProductName(product, locale)}
      description={product.short_description}
      price={formatProductPrice(product, locale)}
      oldPrice={formatProductOldPrice(product, locale)}
      ctaLabel={labels.cta}
      detailsLabel={labels.details}
      favoriteLabel={labels.favorite}
      compareLabel={labels.compare}
      favoriteActive={favoriteActive}
      compareActive={compareActive}
      onFavoriteClick={onFavoriteClick}
      onCompareClick={onCompareClick}
      onDetailsClick={onDetailsClick}
      detailsHref={detailsHref}
      onCtaClick={onCtaClick}
      ctaDisabled={ctaDisabled}
      ctaClassName={alreadyInCart ? alreadyInCartClassName : undefined}
      badges={badges}
      stackActions={stackActions}
    />
  );
}
