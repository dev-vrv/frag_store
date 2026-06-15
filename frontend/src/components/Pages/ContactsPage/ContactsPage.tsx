"use client";

import { ContactFormCard } from "@/components/Contacts/ContactFormCard";
import { ContactInfoCard } from "@/components/Contacts/ContactInfoCard";
import { contactContent } from "@/components/Contacts/contact-content";
import { ContactCyberBackground } from "@/components/Pages/ContactsPage/ContactCyberBackground";
import { ContactPanel } from "@/components/Pages/ContactsPage/ContactPanel";
import { CyberBadge, CyberLaserText } from "@/components/cyber";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { type Dictionary, type Locale } from "@/lib/i18n";

interface ContactsPageProps {
  locale: Locale;
  dictionary: Dictionary;
}

export function ContactsPage({
  locale,
  dictionary,
}: ContactsPageProps) {
  const page = dictionary.pages.contacts;
  const text = contactContent[locale];

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
        <ContactInfoCard locale={locale} dictionary={text.info} />
        <ContactFormCard locale={locale} dictionary={text.form} className="h-fit" />
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
