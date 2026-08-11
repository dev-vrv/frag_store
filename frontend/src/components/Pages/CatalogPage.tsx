"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  BadgePercent,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Filter,
  Heart,
  PackageCheck,
  Scale,
  Search,
  Sparkles,
  Star,
  Trophy,
  X,
} from "lucide-react";

import {
  CyberBadge,
  CyberButton,
  CyberCard,
  CyberCardContent,
  CyberInput,
  CyberNativeSelect,
  CyberSheet,
  CyberSheetContent,
  CyberSheetDescription,
  CyberSheetHeader,
  CyberSheetTitle,
  CyberSheetTrigger,
  CyberTabs,
  CyberTabsList,
  CyberTabsTrigger,
} from "@/components/cyber";
import { useCart } from "@/components/Cart/CartProvider";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import {
  ProductComparisonDialog,
  type ProductComparisonCategoryGroup,
} from "@/components/Products/ProductComparisonDialog";
import { ProductDetailsDialog } from "@/components/Products/ProductDetailsDialog";
import { CatalogProductCard } from "@/components/Products/CatalogProductCard";
import { ProductTypeIcon } from "@/components/Products/ProductTypeIcon";
import {
  reconcileComparisonGroups,
  useComparisonGroups,
  writeComparisonGroups,
} from "@/lib/comparison";
import { reconcileFavoriteIds, toggleFavorite, useFavoriteIds } from "@/lib/favorites";
import { type Dictionary, type Locale, localizePath } from "@/lib/i18n";
import {
  getLocalizedCategoryName,
  getLocalizedProductName,
  type ProductBrand,
  type Product,
  type ProductCategory,
} from "@/lib/products";
import { subscribeToProductStock } from "@/lib/notifications";
import { cn } from "@/lib/utils";

interface CatalogPageProps {
  locale: Locale;
  dictionary: Dictionary;
  products: Product[];
  categories: ProductCategory[];
  brands: ProductBrand[];
  initialCategory?: string[];
  initialBrand?: string;
  initialQuickFilters?: Partial<Record<QuickFilterKey, boolean>>;
}

type CompareActionResult = "added" | "removed" | "limit";

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
  | "inStock"
  | "favorites";

interface QuickFilterOption {
  key: QuickFilterKey;
  label: string;
}

const quickFilterIconByKey = {
  bestSeller: Trophy,
  discount: BadgePercent,
  newArrival: Sparkles,
  featured: Star,
  inStock: PackageCheck,
  favorites: Heart,
} as const;

const paginationWindowSize = 10;
type GridColumns = 1 | 2 | 3 | 4;

const catalogFilterButtonClassName =
  "catalog-filter-option font-tech group relative inline-flex min-h-[3rem] items-center overflow-hidden rounded-none border outline-none [clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,8px_100%,0_calc(100%-8px))] transition-[transform,border-color,background-color,color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:transform-none [&_svg]:relative [&_svg]:z-10";

