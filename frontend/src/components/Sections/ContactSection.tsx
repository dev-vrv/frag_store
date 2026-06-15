import { CyberBadge } from "@/components/cyber";
import { ContactFormCard } from "@/components/Contacts/ContactFormCard";
import { ContactInfoCard } from "@/components/Contacts/ContactInfoCard";
import { contactContent } from "@/components/Contacts/contact-content";
import { Section } from "@/components/Sections/Section";
import { type Locale } from "@/lib/i18n";

export interface ContactSectionProps {
  locale: Locale;
}

export function ContactSection({ locale }: ContactSectionProps) {
  const content = contactContent[locale];

  return (
    <Section
      fullWidth
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#040405_0%,#09080c_46%,#030304_100%)] text-zinc-50"
    >
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_16%,rgba(255,23,68,0.14),transparent_24%),radial-gradient(circle_at_82%_14%,rgba(34,211,238,0.12),transparent_22%),radial-gradient(circle_at_50%_100%,rgba(167,139,250,0.07),transparent_26%)]" />
      <div className="cyber-grid absolute inset-0 -z-10 opacity-25" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/70 to-transparent" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <div className="max-w-3xl">
          <CyberBadge variant="red" glow>
            {content.home.eyebrow}
          </CyberBadge>
          <h2 className="font-display mt-6 text-4xl font-normal tracking-[0.03em] text-white sm:text-5xl">
            {content.home.title}
          </h2>
          <p className="mt-5 text-base leading-8 text-zinc-400 sm:text-lg">
            {content.home.subtitle}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
          <ContactInfoCard locale={locale} dictionary={content.info} />
          <ContactFormCard
            locale={locale}
            dictionary={content.form}
            className="h-fit"
          />
        </div>
      </div>
    </Section>
  );
}
