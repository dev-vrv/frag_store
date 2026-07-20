import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE, getBackendApiUrl, readApiError } from "@/lib/auth";

async function getAccessToken() {
  return (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
}

function unauthorized() {
  return NextResponse.json({ detail: "Unauthorized." }, { status: 401 });
}

async function proxyResponse(response: Response) {
  if (!response.ok) {
    return NextResponse.json({ detail: await readApiError(response) }, { status: response.status });
  }
  return NextResponse.json(await response.json());
}

export async function GET(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) return unauthorized();
  const summary = new URL(request.url).searchParams.get("summary") === "1";
  const path = summary ? "notifications/unread-count/" : "notifications/";
  return proxyResponse(await fetch(`${getBackendApiUrl()}/users/${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  }));
}

export async function PATCH(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) return unauthorized();
  const body = (await request.json()) as { id?: number };
  if (!body.id) return NextResponse.json({ detail: "Notification id is required." }, { status: 400 });
  return proxyResponse(await fetch(`${getBackendApiUrl()}/users/notifications/${body.id}/mark-read/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  }));
}

export async function POST() {
  const accessToken = await getAccessToken();
  if (!accessToken) return unauthorized();
  return proxyResponse(await fetch(`${getBackendApiUrl()}/users/notifications/mark-all-read/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  }));
}
