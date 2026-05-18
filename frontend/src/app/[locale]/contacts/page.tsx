import {
  LocalizedPlaceholderPage,
  generateLocaleStaticParams,
  getLocalizedMetadata,
  type LocalePageProps,
} from "@/app/[locale]/localized";

export const generateStaticParams = generateLocaleStaticParams;

export function generateMetadata({ params }: LocalePageProps) {
  return getLocalizedMetadata(params, "contacts");
}

export default function LocalizedContactsPage({ params }: LocalePageProps) {
  return <LocalizedPlaceholderPage params={params} page="contacts" />;
}
