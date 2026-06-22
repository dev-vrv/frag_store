import {
  generateLocaleStaticParams,
  getLocaleDictionary,
  getLocalizedMetadata,
  getLocale,
  type LocalePageProps,
} from "@/app/[locale]/localized";
import { AuthPage } from "@/components/Pages/AuthPage";
import { localizePath } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export const generateStaticParams = generateLocaleStaticParams;

export function generateMetadata({ params }: LocalePageProps) {
  return getLocalizedMetadata(params, "auth");
}

export default async function LocalizedAuthPage({ params }: LocalePageProps) {
  const currentLocale = await getLocale(params);
  const user = await getCurrentUser();

  if (user) {
    redirect(localizePath("/profile", currentLocale));
  }

  const { locale, dictionary } = await getLocaleDictionary(params);

  return <AuthPage locale={locale} dictionary={dictionary} />;
}
