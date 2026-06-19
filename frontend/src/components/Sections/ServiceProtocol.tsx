import { BadgeCheck, ShieldCheck, Truck, Waves } from "lucide-react";

import { CyberBadge } from "@/components/cyber";
import { Section } from "@/components/Sections/Section";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import AnimatedText from "@/components/ui/animatedText";
import { type Dictionary } from "@/lib/i18n";

const serviceIcons = [BadgeCheck, Waves, Truck];

export interface ServiceProtocolProps {
  content: Dictionary["service"];
}

export function ServiceProtocol({ content }: ServiceProtocolProps) {
  return (
    <Section
      fullWidth
      className="service-protocol relative isolate overflow-hidden bg-[linear-gradient(180deg,#040405_0%,#07070a_45%,#050507_100%)] text-zinc-50"
    >
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.12),transparent_24%),radial-gradient(circle_at_78%_18%,rgba(255,23,68,0.18),transparent_28%),radial-gradient(circle_at_48%_100%,rgba(167,139,250,0.05),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.015),transparent)]" />
      <div className="service-protocol__grid absolute inset-0 -z-20 opacity-35" />
      <div className="service-protocol__scan absolute inset-0 -z-10 opacity-25" />
      <div className="service-protocol__rail service-protocol__rail--left" />
      <div className="service-protocol__rail service-protocol__rail--right" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/75 to-transparent" />

      <div className="mx-auto grid w-full max-w-7xl gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="service-protocol__core rounded-[2rem] border border-cyan-300/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] p-7 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02),0_0_56px_rgba(34,211,238,0.08)] backdrop-blur-xl sm:p-8">
          <RevealOnScroll as="div" delay={80}>
            <CyberBadge variant="cyan" glow>
              {content.eyebrow}
            </CyberBadge>
          </RevealOnScroll>
          <AnimatedText
            as="h2"
            text={content.title}
            delay={180}
            className="font-display mt-6 text-4xl font-normal tracking-[0.03em] text-white sm:text-5xl"
            config={{ duration: 0.32, delayStep: 16, distance: 24 }}
          />
          <AnimatedText
            as="p"
            text={content.subtitle}
            delay={340}
            className="mt-5 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg"
            config={{ duration: 0.24, delayStep: 7, distance: 16 }}
          />

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {content.metrics.map(([label, value], index) => (
              <RevealOnScroll
                key={label}
                as="div"
                delay={520 + index * 100}
                className="service-protocol__metric rounded-2xl border border-cyan-300/15 bg-[linear-gradient(180deg,rgba(34,211,238,0.08),rgba(255,255,255,0.025))] p-4"
                style={{ animationDelay: `${index * 180}ms` }}
              >
                <div className="font-tech text-xs uppercase tracking-[0.14em] text-zinc-500">
                  {label}
                </div>
                <div className="font-display mt-2 text-2xl text-cyan-100">{value}</div>
                <div className="mt-3 h-px bg-gradient-to-r from-cyan-300/60 via-red-300/45 to-transparent" />
              </RevealOnScroll>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {content.cards.map((card, index) => {
            const Icon = serviceIcons[index] ?? ShieldCheck;

            return (
              <RevealOnScroll
                key={card.title}
                as="article"
                delay={660 + index * 120}
                className="service-protocol__card group relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-zinc-950/70 p-6 transition-colors duration-300 hover:border-cyan-300/30"
                style={{ animationDelay: `${index * 220}ms` }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(34,211,238,0.08),transparent_42%,rgba(255,23,68,0.14)_100%)] opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-cyan-300/80 to-transparent" />
                <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-red-300/70 to-transparent" />
                <div className="relative flex gap-5">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.18)]">
                    <Icon className="size-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-tech text-xs uppercase tracking-[0.16em] text-red-200">
                      {card.signal}
                    </div>
                    <h3 className="font-display mt-3 text-2xl tracking-[0.03em] text-white">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-zinc-400">{card.description}</p>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
