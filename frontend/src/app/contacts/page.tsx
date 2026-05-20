import type { Metadata } from "next";

import { ContactsPage } from "@/components/Pages/ContactsPage";
import { defaultLocale, getDictionary } from "@/lib/i18n";

const dictionary = getDictionary(defaultLocale);
const page = dictionary.pages.contacts;

export const metadata: Metadata = page.metadata;

export default function DefaultContactsPage() {
  return <ContactsPage locale={defaultLocale} dictionary={dictionary} />;
}
