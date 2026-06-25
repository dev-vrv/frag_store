import { type Locale } from "@/lib/i18n";

export interface ProductBrand {
  id: number;
  name: string;
  slug: string;
  website: string;
  country: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  device_type: string;
  sort_order: number;
  products_count?: number;
}

export interface ProductMedia {
  id: number;
  media_type: "image" | "video";
  file: string | null;
  external_url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductColorOption {
  id: number;
  name: string;
  hex_code: string;
  sort_order: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  short_description: string;
  description?: string;
  price: string;
  old_price: string | null;
  currency: "KGS" | "USD";
  quantity_in_stock: number;
  availability_status: string;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  has_discount: boolean;
  discount_percent: number;
  color: string;
  color_options: ProductColorOption[];
  category: ProductCategory;
  brand: ProductBrand;
  primary_media: ProductMedia | null;
  media_items?: ProductMedia[];
  created_at?: string;
  updated_at?: string;
}

type CollectionResponse<T> = T[] | { results?: T[] };

const internalApiUrl = process.env.API_URL || "http://127.0.0.1:8000/api";
const publicApiUrl = process.env.NEXT_PUBLIC_API_URL || internalApiUrl;

function getApiUrl() {
  return typeof window === "undefined" ? internalApiUrl : publicApiUrl;
}

function normalizeMediaUrl(url: string | null) {
  if (!url) {
    return null;
  }

  if (url.startsWith("/media/")) {
    return url;
  }

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.pathname.startsWith("/media/")) {
      return parsedUrl.pathname;
    }
  } catch {
    return url;
  }

  return url;
}

function normalizeMedia(media: ProductMedia | null) {
  if (!media) {
    return null;
  }

  return {
    ...media,
    file: normalizeMediaUrl(media.file),
  };
}

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    primary_media: normalizeMedia(product.primary_media),
    media_items: product.media_items?.map((item) => normalizeMedia(item) as ProductMedia),
  };
}

function unwrapCollection<T>(payload: CollectionResponse<T>) {
  return Array.isArray(payload) ? payload : payload.results ?? [];
}

export function getLocalizedProductName(product: Product, locale: Locale) {
  void locale;
  return product.name;
}

const defaultCategoryTranslations: Record<
  string,
  Record<Locale, { name: string; description: string }>
