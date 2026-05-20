import type { Metadata } from "next";

import { LegalPage } from "@/components/Pages/LegalPage";
import { defaultLocale, getDictionary } from "@/lib/i18n";

const dictionary = getDictionary(defaultLocale);
const page = dictionary.pages.privacy;

export const metadata: Metadata = page.metadata;

export default function PrivacyPage() {
  return <LegalPage locale={defaultLocale} dictionary={dictionary} page="privacy" />;
}
