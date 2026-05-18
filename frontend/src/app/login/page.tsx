import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/Pages/PlaceholderPage";
import { defaultLocale, getDictionary } from "@/lib/i18n";

const dictionary = getDictionary(defaultLocale);
const page = dictionary.pages.login;

export const metadata: Metadata = page.metadata;

export default function LoginPage() {
  return (
    <PlaceholderPage
      locale={defaultLocale}
      dictionary={dictionary}
      title={page.title}
      subtitle={page.subtitle}
      badge={page.badge}
    />
  );
}