> = {
  mice: {
    ru: {
      name: "Игровые мыши",
      description: "Проводные и беспроводные игровые мыши с современными сенсорами и точной формой.",
    },
    en: {
      name: "Gaming Mice",
      description: "Wired and wireless gaming mice with modern sensors and competitive shapes.",
    },
    kg: {
      name: "Оюн чычкандары",
      description: "Заманбап сенсорлору жана ыңгайлуу формасы бар оюн чычкандары.",
    },
  },
  keyboards: {
    ru: {
      name: "Клавиатуры",
      description: "Механические и low-profile клавиатуры с быстрым откликом и RGB-подсветкой.",
    },
    en: {
      name: "Gaming Keyboards",
      description: "Mechanical and low-profile gaming keyboards with fast actuation and RGB lighting.",
    },
    kg: {
      name: "Оюн клавиатуралары",
      description: "Тез жооп берген жана RGB жарыгы бар оюн клавиатуралары.",
    },
  },
  headsets: {
    ru: {
      name: "Гарнитуры",
      description: "Гарнитуры для чистой связи, точного позиционирования и комфортных длинных сессий.",
    },
    en: {
      name: "Gaming Headsets",
      description: "Headsets for clear comms, positional audio, and long-session comfort.",
    },
    kg: {
      name: "Оюн гарнитуралары",
      description: "Таза байланыш жана так позиция үчүн оюн гарнитуралары.",
    },
  },
  mousepads: {
    ru: {
      name: "Коврики",
      description: "Коврики под speed и control сценарии для стабильного трекинга.",
    },
    en: {
      name: "Gaming Mousepads",
      description: "Mousepads for speed and control use cases with stable tracking.",
    },
    kg: {
      name: "Оюн килемчелери",
      description: "Туруктуу трекинг үчүн speed жана control килемчелери.",
    },
  },
  controllers: {
    ru: {
      name: "Геймпады",
      description: "Контроллеры для консоли и ПК с упором на комфорт и точность.",
    },
    en: {
      name: "Game Controllers",
      description: "Controllers for console and PC gaming focused on comfort and control.",
    },
    kg: {
      name: "Геймпаддар жана контроллерлор",
      description: "Консоль жана ПК үчүн ыңгайлуу оюн контроллерлору.",
    },
  },
  monitors: {
    ru: {
      name: "Мониторы",
      description: "Мониторы с высокой герцовкой, низким откликом и adaptive sync.",
    },
    en: {
      name: "Gaming Monitors",
      description: "Displays with high refresh rate, low response time, and adaptive sync.",
    },
    kg: {
      name: "Оюн мониторлору",
      description: "Жогорку герцовкасы жана аз кечигүүсү бар мониторлор.",
    },
  },
  microphones: {
    ru: {
      name: "Микрофоны",
      description: "USB и XLR микрофоны для стрима, голосового чата и контента.",
    },
    en: {
      name: "Microphones",
      description: "USB and XLR microphones for streaming, voice chat, and content.",
    },
    kg: {
      name: "Микрофондор",
      description: "Стрим жана байланыш үчүн USB жана XLR микрофондору.",
    },
  },
  webcams: {
    ru: {
      name: "Веб-камеры",
      description: "Камеры для стрима, созвонов и creator-сетапов.",
    },
    en: {
      name: "Webcams",
      description: "Streaming webcams for calls, broadcasts, and creator setups.",
    },
    kg: {
      name: "Веб-камералар",
      description: "Стрим, чалуу жана creator-сетап үчүн веб-камералар.",
    },
  },
  speakers: {
    ru: {
      name: "Акустика",
      description: "Настольная акустика и компактные системы для игрового стола.",
    },
    en: {
      name: "Speakers",
      description: "Desktop speakers and compact sound systems for gaming desks.",
    },
    kg: {
      name: "Акустика",
      description: "Оюн столу үчүн настольный колонкалар жана аудио-системалар.",
    },
  },
  accessories: {
    ru: {
      name: "Аксессуары",
      description: "Хабы, стойки, кабели и полезные desk-аксессуары для сетапа.",
    },
    en: {
      name: "Gaming Accessories",
      description: "Hubs, stands, cables, and useful desk accessories for setups.",
    },
    kg: {
      name: "Оюн аксессуарлары",
      description: "Хабдар, кармагычтар, кабелдер жана сетап үчүн аксессуарлар.",
    },
  },
};

export function getLocalizedCategoryName(category: ProductCategory, locale: Locale) {
  return defaultCategoryTranslations[category.slug]?.[locale]?.name ?? category.name;
}

export function getLocalizedCategoryDescription(category: ProductCategory, locale: Locale) {
  return defaultCategoryTranslations[category.slug]?.[locale]?.description ?? category.description;
}

export function formatProductPrice(product: Product, locale: Locale) {
  const value = Number(product.price);

  if (Number.isNaN(value)) {
    return product.price;
  }

  const formatted = value.toLocaleString(locale === "en" ? "en-US" : "ru-RU");
  return product.currency === "USD" ? `$${formatted}` : `${formatted} сом`;
}

export function formatProductOldPrice(product: Product, locale: Locale) {
  if (!product.old_price) {
    return undefined;
  }

  const value = Number(product.old_price);

  if (Number.isNaN(value)) {
    return product.old_price;
  }

  const formatted = value.toLocaleString(locale === "en" ? "en-US" : "ru-RU");
  return product.currency === "USD" ? `$${formatted}` : `${formatted} сом`;
}

export async function getProducts(searchParams?: Record<string, string>) {
  try {
    const query = new URLSearchParams(searchParams).toString();
    const response = await fetch(`${getApiUrl()}/products/${query ? `?${query}` : ""}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as CollectionResponse<Product>;
    return unwrapCollection(data).map(normalizeProduct);
  } catch {
    return [];
  }
}

export async function getBestSellerProducts(limit = 12) {
  const products = await getProducts({ best_seller: "true" });
  return products.slice(0, limit);
}

export async function getProductCategories() {
  try {
    const response = await fetch(`${getApiUrl()}/products/categories/`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as CollectionResponse<ProductCategory>;
    return unwrapCollection(data);
  } catch {
    return [];
  }
}

export async function getProductBrands() {
  try {
    const response = await fetch(`${getApiUrl()}/products/brands/`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as CollectionResponse<ProductBrand>;
    return unwrapCollection(data);
  } catch {
    return [];
  }
}
