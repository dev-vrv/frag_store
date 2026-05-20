import type { Metadata } from "next";

import { BlogPage } from "@/components/Pages/BlogPage";
import { defaultLocale, getDictionary } from "@/lib/i18n";

const dictionary = getDictionary(defaultLocale);

export const metadata: Metadata = dictionary.pages.blog.metadata;

export default function Blog() {
  return <BlogPage locale={defaultLocale} dictionary={dictionary} />;
}
