import {
  CyberBadge,
  CyberCard,
  CyberCardContent,
} from "@/components/cyber";
import { Check, X } from "lucide-react";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { ContactCyberBackground } from "@/components/Pages/ContactsPage/ContactCyberBackground";
import { ProfileDetailsForm } from "@/components/Pages/ProfileDetailsForm";
import { ProfileOrdersPanel } from "@/components/Pages/ProfileOrdersPanel";
import { ProfileLogoutButton } from "@/components/Pages/ProfileLogoutButton";
import { ProfileTabs } from "@/components/Pages/ProfileTabs";
import { ProfileNotificationsPanel } from "@/components/Pages/ProfileNotificationsPanel";
import { type AuthUser } from "@/lib/auth";
import { localizePath, type Dictionary, type Locale } from "@/lib/i18n";

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
  const orders = user.orders ?? [];
  const activeOrderStatuses = new Set(["new", "confirmed", "processing", "shipped"]);
  const activeOrdersCount = orders.filter((order) => activeOrderStatuses.has(order.status)).length;
  const catalogHref = dictionary.header.nav.find((item) => item.href.includes("catalog"))?.href ?? localizePath("/catalog", locale);

  return (
    <main className="page-shell relative isolate overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_22%),linear-gradient(180deg,#060606_0%,#0b0b0c_38%,#050505_100%)] px-4 pt-36 text-zinc-50 sm:px-6 lg:px-8">
      <Header locale={locale} dictionary={dictionary.header} />
      <ContactCyberBackground />
      <section className="relative z-10 w-full max-w-7xl mx-auto pb-16">
        <div className="grid items-start gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="xl:self-start">
            <CyberCard variant="glass" className="w-full border border-white/10 bg-zinc-950/80">
              <CyberCardContent className="space-y-6 p-6 sm:p-7">
                <CyberBadge variant="neutral">
                  {profile.badge}
                </CyberBadge>
                <h1 className="max-w-[14ch] text-balance font-display text-3xl uppercase tracking-[0.08em] text-zinc-50 sm:text-4xl">
                  {profile.title}
                </h1>
                <p className="max-w-[28ch] text-sm leading-7 text-zinc-400 sm:text-[15px]">
                  {profile.subtitle}
                </p>
                <div className="border-t border-white/10 pt-5">
                  <p className="break-words font-display text-2xl uppercase tracking-[0.08em] text-white sm:text-3xl">
                    {displayName}
                  </p>
                  <div className="mt-5 grid gap-3">
                    <div className="min-w-0 border border-amber-200/15 bg-amber-200/[0.06] p-4">
                      <p className="font-tech text-[11px] uppercase tracking-[0.14em] text-amber-100/70">
                        {profile.discountLabel}
                      </p>
                      <p className="mt-3 font-display text-4xl text-amber-200 sm:text-5xl">
                        {user.personal_discount_percent}%
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="font-tech text-zinc-500">{profile.emailLabel}</p>
                      <p className="mt-1 break-all text-base text-zinc-100 normal-case tracking-normal">
                        {user.email}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="font-tech text-zinc-500">{profile.phoneLabel}</p>
                      <p className="mt-1 break-words text-base text-zinc-100 normal-case tracking-normal">
                        {user.phone || "—"}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="font-tech text-zinc-500">2FA</p>
                      <div className="mt-1 flex items-center gap-2 text-base normal-case tracking-normal text-zinc-100">
                        {user.two_factor_enabled ? (
                          <Check className="size-4 text-emerald-300" />
                        ) : (
                          <X className="size-4 text-red-300" />
                        )}
                        <span>{user.two_factor_enabled ? "Включена" : "Выключена"}</span>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="font-tech text-zinc-500">{profile.joinedLabel}</p>
                      <p className="mt-1 text-base text-zinc-100 normal-case tracking-normal">
                        {joinedAt}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="font-tech text-zinc-500">{profile.addressLabel}</p>
                      <p className="mt-1 break-words text-base text-zinc-100 normal-case tracking-normal">
                        {user.address || "—"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-5">
                  <ProfileLogoutButton locale={locale} label={profile.logoutLabel} />
                </div>
              </CyberCardContent>
            </CyberCard>
          </div>

          <div className="grid gap-6">
            <ProfileTabs
              detailsLabel={profile.badge}
              ordersLabel={profile.ordersBadge}
              notificationsLabel={locale === "en" ? "Notifications" : locale === "kg" ? "Билдирүүлөр" : "Уведомления"}
              activeOrdersCount={activeOrdersCount}
              detailsContent={<ProfileDetailsForm dictionary={profile} user={user} />}
              ordersContent={(
                <ProfileOrdersPanel
                  locale={locale}
                  profile={profile}
                  orders={orders}
                  catalogHref={catalogHref}
                />
              )}
              notificationsContent={<ProfileNotificationsPanel locale={locale} />}
            />
          </div>
        </div>
      </section>
      <Footer locale={locale} dictionary={dictionary} className="-mx-4 sm:-mx-6 lg:-mx-8" />
    </main>
  );
}
