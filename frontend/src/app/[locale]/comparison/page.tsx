import { redirect } from "next/navigation";

import { type LocalePageProps } from "@/app/[locale]/localized";

export default async function LocalizedComparisonPage({ params }: LocalePageProps) {
  const { locale } = await params;

  redirect(`/${locale}/catalog`);
}
