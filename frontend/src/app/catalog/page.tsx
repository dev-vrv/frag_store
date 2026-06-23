import type { Metadata } from "next";

import { CatalogPage as CatalogContentPage } from "@/components/Pages/CatalogPage";
import { defaultLocale, getDictionary } from "@/lib/i18n";
import { getProductBrands, getProductCategories, getProducts } from "@/lib/products";

const dictionary = getDictionary(defaultLocale);
const page = dictionary.pages.catalog;

export const metadata: Metadata = page.metadata;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const initialCategory =
    typeof params.category === "string"
      ? params.category
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];
  const initialBrand = typeof params.brand === "string" ? params.brand : "all";
  const [products, categories, brands] = await Promise.all([
    getProducts(),
    getProductCategories(),
    getProductBrands(),
  ]);

  return (
    <CatalogContentPage
      locale={defaultLocale}
      dictionary={dictionary}
      products={products}
      categories={categories}
      brands={brands}
      initialCategory={initialCategory}
      initialBrand={initialBrand}
    />
  );
}
