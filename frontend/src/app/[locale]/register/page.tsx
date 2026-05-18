import {
  LocalizedPlaceholderPage,
  generateLocaleStaticParams,
  getLocalizedMetadata,
  type LocalePageProps,
} from "@/app/[locale]/localized";

export const generateStaticParams = generateLocaleStaticParams;

export function generateMetadata({ params }: LocalePageProps) {
  return getLocalizedMetadata(params, "register");
}

export default function LocalizedRegisterPage({ params }: LocalePageProps) {
  return <LocalizedPlaceholderPage params={params} page="register" />;
}
