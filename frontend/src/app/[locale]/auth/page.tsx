import {
  generateLocaleStaticParams,
  getLocaleDictionary,
  getLocalizedMetadata,
  type LocalePageProps,
} from "@/app/[locale]/localized";
import { AuthPage } from "@/components/Pages/AuthPage";

export const generateStaticParams = generateLocaleStaticParams;

export function generateMetadata({ params }: LocalePageProps) {
  return getLocalizedMetadata(params, "auth");
}

export default async function LocalizedAuthPage({ params }: LocalePageProps) {
  const { locale, dictionary } = await getLocaleDictionary(params);

  return <AuthPage locale={locale} dictionary={dictionary} />;
}
