import {
  generateLocaleStaticParams,
  getLocaleDictionary,
  getLocalizedMetadata,
  type LocalePageProps,
} from "@/app/[locale]/localized";
import { CatalogPage } from "@/components/Pages/CatalogPage";
import { getProductCategories, getProducts } from "@/lib/products";

export const generateStaticParams = generateLocaleStaticParams;

export function generateMetadata({ params }: LocalePageProps) {
  return getLocalizedMetadata(params, "catalog");
}

export default async function LocalizedCatalogPage({
  params,
  searchParams,
}: LocalePageProps & {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale, dictionary } = await getLocaleDictionary(params);
  const query = (await searchParams) ?? {};
  const initialCategory = typeof query.category === "string" ? query.category : "all";
  const [products, categories] = await Promise.all([
    getProducts(),
    getProductCategories(),
  ]);

  return (
    <CatalogPage
      locale={locale}
      dictionary={dictionary}
      products={products}
      categories={categories}
      initialCategory={initialCategory}
    />
  );
}
