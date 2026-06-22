import { NextResponse } from "next/server";

import {
  ACCESS_TOKEN_COOKIE,
  getBackendApiUrl,
  readApiError,
  REFRESH_TOKEN_COOKIE,
  type AuthResponse,
} from "@/lib/auth";

function setAuthCookies(response: NextResponse, payload: AuthResponse) {
  const secure = process.env.NODE_ENV === "production";

  response.cookies.set(ACCESS_TOKEN_COOKIE, payload.access, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 30,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, payload.refresh, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const response = await fetch(`${getBackendApiUrl()}/users/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    return NextResponse.json(
      { detail: await readApiError(response) },
      { status: response.status },
    );
  }

  const payload = (await response.json()) as AuthResponse;
  const nextResponse = NextResponse.json(payload);
  setAuthCookies(nextResponse, payload);
  return nextResponse;
}
