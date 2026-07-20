"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Filter,
  PackageCheck,
  Scale,
  Search,
  Sparkles,
  X,
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
  CyberTabs,
  CyberTabsList,
  CyberTabsTrigger,
} from "@/components/cyber";
import { GeometricBackdrop } from "@/components/Background/GeometricBackdrop";
import { useCart } from "@/components/Cart/CartProvider";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import {
  ProductComparisonDialog,
  type ProductComparisonCategoryGroup,
} from "@/components/Products/ProductComparisonDialog";
import { ProductDetailsDialog } from "@/components/Products/ProductDetailsDialog";
import { ProductTypeIcon } from "@/components/Products/ProductTypeIcon";
import {
  reconcileComparisonGroups,
  useComparisonGroups,
  writeComparisonGroups,
} from "@/lib/comparison";
import { reconcileFavoriteIds, toggleFavorite, useFavoriteIds } from "@/lib/favorites";
import { type Dictionary, type Locale, localizePath } from "@/lib/i18n";
import {
  formatProductOldPrice,
  formatProductPrice,
  getLocalizedCategoryName,
  getLocalizedProductName,
  type ProductBrand,
  type Product,
  type ProductCategory,
  type ProductMedia,
  type ProductTechnicalHighlight,
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

const paginationWindowSize = 10;
type GridColumns = 1 | 2 | 3 | 4;

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

  if (!source) {
    return false;
  }

  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(source);
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
        {getCategoryIcon(product.category.device_type)}
      </div>
    </div>
  );
}

