"use client";

import { Mail, MapPin, Phone, Timer } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTelegram,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

import { ContactCyberBackground } from "@/components/Pages/ContactsPage/ContactCyberBackground";
import { ContactPanel } from "@/components/Pages/ContactsPage/ContactPanel";
import { ContactMessageForm, type ContactFormDictionary } from "@/components/Pages/ContactsPage/ContactMessageForm";
import { CyberBadge, CyberLaserText } from "@/components/cyber";
import { useContactInfo } from "@/components/Contacts/ContactProvider";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { type ContactInfo } from "@/lib/contacts";
import { type Dictionary, type Locale } from "@/lib/i18n";

interface ContactsPageProps {
  locale: Locale;
  dictionary: Dictionary;
}

const contactPageText: Record<
  Locale,
  {
    intro: string;
    contactsTitle: string;
    empty: string;
    mapTitle: string;
    socialTitle: string;
    extraTitle: string;
    helpTitle: string;
    helpItems: string[];
    directTitle: string;
    fallbackPhone: string;
    fallbackEmail: string;
    form: ContactFormDictionary;
  }
> = {
  ru: {
    intro: "Ответим по наличию, сборкам и заказам. Оставьте сообщение или выберите удобный канал связи.",
    contactsTitle: "Контакты",
    empty: "Контактные данные для этой локали пока не добавлены.",
    mapTitle: "Карта",
    socialTitle: "Соцсети",
    extraTitle: "Дополнительно",
    helpTitle: "С чем поможем",
    helpItems: [
      "Подбор gaming-девайсов и аксессуаров",
      "Заявки на сборки и апгрейд сетапа",
      "Наличие, заказ и резерв товара",
      "Партнерские и корпоративные запросы",
    ],
    directTitle: "Соцсети и мессенджеры",
    fallbackPhone: "Телефон",
    fallbackEmail: "Email",
    form: {
      title: "Оставить сообщение",
      nameLabel: "Имя",
      namePlaceholder: "Ваше имя",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      phoneLabel: "Телефон",
      phonePlaceholder: "+996 000 000 000",
      messageLabel: "Сообщение",
      messagePlaceholder: "Опишите вопрос или заявку",
      submit: "Отправить",
      success: "Сообщение отправлено. Мы свяжемся с вами.",
      error: "Не удалось отправить сообщение. Попробуйте позже.",
    },
  },
  en: {
    intro: "Ask about stock, builds, or orders. Leave a message or choose the channel that works best for you.",
    contactsTitle: "Contacts",
    empty: "Contacts for this locale have not been added yet.",
    mapTitle: "Map",
    socialTitle: "Socials",
    extraTitle: "More",
    helpTitle: "How we can help",
    helpItems: [
      "Gaming gear and accessory selection",
      "Build requests and setup upgrades",
      "Stock, orders, and item reservations",
      "Partnership and business requests",
    ],
    directTitle: "Socials and messengers",
    fallbackPhone: "Phone",
    fallbackEmail: "Email",
    form: {
      title: "Leave a message",
      nameLabel: "Name",
      namePlaceholder: "Your name",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      phoneLabel: "Phone",
      phonePlaceholder: "+1 555 000 0000",
      messageLabel: "Message",
      messagePlaceholder: "Describe your question or request",
      submit: "Send",
      success: "Message sent. We will contact you.",
      error: "Could not send the message. Try again later.",
    },
  },
  kg: {
    intro: "Товарлар, сборкалар жана заказдар боюнча жооп беребиз. Билдирүү калтырыңыз же ыңгайлуу байланыш каналын тандаңыз.",
    contactsTitle: "Байланыш",
    empty: "Бул тил үчүн байланыш маалыматтары азырынча кошула элек.",
    mapTitle: "Карта",
    socialTitle: "Соцтармактар",
    extraTitle: "Кошумча",
    helpTitle: "Кандай жардам беребиз",
    helpItems: [
      "Gaming девайстарды жана аксессуарларды тандоо",
      "Сборка жана сетапты жаңыртуу боюнча сурамдар",
      "Товарлардын бар-жогу, заказ жана резерв",
      "Өнөктөштүк жана бизнес сурамдар",
    ],
    directTitle: "Соцтармактар жана мессенджерлер",
    fallbackPhone: "Телефон",
    fallbackEmail: "Email",
    form: {
      title: "Билдирүү калтыруу",
      nameLabel: "Атыңыз",
      namePlaceholder: "Атыңыз",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      phoneLabel: "Телефон",
      phonePlaceholder: "+996 700 000 000",
      messageLabel: "Билдирүү",
      messagePlaceholder: "Сурооңузду же өтүнүчүңүздү жазыңыз",
      submit: "Жөнөтүү",
      success: "Билдирүү жөнөтүлдү. Биз сиз менен байланышабыз.",
      error: "Билдирүү жөнөтүлгөн жок. Кийинчерээк аракет кылыңыз.",
    },
  },
};

