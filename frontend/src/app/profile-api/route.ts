import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE, getBackendApiUrl, readApiError } from "@/lib/auth";

export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json({ detail: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const response = await fetch(`${getBackendApiUrl()}/users/me/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    return NextResponse.json(
      { detail: await readApiError(response) },
      { status: response.status },
    );
  }

  return NextResponse.json(await response.json());
}
