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
  CyberLaserText,
  CyberNativeSelect,
  CyberProductCard,
} from "@/components/cyber";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { type Dictionary, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface CatalogPageProps {
  locale: Locale;
  dictionary: Dictionary;
}

type Category =
  | "all"
  | "mice"
  | "keyboards"
  | "headsets"
  | "components"
  | "accessories"
  | "setups";
type SortKey = "popular" | "priceAsc" | "priceDesc" | "rating";

interface CatalogProduct {
  id: number;
  category: Exclude<Category, "all">;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  rating: number;
  badges: Array<"new" | "hit" | "sale" | "pro">;
}

const products: CatalogProduct[] = [
  {
    id: 1,
    category: "mice",
    title: "Rift X9 Wireless",
    description: "Легкая игровая мышь 54 г, сенсор 26K DPI, быстрый 2.4G режим.",
    price: 7490,
    oldPrice: 8490,
    rating: 4.9,
    badges: ["hit", "sale"],
  },
  {
    id: 2,
    category: "keyboards",
    title: "Neon TKL Forge",
    description: "TKL клавиатура с hot-swap, PBT кейкапами и gasket mount посадкой.",
    price: 12990,
    rating: 4.8,
    badges: ["pro"],
  },
  {
    id: 3,
    category: "headsets",
    title: "Auralis V7",
    description: "Гарнитура 7.1 с мягкими амбушюрами и съемным шумоподавляющим микрофоном.",
    price: 8990,
    rating: 4.7,
    badges: ["new"],
  },
  {
    id: 4,
    category: "components",
    title: "CoreFlux 750W",
    description: "Модульный блок питания 80+ Gold для стабильных игровых сборок.",
    price: 10990,
    oldPrice: 11990,
    rating: 4.8,
    badges: ["sale"],
  },
  {
    id: 5,
    category: "accessories",
    title: "Zero Drag Mat XL",
    description: "Большой коврик с контролируемым скольжением и прошитыми краями.",
    price: 3490,
    rating: 4.6,
    badges: ["hit"],
  },
  {
    id: 6,
    category: "mice",
    title: "Pulse Mini 8K",
    description: "Компактная мышь для claw grip, polling rate 8000 Hz и PTFE глайды.",
    price: 9990,
    rating: 4.9,
    badges: ["new", "pro"],
  },
  {
    id: 7,
    category: "keyboards",
    title: "Obsidian 75 HE",
    description: "75% клавиатура на hall-effect переключателях с rapid trigger.",
    price: 17990,
    rating: 5,
    badges: ["new", "pro"],
  },
  {
    id: 8,
    category: "components",
    title: "Frostline AIO 240",
    description: "СЖО 240 мм с тихими вентиляторами и чистой подсветкой.",
    price: 15990,
    oldPrice: 17990,
    rating: 4.7,
    badges: ["sale"],
  },
  {
    id: 9,
    category: "headsets",
    title: "Comms Pro Mic",
    description: "USB-микрофон для стримов, дискорда и командных игр.",
    price: 6990,
    rating: 4.6,
    badges: ["hit"],
  },
  {
    id: 10,
    category: "setups",
    title: "Starter Aim Setup",
    description: "Готовый стартовый сетап: мышь, коврик, гарнитура и базовые настройки под FPS.",
    price: 18900,
    oldPrice: 20900,
    rating: 4.8,
    badges: ["hit", "sale"],
  },
  {
    id: 11,
    category: "setups",
    title: "Ranked Core Setup",
    description: "Сбалансированная сборка периферии: клавиатура, мышь, гарнитура и коврик.",
    price: 31900,
    rating: 4.9,
    badges: ["pro"],
  },
  {
    id: 12,
    category: "setups",
    title: "Full Station Setup",
    description: "Полный игровой сетап с монитором, клавиатурой, мышью, звуком и аксессуарами.",
    price: 72900,
    rating: 5,
    badges: ["new", "pro"],
  },
];

const catalogText: Record<
  Locale,
  {
    search: string;
    searchPlaceholder: string;
    sort: string;
    categories: Record<Category, string>;
    sortOptions: Record<SortKey, string>;
    results: string;
    empty: string;
    reset: string;
    addToCart: string;
    details: string;
    favorite: string;
    page: string;
    filters: string;
    featured: string;
    setupIncludes: string;
    setups: Array<{
      title: string;
      items: string;
      price: string;
    }>;
    badgeLabels: Record<"new" | "hit" | "sale" | "pro", string>;
  }
> = {
  ru: {
    search: "Поиск",
    searchPlaceholder: "Мышь, клавиатура, гарнитура...",
    sort: "Сортировка",
    categories: {
      all: "Все",
      mice: "Мышки",
      keyboards: "Клавиатуры",
      headsets: "Гарнитуры",
      components: "Комплектующие",
      accessories: "Аксессуары",
      setups: "Готовые сетапы",
    },
    sortOptions: {
      popular: "Популярные",
      priceAsc: "Цена: ниже",
      priceDesc: "Цена: выше",
      rating: "Рейтинг",
    },
    results: "товаров найдено",
    empty: "Ничего не найдено. Попробуйте изменить поиск или категорию.",
    reset: "Сбросить",
    addToCart: "В корзину",
    details: "Подробнее",
    favorite: "В избранное",
    page: "Страница",
    filters: "Фильтры",
    featured: "Подборка недели",
    setupIncludes: "В сетапе",
    setups: [
      {
        title: "Starter Aim",
        items: "мышь + коврик + гарнитура",
        price: "от 18 900 сом",
      },
      {
        title: "Ranked Core",
        items: "клавиатура + мышь + гарнитура",
        price: "от 31 900 сом",
      },
      {
        title: "Full Station",
        items: "монитор + клавиатура + мышь + звук",
        price: "от 72 900 сом",
      },
    ],
    badgeLabels: {
      new: "Новинка",
      hit: "Хит",
      sale: "Скидка",
      pro: "Pro",
    },
  },
  en: {
    search: "Search",
    searchPlaceholder: "Mouse, keyboard, headset...",
    sort: "Sort",
    categories: {
      all: "All",
      mice: "Mice",
      keyboards: "Keyboards",
      headsets: "Headsets",
      components: "Components",
      accessories: "Accessories",
      setups: "Ready setups",
    },
    sortOptions: {
      popular: "Popular",
      priceAsc: "Price: low",
      priceDesc: "Price: high",
      rating: "Rating",
    },
    results: "products found",
    empty: "Nothing found. Try changing search or category.",
    reset: "Reset",
    addToCart: "Add to cart",
    details: "Details",
    favorite: "Add to favorites",
    page: "Page",
    filters: "Filters",
    featured: "Weekly picks",
    setupIncludes: "Includes",
    setups: [
      {
        title: "Starter Aim",
        items: "mouse + mousepad + headset",
        price: "from 18,900 KGS",
      },
      {
        title: "Ranked Core",
        items: "keyboard + mouse + headset",
        price: "from 31,900 KGS",
      },
      {
        title: "Full Station",
        items: "monitor + keyboard + mouse + audio",
        price: "from 72,900 KGS",
      },
    ],
    badgeLabels: {
      new: "New",
      hit: "Hit",
      sale: "Sale",
      pro: "Pro",
    },
  },
  kg: {
    search: "Издөө",
    searchPlaceholder: "Мышка, клавиатура, гарнитура...",
    sort: "Сорттоо",
    categories: {
      all: "Баары",
      mice: "Мышкалар",
      keyboards: "Клавиатуралар",
      headsets: "Гарнитуралар",
      components: "Комплекттер",
      accessories: "Аксессуарлар",
      setups: "Даяр сетаптар",
    },
    sortOptions: {
      popular: "Популярдуу",
      priceAsc: "Баасы: төмөн",
      priceDesc: "Баасы: жогору",
      rating: "Рейтинг",
    },
    results: "товар табылды",
    empty: "Эч нерсе табылган жок. Издөөнү же категорияны өзгөртүңүз.",
    reset: "Тазалоо",
    addToCart: "Себетке",
    details: "Кененирээк",
    favorite: "Тандалгандарга",
    page: "Барак",
    filters: "Фильтрлер",
    featured: "Аптанын тандоосу",
    setupIncludes: "Сетапта",
    setups: [
      {
        title: "Starter Aim",
        items: "мышка + коврик + гарнитура",
        price: "18 900 сомдон",
      },
      {
        title: "Ranked Core",
        items: "клавиатура + мышка + гарнитура",
        price: "31 900 сомдон",
      },
      {
        title: "Full Station",
        items: "монитор + клавиатура + мышка + үн",
        price: "72 900 сомдон",
      },
    ],
    badgeLabels: {
      new: "Жаңы",
      hit: "Хит",
      sale: "Арзан",
      pro: "Pro",
    },
  },
};

const categoryIcons: Record<Category, React.ReactNode> = {
  all: <Sparkles aria-hidden="true" />,
  mice: <Mouse aria-hidden="true" />,
  keyboards: <Keyboard aria-hidden="true" />,
  headsets: <Headphones aria-hidden="true" />,
  components: <Cpu aria-hidden="true" />,
  accessories: <Gamepad2 aria-hidden="true" />,
  setups: <PackageCheck aria-hidden="true" />,
};

const setupIcons = [Mouse, Keyboard, Monitor];

const pageSize = 6;

export function CatalogPage({ locale, dictionary }: CatalogPageProps) {
  const page = dictionary.pages.catalog;
  const text = catalogText[locale];
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const [sort, setSort] = useState<SortKey>("popular");
  const [pageIndex, setPageIndex] = useState(1);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const matchesQuery =
        !normalizedQuery ||
        product.title.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });

    return filtered.toSorted((a, b) => {
      if (sort === "priceAsc") {
        return a.price - b.price;
      }

      if (sort === "priceDesc") {
        return b.price - a.price;
      }

      if (sort === "rating") {
        return b.rating - a.rating;
      }

      return b.badges.length + b.rating - (a.badges.length + a.rating);
    });
  }, [category, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePageIndex = Math.min(pageIndex, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safePageIndex - 1) * pageSize,
    safePageIndex * pageSize,
  );

  function updateCategory(nextCategory: Category) {
    setCategory(nextCategory);
    setPageIndex(1);
  }

  function updateQuery(nextQuery: string) {
    setQuery(nextQuery);
    setPageIndex(1);
  }

  function updateSort(nextSort: string) {
    setSort(nextSort as SortKey);
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
                onChange={(event) => updateQuery(event.target.value)}
              />
              <CyberNativeSelect
                label={text.sort}
                value={sort}
                onValueChange={updateSort}
                options={[
                  { value: "popular", label: text.sortOptions.popular },
                  { value: "priceAsc", label: text.sortOptions.priceAsc },
                  { value: "priceDesc", label: text.sortOptions.priceDesc },
                  { value: "rating", label: text.sortOptions.rating },
                ]}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {(Object.keys(text.categories) as Category[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => updateCategory(item)}
                  className={cn(
                    "font-tech inline-flex min-h-10 items-center gap-2 border border-white/10 bg-white/[0.035] px-3 text-sm uppercase tracking-[0.08em] text-zinc-300 transition hover:border-red-400/35 hover:bg-red-500/10 hover:text-red-100 [&_svg]:size-4",
                    category === item && "border-red-400/55 bg-red-500/14 text-red-100",
                  )}
                >
                  {categoryIcons[item]}
                  {text.categories[item]}
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
                  onClick={() => {
                    setQuery("");
                    setCategory("all");
                    setSort("popular");
                    setPageIndex(1);
                  }}
                >
                  {text.reset}
                </CyberButton>
              ) : null}
            </div>
          </CyberCardContent>
        </CyberCard>
      </section>

      <section className="mx-auto mt-8 max-w-7xl">
        {paginatedProducts.length ? (
          <div className="grid auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-3">
            {paginatedProducts.map((product) => (
              <CyberProductCard
                key={product.id}
                image={<ProductVisual category={product.category} />}
                title={product.title}
                description={product.description}
                price={formatPrice(product.price)}
                oldPrice={product.oldPrice ? formatPrice(product.oldPrice) : undefined}
                rating={product.rating}
                ctaLabel={text.addToCart}
                detailsLabel={text.details}
                favoriteLabel={text.favorite}
                badges={product.badges.map((badge) => ({
                  label: text.badgeLabels[badge],
                  variant: badge === "sale" ? "green" : badge === "pro" ? "violet" : "red",
                }))}
              />
            ))}
          </div>
        ) : (
          <CyberCard variant="glass">
            <CyberCardContent className="p-8 text-center text-lg text-zinc-400">
              {text.empty}
            </CyberCardContent>
          </CyberCard>
        )}
      </section>

      <section className="mx-auto mt-8 flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

      <Footer locale={locale} dictionary={dictionary} className="-mx-4 sm:-mx-6 lg:-mx-8" />
    </main>
  );
}

function ProductVisual({ category }: { category: Exclude<Category, "all"> }) {
  const Icon =
    category === "mice"
      ? Mouse
      : category === "keyboards"
        ? Keyboard
        : category === "headsets"
          ? Headphones
      : category === "components"
        ? Cpu
        : category === "setups"
          ? PackageCheck
          : Gamepad2;

  return (
    <div className="flex h-full items-center justify-center">
      <div className="grid size-28 place-items-center border border-red-300/25 bg-black/45 text-red-100 shadow-[0_0_46px_rgba(255,23,68,0.18)]">
        <Icon className="size-12" aria-hidden="true" />
      </div>
    </div>
  );
}

function formatPrice(value: number) {
  return `${value.toLocaleString("ru-RU")} сом`;
}
