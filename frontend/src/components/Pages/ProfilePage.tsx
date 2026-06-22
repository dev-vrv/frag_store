import {
  CyberBadge,
  CyberCard,
  CyberCardContent,
  CyberLaserText,
} from "@/components/cyber";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { ContactCyberBackground } from "@/components/Pages/ContactsPage/ContactCyberBackground";
import { ProfileLogoutButton } from "@/components/Pages/ProfileLogoutButton";
import { type AuthUser } from "@/lib/auth";
import { type Dictionary, type Locale } from "@/lib/i18n";

export interface ProfilePageProps {
  locale: Locale;
  dictionary: Dictionary;
  user: AuthUser;
}

export function ProfilePage({ locale, dictionary, user }: ProfilePageProps) {
  const profile = dictionary.profile;
  const displayName = user.full_name || user.first_name || user.email;
  const joinedAt = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
  }).format(new Date(user.date_joined));

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-black px-4 pt-36 text-zinc-50 sm:px-6 lg:px-8">
      <Header locale={locale} dictionary={dictionary.header} />
      <ContactCyberBackground />
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-9rem)] max-w-7xl items-center">
        <CyberCard variant="glass" className="w-full p-2">
          <CyberCardContent className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <div>
              <CyberBadge variant="red" glow>
                {profile.badge}
              </CyberBadge>
              <CyberLaserText
                as="h1"
                text={profile.title}
                className="mt-7 block text-5xl text-red-100 sm:text-7xl"
                speedMs={44}
              />
              <p className="mt-6 max-w-2xl text-xl leading-9 text-zinc-400">
                {profile.subtitle}
              </p>
            </div>

            <div className="border border-white/10 bg-black/35 p-6 shadow-[0_0_32px_rgba(255,23,68,0.12)] backdrop-blur-sm">
              <p className="font-display text-3xl uppercase tracking-[0.08em] text-white">
                {displayName}
              </p>
              <div className="mt-6 space-y-4 text-sm uppercase tracking-[0.1em] text-zinc-400">
                <div>
                  <p className="font-tech text-zinc-500">{profile.emailLabel}</p>
                  <p className="mt-1 text-base text-zinc-100 normal-case tracking-normal">
                    {user.email}
                  </p>
                </div>
                <div>
                  <p className="font-tech text-zinc-500">{profile.phoneLabel}</p>
                  <p className="mt-1 text-base text-zinc-100 normal-case tracking-normal">
                    {user.phone || "—"}
                  </p>
                </div>
                <div>
                  <p className="font-tech text-zinc-500">{profile.joinedLabel}</p>
                  <p className="mt-1 text-base text-zinc-100 normal-case tracking-normal">
                    {joinedAt}
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <ProfileLogoutButton locale={locale} label={profile.logoutLabel} />
              </div>
            </div>
          </CyberCardContent>
        </CyberCard>
      </section>
      <Footer locale={locale} dictionary={dictionary} className="-mx-4 sm:-mx-6 lg:-mx-8" />
    </main>
  );
}
