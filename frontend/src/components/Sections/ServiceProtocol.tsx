"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, ShieldCheck, Truck, Waves, X } from "lucide-react";

import {
  CyberBadge,
  CyberButton,
  CyberDialog,
  CyberDialogContent,
  CyberDialogDescription,
  CyberDialogHeader,
  CyberDialogTitle,
} from "@/components/cyber";
import { Section } from "@/components/Sections/Section";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import AnimatedText from "@/components/ui/animatedText";
import { type Dictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const serviceIcons = [BadgeCheck, Waves, Truck];
const serviceThemes = [
  {
    badge: "text-cyan-100 border-cyan-300/20 bg-cyan-300/10",
    accent: "text-cyan-100",
    stat: "text-cyan-100",
    surface:
      "bg-[radial-gradient(circle_at_22%_18%,rgba(34,211,238,0.22),transparent_28%),radial-gradient(circle_at_80%_14%,rgba(244,63,94,0.14),transparent_24%),linear-gradient(145deg,rgba(8,15,28,0.94),rgba(3,6,14,0.98))]",
    shell:
      "border-cyan-300/20 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_78%_14%,rgba(244,63,94,0.10),transparent_22%),linear-gradient(180deg,rgba(7,11,22,0.98),rgba(4,6,14,0.98))]",
    line: "from-cyan-300/80 via-red-300/35 to-transparent",
    orb: "bg-cyan-300/16",
  },
  {
    badge: "text-fuchsia-100 border-fuchsia-300/20 bg-fuchsia-300/10",
    accent: "text-fuchsia-100",
    stat: "text-fuchsia-100",
    surface:
      "bg-[radial-gradient(circle_at_20%_18%,rgba(217,70,239,0.20),transparent_30%),radial-gradient(circle_at_80%_14%,rgba(34,211,238,0.12),transparent_22%),linear-gradient(145deg,rgba(16,10,28,0.95),rgba(6,7,17,0.98))]",
    shell:
      "border-fuchsia-300/20 bg-[radial-gradient(circle_at_16%_12%,rgba(217,70,239,0.13),transparent_28%),radial-gradient(circle_at_82%_16%,rgba(34,211,238,0.08),transparent_22%),linear-gradient(180deg,rgba(12,8,20,0.98),rgba(5,6,14,0.98))]",
    line: "from-fuchsia-300/80 via-cyan-300/35 to-transparent",
    orb: "bg-fuchsia-300/16",
  },
  {
    badge: "text-amber-100 border-amber-200/20 bg-amber-200/10",
    accent: "text-amber-100",
    stat: "text-amber-100",
    surface:
      "bg-[radial-gradient(circle_at_22%_18%,rgba(251,191,36,0.18),transparent_28%),radial-gradient(circle_at_80%_14%,rgba(244,63,94,0.14),transparent_24%),linear-gradient(145deg,rgba(22,12,12,0.95),rgba(9,7,16,0.98))]",
    shell:
      "border-amber-200/20 bg-[radial-gradient(circle_at_18%_12%,rgba(251,191,36,0.12),transparent_28%),radial-gradient(circle_at_80%_14%,rgba(244,63,94,0.10),transparent_22%),linear-gradient(180deg,rgba(18,11,12,0.98),rgba(7,6,14,0.98))]",
    line: "from-amber-200/80 via-red-300/35 to-transparent",
    orb: "bg-amber-200/14",
  },
] as const;

export interface ServiceProtocolProps {
  content: Dictionary["service"];
}

export function ServiceProtocol({ content }: ServiceProtocolProps) {
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const activeCard = activeCardIndex === null ? null : content.cards[activeCardIndex];
  const previousIndex =
    activeCardIndex === null ? null : (activeCardIndex - 1 + content.cards.length) % content.cards.length;
  const nextIndex = activeCardIndex === null ? null : (activeCardIndex + 1) % content.cards.length;
  const activeTheme = useMemo(
    () => (activeCardIndex === null ? serviceThemes[0] : serviceThemes[activeCardIndex] ?? serviceThemes[0]),
    [activeCardIndex],
  );

  return (
    <Section
      fullWidth
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#050507_0%,#0a0a0e_40%,#040405_100%)] text-zinc-50"
    >
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.12),transparent_26%),radial-gradient(circle_at_78%_16%,rgba(255,23,68,0.16),transparent_28%),radial-gradient(circle_at_48%_100%,rgba(217,70,239,0.1),transparent_28%)]" />
      <div className="cyber-grid absolute inset-0 -z-10 opacity-25" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/75 to-transparent" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 sm:gap-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <RevealOnScroll as="div" delay={80}>
            <CyberBadge variant="cyan" glow>
              {content.eyebrow}
            </CyberBadge>
          </RevealOnScroll>
          <AnimatedText
            as="h2"
            text={content.title}
            delay={180}
            className="font-display mt-6 text-[2rem] font-normal leading-[1.08] tracking-[0.02em] text-white sm:text-[2.6rem] lg:text-5xl"
            config={{ duration: 0.32, delayStep: 16, distance: 24 }}
          />
          <AnimatedText
            as="p"
            text={content.subtitle}
            delay={340}
            className="mt-5 max-w-2xl text-[0.95rem] leading-7 text-zinc-400 sm:text-base sm:leading-8 lg:text-lg"
            config={{ duration: 0.24, delayStep: 7, distance: 16 }}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {content.metrics.map(([label, value], index) => (
            <RevealOnScroll
              key={label}
              as="div"
              delay={500 + index * 90}
              className="rounded-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] p-4 backdrop-blur-xl"
            >
              <p className="font-tech text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                {label}
              </p>
              <p className="mt-2 font-display text-[1.8rem] tracking-[0.04em] text-cyan-100">
                {value}
              </p>
              <div className="mt-4 h-px bg-gradient-to-r from-cyan-300/70 via-red-300/35 to-transparent" />
            </RevealOnScroll>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {content.cards.map((card, index) => {
            const Icon = serviceIcons[index] ?? ShieldCheck;
            const theme = serviceThemes[index] ?? serviceThemes[0];

            return (
              <RevealOnScroll key={card.title} as="article" delay={620 + index * 120} className="h-full">
                <button
                  type="button"
                  onClick={() => setActiveCardIndex(index)}
                  className="group flex h-full w-full flex-col overflow-hidden rounded-[1.55rem] border border-white/10 bg-zinc-950/60 text-left shadow-[0_18px_48px_rgba(0,0,0,0.24)] transition-[transform,border-color,box-shadow] duration-500 ease-out hover:-translate-y-1.5 hover:border-cyan-300/28 hover:shadow-[0_22px_60px_rgba(34,211,238,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/35"
                  aria-label={`${card.title}. ${content.modalCta}`}
                >
                  <div className={cn("relative aspect-[4/3] overflow-hidden border-b border-white/10", theme.surface)}>
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.07)_1px,transparent_1px)] bg-[size:22px_22px] opacity-40" />
                    <div className={cn("absolute -right-8 top-6 size-28 rounded-full blur-3xl transition-transform duration-500 group-hover:scale-110", theme.orb)} />
                    <div className="relative z-10 flex h-full flex-col p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-3">
                        <span className={cn("inline-flex max-w-[calc(100%-5rem)] items-center border px-3 py-1.5 font-tech text-[11px] uppercase tracking-[0.16em]", theme.badge)}>
                          {card.signal}
                        </span>
                        <span className="shrink-0 border border-white/12 bg-black/45 px-3 py-1.5 font-tech text-[11px] uppercase tracking-[0.16em] text-zinc-300">
                          FRAG STORE
                        </span>
                      </div>

                      <div className="flex flex-1 items-center justify-end py-5 sm:py-6">
                        <div className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-black/35 text-white shadow-[0_0_38px_rgba(255,255,255,0.08)] sm:size-14">
                          <Icon className="size-6 sm:size-7" />
                        </div>
                      </div>

                      <div className="mt-auto">
                        <p className="font-tech text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                          {content.modalHint}
                        </p>
                        <div className={cn("mt-3 h-px w-28 bg-gradient-to-r", theme.line)} />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
                    <div className="flex-1">
                      <h3 className="min-h-[3.6rem] text-balance font-display text-[1.35rem] font-normal leading-tight tracking-[0.03em] text-white sm:text-[1.55rem]">
                        {card.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-zinc-400 sm:text-[0.95rem]">
                        {card.description}
                      </p>
                    </div>

                    <div className="flex items-end justify-between gap-4 border-t border-white/10 pt-4">
                      <div>
                        <p className="font-tech text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                          {content.metrics[index]?.[0] ?? "FRAG STORE"}
                        </p>
                        <p className={cn("mt-2 font-display text-[1.55rem] tracking-[0.04em]", theme.stat)}>
                          {content.metrics[index]?.[1] ?? "100%"}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-2 font-tech text-[11px] uppercase tracking-[0.16em] text-cyan-100">
                        {content.modalCta}
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </button>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>

      <CyberDialog open={activeCardIndex !== null} onOpenChange={(open) => !open && setActiveCardIndex(null)}>
        <CyberDialogContent
          showCloseButton={false}
          className="block h-[88svh] overflow-y-auto overscroll-y-contain p-0 touch-pan-y sm:max-w-5xl"
        >
          {activeCard ? (
            <div className={cn("relative min-h-full", activeTheme.shell)}>
              <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/75 to-transparent" />

              <div className="relative z-10 min-h-full lg:grid lg:grid-cols-[0.92fr_1.08fr]">
                <div className="border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={cn("inline-flex items-center border px-3 py-1.5 font-tech text-[11px] uppercase tracking-[0.16em]", activeTheme.badge)}>
                        {activeCard.signal}
                      </span>
                      <span className="inline-flex items-center border border-white/12 bg-white/[0.04] px-3 py-1.5 font-tech text-[11px] uppercase tracking-[0.16em] text-zinc-300">
                        FRAG STORE
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveCardIndex(null)}
                      aria-label={content.modalClose}
                      className="grid size-10 place-items-center rounded-full border border-white/12 bg-black/30 text-zinc-300 transition-colors hover:border-white/22 hover:bg-white/[0.08] hover:text-white"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  <div className="mt-8 flex items-center justify-center">
                    <div className={cn("relative grid aspect-square w-full max-w-[16rem] place-items-center overflow-hidden rounded-[2rem] border border-white/10", activeTheme.surface)}>
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.07)_1px,transparent_1px)] bg-[size:22px_22px] opacity-40" />
                      <div className={cn("absolute -right-6 top-6 size-24 rounded-full blur-3xl", activeTheme.orb)} />
                      {(() => {
                        const ActiveIcon = serviceIcons[activeCardIndex ?? 0] ?? ShieldCheck;
                        return <ActiveIcon className="relative z-10 size-20 text-white" />;
                      })()}
                    </div>
                  </div>

                  <div className="mt-8">
                    <p className="font-tech text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                      {content.modalHint}
                    </p>
                    <h3 className="mt-3 font-display text-[2rem] leading-none tracking-[0.04em] text-white sm:text-[2.4rem]">
                      {activeCard.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base">
                      {activeCard.description}
                    </p>
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    {content.metrics.map(([label, value]) => (
                      <div key={label} className="border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-sm">
                        <p className="font-tech text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                          {label}
                        </p>
                        <p className={cn("mt-2 font-display text-xl", activeTheme.stat)}>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <CyberDialogHeader className="text-left">
                    <CyberDialogDescription className="font-tech text-[11px] uppercase tracking-[0.16em] text-cyan-200/70">
                      {content.modalHint}
                    </CyberDialogDescription>
                    <CyberDialogTitle className="font-display text-2xl tracking-[0.04em] text-white sm:text-[2rem]">
                      {activeCard.detailsTitle}
                    </CyberDialogTitle>
                  </CyberDialogHeader>

                  <p className="mt-6 max-w-2xl text-[0.98rem] leading-8 text-zinc-300 sm:text-base">
                    {activeCard.detailsDescription}
                  </p>

                  <div className="mt-8">
                    <p className="font-tech text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                      {content.modalListLabel}
                    </p>
                    <div className="mt-4 grid gap-3">
                      {activeCard.highlights.map((highlight) => (
                        <div
                          key={highlight}
                          className="rounded-[1.15rem] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm leading-7 text-zinc-300"
                        >
                          {highlight}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 rounded-[1.3rem] border border-white/10 bg-black/20 p-5">
                    <p className="text-sm leading-7 text-zinc-400">{activeCard.note}</p>
                  </div>

                  <div className="mt-8 flex justify-start">
                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => previousIndex !== null && setActiveCardIndex(previousIndex)}
                          aria-label={content.modalPrev}
                          className="inline-flex size-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-zinc-200 transition-colors hover:border-white/22 hover:bg-white/[0.08] hover:text-white"
                        >
                          <ArrowLeft className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => nextIndex !== null && setActiveCardIndex(nextIndex)}
                          aria-label={content.modalNext}
                          className="inline-flex size-11 items-center justify-center rounded-full border border-cyan-300/18 bg-cyan-300/[0.06] text-cyan-100 transition-colors hover:border-cyan-300/32 hover:bg-cyan-300/[0.12] hover:text-white"
                        >
                          <ArrowRight className="size-4" />
                        </button>
                      </div>
                      <CyberButton variant="ghost" onClick={() => setActiveCardIndex(null)}>
                        {content.modalClose}
                      </CyberButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </CyberDialogContent>
      </CyberDialog>
    </Section>
  );
}
