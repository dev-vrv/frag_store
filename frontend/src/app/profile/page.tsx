import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ProfilePage } from "@/components/Pages/ProfilePage";
import { defaultLocale, getDictionary } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/server-auth";

const dictionary = getDictionary(defaultLocale);
const page = dictionary.pages.profile;

export const metadata: Metadata = page.metadata;

export default async function ProfileRoutePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  return <ProfilePage locale={defaultLocale} dictionary={dictionary} user={user} />;
}
