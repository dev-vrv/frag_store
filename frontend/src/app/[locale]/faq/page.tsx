import {
  generateLocaleStaticParams,
  getLocaleDictionary,
  getLocalizedMetadata,
  type LocalePageProps,
} from "@/app/[locale]/localized";
import { FaqPage } from "@/components/Pages/FaqPage";

export const generateStaticParams = generateLocaleStaticParams;

export function generateMetadata({ params }: LocalePageProps) {
  return getLocalizedMetadata(params, "faq");
}

export default async function LocalizedFaqPage({ params }: LocalePageProps) {
  const { locale, dictionary } = await getLocaleDictionary(params);

  return <FaqPage locale={locale} dictionary={dictionary} />;
}
