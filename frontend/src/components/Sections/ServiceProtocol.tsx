"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, ShieldCheck, Truck, Waves, X } from "lucide-react";

import {
  CyberBadge,
  CyberDialog,
  CyberDialogClose,
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
const serviceTheme = {
  badge: "border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-100",
  stat: "text-cyan-100",
  surface:
    "bg-[radial-gradient(circle_at_82%_18%,rgba(34,211,238,0.12),transparent_30%),linear-gradient(145deg,rgba(var(--theme-surface-rgb),0.94),rgba(var(--theme-surface-rgb),0.99))]",
  shell:
    "border-cyan-300/20 bg-[radial-gradient(circle_at_16%_10%,rgba(34,211,238,0.09),transparent_28%),radial-gradient(circle_at_84%_12%,rgba(244,63,94,0.055),transparent_22%),linear-gradient(180deg,rgba(var(--theme-surface-rgb),0.98),rgba(var(--theme-surface-rgb),0.99))]",
} as const;

export interface ServiceProtocolProps {
  content: Dictionary["service"];
}

export function ServiceProtocol({ content }: ServiceProtocolProps) {
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const dialogTitleRef = useRef<HTMLHeadingElement>(null);
  const activeCard = activeCardIndex === null ? null : content.cards[activeCardIndex];
  const previousIndex =
    activeCardIndex === null ? null : (activeCardIndex - 1 + content.cards.length) % content.cards.length;
  const nextIndex = activeCardIndex === null ? null : (activeCardIndex + 1) % content.cards.length;
  const activePosition = activeCardIndex ?? 0;
  const ActiveIcon = serviceIcons[activePosition] ?? ShieldCheck;

  const showCard = (index: number) => {
    setActiveCardIndex(index);
    window.requestAnimationFrame(() => {
      dialogContentRef.current?.scrollTo({ top: 0, behavior: "auto" });
      dialogTitleRef.current?.focus({ preventScroll: true });
    });
  };

  return (
    <Section
      fullWidth
      className="relative isolate overflow-hidden bg-transparent text-zinc-50"
    >
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(86%_48%_at_-12%_22%,rgba(34,211,238,0.075),transparent_66%),radial-gradient(78%_44%_at_110%_18%,rgba(244,63,94,0.05),transparent_64%),linear-gradient(180deg,rgba(var(--theme-surface-rgb),0.03)_0%,rgba(var(--theme-surface-rgb),0.17)_24%,rgba(var(--theme-surface-rgb),0.17)_78%,rgba(var(--theme-surface-rgb),0.03)_100%)]" />
      <div className="service-protocol__grid pointer-events-none absolute inset-0 -z-10 opacity-45" />
      <div className="service-protocol__scan pointer-events-none absolute inset-0 -z-10 opacity-30" />
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
            className="font-display type-h2-display mt-6 text-white"
            config={{ duration: 0.32, delayStep: 16, distance: 24 }}
          />
          <AnimatedText
            as="p"
            text={content.subtitle}
            delay={340}
            className="font-tech type-body-lg mt-5 max-w-2xl text-zinc-400"
            config={{ duration: 0.24, delayStep: 7, distance: 16 }}
          />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {content.metrics.map(([label, value], index) => (
            <RevealOnScroll
              key={label}
              as="div"
              delay={500 + index * 90}
              className="service-protocol__metric group relative overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(var(--theme-contrast-rgb),0.05),rgba(var(--theme-contrast-rgb),0.02))] p-4 backdrop-blur-xl transition-colors duration-300 hover:border-cyan-300/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-tech type-caption uppercase tracking-[0.12em] text-zinc-500">
                    {label}
                  </p>
                  <p className="font-tech type-price mt-2 text-cyan-100">
                    {value}
                  </p>
                </div>
                <span className="font-tech text-[10px] tracking-[0.16em] text-zinc-600" aria-hidden="true">
                  0{index + 1}
                </span>
              </div>
              <div className="mt-4 flex items-center" aria-hidden="true">
                <span className="size-1.5 bg-red-300/80" />
                <span className="h-px flex-1 bg-gradient-to-r from-red-300/55 via-cyan-300/55 to-transparent" />
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {content.cards.map((card, index) => {
            const Icon = serviceIcons[index] ?? ShieldCheck;

            return (
              <RevealOnScroll key={card.title} as="article" delay={620 + index * 120} className="h-full">
                <button
                  type="button"
                  onClick={() => setActiveCardIndex(index)}
                  className="service-protocol__card group flex h-full w-full flex-col overflow-hidden border border-white/10 bg-[rgba(var(--theme-surface-rgb),0.76)] text-left shadow-[0_18px_48px_rgba(0,0,0,0.22)] transition-[transform,border-color,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:border-cyan-300/28 hover:shadow-[0_22px_60px_rgba(0,0,0,0.28)] focus-visible:border-cyan-300/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-300/35 motion-reduce:hover:transform-none"
                  aria-label={`${card.title}. ${content.modalCta}`}
                >
                  <div className={cn("relative aspect-[4/3] overflow-hidden border-b border-white/10", serviceTheme.surface)}>
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.055)_1px,transparent_1px)] bg-[size:24px_24px] opacity-35" />
                    <div className="service-protocol__card-scan absolute inset-x-0 top-0 z-20 h-14 -translate-y-full bg-gradient-to-b from-transparent via-cyan-200/[0.07] to-transparent" />
                    <div className="absolute -right-8 top-6 size-28 rounded-full bg-cyan-300/[0.10] blur-3xl transition-transform duration-500 group-hover:scale-110" />
                    <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-3">
                        <span className={cn("inline-flex max-w-[calc(100%-5rem)] items-center border px-3 py-1.5 font-tech text-[11px] uppercase tracking-[0.16em]", serviceTheme.badge)}>
                          {card.signal}
                        </span>
                        <span className="flex shrink-0 items-center gap-2 border border-white/10 bg-surface/45 px-3 py-1.5 font-tech text-[10px] uppercase tracking-[0.16em] text-zinc-400">
                          <span className="service-protocol__status size-1.5 bg-red-300" aria-hidden="true" />
                          SYS.0{index + 1}
                        </span>
                      </div>

                      <div className="flex flex-1 items-center justify-center py-5 sm:py-6">
                        <div className="service-protocol__icon relative grid size-28 place-items-center sm:size-32">
                          <div className="service-protocol__icon-ring absolute inset-1 border border-dashed border-cyan-300/20" />
                          <div className="absolute inset-4 border border-white/8" />
                          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-300/15 to-transparent" />
                          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-300/15 to-transparent" />
                          <div className="relative grid size-20 place-items-center border border-cyan-300/20 bg-[radial-gradient(circle_at_32%_26%,rgba(34,211,238,0.12),transparent_42%),rgba(var(--theme-surface-rgb),0.62)] text-cyan-100 shadow-[0_0_42px_rgba(34,211,238,0.08)] backdrop-blur-sm transition-[transform,border-color,box-shadow] duration-500 group-hover:border-cyan-300/35 group-hover:shadow-[0_0_52px_rgba(34,211,238,0.13)] sm:size-22">
                            <span className="absolute left-1.5 top-1.5 size-1 bg-red-300/90" aria-hidden="true" />
                            <Icon className="relative z-10 size-9 sm:size-10" />
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <p className="font-tech text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                          {content.modalHint}
                        </p>
                        <div className="mt-3 flex items-center" aria-hidden="true">
                          <span className="h-px w-14 bg-red-300/55" />
                          <span className="h-px w-20 bg-gradient-to-r from-cyan-300/65 to-transparent" />
                        </div>
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
                        <p className={cn("mt-2 font-display text-[1.55rem] tracking-[0.04em]", serviceTheme.stat)}>
                          {content.metrics[index]?.[1] ?? "100%"}
                        </p>
                      </div>
                      <span className="service-protocol__cta inline-flex items-center gap-2 font-tech text-[11px] uppercase tracking-[0.16em] text-cyan-100">
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
          ref={dialogContentRef}
          showCloseButton={false}
          className="service-protocol__dialog-content block h-[90svh] w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] overflow-y-auto overscroll-y-contain rounded-none border-cyan-300/20 bg-transparent p-0 shadow-[0_32px_110px_rgba(0,0,0,0.58),0_0_70px_rgba(34,211,238,0.07)] touch-pan-y before:hidden sm:w-[calc(100%-2rem)] sm:max-w-5xl"
        >
          {activeCard ? (
            <div
              className={cn("service-protocol__dialog-shell relative min-h-full overflow-hidden", serviceTheme.shell)}
            >
              <div className="service-protocol__dialog-grid pointer-events-none absolute inset-0 opacity-55" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-red-300/65 via-cyan-300/75 to-transparent" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-px w-32 bg-gradient-to-r from-cyan-300/70 to-transparent" />

              <div className="relative z-10 mx-auto min-h-full max-w-7xl lg:grid lg:grid-cols-[0.88fr_1.12fr]">
                <div className="relative flex flex-col border-b border-white/10 p-5 sm:p-7 lg:border-r lg:border-b-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-wrap items-center gap-2.5">
                      <span className={cn("inline-flex items-center border px-3 py-1.5 font-tech text-[11px] uppercase tracking-[0.16em]", serviceTheme.badge)}>
                        {activeCard.signal}
                      </span>
                      <span className="hidden items-center gap-2 border border-white/10 bg-white/[0.025] px-3 py-1.5 font-tech text-[10px] uppercase tracking-[0.16em] text-zinc-400 sm:inline-flex">
                        <span className="service-protocol__status size-1.5 bg-red-300" aria-hidden="true" />
                        SYS.0{activePosition + 1}
                      </span>
                    </div>
                    <CyberDialogClose asChild>
                      <button
                        type="button"
                        aria-label={content.modalClose}
                        className="service-protocol__dialog-button group grid size-10 shrink-0 place-items-center border border-white/12 bg-surface/35 text-zinc-400 transition-[border-color,background-color,color,transform] duration-300 hover:border-red-300/30 hover:bg-red-300/[0.06] hover:text-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-300/35 active:scale-[0.97]"
                      >
                        <X className="size-4 transition-transform duration-300 group-hover:rotate-90 motion-reduce:transition-none" />
                      </button>
                    </CyberDialogClose>
                  </div>

                  <div className="mt-7 flex items-center justify-center">
                    <div
                      className={cn(
                        "service-protocol__dialog-visual relative grid aspect-square w-full max-w-[16rem] place-items-center overflow-hidden border border-white/10",
                        serviceTheme.surface,
                      )}
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.055)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
                      <div className="absolute -right-8 top-5 size-28 rounded-full bg-cyan-300/[0.09] blur-3xl" />
                      <span className="absolute top-3 left-3 size-1.5 bg-red-300/85" aria-hidden="true" />
                      <span className="absolute top-3 right-3 font-tech text-[9px] uppercase tracking-[0.18em] text-zinc-600" aria-hidden="true">
                        FRAG//SERVICE
                      </span>
                      <div key={activePosition} className="service-protocol__dialog-icon relative z-10 grid size-36 place-items-center sm:size-40">
                        <div className="service-protocol__icon-ring absolute inset-0 border border-dashed border-cyan-300/22" />
                        <div className="absolute inset-5 border border-white/8" />
                        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-300/18 to-transparent" />
                        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-300/18 to-transparent" />
                        <div className="relative grid size-24 place-items-center border border-cyan-300/24 bg-[radial-gradient(circle_at_32%_26%,rgba(34,211,238,0.14),transparent_42%),rgba(var(--theme-surface-rgb),0.72)] text-cyan-100 shadow-[0_0_58px_rgba(34,211,238,0.11)] backdrop-blur-sm sm:size-28">
                          <span className="absolute top-2 left-2 size-1 bg-red-300" aria-hidden="true" />
                          <ActiveIcon className="relative z-10 size-13 sm:size-15" />
                        </div>
                      </div>
                      <div className="absolute inset-x-4 bottom-3 flex items-center" aria-hidden="true">
                        <span className="h-px w-10 bg-red-300/55" />
                        <span className="h-px flex-1 bg-gradient-to-r from-cyan-300/55 to-transparent" />
                      </div>
                    </div>
                  </div>

                  <div key={`summary-${activePosition}`} className="service-protocol__dialog-summary mt-7">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-tech text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                        {content.modalHint}
                      </p>
                      <span className="font-tech text-[10px] tracking-[0.16em] text-zinc-600" aria-hidden="true">
                        0{activePosition + 1} / 0{content.cards.length}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-[1.8rem] leading-none tracking-[0.04em] text-white sm:text-[2.2rem]">
                      {activeCard.title}
                    </h3>
                    <p className="mt-4 max-w-full break-words text-sm leading-7 text-zinc-400">
                      {activeCard.description}
                    </p>
                  </div>

                  <div className="mt-7 grid gap-2 md:grid-cols-3 lg:mt-auto lg:grid-cols-1 lg:pt-7">
                    {content.metrics.map(([label, value], metricIndex) => (
                      <div
                        key={label}
                        className={cn(
                          "service-protocol__dialog-metric flex items-center justify-between gap-4 border px-4 py-3 backdrop-blur-sm transition-colors duration-300",
                          metricIndex === activePosition
                            ? "border-cyan-300/22 bg-cyan-300/[0.055]"
                            : "border-white/8 bg-surface/18",
                        )}
                      >
                        <div className="min-w-0">
                          <p className="truncate font-tech text-[9px] uppercase tracking-[0.15em] text-zinc-500">
                            {label}
                          </p>
                          <p className={cn("mt-1.5 font-display text-lg", metricIndex === activePosition ? serviceTheme.stat : "text-zinc-300")}>
                            {value}
                          </p>
                        </div>
                        <span className={cn("size-1.5 shrink-0", metricIndex === activePosition ? "bg-red-300" : "bg-zinc-700")} aria-hidden="true" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex min-h-full flex-col p-5 sm:p-7 lg:p-8">
                  <div key={`copy-${activePosition}`} className="service-protocol__dialog-copy-transition">
                    <CyberDialogHeader className="text-left">
                      <CyberDialogDescription className="flex items-center gap-3 font-tech text-[10px] uppercase tracking-[0.16em] text-cyan-200/70">
                        <span className="h-px w-8 bg-red-300/60" aria-hidden="true" />
                        {content.modalHint}
                        <span aria-hidden="true">· 0{activePosition + 1}</span>
                      </CyberDialogDescription>
                      <CyberDialogTitle
                        ref={dialogTitleRef}
                        tabIndex={-1}
                        className="max-w-2xl text-balance font-display text-[1.7rem] leading-[1.08] tracking-[0.035em] text-white outline-none sm:text-[2.15rem]"
                      >
                        {activeCard.detailsTitle}
                      </CyberDialogTitle>
                    </CyberDialogHeader>

                    <p className="mt-6 max-w-2xl text-[0.95rem] leading-8 text-zinc-300 sm:text-base">
                      {activeCard.detailsDescription}
                    </p>

                    <div className="mt-7">
                      <p className="font-tech text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                        {content.modalListLabel}
                      </p>
                      <div className="mt-4 grid gap-2.5">
                        {activeCard.highlights.map((highlight, highlightIndex) => (
                          <div
                            key={highlight}
                            className="service-protocol__dialog-highlight grid grid-cols-[2rem_1fr] gap-3 border border-white/9 bg-white/[0.025] p-4 text-sm leading-7 text-zinc-300 transition-colors duration-300 hover:border-cyan-300/18 hover:bg-cyan-300/[0.035]"
                          >
                            <span className="font-tech text-[10px] tracking-[0.16em] text-cyan-200/75" aria-hidden="true">
                              0{highlightIndex + 1}
                            </span>
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="service-protocol__dialog-note mt-7 grid grid-cols-[auto_1fr] gap-4 border border-cyan-300/14 bg-cyan-300/[0.035] p-4 sm:p-5">
                      <div className="grid size-10 place-items-center border border-cyan-300/20 bg-surface/40 text-cyan-100">
                        <ShieldCheck className="size-5" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-tech text-[9px] uppercase tracking-[0.16em] text-zinc-500">FRAG STORE // NOTE</p>
                        <p className="mt-2 text-sm leading-7 text-zinc-400">{activeCard.note}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-7">
                    <div className="border-t border-white/10 pt-5">
                      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
                        <button
                          type="button"
                          onClick={() => previousIndex !== null && showCard(previousIndex)}
                          aria-label={content.modalPrev}
                          className="service-protocol__dialog-button group inline-flex h-12 min-w-0 items-center justify-start gap-2.5 border border-white/10 bg-white/[0.025] px-3 text-zinc-300 transition-[border-color,background-color,color,transform] duration-300 hover:-translate-x-0.5 hover:border-cyan-300/20 hover:bg-cyan-300/[0.045] hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-300/35 active:scale-[0.985] motion-reduce:hover:transform-none sm:px-4"
                        >
                          <ArrowLeft className="size-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5 motion-reduce:transition-none" />
                          <span className="hidden truncate font-tech text-[10px] uppercase tracking-[0.13em] sm:inline">
                            {content.modalPrev}
                          </span>
                        </button>
                        <span
                          className="inline-flex h-12 min-w-20 items-center justify-center border border-white/8 bg-surface/30 px-3 font-tech text-[10px] tracking-[0.16em] text-zinc-500"
                          aria-live="polite"
                          aria-atomic="true"
                        >
                          <span className="text-cyan-100">0{activePosition + 1}</span>
                          <span className="mx-2 text-zinc-700">/</span>
                          0{content.cards.length}
                        </span>
                        <button
                          type="button"
                          onClick={() => nextIndex !== null && showCard(nextIndex)}
                          aria-label={content.modalNext}
                          className="service-protocol__dialog-button group inline-flex h-12 min-w-0 items-center justify-end gap-2.5 border border-cyan-300/20 bg-cyan-300/[0.055] px-3 text-cyan-100 transition-[border-color,background-color,color,transform,box-shadow] duration-300 hover:translate-x-0.5 hover:border-cyan-300/35 hover:bg-cyan-300/[0.09] hover:shadow-[0_0_28px_rgba(34,211,238,0.08)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-300/40 active:scale-[0.985] motion-reduce:hover:transform-none sm:px-4"
                        >
                          <span className="hidden truncate font-tech text-[10px] uppercase tracking-[0.13em] sm:inline">
                            {content.modalNext}
                          </span>
                          <ArrowRight className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none" />
                        </button>
                      </div>
                      <CyberDialogClose asChild>
                        <button
                          type="button"
                          className="service-protocol__dialog-button mt-2.5 inline-flex h-11 w-full items-center justify-center gap-2.5 border border-white/9 bg-white/[0.02] px-4 font-tech text-[10px] uppercase tracking-[0.14em] text-zinc-500 transition-[border-color,background-color,color] duration-300 hover:border-red-300/22 hover:bg-red-300/[0.04] hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-300/30"
                        >
                          <span className="size-1.5 bg-red-300/80" aria-hidden="true" />
                          {content.modalClose}
                          <X className="size-3.5" aria-hidden="true" />
                        </button>
                      </CyberDialogClose>
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