const catalogFilterActiveClassName = "catalog-filter-option-active";

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
    resultsTitle: string;
    results: string;
    empty: string;
    emptyFilteredByCategory: string;
    emptyTitle: string;
    emptySubtitle: string;
    reset: string;
    addToCart: string;
    addedToCart: string;
    alreadyInCart: string;
    details: string;
    favorite: string;
    page: string;
    filters: string;
    featured: string;
    previousPage: string;
    nextPage: string;
    quickFilters: string;
    categoryShowcase: string;
    categoryShowcaseLead: string;
    gridDensity: string;
    favoritesOnly: string;
    detailsLead: string;
    hoverSpecs: string;
    specsLabel: string;
    close: string;
    removeFavorite: string;
    highlightsLabel: string;
    colorLabel: string;
    sku: string;
    brandLabel: string;
    categoryLabel: string;
    availabilityLabel: string;
    inStock: string;
    outOfStock: string;
    notifyStock: string;
    stockSubscribed: string;
    quickFilterOptions: QuickFilterOption[];
    badgeNew: string;
    badgeHit: string;
    badgeSale: string;
    compareLabel: string;
    compareActive: string;
    compareTrayTitle: string;
    compareTrayHint: string;
    compareTrayCategoryHint: string;
    compareTrayReady: string;
    compareTrayOpen: string;
    compareTrayClear: string;
    compareTrayClearAll: string;
    compareTrayLimit: string;
    compareTraySections: string;
    compareTrayCollapse: string;
    compareTrayExpand: string;
    compareToastAdded: string;
    compareToastRemoved: string;
    compareDialog: {
      badge: string;
      title: string;
      subtitle: string;
      close: string;
      clear: string;
      clearAll: string;
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
      sectionsLabel: string;
    };
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
    resultsTitle: "Результаты",
    results: "товаров найдено",
    empty: "По выбранным фильтрам товары не найдены.",
    emptyFilteredByCategory: "По выбранным фильтрам товары не найдены.",
    emptyTitle: "Товаров пока нет",
    emptySubtitle: "Товары появятся позже.",
    reset: "Сбросить",
    addToCart: "В корзину",
    addedToCart: "Добавлено в корзину",
    alreadyInCart: "В корзине",
    details: "Подробнее",
    favorite: "В избранное",
    page: "Страница",
    filters: "Фильтры",
    featured: "Каталог",
    previousPage: "Предыдущая страница",
    nextPage: "Следующая страница",
    quickFilters: "Быстрые фильтры",
    categoryShowcase: "Категории",
    categoryShowcaseLead: "Сначала выберите нужную категорию, затем откроется каталог по этому направлению.",
    gridDensity: "Сетка товаров",
    favoritesOnly: "Избранное",
    detailsLead: "Полные характеристики и описание",
    hoverSpecs: "Ключевые параметры",
    specsLabel: "Спецификации",
    close: "Закрыть",
    removeFavorite: "Убрать из избранного",
    highlightsLabel: "Ключевые преимущества",
    colorLabel: "Цвет",
    sku: "Артикул",
    brandLabel: "Марка",
    categoryLabel: "Категория",
    availabilityLabel: "Наличие",
    inStock: "В наличии",
    outOfStock: "Нет в наличии",
    notifyStock: "Сообщить о поступлении",
    stockSubscribed: "Уведомим о поступлении",
    quickFilterOptions: [
      { key: "bestSeller", label: "Лидеры продаж" },
      { key: "discount", label: "Со скидкой" },
      { key: "newArrival", label: "Новинки" },
      { key: "featured", label: "Подборка" },
      { key: "inStock", label: "В наличии" },
      { key: "favorites", label: "Избранное" },
    ],
    badgeNew: "Новинка",
    badgeHit: "Хит",
    badgeSale: "Скидка",
    compareLabel: "Сравнить",
    compareActive: "В сравнении",
    compareTrayTitle: "Сравнение товаров",
    compareTrayHint: "Выберите еще один товар этой же категории, чтобы открыть сравнение внутри раздела.",
    compareTrayCategoryHint: "Мышки, клавиатуры и другие категории теперь хранятся в отдельных разделах.",
    compareTrayReady: "Можно открыть подробное сравнение.",
    compareTrayOpen: "Открыть сравнение",
    compareTrayClear: "Очистить раздел",
    compareTrayClearAll: "Очистить все",
    compareTrayLimit: "До 3 товаров в разделе",
    compareTraySections: "Разделы сравнения",
    compareTrayCollapse: "Свернуть",
    compareTrayExpand: "Развернуть",
    compareToastAdded: "Товар добавлен в сравнение.",
    compareToastRemoved: "Товар убран из сравнения.",
    compareDialog: {
      badge: "Сравнение",
      title: "СРАВНЕНИЕ ТОВАРОВ",
      subtitle: "Смотрите ключевые различия по цене, наличию, характеристикам и сильным сторонам без переходов между карточками.",
      close: "Закрыть",
      clear: "Очистить раздел",
      clearAll: "Очистить все",
      openProduct: "Подробнее",
      removeProduct: "Убрать",
      differencesOnly: "Только различия",
      productsSelected: "товара выбрано",
      pickMore: "Выделенные отличия подсвечены, чтобы быстрее понять разницу между моделями.",
      categoryLabel: "Категория",
      brandLabel: "Марка",
      availabilityLabel: "Наличие",
      priceLabel: "Цена",
      skuLabel: "Артикул",
      highlightsLabel: "Сильные стороны",
      specsLabel: "Характеристики",
      inStock: "В наличии",
      outOfStock: "Нет в наличии",
      emptyValue: "Нет данных",
      parameterLabel: "Параметр",
      sectionsLabel: "Разделы",
    },
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
    resultsTitle: "Results",
    results: "products found",
    empty: "No products found for the selected filters.",
    emptyFilteredByCategory: "No products found for the selected filters.",
    emptyTitle: "No products yet",
    emptySubtitle: "Products will be added later.",
    reset: "Reset",
    addToCart: "Add to cart",
    addedToCart: "Added to cart",
    alreadyInCart: "In cart",
    details: "Details",
    favorite: "Add to favorites",
    page: "Page",
    filters: "Filters",
    featured: "Catalog",
    previousPage: "Previous page",
    nextPage: "Next page",
    quickFilters: "Quick filters",
    categoryShowcase: "Categories",
    categoryShowcaseLead: "Start from a category, then open the product grid already focused on that section.",
    gridDensity: "Product grid",
    favoritesOnly: "Favorites",
    detailsLead: "Full description and product details",
    hoverSpecs: "Key specs",
    specsLabel: "Specifications",
    close: "Close",
    removeFavorite: "Remove from favorites",
    highlightsLabel: "Highlights",
    colorLabel: "Color",
    sku: "SKU",
    brandLabel: "Brand",
    categoryLabel: "Category",
    availabilityLabel: "Availability",
    inStock: "In stock",
    outOfStock: "Out of stock",
    notifyStock: "Notify when available",
    stockSubscribed: "Notification enabled",
    quickFilterOptions: [
      { key: "bestSeller", label: "Best sellers" },
      { key: "discount", label: "On sale" },
      { key: "newArrival", label: "New arrivals" },
      { key: "featured", label: "Featured" },
      { key: "inStock", label: "In stock" },
      { key: "favorites", label: "Favorites" },
    ],
    badgeNew: "New",
    badgeHit: "Hit",
    badgeSale: "Sale",
    compareLabel: "Compare",
    compareActive: "Comparing",
    compareTrayTitle: "Product comparison",
    compareTrayHint: "Select one more product from the same category to open that section comparison.",
    compareTrayCategoryHint: "Mice, keyboards, and other categories are stored in separate sections now.",
    compareTrayReady: "Detailed comparison is ready.",
    compareTrayOpen: "Open comparison",
    compareTrayClear: "Clear section",
    compareTrayClearAll: "Clear all",
    compareTrayLimit: "Up to 3 products per section",
    compareTraySections: "Comparison sections",
    compareTrayCollapse: "Collapse",
    compareTrayExpand: "Expand",
    compareToastAdded: "Product added to comparison.",
    compareToastRemoved: "Product removed from comparison.",
    compareDialog: {
      badge: "Compare",
      title: "PRODUCT COMPARISON",
      subtitle: "Review pricing, availability, specs, and strengths side by side without jumping between product cards.",
      close: "Close",
      clear: "Clear section",
      clearAll: "Clear all",
      openProduct: "Details",
      removeProduct: "Remove",
      differencesOnly: "Differences only",
      productsSelected: "products selected",
      pickMore: "Changed values are highlighted so the main differences are easier to scan.",
      categoryLabel: "Category",
      brandLabel: "Brand",
      availabilityLabel: "Availability",
      priceLabel: "Price",
      skuLabel: "SKU",
      highlightsLabel: "Highlights",
      specsLabel: "Specifications",
      inStock: "In stock",
      outOfStock: "Out of stock",
      emptyValue: "No data",
      parameterLabel: "Parameter",
      sectionsLabel: "Sections",
    },
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
    resultsTitle: "Жыйынтыктар",
    results: "товар табылды",
    empty: "Тандалган фильтрлер боюнча товар табылган жок.",
    emptyFilteredByCategory: "Тандалган фильтрлер боюнча товар табылган жок.",
    emptyTitle: "Азырынча товар жок",
    emptySubtitle: "Товарлар кийинчерээк кошулат.",
    reset: "Тазалоо",
    addToCart: "Себетке",
    addedToCart: "Себетке кошулду",
    alreadyInCart: "Себетте",
    details: "Кененирээк",
    favorite: "Тандалгандарга",
    page: "Барак",
    filters: "Фильтрлер",
    featured: "Каталог",
    previousPage: "Мурунку барак",
    nextPage: "Кийинки барак",
    quickFilters: "Тез фильтрлер",
    categoryShowcase: "Категориялар",
    categoryShowcaseLead: "Адегенде категорияны тандаңыз, андан кийин каталог ошол бөлүк боюнча ачылат.",
    gridDensity: "Товар тору",
    favoritesOnly: "Тандалгандар",
    detailsLead: "Толук сүрөттөмө жана товар маалыматы",
    hoverSpecs: "Негизги мүнөздөмөлөр",
    specsLabel: "Спецификациялар",
    close: "Жабуу",
    removeFavorite: "Тандалгандардан алып салуу",
    highlightsLabel: "Негизги артыкчылыктар",
    colorLabel: "Түс",
    sku: "Артикул",
    brandLabel: "Марка",
    categoryLabel: "Категория",
    availabilityLabel: "Жеткиликтүүлүк",
    inStock: "Бар",
    outOfStock: "Жок",
    notifyStock: "Келгенде билдирүү",
    stockSubscribed: "Келгенде билдиребиз",
    quickFilterOptions: [
      { key: "bestSeller", label: "Сатуу лидерлери" },
      { key: "discount", label: "Арзандатуу менен" },
      { key: "newArrival", label: "Жаңы товарлар" },
      { key: "featured", label: "Подборка" },
      { key: "inStock", label: "Бар" },
      { key: "favorites", label: "Тандалгандар" },
    ],
    badgeNew: "Жаңы",
    badgeHit: "Хит",
    badgeSale: "Арзан",
    compareLabel: "Салыштыруу",
    compareActive: "Салыштырылууда",
    compareTrayTitle: "Товарларды салыштыруу",
    compareTrayHint: "Ошол эле категориядан дагы бир товар тандаңыз, ошондо ошол бөлүмдөгү салыштыруу ачылат.",
    compareTrayCategoryHint: "Чычкандар, клавиатуралар жана башка категориялар өзүнчө бөлүмдөрдө сакталат.",
    compareTrayReady: "Толук салыштыруу даяр.",
    compareTrayOpen: "Салыштырууну ачуу",
    compareTrayClear: "Бөлүмдү тазалоо",
    compareTrayClearAll: "Баарын тазалоо",
    compareTrayLimit: "Бөлүмдө 3 товарга чейин",
    compareTraySections: "Салыштыруу бөлүмдөрү",
    compareTrayCollapse: "Жыйноо",
    compareTrayExpand: "Жайып көрсөтүү",
    compareToastAdded: "Товар салыштырууга кошулду.",
    compareToastRemoved: "Товар салыштыруудан алынды.",
    compareDialog: {
      badge: "Салыштыруу",
      title: "ТОВАРЛАРДЫ САЛЫШТЫРУУ",
      subtitle: "Бааны, жеткиликтүүлүктү, мүнөздөмөлөрдү жана артыкчылыктарды бир экрандан катар көрүңүз.",
      close: "Жабуу",
      clear: "Бөлүмдү тазалоо",
      clearAll: "Баарын тазалоо",
      openProduct: "Кененирээк",
      removeProduct: "Алып салуу",
      differencesOnly: "Айырмасы гана",
      productsSelected: "товар тандалды",
      pickMore: "Айырмаланган маанилер тез табылышы үчүн өзүнчө белгиленет.",
      categoryLabel: "Категория",
      brandLabel: "Марка",
      availabilityLabel: "Жеткиликтүүлүк",
      priceLabel: "Баасы",
      skuLabel: "Артикул",
      highlightsLabel: "Артыкчылыктар",
      specsLabel: "Мүнөздөмөлөр",
      inStock: "Бар",
      outOfStock: "Жок",
      emptyValue: "Маалымат жок",
      parameterLabel: "Параметр",
      sectionsLabel: "Бөлүмдөр",
    },
  },
};

