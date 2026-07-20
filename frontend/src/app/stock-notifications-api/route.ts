import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE, getBackendApiUrl, readApiError } from "@/lib/auth";

export async function POST(request: Request) {
  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) return NextResponse.json({ detail: "Unauthorized." }, { status: 401 });
  const body = (await request.json()) as { productSlug?: string; locale?: string };
  if (!body.productSlug) return NextResponse.json({ detail: "Product is required." }, { status: 400 });
  const response = await fetch(`${getBackendApiUrl()}/products/${encodeURIComponent(body.productSlug)}/stock-subscription/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ locale: body.locale }),
  });
  if (!response.ok) return NextResponse.json({ detail: await readApiError(response) }, { status: response.status });
  return NextResponse.json(await response.json(), { status: 201 });
}
