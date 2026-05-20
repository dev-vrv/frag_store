import {
  generateLocaleStaticParams,
  getLocaleDictionary,
  getLocalizedMetadata,
  type LocalePageProps,
} from "@/app/[locale]/localized";
import { ContactsPage } from "@/components/Pages/ContactsPage";

export const generateStaticParams = generateLocaleStaticParams;

export function generateMetadata({ params }: LocalePageProps) {
  return getLocalizedMetadata(params, "contacts");
}

export default async function LocalizedContactsPage({ params }: LocalePageProps) {
  const { locale, dictionary } = await getLocaleDictionary(params);

  return <ContactsPage locale={locale} dictionary={dictionary} />;
}
