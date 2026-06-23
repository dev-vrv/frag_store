"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Check,
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
  CyberDialog,
  CyberDialogContent,
  CyberDialogDescription,
  CyberDialogHeader,
  CyberDialogTitle,
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
  getLocalizedCategoryName,
  getLocalizedProductName,
  type ProductBrand,
  type Product,
  type ProductCategory,
} from "@/lib/products";
import { cn } from "@/lib/utils";

interface CatalogPageProps {
  locale: Locale;
  dictionary: Dictionary;
  products: Product[];
  categories: ProductCategory[];
  brands: ProductBrand[];
  initialCategory?: string[];
  initialBrand?: string;
}

type SortKey = "popular" | "priceAsc" | "priceDesc" | "newest";

interface CatalogCategoryOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface CatalogBrandOption {
  value: string;
  label: string;
}

type QuickFilterKey =
  | "bestSeller"
  | "discount"
  | "newArrival"
  | "featured"
  | "inStock";

interface QuickFilterOption {
  key: QuickFilterKey;
  label: string;
}

const pageSize = 6;

function parseInitialCategories(value?: string[]) {
  if (!value?.length) {
    return [];
  }

  return [...new Set(value.filter((item) => item !== "all"))];
}

const catalogText: Record<
  Locale,
  {
    search: string;
    searchPlaceholder: string;
    sort: string;
    brand: string;
    allBrands: string;
    allCategories: string;
    sortOptions: Record<SortKey, string>;
    results: string;
    empty: string;
    emptyFilteredByCategory: string;
    emptyTitle: string;
    emptySubtitle: string;
    reset: string;
    addToCart: string;
    details: string;
    favorite: string;
    page: string;
    filters: string;
    featured: string;
    previousPage: string;
    nextPage: string;
    quickFilters: string;
    detailsLead: string;
    sku: string;
    brandLabel: string;
    categoryLabel: string;
    availabilityLabel: string;
    inStock: string;
    outOfStock: string;
    quickFilterOptions: QuickFilterOption[];
    badgeNew: string;
    badgeHit: string;
    badgeSale: string;
  }
