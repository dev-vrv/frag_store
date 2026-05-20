import {
  LocalizedPlaceholderPage,
  generateLocaleStaticParams,
  getLocalizedMetadata,
  type LocalePageProps,
} from "@/app/[locale]/localized";

export const generateStaticParams = generateLocaleStaticParams;

export function generateMetadata({ params }: LocalePageProps) {
  return getLocalizedMetadata(params, "cart");
}

export default function LocalizedCartPage({ params }: LocalePageProps) {
  return <LocalizedPlaceholderPage params={params} page="cart" />;
}
