import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE, getBackendApiUrl, readApiError } from "@/lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json({ detail: "Unauthorized." }, { status: 401 });
  }

  const response = await fetch(`${getBackendApiUrl()}/users/me/email-verification/request/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return NextResponse.json(
      { detail: await readApiError(response) },
      { status: response.status },
    );
  }

  return NextResponse.json(await response.json());
}
