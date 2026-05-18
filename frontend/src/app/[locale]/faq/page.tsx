import {
  LocalizedPlaceholderPage,
  generateLocaleStaticParams,
  getLocalizedMetadata,
  type LocalePageProps,
} from "@/app/[locale]/localized";

export const generateStaticParams = generateLocaleStaticParams;

export function generateMetadata({ params }: LocalePageProps) {
  return getLocalizedMetadata(params, "faq");
}

export default function LocalizedFaqPage({ params }: LocalePageProps) {
  return <LocalizedPlaceholderPage params={params} page="faq" />;
}
