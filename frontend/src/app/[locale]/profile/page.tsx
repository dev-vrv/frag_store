import { redirect } from "next/navigation";

import {
  generateLocaleStaticParams,
  getLocale,
  getLocaleDictionary,
  getLocalizedMetadata,
  type LocalePageProps,
} from "@/app/[locale]/localized";
import { ProfilePage } from "@/components/Pages/ProfilePage";
import { localizePath } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/server-auth";

export const generateStaticParams = generateLocaleStaticParams;

export function generateMetadata({ params }: LocalePageProps) {
  return getLocalizedMetadata(params, "profile");
}

export default async function LocalizedProfilePage({ params }: LocalePageProps) {
  const locale = await getLocale(params);
  const user = await getCurrentUser();

  if (!user) {
    redirect(localizePath("/auth", locale));
  }

  const { dictionary } = await getLocaleDictionary(params);

  return <ProfilePage locale={locale} dictionary={dictionary} user={user} />;
}
