"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Cpu,
  Filter,
  Gamepad2,
  Headphones,
  Keyboard,
  Monitor,
  Mouse,
  PackageCheck,
  Search,
  Sparkles,
} from "lucide-react";

import {
  CyberBadge,
  CyberButton,
  CyberCard,
  CyberCardContent,
  CyberInput,
  CyberNativeSelect,
  CyberProductCard,
  CyberSheet,
  CyberSheetContent,
  CyberSheetDescription,
  CyberSheetHeader,
  CyberSheetTitle,
  CyberSheetTrigger,
} from "@/components/cyber";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { type Dictionary, type Locale } from "@/lib/i18n";
import {
  formatProductOldPrice,
  formatProductPrice,
  getLocalizedProductName,
  type Product,
  type ProductCategory,
} from "@/lib/products";
import { cn } from "@/lib/utils";

interface CatalogPageProps {
  locale: Locale;
  dictionary: Dictionary;
  products: Product[];
  categories: ProductCategory[];
  initialCategory?: string;
}

type SortKey = "popular" | "priceAsc" | "priceDesc" | "newest";

interface CatalogCategoryOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const pageSize = 6;

const catalogText: Record<
  Locale,
  {
    search: string;
    searchPlaceholder: string;
    sort: string;
    allCategories: string;
    sortOptions: Record<SortKey, string>;
    results: string;
    empty: string;
    emptyTitle: string;
    emptySubtitle: string;
    reset: string;
    addToCart: string;
    details: string;
    favorite: string;
    page: string;
    filters: string;
    featured: string;
    badgeNew: string;
    badgeHit: string;
    badgeSale: string;
  }
> = {
  ru: {
    search: "Поиск",
    searchPlaceholder: "Мышь, клавиатура, гарнитура...",
    sort: "Сортировка",
    allCategories: "Все",
    sortOptions: {
      popular: "Популярные",
      priceAsc: "Цена: ниже",
      priceDesc: "Цена: выше",
      newest: "Новинки",
    },
    results: "товаров найдено",
    empty: "Ничего не найдено. Попробуйте изменить поиск или фильтры.",
    emptyTitle: "Каталог пока пуст",
    emptySubtitle: "Когда товары появятся, здесь сразу откроется полноценная витрина с фильтрами и сортировкой.",
    reset: "Сбросить",
    addToCart: "В корзину",
    details: "Подробнее",
    favorite: "В избранное",
    page: "Страница",
    filters: "Фильтры",
    featured: "Подборка недели",
    badgeNew: "Новинка",
    badgeHit: "Хит",
    badgeSale: "Скидка",
  },
  en: {
    search: "Search",
    searchPlaceholder: "Mouse, keyboard, headset...",
    sort: "Sort",
    allCategories: "All",
    sortOptions: {
      popular: "Popular",
      priceAsc: "Price: low",
      priceDesc: "Price: high",
      newest: "New arrivals",
    },
    results: "products found",
    empty: "Nothing found. Try changing search or filters.",
    emptyTitle: "Catalog is empty for now",
    emptySubtitle: "As soon as products are added, this page will automatically turn into a full storefront with filters and sorting.",
    reset: "Reset",
    addToCart: "Add to cart",
    details: "Details",
    favorite: "Add to favorites",
    page: "Page",
    filters: "Filters",
    featured: "Weekly picks",
    badgeNew: "New",
    badgeHit: "Hit",
    badgeSale: "Sale",
  },
  kg: {
    search: "Издөө",
    searchPlaceholder: "Мышка, клавиатура, гарнитура...",
    sort: "Сорттоо",
    allCategories: "Баары",
    sortOptions: {
      popular: "Популярдуу",
      priceAsc: "Баасы: төмөн",
      priceDesc: "Баасы: жогору",
      newest: "Жаңы товарлар",
    },
    results: "товар табылды",
    empty: "Эч нерсе табылган жок. Издөөнү же фильтрлерди өзгөртүңүз.",
    emptyTitle: "Каталог азырынча бош",
    emptySubtitle: "Товарлар кошулганда бул жерде фильтрлери жана сорттоосу бар толук витрина автоматтык түрдө чыгат.",
    reset: "Тазалоо",
    addToCart: "Себетке",
    details: "Кененирээк",
    favorite: "Тандалгандарга",
    page: "Барак",
    filters: "Фильтрлер",
    featured: "Аптанын тандоосу",
    badgeNew: "Жаңы",
    badgeHit: "Хит",
    badgeSale: "Арзан",
  },
};

