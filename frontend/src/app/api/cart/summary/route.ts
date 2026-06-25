import { NextResponse } from "next/server";

import { getBackendApiUrl } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const response = await fetch(`${getBackendApiUrl()}/cart/summary/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => ({ detail: "Request failed." }));
  return NextResponse.json(payload, { status: response.status });
}
