import {
  LocalizedPlaceholderPage,
  generateLocaleStaticParams,
  getLocalizedMetadata,
  type LocalePageProps,
} from "@/app/[locale]/localized";

export const generateStaticParams = generateLocaleStaticParams;

export function generateMetadata({ params }: LocalePageProps) {
  return getLocalizedMetadata(params, "login");
}

export default function LocalizedLoginPage({ params }: LocalePageProps) {
  return <LocalizedPlaceholderPage params={params} page="login" />;
}