function getCategoryIcon(deviceType: string) {
  if (deviceType === "mouse") return <Mouse aria-hidden="true" />;
  if (deviceType === "keyboard") return <Keyboard aria-hidden="true" />;
  if (deviceType === "headset") return <Headphones aria-hidden="true" />;
  if (deviceType === "monitor") return <Monitor aria-hidden="true" />;
  if (deviceType === "component") return <Cpu aria-hidden="true" />;
  if (deviceType === "accessory") return <PackageCheck aria-hidden="true" />;
  return <Gamepad2 aria-hidden="true" />;
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
      <div className="grid size-28 place-items-center border border-red-300/25 bg-black/45 text-red-100 shadow-[0_0_46px_rgba(255,23,68,0.18)]">
        {getCategoryIcon(product.category.device_type)}
      </div>
    </div>
  );
}

export function CatalogPage({
  locale,
  dictionary,
  products,
  categories,
  initialCategory = "all",
}: CatalogPageProps) {
  const text = catalogText[locale];
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<SortKey>("popular");
  const [pageIndex, setPageIndex] = useState(1);

  const categoryOptions = useMemo<CatalogCategoryOption[]>(
    () => [
      {
        value: "all",
        label: text.allCategories,
        icon: <Sparkles aria-hidden="true" />,
      },
      ...categories.map((item) => ({
        value: item.slug,
        label: item.name,
        icon: getCategoryIcon(item.device_type),
      })),
    ],
    [categories, text.allCategories],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesCategory = category === "all" || product.category.slug === category;
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.short_description.toLowerCase().includes(normalizedQuery) ||
        product.brand.name.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });

    return filtered.toSorted((a, b) => {
      if (sort === "priceAsc") {
        return Number(a.price) - Number(b.price);
      }

      if (sort === "priceDesc") {
        return Number(b.price) - Number(a.price);
      }

      if (sort === "newest") {
        return Number(b.is_new_arrival) - Number(a.is_new_arrival);
      }

      return (
        Number(b.is_best_seller) * 3 +
        Number(b.is_featured) * 2 +
        Number(b.has_discount) -
        (Number(a.is_best_seller) * 3 + Number(a.is_featured) * 2 + Number(a.has_discount))
      );
    });
  }, [category, products, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePageIndex = Math.min(pageIndex, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safePageIndex - 1) * pageSize,
    safePageIndex * pageSize,
  );

  const hasActiveFilters = Boolean(query || category !== "all" || sort !== "popular");

  function resetFilters() {
    setQuery("");
    setCategory("all");
    setSort("popular");
    setPageIndex(1);
  }

  const filterPanel = (
      <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <CyberBadge variant="warning" glow>
          {dictionary.pages.catalog.badge}
        </CyberBadge>
        <p className="mt-3 font-display text-2xl uppercase tracking-[0.05em] text-white">
          {dictionary.pages.catalog.title}
        </p>
        <p className="mt-1.5 max-w-md text-sm leading-6 text-zinc-400">
          {dictionary.pages.catalog.subtitle}
        </p>
      </div>

      <div className="space-y-4 border-t border-white/10 pt-4">
        <CyberInput
          label={text.search}
          placeholder={text.searchPlaceholder}
          icon={<Search aria-hidden="true" />}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPageIndex(1);
          }}
        />
        <CyberNativeSelect
          label={text.sort}
          value={sort}
          onValueChange={(value) => {
            setSort(value as SortKey);
            setPageIndex(1);
          }}
          options={[
            { value: "popular", label: text.sortOptions.popular },
            { value: "priceAsc", label: text.sortOptions.priceAsc },
            { value: "priceDesc", label: text.sortOptions.priceDesc },
            { value: "newest", label: text.sortOptions.newest },
          ]}
        />
      </div>

      <div className="grid grid-cols-3 gap-2.5 border-t border-white/10 pt-4">
        <div className="border border-white/10 bg-white/[0.03] px-2.5 py-2">
          <p className="font-tech text-[9px] uppercase tracking-[0.16em] text-zinc-500">
            {text.results}
          </p>
          <p className="mt-1 font-display text-lg text-white">
            {filteredProducts.length}
          </p>
        </div>
        <div className="border border-white/10 bg-white/[0.03] px-2.5 py-2">
          <p className="font-tech text-[9px] uppercase tracking-[0.16em] text-zinc-500">
            {text.filters}
          </p>
          <p className="mt-1 font-display text-lg text-amber-200">
            {categoryOptions.length - 1}
          </p>
        </div>
        <div className="border border-white/10 bg-white/[0.03] px-2.5 py-2">
          <p className="font-tech text-[9px] uppercase tracking-[0.16em] text-zinc-500">
            {text.page}
          </p>
          <p className="mt-1 font-display text-lg text-white">
            {safePageIndex}/{totalPages}
          </p>
        </div>
      </div>

      <div className="space-y-3 border-t border-white/10 pt-4">
        <p className="font-tech text-[11px] uppercase tracking-[0.16em] text-zinc-500">
          {text.filters}
        </p>
        <div className="flex flex-wrap gap-2.5">
          {categoryOptions.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                setCategory(item.value);
                setPageIndex(1);
              }}
              className={cn(
                "font-tech inline-flex min-h-11 items-center gap-2 border border-white/10 bg-white/[0.035] px-3.5 text-sm uppercase tracking-[0.08em] text-zinc-300 transition duration-300 hover:-translate-y-0.5 hover:border-amber-200/35 hover:bg-white/[0.07] hover:text-white [&_svg]:size-4",
                category === item.value &&
                  "border-amber-200/45 bg-amber-200/[0.10] text-amber-100 shadow-[0_12px_30px_rgba(251,191,36,0.08)]",
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="border-t border-white/10 pt-4">
          <CyberButton type="button" variant="outline" size="sm" onClick={resetFilters}>
            {text.reset}
          </CyberButton>
        </div>
      ) : null}
    </div>
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] px-4 pb-24 pt-32 text-zinc-50 sm:px-6 lg:px-8">
      <Header locale={locale} dictionary={dictionary.header} />
      <div className="absolute inset-0 -z-40 bg-[radial-gradient(circle_at_50%_0%,rgba(255,214,153,0.08),transparent_20%),linear-gradient(180deg,#080808_0%,#040404_45%,#020202_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-30 overflow-hidden">
        <div className="absolute -left-[12%] top-[8%] h-[22rem] w-[22rem] animate-[catalogAurora_22s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(255,173,72,0.22),rgba(255,173,72,0.08)_38%,transparent_72%)] blur-3xl sm:h-[28rem] sm:w-[28rem]" />
        <div className="absolute right-[-10%] top-[12%] h-[24rem] w-[24rem] animate-[catalogAurora_28s_ease-in-out_infinite_reverse] rounded-full bg-[radial-gradient(circle,rgba(255,92,72,0.18),rgba(255,92,72,0.06)_38%,transparent_74%)] blur-3xl sm:h-[30rem] sm:w-[30rem]" />
        <div className="absolute left-[18%] bottom-[8%] h-[18rem] w-[34rem] animate-[catalogPulse_20s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.10),transparent_64%)] blur-3xl" />
        <div className="absolute left-1/2 top-[14%] h-[34rem] w-[34rem] -translate-x-1/2 animate-[catalogHalo_26s_linear_infinite] rounded-full border border-white/10 opacity-40" />
        <div className="absolute left-[-8%] top-[24%] h-32 w-[36rem] animate-[catalogBeam_18s_ease-in-out_infinite] rotate-[-12deg] bg-[linear-gradient(90deg,transparent,rgba(255,202,112,0.14),transparent)] blur-2xl" />
        <div className="absolute right-[-10%] top-[52%] h-28 w-[30rem] animate-[catalogBeam_24s_ease-in-out_infinite_reverse] rotate-[18deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)] blur-2xl" />
      </div>
      <div className="cyber-grid absolute inset-0 -z-20 opacity-[0.12]" />
      <div className="pointer-events-none absolute inset-0 -z-10 animate-[catalogGridDrift_36s_linear_infinite] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:68px_68px] opacity-[0.16] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.88),rgba(0,0,0,0.45)_55%,transparent)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.015),transparent_18%,transparent_82%,rgba(255,255,255,0.015))]" />
      <style jsx>{`
        @keyframes catalogAurora {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(32px, -18px, 0) scale(1.12);
          }
        }

        @keyframes catalogPulse {
          0%,
          100% {
            transform: scale(0.94);
            opacity: 0.42;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.78;
          }
        }

        @keyframes catalogHalo {
          from {
            transform: translateX(-50%) rotate(0deg);
          }
          to {
            transform: translateX(-50%) rotate(360deg);
          }
        }

        @keyframes catalogBeam {
          0%,
          100% {
            transform: translateX(0) rotate(-12deg);
            opacity: 0.3;
          }
          50% {
            transform: translateX(48px) rotate(-9deg);
            opacity: 0.75;
          }
        }

        @keyframes catalogGridDrift {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(24px, 18px, 0);
          }
        }
      `}</style>

      <section className="mx-auto py-8 max-w-7xl">
        <div className="mb-5 flex items-center justify-between gap-3 xl:hidden">
          <div>
            <p className="font-display text-2xl uppercase tracking-[0.05em] text-white">
              {dictionary.pages.catalog.title}
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              {filteredProducts.length} {text.results}
            </p>
          </div>
          <CyberSheet>
            <CyberSheetTrigger asChild>
              <CyberButton variant="outline" className="border-white/20 text-white hover:border-white/40 hover:bg-white/10 hover:text-white">
                <Filter aria-hidden="true" />
                {text.filters}
              </CyberButton>
            </CyberSheetTrigger>
            <CyberSheetContent side="left" className="w-[88vw] border-white/10 bg-zinc-950/95 p-5 sm:max-w-md">
              <CyberSheetHeader className="border-b border-white/10 pb-4">
                <CyberSheetTitle className="font-display text-2xl uppercase tracking-[0.05em] text-white">
                  {text.filters}
                </CyberSheetTitle>
                <CyberSheetDescription>
                  {dictionary.pages.catalog.subtitle}
                </CyberSheetDescription>
              </CyberSheetHeader>
              <div className="mt-5">{filterPanel}</div>
            </CyberSheetContent>
          </CyberSheet>
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="hidden xl:block xl:sticky xl:top-32">
            <CyberCard variant="glass" className="overflow-hidden border-white/10 bg-zinc-950/70">
              <CyberCardContent className="p-5">
                {filterPanel}
              </CyberCardContent>
            </CyberCard>
          </aside>

          <div>
        {products.length === 0 ? (
          <CyberCard variant="glass" className="overflow-hidden border-white/10 bg-zinc-950/70">
            <CyberCardContent className="flex flex-col items-center justify-center gap-5 p-10 text-center sm:p-14">
              <div className="grid size-20 place-items-center rounded-full border border-amber-200/20 bg-amber-200/[0.08] text-amber-100 shadow-[0_0_34px_rgba(251,191,36,0.12)]">
                <PackageCheck className="size-9" />
              </div>
              <div className="space-y-3">
                <CyberBadge variant="warning" glow>
                  {text.featured}
                </CyberBadge>
                <h2 className="font-display text-4xl tracking-[0.04em] text-white">
                  {text.emptyTitle}
                </h2>
                <p className="mx-auto max-w-2xl text-base leading-8 text-zinc-400">
                  {text.emptySubtitle}
                </p>
              </div>
            </CyberCardContent>
          </CyberCard>
        ) : paginatedProducts.length ? (
          <div className="grid auto-rows-fr gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
            {paginatedProducts.map((product) => {
              const badges = [];
              if (product.is_new_arrival) {
                badges.push({ label: text.badgeNew, variant: "cyan" as const });
              }
              if (product.is_best_seller) {
                badges.push({ label: text.badgeHit, variant: "red" as const });
              }
              if (product.has_discount) {
                badges.push({ label: text.badgeSale, variant: "green" as const });
              }

              return (
                <CyberProductCard
                  key={product.id}
                  className="translate-y-0 transition-transform duration-500 hover:-translate-y-1.5"
                  image={<ProductVisual product={product} />}
                  title={getLocalizedProductName(product, locale)}
                  description={product.short_description}
                  price={formatProductPrice(product, locale)}
                  oldPrice={formatProductOldPrice(product, locale)}
                  ctaLabel={text.addToCart}
                  detailsLabel={text.details}
                  favoriteLabel={text.favorite}
                  detailsHref={`?product=${product.slug}`}
                  ctaHref="#"
                  badges={badges}
                />
              );
            })}
          </div>
        ) : (
          <CyberCard variant="glass" className="border-white/10 bg-zinc-950/70">
            <CyberCardContent className="p-10 text-center text-lg text-zinc-400">
              {text.empty}
            </CyberCardContent>
          </CyberCard>
        )}
          </div>
        </div>
      </section>

      {products.length ? (
        <section className="mx-auto mt-8 mb-10 flex max-w-7xl flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-tech text-sm uppercase tracking-[0.1em] text-zinc-500">
            {text.page} {safePageIndex} / {totalPages}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPageIndex((current) => Math.max(1, current - 1))}
              disabled={safePageIndex === 1}
              className="grid size-10 place-items-center border border-white/10 bg-white/[0.035] text-zinc-300 transition hover:border-amber-200/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPageIndex(item)}
                className={cn(
                  "grid size-10 place-items-center border border-white/10 bg-white/[0.035] text-sm text-zinc-300 transition hover:border-amber-200/35 hover:text-white",
                  safePageIndex === item && "border-amber-200/50 bg-amber-200/[0.10] text-amber-100",
                )}
                aria-current={safePageIndex === item ? "page" : undefined}
              >
                {item}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPageIndex((current) => Math.min(totalPages, current + 1))}
              disabled={safePageIndex === totalPages}
              className="grid size-10 place-items-center border border-white/10 bg-white/[0.035] text-zinc-300 transition hover:border-amber-200/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Next page"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </section>
      ) : null}

      <Footer locale={locale} dictionary={dictionary} className="-mx-4 sm:-mx-6 lg:-mx-8" />
    </main>
  );
}
