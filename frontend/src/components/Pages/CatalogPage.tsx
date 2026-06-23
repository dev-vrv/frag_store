"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Cpu,
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

  function resetFilters() {
    setQuery("");
    setCategory("all");
    setSort("popular");
    setPageIndex(1);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 pb-16 pt-36 text-zinc-50 sm:px-6 lg:px-8">
      <Header locale={locale} dictionary={dictionary.header} />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_18%,rgba(255,23,68,0.13),transparent_30%),radial-gradient(circle_at_80%_16%,rgba(34,211,238,0.08),transparent_28%),linear-gradient(180deg,#050507,#000)]" />
      <div className="cyber-grid absolute inset-0 -z-10 opacity-35" />

      <section className="mx-auto mt-10 max-w-7xl">
        <CyberCard variant="glass">
          <CyberCardContent className="space-y-5 p-5 sm:p-6">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem]">
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

            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setCategory(item.value);
                    setPageIndex(1);
                  }}
                  className={cn(
                    "font-tech inline-flex min-h-10 items-center gap-2 border border-white/10 bg-white/[0.035] px-3 text-sm uppercase tracking-[0.08em] text-zinc-300 transition hover:border-red-400/35 hover:bg-red-500/10 hover:text-red-100 [&_svg]:size-4",
                    category === item.value && "border-red-400/55 bg-red-500/14 text-red-100",
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t border-white/10 pt-4 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
              <span>
                {filteredProducts.length} {text.results}
              </span>
              {(query || category !== "all" || sort !== "popular") ? (
                <CyberButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                >
                  {text.reset}
                </CyberButton>
              ) : null}
            </div>
          </CyberCardContent>
        </CyberCard>
      </section>

      <section className="mx-auto mt-8 max-w-7xl py-3">
        {products.length === 0 ? (
          <CyberCard variant="glass" className="overflow-hidden border-cyan-300/15 bg-black/35">
            <CyberCardContent className="flex flex-col items-center justify-center gap-5 p-10 text-center sm:p-14">
              <div className="grid size-20 place-items-center rounded-full border border-cyan-300/20 bg-cyan-300/8 text-cyan-100 shadow-[0_0_34px_rgba(34,211,238,0.14)]">
                <PackageCheck className="size-9" />
              </div>
              <div className="space-y-3">
                <CyberBadge variant="cyan" glow>
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
          <div className="grid auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-3">
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
          <CyberCard variant="glass">
            <CyberCardContent className="p-8 text-center text-lg text-zinc-400">
              {text.empty}
            </CyberCardContent>
          </CyberCard>
        )}
      </section>

      {products.length ? (
        <section className="mx-auto mt-8 flex max-w-7xl flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-tech text-sm uppercase tracking-[0.1em] text-zinc-500">
            {text.page} {safePageIndex} / {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPageIndex((current) => Math.max(1, current - 1))}
              disabled={safePageIndex === 1}
              className="grid size-10 place-items-center border border-white/10 bg-white/[0.035] text-zinc-300 transition hover:border-red-400/35 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-35"
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
                  "grid size-10 place-items-center border border-white/10 bg-white/[0.035] text-sm text-zinc-300 transition hover:border-red-400/35 hover:text-red-100",
                  safePageIndex === item && "border-red-400/55 bg-red-500/14 text-red-100",
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
              className="grid size-10 place-items-center border border-white/10 bg-white/[0.035] text-zinc-300 transition hover:border-red-400/35 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-35"
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