function ProductHoverSpecs({
  product,
  title,
}: {
  product: Product;
  title: string;
}) {
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
            className="min-w-0 rounded-md border border-white/10 bg-white/[0.045] px-2.5 py-2"
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
    <div className="space-y-6">
      <dl className="space-y-2 border-l-2 border-cyan-300/30 pl-3 font-tech text-sm">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-zinc-400">{text.results}:</dt>
          <dd className="font-bold text-white">{filteredProducts.length}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-zinc-400">{text.filters}:</dt>
          <dd className="font-bold text-red-100">
            {activeQuickFilterCount + selectedCategories.length + Number(brand !== "all")}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-zinc-400">{text.page}:</dt>
          <dd className="font-bold text-white">{safePageIndex}/{totalPages}</dd>
        </div>
      </dl>

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
        <p className="font-tech text-[0.92rem] font-semibold uppercase tracking-[0.12em] text-zinc-500">
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
                "font-tech inline-flex min-h-[3rem] items-center justify-start gap-2 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-left text-[0.92rem] leading-[1.25] tracking-[0.01em] text-zinc-200 transition duration-300 hover:border-red-300/28 hover:bg-white/[0.07] hover:text-white [&_svg]:size-3.5 [&_svg]:shrink-0",
                item.value === "all" && "col-span-2 justify-center",
                ((item.value === "all" && selectedCategories.length === 0) ||
                  selectedCategorySet.has(item.value)) &&
                  "border-red-300/32 bg-red-500/[0.08] text-red-50 shadow-[0_12px_30px_rgba(255,23,68,0.08)]",
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 border-t border-white/10 pt-4">
        <p className="font-tech text-[0.92rem] font-semibold uppercase tracking-[0.12em] text-zinc-500">
          {text.quickFilters}
        </p>
        <div className="grid grid-cols-2 gap-2">
            {text.quickFilterOptions.map((option) => {
              const isActive = activeQuickFilters[option.key];

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => toggleQuickFilter(option.key)}
                aria-pressed={isActive}
                className={cn(
                  "group flex min-h-[3rem] items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-center transition duration-300 hover:border-cyan-200/30 hover:bg-white/[0.06]",
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
                    "font-tech text-[0.92rem] leading-[1.25] tracking-[0.01em] text-zinc-200 transition duration-300",
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

      <div className="space-y-3 border-t border-white/10 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-tech text-[0.92rem] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            {text.gridDensity}
          </p>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setGridColumns(value as GridColumns)}
                className={cn(
                  "min-w-10 border px-3 py-2 text-sm font-semibold text-zinc-300 transition",
                  value === 2 && "hidden sm:block",
                  value === 3 && "hidden lg:block",
                  value === 4 && "hidden xl:block",
                  gridColumns === value
                    ? "border-cyan-300/34 bg-cyan-300/12 text-white"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:text-white",
                )}
                aria-pressed={gridColumns === value}
              >
                {value}
              </button>
            ))}
          </div>
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
    <main className="page-shell relative overflow-x-clip bg-[linear-gradient(180deg,#121218_0%,#101016_24%,#0b0b12_54%,#09090f_100%)] px-4 pt-32 text-zinc-50 sm:px-6 lg:px-8">
      <div aria-hidden="true" className="home-shared-backdrop">
        <div className="home-shared-backdrop__base opacity-[0.95]" />
        <div className="cyber-grid home-shared-backdrop__grid opacity-[0.08]" />
      </div>
      <Header locale={locale} dictionary={dictionary.header} />
      <div className="absolute inset-0 -z-40 bg-[radial-gradient(circle_at_12%_18%,rgba(255,23,68,0.28),transparent_24%),radial-gradient(circle_at_86%_14%,rgba(34,211,238,0.12),transparent_22%),radial-gradient(circle_at_82%_24%,rgba(168,85,247,0.16),transparent_28%),radial-gradient(circle_at_50%_84%,rgba(251,191,36,0.08),transparent_30%),linear-gradient(128deg,rgba(255,23,68,0.06)_0%,transparent_34%,transparent_70%,rgba(34,211,238,0.05)_100%),linear-gradient(180deg,#0d0708_0%,#0a0708_28%,#060405_56%,#020203_100%)]" />
      <GeometricBackdrop
        className="absolute inset-0 -z-30"
        variant="catalog"
        gridOpacityClassName="opacity-[0.46]"
        scanlineOpacityClassName="opacity-[0.22]"
      />
      <div className="pointer-events-none absolute inset-0 -z-30 overflow-hidden">
        <div className="absolute -left-[10%] top-[2%] h-[24rem] w-[24rem] animate-[catalogAurora_22s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(255,23,68,0.28),rgba(255,23,68,0.12)_42%,transparent_74%)] blur-3xl sm:h-[30rem] sm:w-[30rem]" />
        <div className="absolute right-[-8%] top-[8%] h-[24rem] w-[24rem] animate-[catalogAurora_28s_ease-in-out_infinite_reverse] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.18),rgba(168,85,247,0.08)_40%,transparent_74%)] blur-3xl sm:h-[32rem] sm:w-[32rem]" />
        <div className="absolute left-[18%] bottom-[8%] h-[18rem] w-[36rem] animate-[catalogPulse_20s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.1),transparent_64%)] blur-3xl" />
        <div className="absolute left-1/2 top-[14%] h-[34rem] w-[34rem] -translate-x-1/2 animate-[catalogHalo_26s_linear_infinite] rounded-full border border-red-200/10 opacity-40" />
        <div className="absolute left-1/2 top-[14%] h-[25rem] w-[25rem] -translate-x-1/2 animate-[catalogHaloReverse_18s_linear_infinite] rounded-full border border-fuchsia-300/10 opacity-28" />
        <div className="absolute left-[14%] top-[52%] h-52 w-52 animate-[catalogPolygon_20s_linear_infinite] border border-red-200/12 opacity-48 [clip-path:polygon(50%_0%,100%_38%,82%_100%,18%_100%,0%_38%)]" />
        <div className="absolute right-[18%] top-[18%] h-44 w-44 animate-[catalogPolygon_26s_linear_infinite_reverse] border border-fuchsia-300/10 opacity-36 [clip-path:polygon(12%_12%,88%_0%,100%_76%,40%_100%,0%_64%)]" />
        <div className="absolute left-[38%] top-[18%] h-40 w-40 animate-[catalogDiamond_22s_linear_infinite] border border-amber-200/10 opacity-30 [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]" />
        <div className="absolute right-[22%] bottom-[14%] h-36 w-36 animate-[catalogDiamond_18s_linear_infinite_reverse] border border-red-100/8 opacity-26 [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]" />
        <div className="absolute left-[-8%] top-[24%] h-32 w-[36rem] animate-[catalogBeam_18s_ease-in-out_infinite] rotate-[-12deg] bg-[linear-gradient(90deg,transparent,rgba(255,23,68,0.12),transparent)] blur-2xl" />
        <div className="absolute right-[-10%] top-[52%] h-28 w-[30rem] animate-[catalogBeam_24s_ease-in-out_infinite_reverse] rotate-[18deg] bg-[linear-gradient(90deg,transparent,rgba(168,85,247,0.1),transparent)] blur-2xl" />
        <div className="absolute inset-x-0 top-[22%] h-px animate-[catalogScanline_9s_linear_infinite] bg-[linear-gradient(90deg,transparent,rgba(255,131,131,0.22),transparent)] opacity-55" />
        <div className="absolute inset-x-0 top-[58%] h-px animate-[catalogScanline_13s_linear_infinite_reverse] bg-[linear-gradient(90deg,transparent,rgba(217,70,239,0.18),transparent)] opacity-42" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 animate-[catalogGridDrift_36s_linear_infinite] bg-[linear-gradient(rgba(255,110,110,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.045)_1px,transparent_1px)] bg-[size:68px_68px] opacity-[0.24] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.94),rgba(0,0,0,0.58)_58%,transparent)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,23,68,0.06),transparent_18%,transparent_82%,rgba(168,85,247,0.05))]" />
      <div className="pointer-events-none absolute inset-x-0 top-[18%] -z-10 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.52),transparent)] shadow-[0_0_18px_rgba(34,211,238,0.18)]" />
      <div className="pointer-events-none absolute inset-x-0 top-[64%] -z-10 h-px bg-[linear-gradient(90deg,transparent,rgba(255,23,68,0.44),transparent)] shadow-[0_0_18px_rgba(255,23,68,0.16)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.16] [background-image:radial-gradient(circle_at_center,rgba(251,191,36,0.12)_1px,transparent_1px)] [background-size:30px_30px] [mask-image:linear-gradient(180deg,transparent,rgba(0,0,0,0.88)_16%,rgba(0,0,0,0.88)_84%,transparent)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,23,68,0.045),transparent_18%,rgba(168,85,247,0.04)_40%,transparent_58%,rgba(251,191,36,0.03)_82%,transparent)] opacity-42" />
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

          <div className="grid items-start gap-6 xl:grid-cols-[300px_minmax(0,1fr)] 2xl:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="hidden xl:block">
              <CyberCard variant="glass" className="sticky top-32 overflow-hidden border-white/10 bg-zinc-950/70">
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
                  const badges = [];
                  const defaultColorId = product.color_options[0]?.id ?? null;
                  const cardAlreadyInCart = hasItem(product.id, defaultColorId);
                  if (product.is_new_arrival) {
                    badges.push({ label: text.badgeNew, variant: "cyan" as const });
                  }
                  if (product.is_best_seller) {
                    badges.push({ label: text.badgeHit, variant: "red" as const });
                  }
                  if (product.has_discount) {
                    badges.push({ label: `-${product.discount_percent}%`, variant: "warning" as const });
                  }

                  return (
                    <CyberProductCard
                      key={product.id}
                      className="!min-h-[30rem] translate-y-0 transition-transform duration-500 hover:-translate-y-1"
                      tone="catalog"
                      image={<ProductVisual product={product} />}
                      hoverPanel={<ProductHoverSpecs product={product} title={text.hoverSpecs} />}
                      title={getLocalizedProductName(product, locale)}
                      description={product.short_description}
                      price={formatProductPrice(product, locale)}
                      oldPrice={formatProductOldPrice(product, locale)}
                      ctaLabel={
                        product.quantity_in_stock <= 0
                          ? stockSubscriptionIds.has(product.id)
                            ? text.stockSubscribed
                            : text.notifyStock
                          : cardAlreadyInCart
                            ? text.alreadyInCart
                            : text.addToCart
                      }
                      detailsLabel={text.details}
                      favoriteLabel={text.favorite}
                      compareLabel={comparisonIdSet.has(product.id) ? text.compareActive : text.compareLabel}
                      favoriteActive={favoriteIdSet.has(product.id)}
                      compareActive={comparisonIdSet.has(product.id)}
                      onFavoriteClick={() => toggleFavorite(product.id)}
                      onCompareClick={() => handleComparisonToggle(product)}
                      onDetailsClick={() => updateProductQuery(product.slug)}
                      onCtaClick={() => handleCatalogCardAddToCart(product)}
                      ctaDisabled={stockSubscriptionIds.has(product.id) || cardAlreadyInCart}
                      ctaClassName={
                        cardAlreadyInCart
                          ? "border-cyan-300/60 bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(34,211,238,0.06))] text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.12)] hover:border-cyan-300/60 hover:bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(34,211,238,0.06))] hover:text-cyan-50 disabled:opacity-100"
                          : undefined
                      }
                      badges={badges}
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
                className="grid size-10 place-items-center border border-white/10 bg-white/[0.035] text-zinc-300 transition hover:border-amber-200/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
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
                onClick={() => setCatalogPage((current) => Math.min(totalPages, current + 1))}
                disabled={safePageIndex === totalPages}
                className="grid size-10 place-items-center border border-white/10 bg-white/[0.035] text-zinc-300 transition hover:border-amber-200/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
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
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 px-4">
          <div className="mx-auto w-full max-w-4xl">
            {compareFeedback ? (
              <div className="pointer-events-auto mx-auto mb-3 w-fit rounded-md border border-cyan-300/24 bg-zinc-950/88 px-4 py-2 text-sm text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.12)] backdrop-blur-xl">
                {compareFeedback}
              </div>
            ) : null}
            <CyberCard variant="glass" className="pointer-events-auto overflow-hidden border-cyan-300/18 bg-zinc-950/88 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
              <CyberCardContent className="p-3 sm:p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <CyberBadge variant="cyan" glow className="min-h-8 px-3 text-[10px]">
                          <Scale className="mr-1.5 size-3.5" aria-hidden="true" />
                          {text.compareTrayTitle}
                        </CyberBadge>
                        <span className="font-tech text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                          {flattenedComparisonIds.length}
                        </span>
                        <span className="font-tech text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                          {text.compareTrayLimit}
                        </span>
                      </div>
                      {!isComparisonTrayCollapsed ? (
                        <p className="text-xs leading-5 text-zinc-300 sm:text-sm">
                          {activeComparisonProducts.length >= 2 ? text.compareTrayReady : text.compareTrayHint}
                        </p>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsComparisonTrayCollapsed((current) => !current)}
                      className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs uppercase tracking-[0.12em] text-zinc-200 transition hover:border-cyan-300/24 hover:bg-white/[0.08]"
                      aria-expanded={!isComparisonTrayCollapsed}
                      aria-label={isComparisonTrayCollapsed ? text.compareTrayExpand : text.compareTrayCollapse}
                    >
                      {isComparisonTrayCollapsed ? (
                        <ChevronUp className="size-3.5" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="size-3.5" aria-hidden="true" />
                      )}
                      <span>{isComparisonTrayCollapsed ? text.compareTrayExpand : text.compareTrayCollapse}</span>
                    </button>
                  </div>

                  {!isComparisonTrayCollapsed ? (
                    <div className="flex flex-col gap-3 border-t border-white/8 pt-3">
                      {comparisonCategoryGroups.length > 1 ? (
                        <CyberTabs
                          value={resolvedActiveComparisonCategorySlug ?? undefined}
                          onValueChange={setActiveComparisonCategorySlug}
                          className="gap-2"
                        >
                          <div className="space-y-2">
                            <p className="font-tech text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                              {text.compareTraySections}
                            </p>
                            <CyberTabsList className="w-full gap-1.5 overflow-x-auto p-1">
                              {comparisonCategoryGroups.map((group) => (
                                <CyberTabsTrigger
                                  key={group.slug}
                                  value={group.slug}
                                  className="min-h-9 min-w-fit px-3 py-2 text-[11px] tracking-[0.12em]"
                                >
                                  <span>{group.label}</span>
                                  <span className="font-tech text-[10px] text-zinc-500">
                                    {group.products.length}
                                  </span>
                                </CyberTabsTrigger>
                              ))}
                            </CyberTabsList>
                          </div>
                        </CyberTabs>
                      ) : null}

                      <div className="flex flex-wrap gap-2">
                        {activeComparisonProducts.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => handleComparisonToggle(product)}
                            className="inline-flex min-h-8 max-w-full items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-left text-xs text-zinc-200 transition hover:border-cyan-300/32 hover:bg-white/[0.07]"
                          >
                            <span className="max-w-[12rem] truncate">{getLocalizedProductName(product, locale)}</span>
                            <X className="size-3 text-zinc-500" aria-hidden="true" />
                          </button>
                        ))}
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                        {activeComparisonGroup ? (
                          <CyberButton
                            variant="ghost"
                            size="sm"
                            onClick={() => clearComparisonCategory(activeComparisonGroup.slug)}
                          >
                            {text.compareTrayClear}
                          </CyberButton>
                        ) : null}
                        <CyberButton variant="ghost" size="sm" onClick={clearComparison}>
                          {text.compareTrayClearAll}
                        </CyberButton>
                        <CyberButton
                          variant="secondary"
                          size="sm"
                          onClick={() => setIsComparisonDialogOpen(true)}
                          disabled={activeComparisonProducts.length < 2}
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
