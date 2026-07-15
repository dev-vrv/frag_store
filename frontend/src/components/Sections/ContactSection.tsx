import { CyberBadge } from "@/components/cyber";
import { ContactFormCard } from "@/components/Contacts/ContactFormCard";
import { ContactInfoCard } from "@/components/Contacts/ContactInfoCard";
import { contactContent } from "@/components/Contacts/contact-content";
import { Section } from "@/components/Sections/Section";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import AnimatedText from "@/components/ui/animatedText";
import { type Locale } from "@/lib/i18n";

export interface ContactSectionProps {
  locale: Locale;
}

export function ContactSection({ locale }: ContactSectionProps) {
  const content = contactContent[locale];

  return (
    <Section
      fullWidth
      className="relative isolate overflow-hidden bg-transparent text-zinc-50"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(82%_50%_at_-10%_28%,rgba(255,23,68,0.08),transparent_62%),radial-gradient(88%_52%_at_110%_18%,rgba(34,211,238,0.08),transparent_64%),linear-gradient(118deg,rgba(255,23,68,0.03)_0%,transparent_42%,transparent_64%,rgba(34,211,238,0.03)_100%),linear-gradient(180deg,rgba(1,1,3,0.03)_0%,rgba(2,2,4,0.18)_24%,rgba(2,2,4,0.18)_78%,rgba(1,1,3,0.03)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/70 to-transparent" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 sm:gap-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <RevealOnScroll as="div" delay={80}>
            <CyberBadge variant="red" glow>
              {content.home.eyebrow}
            </CyberBadge>
          </RevealOnScroll>
          <AnimatedText
            as="h2"
            text={content.home.title}
            delay={180}
            className="font-display type-h2-display mt-6 text-white"
            config={{ duration: 0.32, delayStep: 16, distance: 24 }}
          />
          <AnimatedText
            as="p"
            text={content.home.subtitle}
            delay={340}
            className="font-tech type-body-lg mt-5 max-w-2xl text-zinc-400"
            config={{ duration: 0.24, delayStep: 7, distance: 16 }}
          />
        </div>

        <div className="grid gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          <RevealOnScroll delay={520}>
            <ContactInfoCard locale={locale} dictionary={content.info} />
          </RevealOnScroll>
          <RevealOnScroll delay={660}>
            <ContactFormCard
              locale={locale}
              dictionary={content.form}
              className="h-fit"
            />
          </RevealOnScroll>
        </div>
      </div>
    </Section>
  );
}
