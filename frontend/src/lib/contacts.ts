import { type Locale } from "@/lib/i18n";

export interface ContactInfo {
  id: number;
  locale: Locale;
  phone: string;
  email: string;
  address: string;
  working_hours: string;
  whatsapp: string;
  telegram: string;
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
  x: string;
  extra_contacts: Record<string, string>;
  updated_at: string;
}

export interface ContactMessagePayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
  locale: Locale;
}

type ContactInfoListResponse =
  | ContactInfo[]
  | {
      results?: ContactInfo[];
    };

const internalApiUrl = process.env.API_URL || "http://127.0.0.1:8000/api";
const publicApiUrl = process.env.NEXT_PUBLIC_API_URL || internalApiUrl;

function getApiUrl() {
  return typeof window === "undefined" ? internalApiUrl : publicApiUrl;
}

export async function getContactInfo(locale: Locale) {
  try {
    const response = await fetch(
      `${getApiUrl()}/content/contact-info/?locale=${locale}`,
      {
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as ContactInfoListResponse;
    const contacts = Array.isArray(data) ? data : data.results ?? [];

    return contacts[0] ?? null;
  } catch {
    return null;
  }
}

export async function getContactInfos() {
  try {
    const response = await fetch(`${getApiUrl()}/content/contact-info/`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as ContactInfoListResponse;

    return Array.isArray(data) ? data : data.results ?? [];
  } catch {
    return [];
  }
}

export async function sendContactMessage(payload: ContactMessagePayload) {
  const response = await fetch(`${getApiUrl()}/users/contact-messages/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to send contact message");
  }

  return response.json();
}