function getCategoryIcon(deviceType: string) {
  return <ProductTypeIcon deviceType={deviceType} className="size-5" />;
}

export function CatalogPage({
  locale,
  dictionary,
  products,
  categories,
  brands,
  initialCategory = [],
  initialBrand = "all",
  initialQuickFilters,
}: CatalogPageProps) {
  const text = catalogText[locale];
  const { addItem, hasItem } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const catalogSectionRef = useRef<HTMLElement | null>(null);
  const addToCartFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const compareFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const favoriteIds = useFavoriteIds();
  const comparisonGroups = useComparisonGroups();
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(() =>
    parseInitialCategories(initialCategory),
  );
  const [brand, setBrand] = useState(initialBrand);
  const [sort, setSort] = useState<SortKey>("popular");
  const [pageIndex, setPageIndex] = useState(1);
  const [selectedProductColorId, setSelectedProductColorId] = useState<number | null>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [lastAddedCartItemKey, setLastAddedCartItemKey] = useState<string | null>(null);
  const [compareFeedback, setCompareFeedback] = useState<string | null>(null);
  const [stockSubscriptionIds, setStockSubscriptionIds] = useState<Set<number>>(() => new Set());
  const [stockSubscriptionError, setStockSubscriptionError] = useState<string | null>(null);
  const [isComparisonDialogOpen, setIsComparisonDialogOpen] = useState(false);
  const [isComparisonTrayCollapsed, setIsComparisonTrayCollapsed] = useState(false);
  const [activeComparisonCategorySlug, setActiveComparisonCategorySlug] = useState<string | null>(null);
  const [gridColumns, setGridColumns] = useState<GridColumns>(4);
  const [quickFilters, setQuickFilters] = useState<Record<QuickFilterKey, boolean>>({
    bestSeller: false,
    discount: false,
    newArrival: initialQuickFilters?.newArrival ?? false,
    featured: false,
    inStock: false,
    favorites: false,
  });
  const favoriteIdSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  useEffect(() => {
    function clampGridColumnsToViewport() {
      const maximumColumns: GridColumns = window.innerWidth >= 1280
        ? 4
        : window.innerWidth >= 1024
          ? 3
          : window.innerWidth >= 640
            ? 2
            : 1;

      setGridColumns((current) => Math.min(current, maximumColumns) as GridColumns);
    }

    clampGridColumnsToViewport();
    window.addEventListener("resize", clampGridColumnsToViewport);

    return () => window.removeEventListener("resize", clampGridColumnsToViewport);
  }, []);

  const comparisonCategoryGroups = useMemo<ProductComparisonCategoryGroup[]>(
    () =>
      Object.entries(comparisonGroups)
        .map(([slug, ids]) => {
          const groupProducts = ids
            .map((id) => products.find((product) => product.id === id) ?? null)
            .filter((product): product is Product => Boolean(product));

          if (!groupProducts.length) {
            return null;
          }

          return {
            slug,
            label: getLocalizedCategoryName(groupProducts[0].category, locale),
            products: groupProducts,
          };
        })
        .filter((group): group is ProductComparisonCategoryGroup => Boolean(group))
        .sort((left, right) => left.label.localeCompare(right.label, locale === "en" ? "en" : "ru")),
    [comparisonGroups, locale, products],
  );
  const flattenedComparisonIds = useMemo(
    () => comparisonCategoryGroups.flatMap((group) => group.products.map((product) => product.id)),
    [comparisonCategoryGroups],
  );
  const comparisonIdSet = useMemo(() => new Set(flattenedComparisonIds), [flattenedComparisonIds]);
  const resolvedActiveComparisonCategorySlug =
    comparisonCategoryGroups.find((group) => group.slug === activeComparisonCategorySlug)?.slug ??
    comparisonCategoryGroups[0]?.slug ??
    null;
  const activeComparisonGroup =
    comparisonCategoryGroups.find((group) => group.slug === resolvedActiveComparisonCategorySlug) ?? null;
  const activeComparisonProducts = activeComparisonGroup?.products ?? [];
  const favoritesFromQuery = searchParams.get("favorites") === "1";
  const activeQuickFilters = useMemo(
    () => ({
      ...quickFilters,
      favorites: favoritesFromQuery,
    }),
    [favoritesFromQuery, quickFilters],
  );

  useEffect(() => {
    if (!favoriteIds.length) {
      return;
    }

    reconcileFavoriteIds(products.map((product) => product.id));
  }, [favoriteIds, products]);

  useEffect(() => {
    if (!Object.keys(comparisonGroups).length) {
      return;
    }

    reconcileComparisonGroups(
      products.map((product) => ({ id: product.id, categorySlug: product.category.slug })),
    );
  }, [comparisonGroups, products]);

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
  const itemsPerPage = gridColumns * 2;

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
        (!activeQuickFilters.bestSeller || product.is_best_seller) &&
        (!activeQuickFilters.discount || product.has_discount) &&
        (!activeQuickFilters.newArrival || product.is_new_arrival) &&
        (!activeQuickFilters.featured || product.is_featured) &&
        (!activeQuickFilters.inStock || product.quantity_in_stock > 0) &&
        (!activeQuickFilters.favorites || favoriteIdSet.has(product.id));

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
  }, [activeQuickFilters, brand, favoriteIdSet, products, query, selectedCategorySet, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const safePageIndex = Math.min(pageIndex, totalPages);
  const paginationWindowStart =
    Math.floor((safePageIndex - 1) / paginationWindowSize) * paginationWindowSize + 1;
  const paginationWindowEnd = Math.min(totalPages, paginationWindowStart + paginationWindowSize - 1);
  const visiblePageItems = Array.from(
    { length: paginationWindowEnd - paginationWindowStart + 1 },
    (_, index) => paginationWindowStart + index,
  );
  const paginatedProducts = filteredProducts.slice(
    (safePageIndex - 1) * itemsPerPage,
    safePageIndex * itemsPerPage,
  );

  const activeQuickFilterCount = Object.values(activeQuickFilters).filter(Boolean).length;
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
  const resolvedSelectedProductColorId =
    selectedProductColorId ?? selectedProduct?.color_options[0]?.id ?? null;
  const selectedProductCartKey = selectedProduct
    ? `${selectedProduct.id}:${resolvedSelectedProductColorId ?? "none"}`
    : null;
  const selectedProductAlreadyInCart = selectedProduct
    ? hasItem(selectedProduct.id, resolvedSelectedProductColorId)
    : false;
  const selectedProductJustAdded =
    selectedProductCartKey != null && lastAddedCartItemKey === selectedProductCartKey;

  useEffect(() => {
    return () => {
      if (addToCartFeedbackTimeoutRef.current) {
        clearTimeout(addToCartFeedbackTimeoutRef.current);
      }
      if (compareFeedbackTimeoutRef.current) {
        clearTimeout(compareFeedbackTimeoutRef.current);
      }
    };
  }, []);

  function replaceSearchParams(mutator: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutator(params);
    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }

  function updateProductQuery(productSlug: string | null) {
    if (productSlug) {
      const product = products.find((item) => item.slug === productSlug) ?? null;
      setSelectedProductColorId(product?.color_options[0]?.id ?? null);
      setSelectedMediaIndex(0);
    } else {
      setSelectedProductColorId(null);
      setSelectedMediaIndex(0);
    }

    replaceSearchParams((params) => {
      if (productSlug) {
        params.set("product", productSlug);
      } else {
        params.delete("product");
      }
    });
  }

  function triggerAddToCartFeedback(cartItemKey: string) {
    setLastAddedCartItemKey(cartItemKey);

    if (addToCartFeedbackTimeoutRef.current) {
      clearTimeout(addToCartFeedbackTimeoutRef.current);
    }

    addToCartFeedbackTimeoutRef.current = setTimeout(() => {
      setLastAddedCartItemKey((current) => (current === cartItemKey ? null : current));
      addToCartFeedbackTimeoutRef.current = null;
    }, 2200);
  }

  function showCompareFeedback(message: string) {
    setCompareFeedback(message);

    if (compareFeedbackTimeoutRef.current) {
      clearTimeout(compareFeedbackTimeoutRef.current);
    }

    compareFeedbackTimeoutRef.current = setTimeout(() => {
      setCompareFeedback((current) => (current === message ? null : current));
      compareFeedbackTimeoutRef.current = null;
    }, 2400);
  }

  async function handleCatalogCardAddToCart(product: Product) {
    if (product.quantity_in_stock <= 0) {
      try {
        setStockSubscriptionError(null);
        await subscribeToProductStock(product.slug, locale);
        setStockSubscriptionIds((current) => new Set(current).add(product.id));
      } catch (error) {
        if ((error as Error & { status?: number }).status === 401) {
          router.push(`${localizePath("/auth", locale)}?next=${encodeURIComponent(pathname)}`);
        } else {
          setStockSubscriptionError((error as Error).message);
        }
      }
      return;
    }

    const defaultColorId = product.color_options[0]?.id ?? null;

    if (hasItem(product.id, defaultColorId)) {
      return;
    }

    addItem(product.id, 1, defaultColorId);
    triggerAddToCartFeedback(`${product.id}:${defaultColorId ?? "none"}`);
  }

  async function handleSelectedProductAddToCart() {
    if (selectedProduct?.quantity_in_stock === 0) {
      await handleCatalogCardAddToCart(selectedProduct);
      return;
    }

    if (
      !selectedProduct ||
      selectedProduct.quantity_in_stock <= 0 ||
      (selectedProduct.color_options.length > 0 && !resolvedSelectedProductColorId) ||
      selectedProductAlreadyInCart
    ) {
      return;
    }

    addItem(selectedProduct.id, 1, resolvedSelectedProductColorId);
    triggerAddToCartFeedback(`${selectedProduct.id}:${resolvedSelectedProductColorId ?? "none"}`);
  }

  function toggleComparison(product: Product): CompareActionResult {
    const currentCategoryIds = [...(comparisonGroups[product.category.slug] ?? [])];

    if (currentCategoryIds.includes(product.id)) {
      const nextGroups = { ...comparisonGroups };
      const nextCategoryIds = currentCategoryIds.filter((id) => id !== product.id);

      if (nextCategoryIds.length) {
        nextGroups[product.category.slug] = nextCategoryIds;
      } else {
        delete nextGroups[product.category.slug];
      }

      writeComparisonGroups(nextGroups);
      return "removed";
    }

    if (currentCategoryIds.length >= 3) {
      return "limit";
    }

    writeComparisonGroups({
      ...comparisonGroups,
      [product.category.slug]: [...currentCategoryIds, product.id],
    });
    return "added";
  }

  function handleComparisonToggle(product: Product) {
    const result = toggleComparison(product);

    if (result === "added") {
      setActiveComparisonCategorySlug(product.category.slug);
      setIsComparisonTrayCollapsed(false);
      showCompareFeedback(text.compareToastAdded);
      return;
    }

    if (result === "removed") {
      showCompareFeedback(text.compareToastRemoved);
      return;
    }

    if (result === "limit") {
      showCompareFeedback(text.compareTrayLimit);
      return;
    }
  }

  function clearComparison() {
    writeComparisonGroups({});
    setCompareFeedback(null);
    setIsComparisonDialogOpen(false);
    setIsComparisonTrayCollapsed(false);
  }

  function clearComparisonCategory(categorySlug: string) {
    const nextGroups = { ...comparisonGroups };
    delete nextGroups[categorySlug];
    writeComparisonGroups(nextGroups);
    setCompareFeedback(null);

    if (resolvedActiveComparisonCategorySlug === categorySlug) {
      const fallbackGroup = comparisonCategoryGroups.find((group) => group.slug !== categorySlug) ?? null;
      setActiveComparisonCategorySlug(fallbackGroup?.slug ?? null);
      if (!fallbackGroup) {
        setIsComparisonDialogOpen(false);
        setIsComparisonTrayCollapsed(false);
      }
    }
  }

  function toggleQuickFilter(key: QuickFilterKey) {
    if (key === "favorites") {
      replaceSearchParams((params) => {
        if (favoritesFromQuery) {
          params.delete("favorites");
        } else {
          params.set("favorites", "1");
        }
      });
      setPageIndex(1);
      return;
    }

    setQuickFilters((current) => ({
      ...current,
      [key]: !current[key],
    }));
    setPageIndex(1);
  }

  function toggleCategory(value: string) {
    if (value === "all") {
      setSelectedCategories([]);
      replaceSearchParams((params) => {
        params.delete("category");
      });
      setPageIndex(1);
      return;
    }

    setSelectedCategories((current) => {
      const nextCategories = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];

      replaceSearchParams((params) => {
        if (nextCategories.length) {
          params.set("category", nextCategories.join(","));
        } else {
          params.delete("category");
        }
      });

      return nextCategories;
    });
    setPageIndex(1);
  }

  function scrollCatalogToTop() {
    const targetTop = catalogSectionRef.current
      ? catalogSectionRef.current.getBoundingClientRect().top + window.scrollY - 96
      : 0;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth",
    });
  }

  function setCatalogPage(nextPage: number | ((current: number) => number)) {
    setPageIndex((current) => {
      const resolvedPage =
        typeof nextPage === "function" ? nextPage(current) : nextPage;

      if (resolvedPage !== current) {
        window.requestAnimationFrame(scrollCatalogToTop);
      }

      return resolvedPage;
    });
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
      favorites: false,
    });
    replaceSearchParams((params) => {
      params.delete("favorites");
      params.delete("category");
    });
    setPageIndex(1);
  }

  const filterPanel = (
    <div className="catalog-filter-panel space-y-6">
      <div className="space-y-4">
        <p className="catalog-heading font-tech text-[0.82rem] font-bold uppercase tracking-[0.1em]">
          {text.resultsTitle}
        </p>
        <dl className="catalog-filter-summary space-y-1.5 border px-3 py-3 font-tech text-[0.82rem] leading-5">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="catalog-muted">{text.results}:</dt>
            <dd className="catalog-heading text-sm font-bold">{filteredProducts.length}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="catalog-muted">{text.filters}:</dt>
            <dd className="catalog-heading text-sm font-bold">
              {activeQuickFilterCount + selectedCategories.length + Number(brand !== "all")}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="catalog-muted">{text.page}:</dt>
            <dd className="catalog-heading text-sm font-bold">{safePageIndex}/{totalPages}</dd>
          </div>
        </dl>
      </div>

      <div className="catalog-filter-fields space-y-4 [&_label]:text-[0.78rem] [&_label]:uppercase [&_label]:tracking-[0.1em]">
        <CyberInput
          className="catalog-filter-field text-sm placeholder:text-sm"
          labelClassName="catalog-heading"
          label={text.search}
          placeholder={text.searchPlaceholder}
          icon={<Search className="catalog-filter-icon" aria-hidden="true" />}
          tone="red"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPageIndex(1);
          }}
        />
        <CyberNativeSelect
          className="catalog-filter-field text-sm before:hidden after:hidden"
          label={text.brand}
          tone="red"
          value={brand}
          onValueChange={(value) => {
            setBrand(value);
            setPageIndex(1);
          }}
          options={brandOptions}
        />
        <CyberNativeSelect
          className="catalog-filter-field text-sm before:hidden after:hidden"
          label={text.sort}
          tone="red"
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

      <div className="catalog-divider space-y-4 border-t pt-4">
        <p className="catalog-heading font-tech text-[0.82rem] font-bold uppercase tracking-[0.1em]">
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
                catalogFilterButtonClassName,
                "justify-start gap-2 px-3 py-2 text-left text-[0.82rem] leading-[1.3] tracking-[0.01em] [&_svg]:size-3.5 [&_svg]:shrink-0",
                item.value === "all" && "col-span-2 justify-center",
                ((item.value === "all" && selectedCategories.length === 0) ||
                  selectedCategorySet.has(item.value)) &&
                  catalogFilterActiveClassName,
              )}
            >
              {item.icon}
              <span className="relative z-10">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="catalog-divider space-y-4 border-t pt-4">
        <p className="catalog-heading font-tech text-[0.82rem] font-bold uppercase tracking-[0.1em]">
          {text.quickFilters}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {text.quickFilterOptions.map((option) => {
            const isActive = activeQuickFilters[option.key];
            const Icon = quickFilterIconByKey[option.key];

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => toggleQuickFilter(option.key)}
                aria-pressed={isActive}
                className={cn(
                  catalogFilterButtonClassName,
                  "justify-start gap-2 px-3 py-2 text-left text-[0.82rem] leading-[1.3] tracking-[0.01em] [&_svg]:size-3.5 [&_svg]:shrink-0",
                  isActive && catalogFilterActiveClassName,
                )}
              >
                <Icon aria-hidden="true" />
                <span className="relative z-10">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="catalog-divider space-y-4 border-t pt-4">
        <p className="catalog-heading font-tech text-[0.82rem] font-bold uppercase tracking-[0.1em]">
          {text.gridDensity}
        </p>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setGridColumns(value as GridColumns)}
              className={cn(
                catalogFilterButtonClassName,
                "min-w-10 flex-1 justify-center px-3 py-2 text-[0.82rem] font-semibold",
                value === 2 && "hidden sm:inline-flex",
                value === 3 && "hidden lg:inline-flex",
                value === 4 && "hidden xl:inline-flex",
                gridColumns === value && catalogFilterActiveClassName,
              )}
              aria-pressed={gridColumns === value}
            >
              <span className="relative z-10">{value}</span>
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="catalog-divider border-t pt-4">
          <CyberButton
            type="button"
            variant="danger"
            size="sm"
            className="catalog-filter-reset w-full before:hidden after:hidden"
            onClick={resetFilters}
          >
            {text.reset}
          </CyberButton>
        </div>
      ) : null}
    </div>
  );

  return (
    <main className="catalog-ui page-shell relative overflow-x-clip bg-transparent px-4 pt-32 text-zinc-50 sm:px-6 lg:px-8">
      <Header locale={locale} dictionary={dictionary.header} />
      <div className="relative z-10">
        <section ref={catalogSectionRef} className="mx-auto w-full max-w-[100rem] py-8">
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
                  <CyberButton
                    variant="ghost"
                    className="catalog-filter-launcher before:hidden after:hidden"
                  >
                    <Filter aria-hidden="true" />
                    {text.filters}
                  </CyberButton>
                </CyberSheetTrigger>
                <CyberSheetContent side="left" className="catalog-ui catalog-filter-sheet w-[88vw] p-5 sm:max-w-md">
                  <CyberSheetHeader className="catalog-divider border-b pb-4">
                    <CyberSheetTitle className="catalog-heading font-display text-2xl uppercase tracking-[0.05em]">
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

          <div className="grid items-start gap-6 xl:grid-cols-[300px_minmax(0,1fr)] 2xl:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="hidden xl:block">
              <CyberCard
                variant="glass"
                className="catalog-filter-shell sticky top-32 overflow-hidden before:hidden after:hidden"
              >
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
                      <h2 className="font-display type-h2-display text-white">
                        {text.emptyTitle}
                      </h2>
                      <p className="font-tech type-body mx-auto max-w-2xl text-zinc-400">
                        {text.emptySubtitle}
                      </p>
                    </div>
                  </CyberCardContent>
                </CyberCard>
              ) : paginatedProducts.length ? (
                <div
                  className={cn(
                    "grid auto-rows-fr gap-4 sm:gap-5",
                    gridColumns === 1 && "grid-cols-1",
                    gridColumns === 2 && "sm:grid-cols-2",
                    gridColumns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
                    gridColumns === 4 && "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                  )}
                >
                  {paginatedProducts.map((product) => {
                    const defaultColorId = product.color_options[0]?.id ?? null;
                    const cardAlreadyInCart = hasItem(product.id, defaultColorId);

                    return (
                      <CatalogProductCard
                        key={product.id}
                        product={product}
                        locale={locale}
                        labels={{
                          badgeNew: text.badgeNew,
                          badgeHit: text.badgeHit,
                          cta:
                            product.quantity_in_stock <= 0
                              ? stockSubscriptionIds.has(product.id)
                                ? text.stockSubscribed
                                : text.notifyStock
                              : cardAlreadyInCart
                                ? text.alreadyInCart
                                : text.addToCart,
                          details: text.details,
                          favorite: text.favorite,
                          hoverSpecs: text.hoverSpecs,
                          compare: comparisonIdSet.has(product.id) ? text.compareActive : text.compareLabel,
                        }}
                        alreadyInCart={cardAlreadyInCart}
                        favoriteActive={favoriteIdSet.has(product.id)}
                        compareActive={comparisonIdSet.has(product.id)}
                        onFavoriteClick={() => toggleFavorite(product.id)}
                        onCompareClick={() => handleComparisonToggle(product)}
                        onDetailsClick={() => updateProductQuery(product.slug)}
                        onCtaClick={() => handleCatalogCardAddToCart(product)}
                        ctaDisabled={stockSubscriptionIds.has(product.id) || cardAlreadyInCart}
                        stackActions={gridColumns >= 2}
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
          <section className="mx-auto mt-8 mb-10 flex w-full max-w-[92rem] flex-col items-center gap-4 border-t border-white/10 pt-6 text-center">
            <div className="font-tech text-sm uppercase tracking-[0.1em] text-zinc-500">
              {text.page} {safePageIndex} / {totalPages}
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setCatalogPage((current) => Math.max(1, current - 1))}
                disabled={safePageIndex === 1}
                className="grid size-10 place-items-center border border-white/10 bg-white/[0.035] text-zinc-300 transition hover:border-cyan-300/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                aria-label={text.previousPage}
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>
              {visiblePageItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCatalogPage(item)}
                  className={cn(
                    "grid size-10 place-items-center border border-white/10 bg-white/[0.035] text-sm text-zinc-300 transition hover:border-cyan-300/35 hover:text-white",
                    safePageIndex === item && "border-cyan-300/50 bg-cyan-300/[0.10] text-cyan-100",
                  )}
                  aria-current={safePageIndex === item ? "page" : undefined}
                >
                  {item}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCatalogPage((current) => Math.min(totalPages, current + 1))}
                disabled={safePageIndex === totalPages}
                className="grid size-10 place-items-center border border-white/10 bg-white/[0.035] text-zinc-300 transition hover:border-cyan-300/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                aria-label={text.nextPage}
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </section>
        ) : null}

        <Footer
          locale={locale}
          dictionary={dictionary}
          className="-mx-4 sm:-mx-6 lg:-mx-8"
        />
      </div>

      {comparisonCategoryGroups.length ? (
        <div className="comparison-ui pointer-events-none fixed inset-x-0 bottom-4 z-40 px-4">
          <div className="mx-auto w-full max-w-4xl">
            {compareFeedback ? (
              <div className="comparison-panel pointer-events-auto mx-auto mb-3 w-fit rounded-md border px-4 py-2 text-sm backdrop-blur-xl">
                {compareFeedback}
              </div>
            ) : null}
            <CyberCard
              variant="glass"
              className="comparison-panel pointer-events-auto overflow-hidden backdrop-blur-2xl before:hidden after:hidden"
            >
              <CyberCardContent className="p-3 sm:p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <CyberBadge variant="neutral" className="comparison-badge min-h-8 px-3 text-[10px]">
                          <Scale className="mr-1.5 size-3.5" aria-hidden="true" />
                          {text.compareTrayTitle}
                        </CyberBadge>
                        <span className="comparison-heading font-tech text-[10px] uppercase tracking-[0.14em]">
                          {flattenedComparisonIds.length}
                        </span>
                        <span className="comparison-muted font-tech text-[10px] uppercase tracking-[0.14em]">
                          {text.compareTrayLimit}
                        </span>
                      </div>
                      {!isComparisonTrayCollapsed ? (
                        <p className="comparison-muted text-xs leading-5 sm:text-sm">
                          {activeComparisonProducts.length >= 2 ? text.compareTrayReady : text.compareTrayHint}
                        </p>
                      ) : null}
                    </div>

                    <CyberButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsComparisonTrayCollapsed((current) => !current)}
                      className="comparison-button h-9 min-h-9 shrink-0 px-2 text-[10px] uppercase tracking-[0.1em]"
                      aria-expanded={!isComparisonTrayCollapsed}
                      aria-label={isComparisonTrayCollapsed ? text.compareTrayExpand : text.compareTrayCollapse}
                    >
                      {isComparisonTrayCollapsed ? (
                        <ChevronUp className="size-3.5" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="size-3.5" aria-hidden="true" />
                      )}
                      <span>{isComparisonTrayCollapsed ? text.compareTrayExpand : text.compareTrayCollapse}</span>
                    </CyberButton>
                  </div>

                  {!isComparisonTrayCollapsed ? (
                    <div className="comparison-divider flex flex-col gap-3 border-t pt-3">
                      {comparisonCategoryGroups.length > 1 ? (
                        <CyberTabs
                          value={resolvedActiveComparisonCategorySlug ?? undefined}
                          onValueChange={setActiveComparisonCategorySlug}
                          className="gap-2"
                        >
                          <div className="space-y-2">
                            <p className="comparison-muted font-tech text-[10px] uppercase tracking-[0.14em]">
                              {text.compareTraySections}
                            </p>
                            <CyberTabsList className="comparison-tabs-list w-full gap-1.5 overflow-x-auto p-1">
                              {comparisonCategoryGroups.map((group) => (
                                <CyberTabsTrigger
                                  key={group.slug}
                                  value={group.slug}
                                  className="comparison-tabs-trigger min-h-9 min-w-fit px-3 py-2 text-[11px] tracking-[0.12em]"
                                >
                                  <span>{group.label}</span>
                                  <span className="font-tech text-[10px] opacity-65">
                                    {group.products.length}
                                  </span>
                                </CyberTabsTrigger>
                              ))}
                            </CyberTabsList>
                          </div>
                        </CyberTabs>
                      ) : null}

                      <div className="flex flex-wrap gap-2">
                        {activeComparisonProducts.map((product, index) => {
                          const productName = getLocalizedProductName(product, locale);

                          return (
                            <button
                              key={product.id}
                              type="button"
                              onClick={() => handleComparisonToggle(product)}
                              className="comparison-selected-item inline-flex min-h-11 max-w-full items-stretch border text-left text-xs transition"
                              aria-label={`${text.compareDialog.removeProduct}: ${productName}`}
                            >
                              <span className="comparison-selected-index" aria-hidden="true">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <span className="max-w-[14rem] truncate px-3 py-3">{productName}</span>
                              <span className="comparison-selected-remove" aria-hidden="true">
                                <X className="size-3.5" />
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                        {activeComparisonGroup ? (
                          <CyberButton
                            variant="ghost"
                            size="sm"
                            onClick={() => clearComparisonCategory(activeComparisonGroup.slug)}
                            className="comparison-button"
                          >
                            {text.compareTrayClear}
                          </CyberButton>
                        ) : null}
                        <CyberButton
                          variant="ghost"
                          size="sm"
                          onClick={clearComparison}
                          className="comparison-button"
                        >
                          {text.compareTrayClearAll}
                        </CyberButton>
                        <CyberButton
                          variant="secondary"
                          size="sm"
                          onClick={() => setIsComparisonDialogOpen(true)}
                          disabled={activeComparisonProducts.length < 2}
                          className="comparison-button comparison-button-primary"
                        >
                          <Scale className="size-4" aria-hidden="true" />
                          {text.compareTrayOpen}
                        </CyberButton>
                      </div>
                    </div>
                  ) : null}
                </div>
              </CyberCardContent>
            </CyberCard>
          </div>
        </div>
      ) : null}

      <ProductDetailsDialog
        open={Boolean(selectedProduct)}
        onOpenChange={(open) => !open && updateProductQuery(null)}
        locale={locale}
        product={selectedProduct}
        labels={text}
        selectedColorId={resolvedSelectedProductColorId}
        onSelectColor={setSelectedProductColorId}
        selectedMediaIndex={selectedMediaIndex}
        onSelectMediaIndex={setSelectedMediaIndex}
        actionLabel={
          selectedProduct
            ? selectedProduct.quantity_in_stock <= 0
              ? stockSubscriptionIds.has(selectedProduct.id)
                ? text.stockSubscribed
                : text.notifyStock
              : selectedProductAlreadyInCart
                ? text.alreadyInCart
                : selectedProductJustAdded
                  ? text.addedToCart
                  : text.addToCart
            : text.addToCart
        }
        actionDisabled={
          !selectedProduct ||
          (selectedProduct.quantity_in_stock <= 0 && stockSubscriptionIds.has(selectedProduct.id)) ||
          (selectedProduct.color_options.length > 0 && !resolvedSelectedProductColorId) ||
          selectedProductAlreadyInCart
        }
        actionClassName={cn(
          selectedProductJustAdded &&
            "animate-pulse border-lime-200 shadow-[0_0_42px_rgba(190,242,100,0.32)]",
        )}
        onAction={handleSelectedProductAddToCart}
        actionNotice={
          selectedProduct && selectedProduct.quantity_in_stock > 0 && selectedProductJustAdded
            ? text.addedToCart
            : null
        }
        favoriteActive={selectedProduct ? favoriteIdSet.has(selectedProduct.id) : false}
        onToggleFavorite={selectedProduct ? () => toggleFavorite(selectedProduct.id) : undefined}
      />

      {stockSubscriptionError ? (
        <div className="fixed bottom-5 left-1/2 z-50 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-md border border-red-300/30 bg-zinc-950/95 px-4 py-3 text-center text-sm text-red-100 shadow-[0_0_30px_rgba(255,23,68,0.18)]">
          {stockSubscriptionError}
        </div>
      ) : null}

      <ProductComparisonDialog
        open={isComparisonDialogOpen}
        onOpenChange={setIsComparisonDialogOpen}
        locale={locale}
        groups={comparisonCategoryGroups}
        activeCategorySlug={resolvedActiveComparisonCategorySlug}
        labels={text.compareDialog}
        onSelectCategorySlug={setActiveComparisonCategorySlug}
        onOpenProduct={(product) => {
          setIsComparisonDialogOpen(false);
          updateProductQuery(product.slug);
        }}
        onRemoveProduct={(categorySlug, productId) => {
          const currentCategoryIds = [...(comparisonGroups[categorySlug] ?? [])];
          const nextCategoryIds = currentCategoryIds.filter((id) => id !== productId);
          const nextGroups = { ...comparisonGroups };

          if (nextCategoryIds.length) {
            nextGroups[categorySlug] = nextCategoryIds;
          } else {
            delete nextGroups[categorySlug];
          }

          writeComparisonGroups(nextGroups);
          if (!Object.keys(nextGroups).length) {
            setIsComparisonDialogOpen(false);
          }
        }}
        onClearCategory={clearComparisonCategory}
        onClearAll={clearComparison}
      />

    </main>
  );
}