> = {
  ru: {
    search: "Поиск",
    searchPlaceholder: "Мышь, клавиатура, гарнитура...",
    sort: "Сортировка",
    brand: "Марка",
    allBrands: "Все бренды",
    allCategories: "Все",
    sortOptions: {
      popular: "Популярные",
      priceAsc: "Цена: ниже",
      priceDesc: "Цена: выше",
      newest: "Новинки",
    },
    results: "товаров найдено",
    empty: "По выбранным фильтрам товары не найдены.",
    emptyFilteredByCategory: "По выбранным фильтрам товары не найдены.",
    emptyTitle: "Товаров пока нет",
    emptySubtitle: "Товары появятся позже.",
    reset: "Сбросить",
    addToCart: "В корзину",
    details: "Подробнее",
    favorite: "В избранное",
    page: "Страница",
    filters: "Фильтры",
    featured: "Каталог",
    previousPage: "Предыдущая страница",
    nextPage: "Следующая страница",
    quickFilters: "Быстрые фильтры",
    detailsLead: "Полные характеристики и описание",
    sku: "Артикул",
    brandLabel: "Марка",
    categoryLabel: "Категория",
    availabilityLabel: "Наличие",
    inStock: "В наличии",
    outOfStock: "Нет в наличии",
    quickFilterOptions: [
      { key: "bestSeller", label: "Лидеры продаж" },
      { key: "discount", label: "Со скидкой" },
      { key: "newArrival", label: "Новинки" },
      { key: "featured", label: "Подборка" },
      { key: "inStock", label: "В наличии" },
    ],
    badgeNew: "Новинка",
    badgeHit: "Хит",
    badgeSale: "Скидка",
  },
  en: {
    search: "Search",
    searchPlaceholder: "Mouse, keyboard, headset...",
    sort: "Sort",
    brand: "Brand",
    allBrands: "All brands",
    allCategories: "All",
    sortOptions: {
      popular: "Popular",
      priceAsc: "Price: low",
      priceDesc: "Price: high",
      newest: "New arrivals",
    },
    results: "products found",
    empty: "No products found for the selected filters.",
    emptyFilteredByCategory: "No products found for the selected filters.",
    emptyTitle: "No products yet",
    emptySubtitle: "Products will be added later.",
    reset: "Reset",
    addToCart: "Add to cart",
    details: "Details",
    favorite: "Add to favorites",
    page: "Page",
    filters: "Filters",
    featured: "Catalog",
    previousPage: "Previous page",
    nextPage: "Next page",
    quickFilters: "Quick filters",
    detailsLead: "Full description and product details",
    sku: "SKU",
    brandLabel: "Brand",
    categoryLabel: "Category",
    availabilityLabel: "Availability",
    inStock: "In stock",
    outOfStock: "Out of stock",
    quickFilterOptions: [
      { key: "bestSeller", label: "Best sellers" },
      { key: "discount", label: "On sale" },
      { key: "newArrival", label: "New arrivals" },
      { key: "featured", label: "Featured" },
      { key: "inStock", label: "In stock" },
    ],
    badgeNew: "New",
    badgeHit: "Hit",
    badgeSale: "Sale",
  },
  kg: {
    search: "Издөө",
    searchPlaceholder: "Мышка, клавиатура, гарнитура...",
    sort: "Сорттоо",
    brand: "Бренд",
    allBrands: "Баардык бренддер",
    allCategories: "Баары",
    sortOptions: {
      popular: "Популярдуу",
      priceAsc: "Баасы: төмөн",
      priceDesc: "Баасы: жогору",
      newest: "Жаңы товарлар",
    },
    results: "товар табылды",
    empty: "Тандалган фильтрлер боюнча товар табылган жок.",
    emptyFilteredByCategory: "Тандалган фильтрлер боюнча товар табылган жок.",
    emptyTitle: "Азырынча товар жок",
    emptySubtitle: "Товарлар кийинчерээк кошулат.",
    reset: "Тазалоо",
    addToCart: "Себетке",
    details: "Кененирээк",
    favorite: "Тандалгандарга",
    page: "Барак",
    filters: "Фильтрлер",
    featured: "Каталог",
    previousPage: "Мурунку барак",
    nextPage: "Кийинки барак",
    quickFilters: "Тез фильтрлер",
    detailsLead: "Толук сүрөттөмө жана товар маалыматы",
    sku: "Артикул",
    brandLabel: "Марка",
    categoryLabel: "Категория",
    availabilityLabel: "Жеткиликтүүлүк",
    inStock: "Бар",
    outOfStock: "Жок",
    quickFilterOptions: [
      { key: "bestSeller", label: "Сатуу лидерлери" },
      { key: "discount", label: "Арзандатуу менен" },
      { key: "newArrival", label: "Жаңы товарлар" },
      { key: "featured", label: "Подборка" },
      { key: "inStock", label: "Бар" },
    ],
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
  brands,
  initialCategory = [],
  initialBrand = "all",
}: CatalogPageProps) {
  const text = catalogText[locale];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(() =>
    parseInitialCategories(initialCategory),
  );
  const [brand, setBrand] = useState(initialBrand);
  const [sort, setSort] = useState<SortKey>("popular");
  const [pageIndex, setPageIndex] = useState(1);
  const [quickFilters, setQuickFilters] = useState<Record<QuickFilterKey, boolean>>({
    bestSeller: false,
    discount: false,
    newArrival: false,
    featured: false,
    inStock: false,
  });

  const categoryOptions = useMemo<CatalogCategoryOption[]>(
    () => [
      {
        value: "all",
        label: text.allCategories,
        icon: <Sparkles aria-hidden="true" />,
      },
      ...categories.map((item) => ({
        value: item.slug,
        label: getLocalizedCategoryName(item, locale),
        icon: getCategoryIcon(item.device_type),
      })),
    ],
    [categories, locale, text.allCategories],
  );

  const brandOptions = useMemo<CatalogBrandOption[]>(
    () => [
      {
        value: "all",
        label: text.allBrands,
      },
      ...brands.map((item) => ({
        value: item.slug,
        label: item.name,
      })),
    ],
    [brands, text.allBrands],
  );

  const selectedCategorySet = useMemo(() => new Set(selectedCategories), [selectedCategories]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesCategory =
        selectedCategorySet.size === 0 || selectedCategorySet.has(product.category.slug);
      const matchesBrand = brand === "all" || product.brand.slug === brand;
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.short_description.toLowerCase().includes(normalizedQuery) ||
        product.brand.name.toLowerCase().includes(normalizedQuery);
      const matchesQuickFilters =
        (!quickFilters.bestSeller || product.is_best_seller) &&
        (!quickFilters.discount || product.has_discount) &&
        (!quickFilters.newArrival || product.is_new_arrival) &&
        (!quickFilters.featured || product.is_featured) &&
        (!quickFilters.inStock || product.quantity_in_stock > 0);

      return matchesCategory && matchesBrand && matchesQuery && matchesQuickFilters;
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
  }, [brand, products, query, quickFilters, selectedCategorySet, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePageIndex = Math.min(pageIndex, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safePageIndex - 1) * pageSize,
    safePageIndex * pageSize,
  );

  const activeQuickFilterCount = Object.values(quickFilters).filter(Boolean).length;
  const hasActiveFilters = Boolean(
    query ||
      selectedCategories.length > 0 ||
      brand !== "all" ||
      sort !== "popular" ||
      activeQuickFilterCount,
  );
  const selectedProductSlug = searchParams.get("product");
  const selectedProduct = selectedProductSlug
    ? products.find((product) => product.slug === selectedProductSlug) ?? null
    : null;

  function updateProductQuery(productSlug: string | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (productSlug) {
      params.set("product", productSlug);
    } else {
      params.delete("product");
    }

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }

  function toggleQuickFilter(key: QuickFilterKey) {
    setQuickFilters((current) => ({
      ...current,
      [key]: !current[key],
    }));
    setPageIndex(1);
  }

  function toggleCategory(value: string) {
    if (value === "all") {
      setSelectedCategories([]);
      setPageIndex(1);
      return;
    }

    setSelectedCategories((current) => {
      if (current.includes(value)) {
        return current.filter((item) => item !== value);
      }

      return [...current, value];
    });
    setPageIndex(1);
  }

  function resetFilters() {
    setQuery("");
    setSelectedCategories([]);
    setBrand("all");
    setSort("popular");
    setQuickFilters({
      bestSeller: false,
      discount: false,
      newArrival: false,
      featured: false,
      inStock: false,
    });
    setPageIndex(1);
  }

  const filterPanel = (
    <div className="space-y-6">
      <div className="space-y-4">
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
          label={text.brand}
          value={brand}
          onValueChange={(value) => {
            setBrand(value);
            setPageIndex(1);
          }}
          options={brandOptions}
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

      <div className="space-y-3 border-t border-white/10 pt-4">
        <p className="font-tech text-[11px] uppercase tracking-[0.16em] text-zinc-500">
          {text.filters}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {categoryOptions.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => toggleCategory(item.value)}
              aria-pressed={item.value === "all" ? selectedCategories.length === 0 : selectedCategorySet.has(item.value)}
              className={cn(
                "font-tech inline-flex min-h-[3rem] items-center justify-start gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-left text-[11px] uppercase leading-[1.15] tracking-[0.06em] text-zinc-300 transition duration-300 hover:border-amber-200/35 hover:bg-white/[0.07] hover:text-white [&_svg]:size-3.5 [&_svg]:shrink-0",
                item.value === "all" && "col-span-2 justify-center",
                ((item.value === "all" && selectedCategories.length === 0) ||
                  selectedCategorySet.has(item.value)) &&
                  "border-amber-200/45 bg-amber-200/[0.10] text-amber-100 shadow-[0_12px_30px_rgba(251,191,36,0.08)]",
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 border-t border-white/10 pt-4">
        <p className="font-tech text-[11px] uppercase tracking-[0.16em] text-zinc-500">
          {text.quickFilters}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {text.quickFilterOptions.map((option) => {
            const isActive = quickFilters[option.key];

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => toggleQuickFilter(option.key)}
                aria-pressed={isActive}
                className={cn(
                  "group flex min-h-[3rem] items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-left transition duration-300 hover:border-cyan-200/30 hover:bg-white/[0.06]",
                  isActive &&
                    "border-cyan-300/40 bg-cyan-300/[0.10] shadow-[0_10px_28px_rgba(34,211,238,0.08)]",
                )}
              >
                <span
                  className={cn(
                    "grid size-4 shrink-0 place-items-center rounded border border-white/14 bg-black/35 text-transparent transition duration-300",
                    isActive && "border-cyan-300/55 bg-cyan-300/18 text-cyan-100",
                  )}
                >
                  <Check className="size-3" aria-hidden="true" />
                </span>
                <span
                  className={cn(
                    "font-tech text-[11px] uppercase leading-[1.15] tracking-[0.06em] text-zinc-300 transition duration-300",
                    isActive && "text-cyan-50",
                  )}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5 border-t border-white/10 pt-4">
        <div className="flex min-h-[84px] flex-col justify-between border border-white/10 bg-white/[0.03] px-2.5 py-2">
          <p className="font-tech text-[8px] uppercase leading-4 tracking-[0.14em] text-zinc-500">
            {text.results}
          </p>
          <p className="mt-2 font-display text-lg leading-none text-white">
            {filteredProducts.length}
          </p>
        </div>
        <div className="flex min-h-[84px] flex-col justify-between border border-white/10 bg-white/[0.03] px-2.5 py-2">
          <p className="font-tech text-[8px] uppercase leading-4 tracking-[0.14em] text-zinc-500">
            {text.filters}
          </p>
          <p className="mt-2 font-display text-lg leading-none text-amber-200">
            {activeQuickFilterCount + selectedCategories.length + Number(brand !== "all")}
          </p>
        </div>
        <div className="flex min-h-[84px] flex-col justify-between border border-white/10 bg-white/[0.03] px-2.5 py-2">
          <p className="font-tech text-[8px] uppercase leading-4 tracking-[0.14em] text-zinc-500">
            {text.page}
          </p>
          <p className="mt-2 font-display text-lg leading-none text-white">
            {safePageIndex}/{totalPages}
          </p>
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
    <main className="page-shell relative overflow-hidden bg-[linear-gradient(180deg,#12070a_0%,#17090c_26%,#10070a_56%,#050304_100%)] px-4 pt-32 text-zinc-50 sm:px-6 lg:px-8">
      <Header locale={locale} dictionary={dictionary.header} />
      <div className="absolute inset-0 -z-40 bg-[radial-gradient(circle_at_14%_16%,rgba(255,94,77,0.34),transparent_24%),radial-gradient(circle_at_84%_12%,rgba(220,38,38,0.30),transparent_24%),radial-gradient(circle_at_50%_82%,rgba(251,146,60,0.16),transparent_28%),linear-gradient(180deg,#16090b_0%,#14070a_28%,#0d0507_56%,#040304_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-30 overflow-hidden">
        <div className="absolute -left-[10%] top-[2%] h-[24rem] w-[24rem] animate-[catalogAurora_22s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(255,94,77,0.48),rgba(255,94,77,0.16)_42%,transparent_74%)] blur-3xl sm:h-[30rem] sm:w-[30rem]" />
        <div className="absolute right-[-8%] top-[8%] h-[24rem] w-[24rem] animate-[catalogAurora_28s_ease-in-out_infinite_reverse] rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.44),rgba(220,38,38,0.16)_40%,transparent_74%)] blur-3xl sm:h-[32rem] sm:w-[32rem]" />
        <div className="absolute left-[18%] bottom-[8%] h-[18rem] w-[36rem] animate-[catalogPulse_20s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.26),transparent_64%)] blur-3xl" />
        <div className="absolute left-1/2 top-[14%] h-[34rem] w-[34rem] -translate-x-1/2 animate-[catalogHalo_26s_linear_infinite] rounded-full border border-red-200/12 opacity-60" />
        <div className="absolute left-1/2 top-[14%] h-[25rem] w-[25rem] -translate-x-1/2 animate-[catalogHaloReverse_18s_linear_infinite] rounded-full border border-orange-300/12 opacity-45" />
        <div className="absolute left-[8%] top-[22%] h-40 w-40 rotate-45 animate-[catalogFloatShape_20s_ease-in-out_infinite] border border-red-200/18 bg-red-200/[0.05] backdrop-blur-[2px]" />
        <div className="absolute right-[12%] top-[48%] h-28 w-28 rotate-12 animate-[catalogFloatShapeAlt_24s_ease-in-out_infinite] border border-orange-300/18 bg-orange-300/[0.05] backdrop-blur-[2px]" />
        <div className="absolute left-[14%] top-[52%] h-52 w-52 animate-[catalogPolygon_20s_linear_infinite] border border-red-200/14 opacity-70 [clip-path:polygon(50%_0%,100%_38%,82%_100%,18%_100%,0%_38%)]" />
        <div className="absolute right-[18%] top-[18%] h-44 w-44 animate-[catalogPolygon_26s_linear_infinite_reverse] border border-rose-300/12 opacity-55 [clip-path:polygon(12%_12%,88%_0%,100%_76%,40%_100%,0%_64%)]" />
        <div className="absolute left-[38%] top-[18%] h-40 w-40 animate-[catalogDiamond_22s_linear_infinite] border border-orange-200/12 opacity-50 [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]" />
        <div className="absolute right-[22%] bottom-[14%] h-36 w-36 animate-[catalogDiamond_18s_linear_infinite_reverse] border border-red-100/10 opacity-40 [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]" />
        <div className="absolute left-[-8%] top-[24%] h-32 w-[36rem] animate-[catalogBeam_18s_ease-in-out_infinite] rotate-[-12deg] bg-[linear-gradient(90deg,transparent,rgba(255,94,77,0.24),transparent)] blur-2xl" />
        <div className="absolute right-[-10%] top-[52%] h-28 w-[30rem] animate-[catalogBeam_24s_ease-in-out_infinite_reverse] rotate-[18deg] bg-[linear-gradient(90deg,transparent,rgba(220,38,38,0.20),transparent)] blur-2xl" />
        <div className="absolute inset-x-0 top-[22%] h-px animate-[catalogScanline_9s_linear_infinite] bg-[linear-gradient(90deg,transparent,rgba(255,115,115,0.42),transparent)] opacity-80" />
        <div className="absolute inset-x-0 top-[58%] h-px animate-[catalogScanline_13s_linear_infinite_reverse] bg-[linear-gradient(90deg,transparent,rgba(251,146,60,0.30),transparent)] opacity-70" />
      </div>
      <div className="cyber-grid absolute inset-0 -z-20 opacity-[0.32]" />
      <div className="pointer-events-none absolute inset-0 -z-10 animate-[catalogGridDrift_36s_linear_infinite] bg-[linear-gradient(rgba(255,115,115,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(251,146,60,0.06)_1px,transparent_1px)] bg-[size:68px_68px] opacity-[0.34] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.94),rgba(0,0,0,0.58)_58%,transparent)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,94,77,0.06),transparent_18%,transparent_82%,rgba(220,38,38,0.06))]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.34] [background-image:radial-gradient(circle_at_center,rgba(253,186,116,0.20)_1px,transparent_1px)] [background-size:30px_30px] [mask-image:linear-gradient(180deg,transparent,rgba(0,0,0,0.88)_16%,rgba(0,0,0,0.88)_84%,transparent)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,94,77,0.08),transparent_18%,rgba(251,146,60,0.07)_40%,transparent_58%,rgba(220,38,38,0.08)_82%,transparent)] opacity-80" />
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

        @keyframes catalogHaloReverse {
          from {
            transform: translateX(-50%) rotate(360deg);
          }
          to {
            transform: translateX(-50%) rotate(0deg);
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

        @keyframes catalogFloatShape {
          0%,
          100% {
            transform: translate3d(0, 0, 0) rotate(45deg);
          }
          50% {
            transform: translate3d(18px, 22px, 0) rotate(60deg);
          }
        }

        @keyframes catalogFloatShapeAlt {
          0%,
          100% {
            transform: translate3d(0, 0, 0) rotate(12deg);
          }
          50% {
            transform: translate3d(-20px, 16px, 0) rotate(24deg);
          }
        }

        @keyframes catalogPolygon {
          from {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.08);
          }
          to {
            transform: rotate(360deg) scale(1);
          }
        }

        @keyframes catalogDiamond {
          0% {
            transform: rotate(0deg) scale(1) translate3d(0, 0, 0);
          }
          50% {
            transform: rotate(180deg) scale(1.08) translate3d(0, 18px, 0);
          }
          100% {
            transform: rotate(360deg) scale(1) translate3d(0, 0, 0);
          }
        }

        @keyframes catalogScanline {
          from {
            transform: translateY(-18vh);
          }
          to {
            transform: translateY(52vh);
          }
        }
      `}</style>

      <section className="mx-auto w-full max-w-7xl py-8">
        <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CyberBadge variant="warning" glow>
              {dictionary.pages.catalog.badge}
            </CyberBadge>
            <p className="mt-4 font-display text-3xl uppercase tracking-[0.05em] text-white sm:text-4xl">
              {dictionary.pages.catalog.title}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-[15px] sm:leading-7">
              {dictionary.pages.catalog.subtitle}
            </p>
          </div>
          <div className="xl:hidden">
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
        </div>

        <div className="grid items-start gap-6 2xl:grid-cols-[340px_minmax(0,1fr)]">
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
              <div className="grid auto-rows-fr gap-5 sm:gap-6 md:grid-cols-2 2xl:grid-cols-3">
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
                      onDetailsClick={() => updateProductQuery(product.slug)}
                      ctaHref="#"
                      badges={badges}
                    />
                  );
                })}
              </div>
            ) : (
              <CyberCard variant="glass" className="border-white/10 bg-zinc-950/70">
                <CyberCardContent className="p-10 text-center text-lg text-zinc-400">
                  {selectedCategories.length ? text.emptyFilteredByCategory : text.empty}
                </CyberCardContent>
              </CyberCard>
            )}
          </div>
        </div>
      </section>

      {products.length ? (
        <section className="mx-auto mt-8 mb-10 flex w-full max-w-[92rem] flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-tech text-sm uppercase tracking-[0.1em] text-zinc-500">
            {text.page} {safePageIndex} / {totalPages}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPageIndex((current) => Math.max(1, current - 1))}
              disabled={safePageIndex === 1}
              className="grid size-10 place-items-center border border-white/10 bg-white/[0.035] text-zinc-300 transition hover:border-amber-200/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
              aria-label={text.previousPage}
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
              aria-label={text.nextPage}
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </section>
      ) : null}

      <Footer locale={locale} dictionary={dictionary} className="-mx-4 sm:-mx-6 lg:-mx-8" />

      <CyberDialog open={Boolean(selectedProduct)} onOpenChange={(open) => !open && updateProductQuery(null)}>
        <CyberDialogContent className="max-h-[90svh] overflow-hidden border-cyan-200/16 bg-[linear-gradient(180deg,rgba(5,10,24,0.96),rgba(2,6,16,0.98))] p-0 sm:max-w-4xl">
          {selectedProduct ? (
            <div className="grid max-h-[90svh] grid-rows-[auto_minmax(0,1fr)]">
              <CyberDialogHeader className="border-b border-white/10 px-6 pb-5 pt-6 sm:px-8">
                <CyberDialogDescription className="font-tech text-[11px] uppercase tracking-[0.16em] text-cyan-200/70">
                  {text.detailsLead}
                </CyberDialogDescription>
                <CyberDialogTitle className="pr-10 font-display text-2xl uppercase tracking-[0.04em] text-white sm:text-3xl">
                  {getLocalizedProductName(selectedProduct, locale)}
                </CyberDialogTitle>
              </CyberDialogHeader>

              <div className="grid min-h-0 gap-0 overflow-y-auto lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
                <div className="relative min-h-[20rem] border-b border-white/10 bg-[radial-gradient(circle_at_24%_18%,rgba(34,211,238,0.24),transparent_30%),radial-gradient(circle_at_78%_16%,rgba(244,63,94,0.18),transparent_28%),linear-gradient(145deg,rgba(8,15,28,0.98),rgba(3,6,14,1))] lg:min-h-full lg:border-b-0 lg:border-r">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.07)_1px,transparent_1px)] bg-[size:28px_28px] opacity-35" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),transparent_54%)]" />
                  <div className="relative z-10 flex h-full items-center justify-center p-6 sm:p-8">
                    <div className="h-full max-h-[28rem] w-full overflow-hidden border border-cyan-200/14 bg-black/30 shadow-[0_0_46px_rgba(34,211,238,0.10)]">
                      <ProductVisual product={selectedProduct} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-6 px-6 py-6 sm:px-8 sm:py-8">
                  <div className="flex flex-wrap gap-2.5">
                    {selectedProduct.is_new_arrival ? <CyberBadge variant="cyan" glow>{text.badgeNew}</CyberBadge> : null}
                    {selectedProduct.is_best_seller ? <CyberBadge variant="red" glow>{text.badgeHit}</CyberBadge> : null}
                    {selectedProduct.has_discount ? <CyberBadge variant="green" glow>{text.badgeSale}</CyberBadge> : null}
                  </div>

                  <div className="space-y-3">
                    <div className="font-display text-3xl text-lime-100 sm:text-4xl">
                      {formatProductPrice(selectedProduct, locale)}
                    </div>
                    {selectedProduct.old_price ? (
                      <div className="font-tech text-base text-zinc-500 line-through">
                        {formatProductOldPrice(selectedProduct, locale)}
                      </div>
                    ) : null}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="border border-white/10 bg-white/[0.03] px-4 py-3">
                      <p className="font-tech text-[11px] uppercase tracking-[0.14em] text-zinc-500">{text.brandLabel}</p>
                      <p className="mt-2 text-base text-zinc-100">{selectedProduct.brand.name}</p>
                    </div>
                    <div className="border border-white/10 bg-white/[0.03] px-4 py-3">
                      <p className="font-tech text-[11px] uppercase tracking-[0.14em] text-zinc-500">{text.categoryLabel}</p>
                      <p className="mt-2 text-base text-zinc-100">{getLocalizedCategoryName(selectedProduct.category, locale)}</p>
                    </div>
                    <div className="border border-white/10 bg-white/[0.03] px-4 py-3">
                      <p className="font-tech text-[11px] uppercase tracking-[0.14em] text-zinc-500">{text.sku}</p>
                      <p className="mt-2 text-base text-zinc-100">{selectedProduct.sku}</p>
                    </div>
                    <div className="border border-white/10 bg-white/[0.03] px-4 py-3">
                      <p className="font-tech text-[11px] uppercase tracking-[0.14em] text-zinc-500">{text.availabilityLabel}</p>
                      <p className="mt-2 text-base text-zinc-100">
                        {selectedProduct.quantity_in_stock > 0 ? text.inStock : text.outOfStock}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="font-tech text-[11px] uppercase tracking-[0.16em] text-zinc-500">{text.detailsLead}</p>
                    <p className="text-base leading-8 text-zinc-300">
                      {selectedProduct.description?.trim() || selectedProduct.short_description}
                    </p>
                  </div>

                  <div className="mt-auto grid gap-3 sm:grid-cols-2">
                    <CyberButton variant="ghost" onClick={() => updateProductQuery(null)}>
                      {text.details}
                    </CyberButton>
                    <CyberButton variant="primary">
                      {text.addToCart}
                    </CyberButton>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </CyberDialogContent>
      </CyberDialog>
    </main>
  );
}
