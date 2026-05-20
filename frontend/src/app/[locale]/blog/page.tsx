import { BlogPage } from "@/components/Pages/BlogPage";
import {
  generateLocaleStaticParams,
  getLocaleDictionary,
  getLocalizedMetadata,
  type LocalePageProps,
} from "@/app/[locale]/localized";

export const generateStaticParams = generateLocaleStaticParams;

export function generateMetadata({ params }: LocalePageProps) {
  return getLocalizedMetadata(params, "blog");
}

export default async function LocalizedBlogPage({ params }: LocalePageProps) {
  const { locale, dictionary } = await getLocaleDictionary(params);

  return <BlogPage locale={locale} dictionary={dictionary} />;
}
