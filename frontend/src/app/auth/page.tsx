import type { Metadata } from "next";

import { AuthPage } from "@/components/Pages/AuthPage";
import { defaultLocale, getDictionary } from "@/lib/i18n";

const dictionary = getDictionary(defaultLocale);
const page = dictionary.pages.auth;

export const metadata: Metadata = page.metadata;

export default function AuthRoutePage() {
  return <AuthPage locale={defaultLocale} dictionary={dictionary} />;
}
