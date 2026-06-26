import { type Locale } from "@/lib/i18n";

export interface ProductTechnicalSpecRow {
  key: string;
  label: string;
  value: string;
}

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

export interface ProductFeature {
  id: number;
  title: string;
  description: string;
  sort_order: number;
}

export interface ProductSpecification {
  id: number;
  group: string;
  name: string;
  value: string;
  unit: string;
  value_type: string;
  is_highlight: boolean;
  sort_order: number;
}

export interface ProductTechnicalHighlight {
  label: string;
  value: string;
}

export interface ProductTechnicalDetails {
  form_factor: string;
  connectivity: string;
  compatibility: string;
  software_support: string;
  battery_life_hours: number | null;
  cable_length_m: string | null;
  sensor_model: string;
  dpi: number | null;
  polling_rate_hz: number | null;
  response_time_ms: string | null;
  switch_type: string;
  programmable_buttons: number | null;
  keyboard_layout: string;
  key_count: number | null;
  switch_profile: string;
  hot_swap: boolean;
  backlight: string;
  driver_size_mm: number | null;
  microphone: string;
  surround_sound: string;
  frequency_response: string;
  impedance_ohm: number | null;
  sensitivity_db: number | null;
  surface_type: string;
  pad_size: string;
  thickness_mm: string | null;
  stitched_edges: boolean;
  base_material: string;
  panel_type: string;
  resolution: string;
  refresh_rate_hz: number | null;
  brightness_nits: number | null;
  contrast_ratio: string;
  material: string;
  extra_notes: string;
  highlights: ProductTechnicalHighlight[];
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
  features?: ProductFeature[];
  specifications?: ProductSpecification[];
  technical_details: ProductTechnicalDetails | null;
  technical_highlights: ProductTechnicalHighlight[];
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

const technicalSpecLabels: Record<
  Locale,
  Record<keyof Omit<ProductTechnicalDetails, "highlights">, string>
> = {
  ru: {
    form_factor: "Форм-фактор",
    connectivity: "Подключение",
    compatibility: "Совместимость",
    software_support: "ПО / драйверы",
    battery_life_hours: "Автономность",
    cable_length_m: "Длина кабеля",
    sensor_model: "Сенсор",
    dpi: "DPI",
    polling_rate_hz: "Polling rate",
    response_time_ms: "Отклик",
    switch_type: "Тип переключателей",
    programmable_buttons: "Программируемые кнопки",
    keyboard_layout: "Формат клавиатуры",
    key_count: "Количество клавиш",
    switch_profile: "Профиль свитчей",
    hot_swap: "Hot-swap",
    backlight: "Подсветка",
    driver_size_mm: "Драйверы",
    microphone: "Микрофон",
    surround_sound: "Звук",
    frequency_response: "Частотный диапазон",
    impedance_ohm: "Сопротивление",
    sensitivity_db: "Чувствительность",
    surface_type: "Поверхность",
    pad_size: "Размер коврика",
    thickness_mm: "Толщина",
    stitched_edges: "Прошитые края",
    base_material: "Основание",
    panel_type: "Матрица",
    resolution: "Разрешение",
    refresh_rate_hz: "Частота обновления",
    brightness_nits: "Яркость",
    contrast_ratio: "Контрастность",
    material: "Материал",
    extra_notes: "Дополнительно",
  },
  en: {
    form_factor: "Form factor",
    connectivity: "Connectivity",
    compatibility: "Compatibility",
    software_support: "Software / drivers",
    battery_life_hours: "Battery life",
    cable_length_m: "Cable length",
    sensor_model: "Sensor",
    dpi: "DPI",
    polling_rate_hz: "Polling rate",
    response_time_ms: "Response time",
    switch_type: "Switch type",
    programmable_buttons: "Programmable buttons",
    keyboard_layout: "Keyboard layout",
    key_count: "Key count",
    switch_profile: "Switch profile",
    hot_swap: "Hot-swap",
    backlight: "Backlight",
    driver_size_mm: "Driver size",
    microphone: "Microphone",
    surround_sound: "Surround sound",
    frequency_response: "Frequency response",
    impedance_ohm: "Impedance",
    sensitivity_db: "Sensitivity",
    surface_type: "Surface",
    pad_size: "Mousepad size",
    thickness_mm: "Thickness",
    stitched_edges: "Stitched edges",
    base_material: "Base material",
    panel_type: "Panel",
    resolution: "Resolution",
    refresh_rate_hz: "Refresh rate",
    brightness_nits: "Brightness",
    contrast_ratio: "Contrast ratio",
    material: "Material",
    extra_notes: "Extra",
  },
  kg: {
    form_factor: "Форм-фактор",
    connectivity: "Туташуу",
    compatibility: "Шайкештик",
    software_support: "ПО / драйверлер",
    battery_life_hours: "Автономдуулук",
    cable_length_m: "Кабелдин узундугу",
    sensor_model: "Сенсор",
    dpi: "DPI",
    polling_rate_hz: "Polling rate",
    response_time_ms: "Жооп берүү убактысы",
    switch_type: "Свич түрү",
    programmable_buttons: "Программалануучу баскычтар",
    keyboard_layout: "Клавиатура форматы",
    key_count: "Баскыч саны",
    switch_profile: "Свич профили",
    hot_swap: "Hot-swap",
    backlight: "Жарык",
    driver_size_mm: "Драйвер өлчөмү",
    microphone: "Микрофон",
    surround_sound: "Үн",
    frequency_response: "Жыштык диапазону",
    impedance_ohm: "Каршылык",
    sensitivity_db: "Сезгичтик",
    surface_type: "Үстү",
    pad_size: "Килемче өлчөмү",
    thickness_mm: "Калыңдыгы",
    stitched_edges: "Тигилген кыры",
    base_material: "Негизи",
    panel_type: "Матрица",
    resolution: "Чечимдүүлүк",
    refresh_rate_hz: "Жаңылануу жыштыгы",
    brightness_nits: "Жарыктыгы",
    contrast_ratio: "Контраст",
    material: "Материал",
    extra_notes: "Кошумча",
  },
};

function formatTechnicalSpecValue(
  field: keyof Omit<ProductTechnicalDetails, "highlights">,
  value: ProductTechnicalDetails[keyof Omit<ProductTechnicalDetails, "highlights">],
  locale: Locale,
) {
  if (value == null || value === "") {
    return "";
  }

  if (typeof value === "boolean") {
    return value ? (locale === "en" ? "Yes" : locale === "kg" ? "Ооба" : "Да") : "";
  }

  const unitMap: Partial<Record<keyof Omit<ProductTechnicalDetails, "highlights">, string>> = {
    battery_life_hours: locale === "en" ? "h" : "ч",
    cable_length_m: locale === "en" ? "m" : "м",
    polling_rate_hz: locale === "en" ? "Hz" : "Гц",
    response_time_ms: locale === "en" ? "ms" : "мс",
    driver_size_mm: locale === "en" ? "mm" : "мм",
    impedance_ohm: locale === "en" ? "Ohm" : "Ом",
    sensitivity_db: locale === "en" ? "dB" : "дБ",
    thickness_mm: locale === "en" ? "mm" : "мм",
    refresh_rate_hz: locale === "en" ? "Hz" : "Гц",
    brightness_nits: locale === "en" ? "nits" : "нит",
  };

  const unit = unitMap[field];

  if (typeof value === "number") {
    return unit ? `${value} ${unit}` : String(value);
  }

  return unit && !String(value).includes(unit) ? `${value} ${unit}` : String(value);
}

export function getProductTechnicalSpecs(product: Product, locale: Locale): ProductTechnicalSpecRow[] {
  const technicalDetails = product.technical_details;
  const specRows: ProductTechnicalSpecRow[] = [];

  if (technicalDetails) {
    (
      Object.keys(technicalSpecLabels[locale]) as Array<keyof Omit<ProductTechnicalDetails, "highlights">>
    ).forEach((field) => {
      const value = formatTechnicalSpecValue(field, technicalDetails[field], locale);

      if (!value) {
        return;
      }

      specRows.push({
        key: `technical:${field}`,
        label: technicalSpecLabels[locale][field],
        value,
      });
    });
  }

  product.specifications?.forEach((spec) => {
    const value = `${spec.value}${spec.unit ? ` ${spec.unit}` : ""}`.trim();

    if (!value) {
      return;
    }

    specRows.push({
      key: `spec:${spec.group}:${spec.name}`.toLowerCase(),
      label: spec.group ? `${spec.group} / ${spec.name}` : spec.name,
      value,
    });
  });

  return specRows;
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

export async function getProductBySlug(slug: string) {
  try {
    const response = await fetch(`${getApiUrl()}/products/${slug}/`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return normalizeProduct((await response.json()) as Product);
  } catch {
    return null;
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
