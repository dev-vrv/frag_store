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

    if (!category) {
      return [];
    }

    return [{
      ...slot,
      category,
      title: getLocalizedCategoryName(category, locale),
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
            className="theme-dark group relative isolate min-h-52 overflow-hidden border border-[rgba(255,255,255,0.15)] bg-[#08090e] p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-200/45 hover:shadow-[0_18px_55px_rgba(0,0,0,0.3)] sm:min-h-56"
          >
            {image ? (
              // Decorative category preview; the title remains the accessible label.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt=""
                className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            ) : null}
            <div className={cn("absolute inset-0 -z-10 bg-gradient-to-br to-transparent", accent)} />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(110deg,rgba(0,0,0,0.58)_0%,rgba(0,0,0,0.14)_56%,rgba(0,0,0,0.02)_100%)]" />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.2)_48%,transparent_74%)]" />

            <div className="flex h-full flex-col justify-between gap-8">
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-12 place-items-center border border-[rgba(255,255,255,0.25)] bg-black/50 text-[rgb(255,255,255)] shadow-[0_8px_24px_rgba(0,0,0,0.28)] backdrop-blur-sm">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <ArrowUpRight className="size-5 text-[rgba(255,255,255,0.8)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-200" />
              </div>
              <div className="w-fit max-w-full border-l-2 border-cyan-300/80 bg-black/55 px-3 py-2.5 shadow-[0_10px_28px_rgba(0,0,0,0.24)] backdrop-blur-[3px]">
                <h3 className="font-display type-h4 uppercase text-[rgb(255,255,255)] [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]">{title}</h3>
                <span className="font-tech type-caption mt-2 block uppercase tracking-[0.12em] text-[rgba(255,255,255,0.8)] [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]">
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
