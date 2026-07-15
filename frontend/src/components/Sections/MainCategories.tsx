import {
  ArrowUpRight,
  Armchair,
  Headphones,
  Keyboard,
  Monitor,
  Mouse,
  RectangleHorizontal,
  type LucideIcon,
} from "lucide-react";

import { Section } from "@/components/Sections/Section";
import { type Locale, localizePath } from "@/lib/i18n";
import { getLocalizedCategoryName, type ProductCategory } from "@/lib/products";
import { cn } from "@/lib/utils";

interface MainCategoriesProps {
  locale: Locale;
  categories: ProductCategory[];
}

interface CategorySlot {
  slugs: string[];
  icon: LucideIcon;
  image?: string;
  accent: string;
  fallbackSlugs?: string[];
  fallbackTitle?: Record<Locale, string>;
}

const copy: Record<Locale, { eyebrow: string; title: string; all: string; open: string }> = {
  ru: {
    eyebrow: "Быстрый доступ",
    title: "Основные категории",
    all: "Весь каталог",
    open: "Открыть категорию",
  },
  en: {
    eyebrow: "Quick access",
    title: "Main categories",
    all: "Full catalog",
    open: "Open category",
  },
  kg: {
    eyebrow: "Тез жетүү",
    title: "Негизги категориялар",
    all: "Толук каталог",
    open: "Категорияны ачуу",
  },
};

const categorySlots: CategorySlot[] = [
  {
    slugs: ["mice"],
    icon: Mouse,
    image: "/images/hero/mouse.webp?v=20260715-1050",
    accent: "from-cyan-300/28 via-sky-400/8",
  },
  {
    slugs: ["keyboards"],
    icon: Keyboard,
    image: "/images/hero/keybord.webp?v=20260715-1057",
    accent: "from-fuchsia-400/26 via-pink-400/8",
  },
  {
    slugs: ["chairs", "gaming-chairs", "gaming_chairs"],
    fallbackSlugs: ["accessories"],
    fallbackTitle: {
      ru: "Игровые кресла",
      en: "Gaming chairs",
      kg: "Оюн креслолору",
    },
    icon: Armchair,
    image: "/images/hero/chaer.jpg?v=20260715-1050",
    accent: "from-lime-300/24 via-emerald-400/8",
  },
  {
    slugs: ["headsets"],
    icon: Headphones,
    image: "/images/hero/headset.jpg?v=20260715-1050",
    accent: "from-red-400/28 via-orange-400/8",
  },
  {
    slugs: ["mousepads"],
    icon: RectangleHorizontal,
    image: "/images/hero/mat.jpg?v=20260715-1600",
    accent: "from-amber-300/22 via-orange-400/7",
  },
  {
    slugs: ["monitors"],
    icon: Monitor,
    image: "/images/hero/monitor.jpeg?v=20260715-1600",
    accent: "from-blue-300/24 via-cyan-400/7",
  },
];

export function MainCategories({ locale, categories }: MainCategoriesProps) {
  const content = copy[locale];
  const cards = categorySlots.flatMap((slot) => {
    const category = categories.find((item) => slot.slugs.includes(item.slug));
    const fallbackCategory = slot.fallbackSlugs
      ? categories.find((item) => slot.fallbackSlugs?.includes(item.slug))
      : undefined;
    const resolvedCategory = category ?? fallbackCategory;

    if (!resolvedCategory) {
      return [];
    }

    return [{
      ...slot,
      category: resolvedCategory,
      title: category
        ? getLocalizedCategoryName(category, locale)
        : slot.fallbackTitle?.[locale] ?? getLocalizedCategoryName(resolvedCategory, locale),
    }];
  });

  if (!cards.length) {
    return null;
  }

  return (
    <Section className="relative" containerClassName="py-12 sm:py-14 lg:py-16">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-tech type-label uppercase tracking-[0.16em] text-cyan-200">
            {content.eyebrow}
          </p>
          <h2 className="font-display type-h2 mt-2 uppercase text-white">{content.title}</h2>
        </div>
        <a
          href={localizePath("/catalog", locale)}
          className="font-tech type-ui group inline-flex items-center gap-2 uppercase tracking-[0.1em] text-zinc-200 transition-colors hover:text-cyan-200"
        >
          {content.all}
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ category, title, icon: Icon, image, accent }) => (
          <a
            key={`${category.slug}-${title}`}
            href={`${localizePath("/catalog", locale)}?category=${encodeURIComponent(category.slug)}`}
            aria-label={`${content.open}: ${title}`}
            className="group relative isolate min-h-44 overflow-hidden border border-white/10 bg-[#111219]/88 p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-200/35 hover:shadow-[0_18px_55px_rgba(0,0,0,0.3)]"
          >
            {image ? (
              // Decorative category preview; the title remains the accessible label.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt=""
                className="absolute inset-0 -z-20 h-full w-full object-cover opacity-28 transition duration-700 group-hover:scale-105 group-hover:opacity-40"
              />
            ) : null}
            <div className={cn("absolute inset-0 -z-10 bg-gradient-to-br to-[#101117]/96", accent)} />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(110deg,rgba(8,9,14,0.9)_0%,rgba(8,9,14,0.5)_58%,rgba(8,9,14,0.24)_100%)]" />

            <div className="flex h-full flex-col justify-between gap-8">
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-12 place-items-center border border-white/14 bg-black/25 text-white backdrop-blur-sm">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <ArrowUpRight className="size-5 text-zinc-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-200" />
              </div>
              <div>
                <h3 className="font-display type-h4 uppercase text-white">{title}</h3>
                <span className="font-tech type-caption mt-2 block uppercase tracking-[0.12em] text-zinc-300">
                  {content.open}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}
