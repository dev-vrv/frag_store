import type { Metadata } from "next";

import { CatalogPage as CatalogContentPage } from "@/components/Pages/CatalogPage";
import { defaultLocale, getDictionary } from "@/lib/i18n";

const dictionary = getDictionary(defaultLocale);
const page = dictionary.pages.catalog;

export const metadata: Metadata = page.metadata;

export default function CatalogPage() {
  return <CatalogContentPage locale={defaultLocale} dictionary={dictionary} />;
}
