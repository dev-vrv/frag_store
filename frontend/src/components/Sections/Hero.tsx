import {
  ChevronDown,
  Cpu,
  RadioTower,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { CyberBadge, CyberButton } from "@/components/cyber";
import { Section } from "@/components/Sections/Section";

const heroMetrics = [
  ["Latency", "0.8 ms"],
  ["Drops", "24/7"],
  ["Sync", "99.9%"],
] as const;

const heroSystemCards: Array<[LucideIcon, string, string]> = [
  [Cpu, "Quantum CPU", "98%"],
  [ShieldCheck, "Armor Link", "Active"],
];

export function Hero() {
  return (
    <Section className="relative isolate flex min-h-[100svh] w-full overflow-hidden bg-black text-zinc-50">
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_18%_24%,rgba(34,211,238,0.22),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(217,70,239,0.2),transparent_28%),radial-gradient(circle_at_58%_78%,rgba(163,230,53,0.1),transparent_24%),linear-gradient(180deg,#050507_0%,#09090b_48%,#000_100%)]" />
      <div className="cyber-grid absolute inset-0 -z-20 opacity-70" />
      <div className="cyber-scanline absolute inset-0 -z-10 opacity-35" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-fuchsia-300/60 to-transparent" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-3xl">
            <div className="cyber-reveal cyber-reveal-delay-1">
              <CyberBadge variant="cyan" glow>
                Neural Storefront // Online
              </CyberBadge>
            </div>

            <h1 className="cyber-reveal cyber-reveal-delay-2 mt-7 max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-7xl lg:text-8xl">
              Gear up for the{" "}
              <span className="cyber-glitch-text bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-lime-200 bg-clip-text text-transparent">
                future arena
              </span>
            </h1>

            <p className="cyber-reveal cyber-reveal-delay-3 mt-6 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
              Premium cyberpunk interface for gaming commerce: neon hardware
              drops, high-contrast dashboards, techwear-grade product cards,
              and fast conversion flows.
            </p>

            <div className="cyber-reveal cyber-reveal-delay-4 mt-9 flex flex-col gap-3 sm:flex-row">
              <CyberButton size="lg" variant="primary">
                <Zap />
                Enter shop
              </CyberButton>
              <CyberButton size="lg" variant="outline">
                <RadioTower />
                Watch signal
              </CyberButton>
            </div>

            <div className="cyber-reveal cyber-reveal-delay-5 mt-10 grid max-w-xl grid-cols-3 gap-3">
              {heroMetrics.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg border border-white/10 bg-white/[0.055] p-3 backdrop-blur-xl"
                >
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-zinc-500">
                    {label}
                  </div>
                  <div className="mt-1 font-mono text-lg font-semibold text-cyan-100">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cyber-hero-device relative min-h-[360px] lg:min-h-[560px]">
            <div className="absolute inset-0 rounded-[1.75rem] border border-cyan-300/20 bg-[linear-gradient(135deg,rgba(39,39,42,0.72),rgba(9,9,11,0.96))] shadow-[0_0_90px_rgba(34,211,238,0.18)] backdrop-blur-xl" />
            <div className="absolute inset-5 rounded-[1.25rem] border border-white/10 bg-black/45" />
            <div className="absolute left-10 right-10 top-10 flex items-center justify-between">
              <CyberBadge variant="violet" glow>
                Loadout Core
              </CyberBadge>
              <div className="h-2 w-28 rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-lime-300 shadow-[0_0_26px_rgba(34,211,238,0.3)]" />
            </div>
            <div className="absolute inset-x-12 top-28 grid gap-4 sm:grid-cols-2">
              {heroSystemCards.map(([Icon, label, value]) => (
                <div
                  key={String(label)}
                  className="rounded-xl border border-cyan-300/15 bg-white/[0.055] p-5 shadow-[inset_0_0_24px_rgba(34,211,238,0.05)]"
                >
                  <Icon className="size-5 text-cyan-200" />
                  <div className="mt-5 font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">
                    {label}
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-12 left-12 right-12 overflow-hidden rounded-2xl border border-fuchsia-300/20 bg-fuchsia-400/10 p-5 shadow-[0_0_50px_rgba(217,70,239,0.16)]">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-fuchsia-100">
                  Drop Timeline
                </span>
                <span className="font-mono text-xs text-lime-200">Live</span>
              </div>
              <div className="space-y-3">
                {[82, 54, 92].map((width, index) => (
                  <div key={index} className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-300 shadow-[0_0_18px_rgba(34,211,238,0.35)]"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="cyber-reveal cyber-reveal-delay-5 absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-zinc-500 sm:flex">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em]">
            Scroll
          </span>
          <ChevronDown className="size-4 animate-bounce text-cyan-200" />
        </div>
      </div>
    </Section>
  );
}
