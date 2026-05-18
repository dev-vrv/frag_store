import type { Metadata } from "next";

import { Main } from "@/components/Main/Main";
import { defaultLocale, getDictionary } from "@/lib/i18n";

const dictionary = getDictionary(defaultLocale);

export const metadata: Metadata = dictionary.metadata;

export default function Home() {
  return <Main locale={defaultLocale} dictionary={dictionary} />;
}
