"use client";

import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  RadioTower,
  Timer,
} from "lucide-react";

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

const socialKeys = [
  "whatsapp",
  "telegram",
  "instagram",
  "facebook",
  "youtube",
  "tiktok",
  "x",
] as const;

export function ContactInfoCard({
  locale,
  dictionary,
  className,
  contentClassName = "flex h-full flex-col p-4 sm:p-6 lg:p-7",
}: ContactInfoCardProps) {
  const contactInfo = useContactInfo(locale);
  const extraContacts = getExtraContacts(contactInfo?.extra_contacts);
  const hasSocialLinks = socialKeys.some((key) => Boolean(contactInfo?.[key]));
  const phoneHref = contactInfo?.phone ? getPhoneHref(contactInfo.phone) : undefined;

  return (
    <ContactPanel className={className} contentClassName={contentClassName}>
      <div className="contact-tone-divider border-b pb-5 sm:pb-6">
        <div className="flex items-center justify-between gap-4">
          <p className="contact-label-cyan flex items-center gap-2 font-tech text-[10px] uppercase tracking-[0.18em]">
            <span className="h-px w-7 bg-[var(--contact-label-cyan)]" aria-hidden="true" />
            {dictionary.eyebrow}
          </p>
          <span className="contact-label-green inline-flex items-center gap-2 font-tech text-[9px] uppercase tracking-[0.16em]">
            <span
              className="size-1.5 bg-[var(--contact-label-green)] motion-safe:animate-pulse"
              aria-hidden="true"
            />
            {dictionary.statusLabel}
          </span>
        </div>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="contact-tone-heading font-display text-[1.7rem] uppercase leading-tight tracking-[0.025em] sm:text-3xl">
            {dictionary.title}
          </h2>
          {contactInfo?.working_hours ? (
            <div className="contact-tone-surface flex w-fit items-center gap-2 border px-3 py-2 font-tech text-[10px] uppercase tracking-[0.1em]">
              <Timer className="size-3.5" aria-hidden="true" />
              <span>{contactInfo.working_hours}</span>
            </div>
          ) : null}
        </div>
      </div>

      {contactInfo ? (
        <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2">
          {contactInfo.phone ? (
            <a
              className="contact-tone-surface contact-interactive-surface group relative flex min-h-20 items-center gap-3 overflow-hidden border p-3.5 transition-[border-color,background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 motion-reduce:hover:transform-none"
              href={phoneHref}
            >
              <span className="contact-tone-icon grid size-10 shrink-0 place-items-center border">
                <Phone className="size-4.5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="contact-tone-muted block font-tech text-[9px] uppercase tracking-[0.16em]">
                  {dictionary.phoneLabel}
                </span>
                <span className="contact-tone-heading mt-1 block break-words text-sm sm:text-base">
                  {contactInfo.phone || dictionary.fallbackPhone}
                </span>
              </span>
              <ArrowUpRight className="contact-tone-muted absolute right-3 top-3 size-3.5 transition" aria-hidden="true" />
            </a>
          ) : null}
          {contactInfo.email ? (
            <a
              className="contact-tone-surface contact-interactive-surface group relative flex min-h-20 items-center gap-3 overflow-hidden border p-3.5 transition-[border-color,background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 motion-reduce:hover:transform-none"
              href={`mailto:${contactInfo.email}`}
            >
              <span className="contact-tone-icon grid size-10 shrink-0 place-items-center border">
                <Mail className="size-4.5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="contact-tone-muted block font-tech text-[9px] uppercase tracking-[0.16em]">
                  {dictionary.emailLabel}
                </span>
                <span className="contact-tone-heading mt-1 block break-all text-sm sm:text-base">
                  {contactInfo.email || dictionary.fallbackEmail}
                </span>
              </span>
              <ArrowUpRight className="contact-tone-muted absolute right-3 top-3 size-3.5 transition" aria-hidden="true" />
            </a>
          ) : null}
          {contactInfo.address ? (
            <div className="contact-tone-surface flex min-h-20 items-center gap-3 border p-3.5 sm:col-span-2">
              <span className="contact-tone-icon grid size-10 shrink-0 place-items-center border">
                <MapPin className="size-4.5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="contact-tone-muted block font-tech text-[9px] uppercase tracking-[0.16em]">
                  {dictionary.addressLabel}
                </span>
                <span className="contact-tone-heading mt-1 block break-words text-sm leading-6 sm:text-base">
                  {contactInfo.address}
                </span>
              </span>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="contact-tone-surface relative mt-5 overflow-hidden border p-4 sm:mt-6 sm:p-5">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(var(--theme-contrast-rgb),0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--theme-contrast-rgb),0.025)_1px,transparent_1px)] bg-[size:20px_20px]" />
          <div className="relative flex items-start gap-4">
            <span className="contact-tone-icon grid size-11 shrink-0 place-items-center border">
              <RadioTower className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="contact-tone-heading font-tech text-[10px] uppercase tracking-[0.14em]">
                {dictionary.emptyTitle}
              </p>
              <p className="contact-tone-muted mt-2 text-sm leading-6">{dictionary.empty}</p>
            </div>
          </div>
        </div>
      )}

      <div className="contact-tone-divider mt-6 border-t pt-5 sm:mt-7 sm:pt-6">
        <div>
          <h3 className="contact-tone-muted font-tech text-[10px] uppercase tracking-[0.18em]">
            {dictionary.helpTitle}
          </h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {dictionary.helpItems.map((item, index) => (
              <li
                key={item}
                className="contact-tone-surface group grid min-h-15 grid-cols-[2rem_1fr] items-center gap-3 border px-3 py-2.5 text-sm leading-5 transition-colors"
              >
                <span className="contact-tone-muted font-tech text-[9px] tracking-[0.16em]" aria-hidden="true">
                  0{index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {hasSocialLinks ? (
          <div className="contact-tone-divider mt-5 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="contact-tone-muted font-tech text-[10px] uppercase tracking-[0.18em]">
              {dictionary.directTitle}
            </h3>
            <ContactSocialButtons locale={locale} tone="contact" />
          </div>
        ) : null}
      </div>

      {extraContacts.length ? (
        <div className="contact-tone-divider mt-6 border-t pt-5">
          <h3 className="contact-tone-muted font-tech text-[10px] uppercase tracking-[0.18em]">
            {dictionary.extraTitle}
          </h3>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            {extraContacts.map(([label, value]) => (
              <div key={label} className="contact-tone-surface border p-4">
                <dt className="contact-tone-muted font-tech text-[9px] uppercase tracking-[0.16em]">
                  {label}
                </dt>
                <dd className="contact-tone-heading mt-2 break-words text-sm">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </ContactPanel>
  );
}
