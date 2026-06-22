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
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#040405_0%,#09080c_46%,#030304_100%)] text-zinc-50"
    >
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_16%,rgba(255,23,68,0.14),transparent_24%),radial-gradient(circle_at_82%_14%,rgba(34,211,238,0.12),transparent_22%),radial-gradient(circle_at_50%_100%,rgba(167,139,250,0.07),transparent_26%)]" />
      <div className="cyber-grid absolute inset-0 -z-10 opacity-25" />
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
            className="font-display mt-6 text-[2rem] font-normal leading-[1.08] tracking-[0.02em] text-white sm:text-[2.6rem] lg:text-5xl"
            config={{ duration: 0.32, delayStep: 16, distance: 24 }}
          />
          <AnimatedText
            as="p"
            text={content.home.subtitle}
            delay={340}
            className="mt-5 max-w-2xl text-[0.95rem] leading-7 text-zinc-400 sm:text-base sm:leading-8 lg:text-lg"
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
