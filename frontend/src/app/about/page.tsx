import type { Metadata } from "next";

import { AboutPage as AboutContentPage } from "@/components/Pages/AboutPage";
import { defaultLocale, getDictionary } from "@/lib/i18n";

const dictionary = getDictionary(defaultLocale);
const page = dictionary.pages.about;

export const metadata: Metadata = page.metadata;

export default function AboutPage() {
  return <AboutContentPage locale={defaultLocale} dictionary={dictionary} />;
}
