import {
  LocalizedPlaceholderPage,
  generateLocaleStaticParams,
  getLocalizedMetadata,
  type LocalePageProps,
} from "@/app/[locale]/localized";

export const generateStaticParams = generateLocaleStaticParams;

export function generateMetadata({ params }: LocalePageProps) {
  return getLocalizedMetadata(params, "about");
}

export default function LocalizedAboutPage({ params }: LocalePageProps) {
  return <LocalizedPlaceholderPage params={params} page="about" />;
}
