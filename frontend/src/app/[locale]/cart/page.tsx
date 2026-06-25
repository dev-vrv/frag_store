import {
  generateLocaleStaticParams,
  getLocaleDictionary,
  getLocalizedMetadata,
  type LocalePageProps,
} from "@/app/[locale]/localized";
import { CartPage } from "@/components/Pages/CartPage";
import { getCurrentUser } from "@/lib/server-auth";

export const generateStaticParams = generateLocaleStaticParams;

export function generateMetadata({ params }: LocalePageProps) {
  return getLocalizedMetadata(params, "cart");
}

export default async function LocalizedCartPage({ params }: LocalePageProps) {
  const [{ locale, dictionary }, user] = await Promise.all([
    getLocaleDictionary(params),
    getCurrentUser(),
  ]);

  return <CartPage locale={locale} dictionary={dictionary} user={user} />;
}
