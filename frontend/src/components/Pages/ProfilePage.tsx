import {
  CyberBadge,
  CyberCard,
  CyberCardContent,
} from "@/components/cyber";
import {
  CalendarDays,
  Check,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
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
  const twoFactorStatus = user.two_factor_enabled
    ? locale === "en"
      ? "Enabled"
      : locale === "kg"
        ? "Күйгүзүлгөн"
        : "Включена"
    : locale === "en"
      ? "Disabled"
      : locale === "kg"
        ? "Өчүрүлгөн"
        : "Выключена";

  return (
    <main className="page-shell relative isolate overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_22%),linear-gradient(180deg,#060606_0%,#0b0b0c_38%,#050505_100%)] px-4 pt-36 text-zinc-50 sm:px-6 lg:px-8">
      <Header locale={locale} dictionary={dictionary.header} />
      <ContactCyberBackground />
      <section className="relative z-10 w-full max-w-7xl mx-auto pb-16">
        <div className="grid items-start gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <div className="xl:self-start">
            <CyberCard variant="glass" className="w-full border border-white/10 bg-zinc-950/80">
              <CyberCardContent className="p-0">
                <div className="p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <CyberBadge variant="neutral">
                      {profile.badge}
                    </CyberBadge>
                    <div className="grid size-12 shrink-0 place-items-center rounded-full border border-cyan-200/15 bg-cyan-200/[0.06] text-cyan-100">
                      <UserRound className="size-5" aria-hidden="true" />
                    </div>
                  </div>
                  <h1 className="mt-6 font-display text-3xl leading-tight tracking-[0.035em] text-zinc-50 sm:text-4xl">
                    {profile.title}
                  </h1>
                  <p className="mt-4 text-[15px] leading-7 text-zinc-400">
                    {profile.subtitle}
                  </p>
                </div>

                <div className="border-y border-white/10 bg-white/[0.025] p-6 sm:p-7">
                  <p className="break-words text-xl font-semibold leading-snug text-white sm:text-2xl">
                    {displayName}
                  </p>
                  <div className="mt-5 flex items-center justify-between gap-4 rounded-md border border-amber-200/15 bg-amber-200/[0.06] px-4 py-4">
                    <p className="font-tech text-xs uppercase tracking-[0.08em] text-amber-100/75">
                      {profile.discountLabel}
                    </p>
                    <p className="shrink-0 font-display text-3xl text-amber-200">
                      {user.personal_discount_percent}%
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    <div className="min-w-0 rounded-md border border-white/10 bg-white/[0.025] p-4">
                      <div className="flex items-start gap-3">
                        <Mail className="mt-0.5 size-4 shrink-0 text-cyan-200/75" aria-hidden="true" />
                        <div className="min-w-0">
                          <p className="font-tech text-xs uppercase tracking-[0.08em] text-zinc-500">{profile.emailLabel}</p>
                          <p className="mt-1.5 break-all text-[15px] leading-6 text-zinc-100">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="min-w-0 rounded-md border border-white/10 bg-white/[0.025] p-4">
                      <div className="flex items-start gap-3">
                        <Phone className="mt-0.5 size-4 shrink-0 text-cyan-200/75" aria-hidden="true" />
                        <div className="min-w-0">
                          <p className="font-tech text-xs uppercase tracking-[0.08em] text-zinc-500">{profile.phoneLabel}</p>
                          <p className="mt-1.5 break-words text-[15px] leading-6 text-zinc-100">{user.phone || "—"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="min-w-0 rounded-md border border-white/10 bg-white/[0.025] p-4">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-cyan-200/75" aria-hidden="true" />
                        <div className="min-w-0">
                          <p className="font-tech text-xs uppercase tracking-[0.08em] text-zinc-500">2FA</p>
                          <div className="mt-1.5 flex items-center gap-2 text-[15px] leading-6 text-zinc-100">
                            {user.two_factor_enabled ? (
                              <Check className="size-4 shrink-0 text-emerald-300" aria-hidden="true" />
                            ) : (
                              <X className="size-4 shrink-0 text-red-300" aria-hidden="true" />
                            )}
                            <span>{twoFactorStatus}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="min-w-0 rounded-md border border-white/10 bg-white/[0.025] p-4">
                      <div className="flex items-start gap-3">
                        <CalendarDays className="mt-0.5 size-4 shrink-0 text-cyan-200/75" aria-hidden="true" />
                        <div className="min-w-0">
                          <p className="font-tech text-xs uppercase tracking-[0.08em] text-zinc-500">{profile.joinedLabel}</p>
                          <p className="mt-1.5 text-[15px] leading-6 text-zinc-100">{joinedAt}</p>
                        </div>
                      </div>
                    </div>

                    <div className="min-w-0 rounded-md border border-white/10 bg-white/[0.025] p-4 sm:col-span-2 xl:col-span-1">
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-cyan-200/75" aria-hidden="true" />
                        <div className="min-w-0">
                          <p className="font-tech text-xs uppercase tracking-[0.08em] text-zinc-500">{profile.addressLabel}</p>
                          <p className="mt-1.5 break-words text-[15px] leading-6 text-zinc-100">{user.address || "—"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-white/10 pt-5 [&>button]:w-full">
                    <ProfileLogoutButton locale={locale} label={profile.logoutLabel} />
                  </div>
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
