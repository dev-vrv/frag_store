"use client";

import { Mail, MapPin, Phone, Timer } from "lucide-react";

import { ContactSocialButtons } from "@/components/Contacts/ContactSocialButtons";
import { useContactInfo } from "@/components/Contacts/ContactProvider";
import { ContactPanel } from "@/components/Pages/ContactsPage/ContactPanel";
import { type Locale } from "@/lib/i18n";

import { type ContactInfoDictionary } from "./contact-content";

export interface ContactInfoCardProps {
  locale: Locale;
  dictionary: ContactInfoDictionary;
  className?: string;
  contentClassName?: string;
}

function getPhoneHref(phone: string) {
  const normalized = phone.replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : undefined;
}

function getExtraContacts(extraContacts: Record<string, string> | null | undefined) {
  if (!extraContacts) {
    return [];
  }

  return Object.entries(extraContacts).filter(([, value]) => Boolean(value));
}

export function ContactInfoCard({
  locale,
  dictionary,
  className,
  contentClassName = "space-y-5 p-5 sm:p-6",
}: ContactInfoCardProps) {
  const contactInfo = useContactInfo(locale);
  const extraContacts = getExtraContacts(contactInfo?.extra_contacts);

  return (
    <ContactPanel className={className} contentClassName={contentClassName}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-display text-3xl uppercase text-red-100">
          {dictionary.title}
        </h2>
        {contactInfo?.working_hours ? (
          <div className="flex items-center gap-2 border border-fuchsia-300/20 bg-white/[0.04] px-3 py-2 text-sm text-zinc-300">
            <Timer className="size-4 text-fuchsia-200" aria-hidden="true" />
            <span>{contactInfo.working_hours}</span>
          </div>
        ) : null}
      </div>

      {contactInfo ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {contactInfo.phone ? (
            <a
              className="flex min-h-16 items-center gap-3 border border-lime-300/20 bg-black/30 p-3 text-zinc-200 transition hover:border-lime-300/55"
              href={getPhoneHref(contactInfo.phone)}
            >
              <Phone className="size-5 text-lime-200" aria-hidden="true" />
              <span className="min-w-0 break-words">
                {contactInfo.phone || dictionary.fallbackPhone}
              </span>
            </a>
          ) : null}
          {contactInfo.email ? (
            <a
              className="flex min-h-16 items-center gap-3 border border-cyan-300/20 bg-black/30 p-3 text-zinc-200 transition hover:border-cyan-300/55"
              href={`mailto:${contactInfo.email}`}
            >
              <Mail className="size-5 text-cyan-200" aria-hidden="true" />
              <span className="min-w-0 break-words">
                {contactInfo.email || dictionary.fallbackEmail}
              </span>
            </a>
          ) : null}
          {contactInfo.address ? (
            <div className="flex min-h-16 items-center gap-3 border border-red-300/20 bg-black/30 p-3 text-zinc-200 sm:col-span-2">
              <MapPin className="size-5 text-red-200" aria-hidden="true" />
              <span className="min-w-0 break-words">{contactInfo.address}</span>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="text-zinc-400">{dictionary.empty}</p>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="space-y-3">
          <h3 className="font-tech text-sm uppercase text-zinc-400">
            {dictionary.helpTitle}
          </h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {dictionary.helpItems.map((item) => (
              <li
                key={item}
                className="border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-zinc-300"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 lg:min-w-52">
          <h3 className="font-tech text-sm uppercase text-zinc-400">
            {dictionary.directTitle}
          </h3>
          <ContactSocialButtons
            locale={locale}
            linkClassName="hover:border-lime-300/60 hover:text-lime-200"
          />
        </div>
      </div>

      {extraContacts.length ? (
        <div className="space-y-3">
          <h3 className="font-tech text-sm uppercase text-zinc-400">
            {dictionary.extraTitle}
          </h3>
          <dl className="grid gap-3 sm:grid-cols-2">
            {extraContacts.map(([label, value]) => (
              <div key={label} className="border border-white/10 bg-white/5 p-4">
                <dt className="font-tech text-xs uppercase text-zinc-500">
                  {label}
                </dt>
                <dd className="mt-1 text-zinc-200">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </ContactPanel>
  );
}
