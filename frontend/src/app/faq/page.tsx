import type { Metadata } from "next";

import { FaqPage as FaqContentPage } from "@/components/Pages/FaqPage";
import { defaultLocale, getDictionary } from "@/lib/i18n";

const dictionary = getDictionary(defaultLocale);
const page = dictionary.pages.faq;

export const metadata: Metadata = page.metadata;

export default function FaqPage() {
  return <FaqContentPage locale={defaultLocale} dictionary={dictionary} />;
}
