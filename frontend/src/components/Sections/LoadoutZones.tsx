import { Headphones, Keyboard, Mouse, Usb, ArrowRight, type LucideIcon } from "lucide-react";

import { CyberBadge, CyberButton } from "@/components/cyber";
import { Section } from "@/components/Sections/Section";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import AnimatedText from "@/components/ui/animatedText";
import { type Dictionary, type Locale, localizePath } from "@/lib/i18n";

const zoneIcons: LucideIcon[] = [Headphones, Keyboard, Mouse, Usb];
const zoneSlugs = ["headsets", "keyboards", "mice", "accessories"];

export interface LoadoutZonesProps {
  locale: Locale;
  content: Dictionary["loadout"];
}

export function LoadoutZones({ locale, content }: LoadoutZonesProps) {
  return (
    <Section
      id="loadout"
      fullWidth
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#050507_0%,#09090d_46%,#040405_100%)] text-zinc-50"
    >
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_15%_20%,rgba(255,23,68,0.18),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(34,211,238,0.12),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(167,139,250,0.07),transparent_28%)]" />
      <div className="cyber-grid absolute inset-0 -z-10 opacity-35" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/70 to-transparent" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <div className="flex flex-col items-center text-center">
          <RevealOnScroll as="div" delay={80}>
            <CyberBadge variant="red" glow>
              {content.eyebrow}
            </CyberBadge>
          </RevealOnScroll>
          <AnimatedText
            as="h2"
            text={content.title}
            delay={180}
            className="font-display mt-6 max-w-4xl text-4xl font-normal tracking-[0.03em] text-white sm:text-5xl"
            config={{ duration: 0.32, delayStep: 16, distance: 24 }}
          />
          <RevealOnScroll className="mt-7 flex justify-center" delay={420}>
            <CyberButton asChild variant="ghost">
              <a href={localizePath("/contacts", locale)}>{content.secondaryCta}</a>
            </CyberButton>
          </RevealOnScroll>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {content.cards.map((card, index) => {
            const Icon = zoneIcons[index];
            const categorySlug = zoneSlugs[index] ?? "all";
            const categoryHref = `${localizePath("/catalog", locale)}?category=${categorySlug}`;

            return (
              <RevealOnScroll
                key={card.title}
                as="article"
                delay={620 + index * 120}
                className="group relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-xl transition-[transform,border-color,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:border-red-400/35 hover:bg-white/[0.05] hover:shadow-[0_18px_48px_rgba(0,0,0,0.32),0_0_34px_rgba(255,23,68,0.12)]"
              >
                <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,23,68,0.14),transparent_42%,rgba(34,211,238,0.08)_100%)] opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-red-300/80 to-transparent transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-y-8 right-0 w-px bg-gradient-to-b from-transparent via-cyan-300/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex size-14 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10 text-red-100 shadow-[0_0_24px_rgba(255,23,68,0.16)] transition-[transform,border-color,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:border-red-300/35 group-hover:bg-red-500/14 group-hover:shadow-[0_0_30px_rgba(255,23,68,0.22)]">
                      <Icon className="size-6 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5" />
                    </div>
                    <span className="font-tech text-xs uppercase tracking-[0.14em] text-cyan-200 transition-colors duration-500 group-hover:text-cyan-100">
                      {card.signal}
                    </span>
                  </div>

                  <h3 className="font-display mt-8 text-2xl tracking-[0.03em] text-white transition-colors duration-500 group-hover:text-red-50">
                    {card.title}
                  </h3>
                  <p className="mt-4 flex-1 text-sm leading-7 text-zinc-400 transition-colors duration-500 group-hover:text-zinc-300">
                    {card.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5 transition-colors duration-500 group-hover:border-white/15">
                    <span className="font-tech text-xs uppercase tracking-[0.14em] text-zinc-500">
                      {content.signalLabel}
                    </span>
                    <span className="font-tech text-sm uppercase tracking-[0.1em] text-lime-200 transition-colors duration-500 group-hover:text-lime-100">
                      {card.stat}
                    </span>
                  </div>

                  <a
                    href={categoryHref}
                    className="font-tech mt-5 inline-flex items-center gap-2 self-start text-xs uppercase tracking-[0.16em] text-red-200 transition-[gap,color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-white group-hover:gap-3 group-hover:text-white"
                    aria-label={`${card.title}: ${content.categoryAriaLabel}`}
                  >
                    {content.categoryCta}
                    <ArrowRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" />
                  </a>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
