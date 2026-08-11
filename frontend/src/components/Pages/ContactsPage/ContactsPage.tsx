import { MapPin } from "lucide-react";

import { ContactFormCard } from "@/components/Contacts/ContactFormCard";
import { ContactInfoCard } from "@/components/Contacts/ContactInfoCard";
import { contactContent } from "@/components/Contacts/contact-content";
import { ContactPanel } from "@/components/Pages/ContactsPage/ContactPanel";
import { CyberBadge } from "@/components/cyber";
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
    <main className="page-shell relative isolate overflow-hidden bg-transparent px-4 pt-32 text-zinc-50 sm:px-6 sm:pt-36 lg:px-8">
      <Header locale={locale} dictionary={dictionary.header} />

      <section className="relative z-10 mx-auto w-full max-w-7xl">
        <CyberBadge variant="neutral">
          {page.badge}
        </CyberBadge>
        <h1 className="font-display type-h1 mt-7 max-w-5xl text-white">
          {page.title}
        </h1>
        <p className="font-tech type-body-lg mt-6 max-w-5xl text-zinc-400">
          {page.subtitle} {text.intro}
        </p>
        <div
          className="mt-8 flex max-w-3xl items-center gap-3 font-tech text-[9px] uppercase tracking-[0.2em] text-zinc-600"
          aria-hidden="true"
        >
          <span>FRAG // COMMS</span>
          <span className="h-px flex-1 bg-white/12" />
          <span>NODE 01</span>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-10 grid w-full max-w-7xl items-stretch gap-6 sm:mt-12 lg:grid-cols-[minmax(0,1.04fr)_minmax(360px,0.96fr)]">
        <ContactInfoCard
          locale={locale}
          dictionary={text.info}
          className="h-full"
        />
        <ContactFormCard
          locale={locale}
          dictionary={text.form}
          className="h-full"
        />
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl py-8 sm:py-10">
        <ContactPanel contentClassName="overflow-hidden p-0">
          <div className="px-5 pb-5 pt-6 sm:px-7 sm:pb-6 sm:pt-7">
            <p className="contact-tone-muted flex items-center gap-2 font-tech text-[10px] uppercase tracking-[0.18em]">
              <span className="h-px w-7 bg-current" aria-hidden="true" />
              GEO // FRAG STORE
            </p>
            <div className="mt-2 flex items-end justify-between gap-4">
              <h2 className="contact-tone-heading font-display text-[1.7rem] uppercase tracking-[0.025em] sm:text-3xl">
                {text.mapTitle}
              </h2>
              <span className="contact-tone-muted hidden items-center gap-2 font-tech text-[9px] uppercase tracking-[0.16em] sm:inline-flex">
                <MapPin className="size-3.5" aria-hidden="true" />
                KG // BISHKEK
              </span>
            </div>
          </div>
          <div className="contact-tone-divider relative overflow-hidden border-y bg-surface/55">
            <div className="pointer-events-none absolute inset-0 z-10 border-[10px] border-surface/10" aria-hidden="true" />
            <iframe
              title={text.mapTitle}
              src="https://yandex.com/map-widget/v1/?ll=74.5698%2C42.8746&z=13"
              className="h-[420px] w-full border-0 grayscale invert sm:h-[520px] lg:h-[580px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
        </ContactPanel>
      </section>
      <Footer locale={locale} dictionary={dictionary} className="-mx-4 sm:-mx-6 lg:-mx-8" />
    </main>
  );
}
