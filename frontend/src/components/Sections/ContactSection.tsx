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
      <div className="absolute inset-0 -z-10 bg-surface/35 shadow-[inset_0_12px_30px_rgba(0,0,0,0.12),inset_0_-12px_30px_rgba(0,0,0,0.12)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(var(--theme-contrast-rgb),0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--theme-contrast-rgb),0.03)_1px,transparent_1px)] bg-[size:42px_42px] opacity-45 [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/15 shadow-[0_0_10px_rgba(0,0,0,0.1)]" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 sm:gap-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <RevealOnScroll as="div" delay={80}>
            <CyberBadge variant="neutral">
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
          <div
            className="mt-7 flex w-full max-w-xl items-center gap-3 font-tech text-[9px] uppercase tracking-[0.2em] text-zinc-600"
            aria-hidden="true"
          >
            <span>FRAG // COMMS</span>
            <span className="h-px flex-1 bg-white/12 shadow-[0_0_8px_rgba(0,0,0,0.08)]" />
            <span>NODE 01</span>
          </div>
        </div>

        <div className="grid items-stretch gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1.04fr)_minmax(340px,0.96fr)]">
          <RevealOnScroll className="h-full" delay={520}>
            <ContactInfoCard
              locale={locale}
              dictionary={content.info}
              className="h-full"
            />
          </RevealOnScroll>
          <RevealOnScroll className="h-full" delay={660}>
            <ContactFormCard
              locale={locale}
              dictionary={content.form}
              className="h-full"
            />
          </RevealOnScroll>
        </div>
      </div>
    </Section>
  );
}
