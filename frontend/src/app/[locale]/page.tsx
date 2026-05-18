import { Main } from "@/components/Main/Main";
import {
  generateLocaleStaticParams,
  getLocaleDictionary,
  getLocalizedMetadata,
  type LocalePageProps,
} from "@/app/[locale]/localized";

export const generateStaticParams = generateLocaleStaticParams;

export function generateMetadata({ params }: LocalePageProps) {
  return getLocalizedMetadata(params);
}

export default async function LocalizedHomePage({ params }: LocalePageProps) {
  const { locale, dictionary } = await getLocaleDictionary(params);

  return <Main locale={locale} dictionary={dictionary} />;
}
