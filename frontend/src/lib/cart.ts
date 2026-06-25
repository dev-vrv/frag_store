import { readApiError } from "@/lib/auth";
import { type Locale } from "@/lib/i18n";

export interface CartItemInput {
  productId: number;
  quantity: number;
  selectedColorId?: number | null;
}

export interface CartSummaryItem {
  product_id: number;
  product_slug: string;
  product_name: string;
  product_sku: string;
  selected_color_id: number | null;
  selected_color_name: string;
  selected_color_hex: string;
  brand_name: string;
  category_name: string;
  short_description: string;
  quantity: number;
  unit_price: string;
  unit_old_price: string | null;
  line_total: string;
  currency: string;
  quantity_in_stock: number;
  primary_media: string | null;
  color_options: Array<{
    id: number;
    name: string;
    hex_code: string;
  }>;
}

export interface CartSummary {
  items: CartSummaryItem[];
  promo_code: string;
  subtotal: string;
  product_discount_total: string;
  promo_discount_total: string;
  discount_total: string;
  total: string;
  currency: string;
  items_count: number;
  quantity_total: number;
}

export interface CartCheckoutPayload {
  delivery_method: "courier" | "pickup";
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_city: string;
  delivery_address: string;
  comment: string;
  promo_code?: string;
  items: Array<{
    product_id: number;
    quantity: number;
    selected_color_id?: number | null;
  }>;
}

export interface CartCheckoutResponse {
  id: number;
  number: string;
  status: string;
  payment_status: string;
  delivery_method: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_city: string;
  delivery_address: string;
  comment: string;
  promo_code: string;
  promo_discount_total: string;
  subtotal: string;
  discount_total: string;
  total: string;
  currency: string;
  created_at: string;
}

export const CART_STORAGE_KEY = "frag-store-cart-v1";

function normalizeMediaUrl(url: string | null) {
  if (!url) {
    return null;
  }

  if (url.startsWith("/media/")) {
    return url;
  }

  try {
    const parsed = new URL(url);
    if (parsed.pathname.startsWith("/media/")) {
      return parsed.pathname;
    }
  } catch {
    return url;
  }

  return url;
}

export function normalizeCartItems(items: CartItemInput[]) {
  const aggregated = new Map<string, CartItemInput>();

  for (const item of items) {
    const productId = Number(item.productId);
    const quantity = Number(item.quantity);
    const selectedColorId =
      item.selectedColorId == null ? null : Number(item.selectedColorId);

    if (!Number.isInteger(productId) || productId <= 0) {
      continue;
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      continue;
    }

    const key = `${productId}:${selectedColorId ?? "none"}`;
    const current = aggregated.get(key);

    aggregated.set(key, {
      productId,
      quantity: (current?.quantity ?? 0) + quantity,
      selectedColorId,
    });
  }

  return Array.from(aggregated.values()).sort((a, b) => {
    if (a.productId !== b.productId) {
      return a.productId - b.productId;
    }

    return (a.selectedColorId ?? 0) - (b.selectedColorId ?? 0);
  });
}

export function readCartStorage() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    return normalizeCartItems(JSON.parse(raw) as CartItemInput[]);
  } catch {
    return [];
  }
}

export function writeCartStorage(items: CartItemInput[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(normalizeCartItems(items)));
}

export async function fetchCartSummary(items: CartItemInput[], promoCode = "") {
  const response = await fetch("/api/cart/summary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        selected_color_id: item.selectedColorId ?? null,
      })),
      promo_code: promoCode,
    }),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  const data = (await response.json()) as CartSummary;

  return {
    ...data,
    items: data.items.map((item) => ({
      ...item,
      primary_media: normalizeMediaUrl(item.primary_media),
    })),
  };
}

export async function submitCartCheckout(payload: CartCheckoutPayload) {
  const response = await fetch("/api/cart/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return (await response.json()) as CartCheckoutResponse;
}

export function formatCartMoney(value: string, currency: string, locale: Locale) {
  const amount = Number(value);
  if (Number.isNaN(amount)) {
    return `${value} ${currency}`;
  }

  const formatted = amount.toLocaleString(locale === "en" ? "en-US" : "ru-RU");
  return currency === "USD" ? `$${formatted}` : `${formatted} сом`;
}
