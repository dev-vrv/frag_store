import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/Pages/PlaceholderPage";
import { defaultLocale, getDictionary } from "@/lib/i18n";

const dictionary = getDictionary(defaultLocale);
const page = dictionary.pages.cart;

export const metadata: Metadata = page.metadata;

export default function CartPage() {
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
