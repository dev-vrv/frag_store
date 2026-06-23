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

export function getLocalizedProductName(product: Product, _locale: Locale) {
  return product.name;
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
      next: { revalidate: 60 },
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
      next: { revalidate: 60 },
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
