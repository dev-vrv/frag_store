import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PlaceholderPage } from "@/components/Pages/PlaceholderPage";
import {
  getDictionary,
  getPageDictionary,
  isLocale,
  locales,
  type Dictionary,
} from "@/lib/i18n";

export interface LocalePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export function generateLocaleStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function getLocale(params: LocalePageProps["params"]) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return locale;
}

export async function getLocaleDictionary(params: LocalePageProps["params"]) {
  const locale = await getLocale(params);

  return {
    locale,
    dictionary: getDictionary(locale),
  };
}

export async function getLocalizedMetadata(
  params: LocalePageProps["params"],
  page?: keyof Dictionary["pages"],
): Promise<Metadata> {
  const locale = await getLocale(params);

  if (!page) {
    return getDictionary(locale).metadata;
  }

  return getPageDictionary(locale, page).metadata;
}

export async function LocalizedPlaceholderPage({
  params,
  page,
  animatedBackground,
}: LocalePageProps & {
  page: keyof Dictionary["pages"];
  animatedBackground?: boolean;
}) {
  const locale = await getLocale(params);
  const dictionary = getDictionary(locale);
  const pageDictionary = dictionary.pages[page];

  return (
    <PlaceholderPage
      locale={locale}
      dictionary={dictionary}
      title={pageDictionary.title}
      subtitle={pageDictionary.subtitle}
      badge={pageDictionary.badge}
      animatedBackground={animatedBackground}
    />
  );
}
