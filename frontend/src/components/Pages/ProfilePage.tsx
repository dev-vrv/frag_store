import {
  CyberBadge,
  CyberButton,
  CyberCard,
  CyberCardContent,
} from "@/components/cyber";
import { Check, X } from "lucide-react";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { ContactCyberBackground } from "@/components/Pages/ContactsPage/ContactCyberBackground";
import { ProfileDetailsForm } from "@/components/Pages/ProfileDetailsForm";
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
  const orders = user.orders ?? [];

  function formatMoney(value: string, currency: string) {
    return `${value} ${currency}`;
  }

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
            <ProfileDetailsForm dictionary={profile} user={user} />

            <CyberCard variant="glass" className="border border-white/10 bg-zinc-950/80">
              <CyberCardContent className="space-y-6 p-5 sm:p-7">
                <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <CyberBadge variant="neutral">
                      {profile.ordersBadge}
                    </CyberBadge>
                    <p className="mt-4 font-display text-2xl uppercase tracking-[0.08em] text-white sm:text-3xl">
                      {profile.ordersTitle}
                    </p>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-[15px]">
                      {profile.ordersSubtitle}
                    </p>
                  </div>
                  <CyberButton asChild variant="ghost">
                    <a href={dictionary.header.nav.find((item) => item.href.includes("catalog"))?.href ?? "/catalog"}>
                      {profile.catalogLabel}
                    </a>
                  </CyberButton>
                </div>

                {orders.length ? (
                  <div className="grid gap-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="grid gap-5 border border-white/10 bg-white/[0.03] p-4 sm:p-5 xl:grid-cols-[280px_minmax(0,1fr)]"
                      >
                        <div className="min-w-0 space-y-3 border-b border-white/10 pb-4 xl:border-b-0 xl:border-r xl:pb-0 xl:pr-5">
                          <div className="flex flex-wrap items-center gap-3">
                            <p className="break-all font-display text-lg uppercase tracking-[0.08em] text-white sm:text-xl">
                              {order.number}
                            </p>
                            <span className="border border-white/15 bg-white/[0.05] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-zinc-200">
                              {order.status}
                            </span>
                          </div>
                          <div className="grid gap-2 text-sm text-zinc-300">
                            <p>
                              {profile.orderDateLabel}:{" "}
                              <span className="text-zinc-100">
                                {new Intl.DateTimeFormat(locale, {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                }).format(new Date(order.created_at))}
                              </span>
                            </p>
                            <p>
                              {profile.orderTotalLabel}:{" "}
                              <span className="text-zinc-100">
                                {formatMoney(order.total, order.currency)}
                              </span>
                            </p>
                            <p>
                              {profile.orderDiscountLabel}:{" "}
                              <span className="text-amber-200">
                                {formatMoney(order.discount_total, order.currency)}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="grid min-w-0 gap-3">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="grid gap-3 border border-white/8 bg-black/25 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                            >
                              <div className="min-w-0">
                                <p className="break-words text-sm uppercase tracking-[0.08em] text-zinc-100">
                                  {item.product_name}
                                </p>
                                <p className="mt-1 break-all text-xs uppercase tracking-[0.12em] text-zinc-500">
                                  SKU: {item.product_sku}
                                </p>
                                {item.selected_color_name ? (
                                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-zinc-400">
                                    Цвет: {item.selected_color_name}
                                  </p>
                                ) : null}
                              </div>
                              <div className="text-left sm:text-right">
                                <p className="text-sm text-zinc-300">
                                  {profile.orderQuantityLabel}: {item.quantity}
                                </p>
                                <p className="mt-1 text-sm text-zinc-100">
                                  {formatMoney(item.line_total, item.currency)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-white/15 bg-white/[0.03] px-6 py-12 text-center sm:px-8 sm:py-14">
                    <p className="font-display text-2xl uppercase tracking-[0.08em] text-white">
                      {profile.ordersEmptyTitle}
                    </p>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
                      {profile.ordersEmptyText}
                    </p>
                  </div>
                )}
              </CyberCardContent>
            </CyberCard>
          </div>
        </div>
      </section>
      <Footer locale={locale} dictionary={dictionary} className="-mx-4 sm:-mx-6 lg:-mx-8" />
    </main>
  );
}
