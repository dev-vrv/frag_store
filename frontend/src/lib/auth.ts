export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  city: string;
  address: string;
  personal_discount_percent: string;
  email_verified: boolean;
  two_factor_enabled: boolean;
  pending_two_factor_enabled: boolean;
  date_joined: string;
  orders?: AuthOrder[];
}

export interface AuthOrderItem {
  id: number;
  product_id: number;
  product_slug: string;
  product_name: string;
  product_sku: string;
  unit_price: string;
  unit_old_price: string | null;
  quantity: number;
  line_total: string;
  currency: string;
}

export interface AuthOrder {
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
  subtotal: string;
  discount_total: string;
  total: string;
  currency: string;
  items: AuthOrderItem[];
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse extends AuthTokens {
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  first_name: string;
  last_name: string;
  phone: string;
  password_confirm: string;
}

export interface ApiErrorPayload {
  detail?: string;
  [key: string]: unknown;
}

export interface ProfileUpdatePayload {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  two_factor_enabled?: boolean;
}

const internalApiUrl = process.env.API_URL || "http://127.0.0.1:8000/api";
const publicApiUrl = process.env.NEXT_PUBLIC_API_URL || internalApiUrl;

export const ACCESS_TOKEN_COOKIE = "frag_access_token";
export const REFRESH_TOKEN_COOKIE = "frag_refresh_token";

export function getBackendApiUrl() {
  return typeof window === "undefined" ? internalApiUrl : publicApiUrl;
}

export async function readApiError(response: Response) {
  let payload: ApiErrorPayload | null = null;

  try {
    payload = (await response.json()) as ApiErrorPayload;
  } catch {
    return "Request failed.";
  }

  if (typeof payload?.detail === "string" && payload.detail.trim()) {
    return payload.detail;
  }

  for (const value of Object.values(payload ?? {})) {
    if (Array.isArray(value) && typeof value[0] === "string") {
      return value[0];
    }
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return "Request failed.";
}

async function submitAuthRequest<TPayload>(path: string, payload: TPayload) {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return (await response.json()) as AuthResponse;
}

export function login(payload: LoginPayload) {
  return submitAuthRequest("/api/auth/login", payload);
}

export function register(payload: RegisterPayload) {
  return submitAuthRequest("/api/auth/register", payload);
}

export function persistAuthCookies(payload: AuthTokens) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(payload.access)}; Path=/; Max-Age=${60 * 30}; SameSite=Lax`;
  document.cookie = `${REFRESH_TOKEN_COOKIE}=${encodeURIComponent(payload.refresh)}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export async function logout() {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }
}

export async function updateProfile(payload: ProfileUpdatePayload) {
  const response = await fetch("/profile-api", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return (await response.json()) as AuthUser;
}

export async function requestProfileEmailVerification() {
  const response = await fetch("/profile-api/email-verification/request", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }
}

export async function confirmProfileEmailVerification(code: string) {
  const response = await fetch("/profile-api/email-verification/confirm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return (await response.json()) as AuthUser;
}
