import { Main } from "@/components/Main/Main";
import {
  generateLocaleStaticParams,
  getLocaleDictionary,
  getLocalizedMetadata,
  type LocalePageProps,
} from "@/app/[locale]/localized";
import { getBestSellerProducts, getProductCategories } from "@/lib/products";

export const generateStaticParams = generateLocaleStaticParams;

export function generateMetadata({ params }: LocalePageProps) {
  return getLocalizedMetadata(params);
}

export default async function LocalizedHomePage({ params }: LocalePageProps) {
  const { locale, dictionary } = await getLocaleDictionary(params);
  const [bestSellerProducts, categories] = await Promise.all([
    getBestSellerProducts(),
    getProductCategories(),
  ]);

  return (
    <Main
      locale={locale}
      dictionary={dictionary}
      bestSellerProducts={bestSellerProducts}
      categories={categories}
    />
  );
}
