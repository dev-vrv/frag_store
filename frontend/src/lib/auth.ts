export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  date_joined: string;
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

export async function logout() {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }
}
