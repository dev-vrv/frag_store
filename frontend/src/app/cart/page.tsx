import type { Metadata } from "next";

import { CartPage } from "@/components/Pages/CartPage";
import { getCurrentUser } from "@/lib/server-auth";
import { defaultLocale, getDictionary } from "@/lib/i18n";

const dictionary = getDictionary(defaultLocale);
const page = dictionary.pages.cart;

export const metadata: Metadata = page.metadata;

export default async function DefaultCartPage() {
  const user = await getCurrentUser();

  return (
    <CartPage locale={defaultLocale} dictionary={dictionary} user={user} />
  );
}