const socialLinks = [
  ["whatsapp", "WhatsApp", FaWhatsapp],
  ["telegram", "Telegram", FaTelegram],
  ["instagram", "Instagram", FaInstagram],
  ["facebook", "Facebook", FaFacebookF],
  ["youtube", "YouTube", FaYoutube],
  ["tiktok", "TikTok", FaTiktok],
  ["x", "X", FaXTwitter],
] as const;

function getPhoneHref(phone: string) {
  const normalized = phone.replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : undefined;
}

function getExtraContacts(contactInfo: ContactInfo | null) {
  if (!contactInfo?.extra_contacts) {
    return [];
  }

  return Object.entries(contactInfo.extra_contacts).filter(([, value]) =>
    Boolean(value),
  );
}

export function ContactsPage({
  locale,
  dictionary,
}: ContactsPageProps) {
  const page = dictionary.pages.contacts;
  const text = contactPageText[locale];
  const contactInfo = useContactInfo(locale);
  const socials = socialLinks
    .map(([key, label, Icon]) => ({
      href: contactInfo?.[key] || "",
      label,
      Icon,
    }))
    .filter((item) => item.href);
  const extraContacts = getExtraContacts(contactInfo);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-black px-4 pt-36 pb-16 text-zinc-50 sm:px-6 lg:px-8">
      <Header locale={locale} dictionary={dictionary.header} />
      <ContactCyberBackground />

      <section className="relative z-10 mx-auto max-w-7xl">
        <CyberBadge variant="red" glow>
          {page.badge}
        </CyberBadge>
        <CyberLaserText
          as="h1"
          text={page.title}
          className="mt-7 block text-5xl text-red-100 sm:text-7xl"
          speedMs={44}
        />
        <p className="mt-6 max-w-3xl text-xl leading-9 text-zinc-400">
          {page.subtitle} {text.intro}
        </p>
      </section>

      <section className="relative z-10 mx-auto mt-12 grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <ContactPanel contentClassName="space-y-5 p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-3xl uppercase text-red-100">
              {text.contactsTitle}
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
                    <span className="min-w-0 break-words">{contactInfo.phone || text.fallbackPhone}</span>
                  </a>
                ) : null}
                {contactInfo.email ? (
                  <a
                    className="flex min-h-16 items-center gap-3 border border-cyan-300/20 bg-black/30 p-3 text-zinc-200 transition hover:border-cyan-300/55"
                    href={`mailto:${contactInfo.email}`}
                  >
                    <Mail className="size-5 text-cyan-200" aria-hidden="true" />
                    <span className="min-w-0 break-words">{contactInfo.email || text.fallbackEmail}</span>
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
              <p className="text-zinc-400">{text.empty}</p>
            )}

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="space-y-3">
              <h3 className="font-tech text-sm uppercase text-zinc-400">
                {text.helpTitle}
              </h3>
              <ul className="grid gap-2 sm:grid-cols-2">
                {text.helpItems.map((item) => (
                  <li
                    key={item}
                    className="border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-zinc-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {socials.length ? (
              <div className="space-y-3 lg:min-w-52">
                <h3 className="font-tech text-sm uppercase text-zinc-400">
                  {text.directTitle}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {socials.map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="grid size-11 place-items-center border border-white/15 bg-white/5 text-zinc-100 transition hover:border-lime-300/60 hover:text-lime-200"
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

            {extraContacts.length ? (
              <div className="space-y-3">
                <h3 className="font-tech text-sm uppercase text-zinc-400">
                  {text.extraTitle}
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

        <ContactPanel className="h-fit" contentClassName="p-6 sm:p-8">
            <ContactMessageForm locale={locale} dictionary={text.form} />
        </ContactPanel>
      </section>

      <section className="relative z-10 mx-auto mt-6 max-w-7xl">
        <ContactPanel contentClassName="space-y-4 p-6 sm:p-8">
            <h2 className="font-display text-3xl uppercase text-red-100">
              {text.mapTitle}
            </h2>
            <div className="overflow-hidden border border-cyan-300/25 bg-black/40">
              <iframe
                title={text.mapTitle}
                src="https://yandex.com/map-widget/v1/?ll=74.5698%2C42.8746&z=13"
                className="h-[420px] w-full border-0 grayscale invert sm:h-[520px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
        </ContactPanel>
      </section>
      <Footer locale={locale} dictionary={dictionary} className="-mx-4 sm:-mx-6 lg:-mx-8" />
    </main>
  );
}
