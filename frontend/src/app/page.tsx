import type { Metadata } from "next";

import { Main } from "@/components/Main/Main";
import { defaultLocale, getDictionary } from "@/lib/i18n";
import { getBestSellerProducts } from "@/lib/products";

const dictionary = getDictionary(defaultLocale);

export const metadata: Metadata = dictionary.metadata;

export default async function Home() {
  const bestSellerProducts = await getBestSellerProducts();

  return <Main locale={defaultLocale} dictionary={dictionary} bestSellerProducts={bestSellerProducts} />;
}
