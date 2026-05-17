import {
  Cpu,
  Gauge,
  Headphones,
  Layers3,
  LockKeyhole,
  Mail,
  Menu,
  RadioTower,
  Search,
  Shield,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";

import {
  CyberBadge,
  CyberButton,
  CyberCard,
  CyberCardContent,
  CyberCardDescription,
  CyberCardHeader,
  CyberCardTitle,
  CyberDialog,
  CyberDialogContent,
  CyberDialogDescription,
  CyberDialogFooter,
  CyberDialogHeader,
  CyberDialogTitle,
  CyberDialogTrigger,
  CyberFeatureCard,
  CyberHero,
  CyberInput,
  CyberProductCard,
  CyberSection,
  CyberSheet,
  CyberSheetContent,
  CyberSheetDescription,
  CyberSheetFooter,
  CyberSheetHeader,
  CyberSheetTitle,
  CyberSheetTrigger,
  CyberTabs,
  CyberTabsContent,
  CyberTabsList,
  CyberTabsTrigger,
} from "@/components/cyber";
import { Separator } from "@/components/ui/separator";

const products = [
  {
    title: "NOVA X-9 Controller",
    description: "Hall-effect sticks, haptic triggers, and tournament grade latency.",
    price: "$189",
    oldPrice: "$229",
    rating: 4.8,
    badges: [
      { label: "New", variant: "red" as const },
      { label: "Pro", variant: "violet" as const },
    ],
  },
  {
    title: "Aegis RGB Station",
    description: "Liquid-cooled compact rig with silent airflow and OLED telemetry.",
    price: "$2,499",
    oldPrice: "$2,799",
    rating: 4.9,
    badges: [{ label: "Elite", variant: "green" as const }],
  },
  {
    title: "Specter Audio Mask",
    description: "Spatial audio headset with active noise isolation and voice EQ.",
    price: "$329",
    rating: 4.7,
    badges: [{ label: "Low stock", variant: "warning" as const }],
  },
];

const sheetActions: Array<[LucideIcon, string]> = [
  [Headphones, "Audio profiles"],
  [Mail, "Drop alerts"],
  [Shield, "Account security"],
];

export default function CyberDemoPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-zinc-50">
      <CyberHero
        eyebrow="Zone 51 Hardware Drop"
        title="Premium gear for"
        highlightedTitle="night city operators"
        subtitle="A reusable cyberpunk UI system for gaming commerce, futuristic dashboards, and techwear-grade product experiences."
        actions={[
          { label: "Enter store", href: "#products", variant: "primary" },
          { label: "View loadout", href: "#components", variant: "outline" },
        ]}
      />

      <CyberSection
        id="components"
        title="Interface Components"
        subtitle="Reusable primitives built on shadcn-style composition, tuned for neon contrast, glass surfaces, sharp controls, and responsive layouts."
        badge="UI Arsenal"
        grid
        glow
        className="border-y border-white/10"
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <CyberCard variant="glass" hover>
            <CyberCardHeader>
              <CyberCardTitle>CyberButton</CyberCardTitle>
              <CyberCardDescription>
                Variant, size, loading, disabled, and icon states.
              </CyberCardDescription>
            </CyberCardHeader>
            <CyberCardContent className="flex flex-wrap gap-3">
              <CyberButton variant="primary">Primary</CyberButton>
              <CyberButton variant="secondary">Secondary</CyberButton>
              <CyberButton variant="ghost">Ghost</CyberButton>
              <CyberButton variant="danger">Danger</CyberButton>
              <CyberButton variant="neon">Neon</CyberButton>
              <CyberButton variant="outline">Outline</CyberButton>
              <CyberButton loading>Syncing</CyberButton>
              <CyberButton disabled>Disabled</CyberButton>
              <CyberButton size="icon" aria-label="Boost">
                <Zap />
              </CyberButton>
            </CyberCardContent>
          </CyberCard>

          <CyberCard variant="glowing" hover>
            <CyberCardHeader>
              <CyberCardTitle>CyberBadge</CyberCardTitle>
              <CyberCardDescription>
                Compact status labels with optional glow.
              </CyberCardDescription>
            </CyberCardHeader>
            <CyberCardContent className="flex flex-wrap gap-3">
              <CyberBadge variant="red" glow>Online</CyberBadge>
              <CyberBadge variant="violet" glow>Quantum</CyberBadge>
              <CyberBadge variant="green" glow>Stable</CyberBadge>
              <CyberBadge variant="red" glow>Alert</CyberBadge>
              <CyberBadge variant="warning" glow>Warning</CyberBadge>
              <CyberBadge variant="neutral">Neutral</CyberBadge>
            </CyberCardContent>
          </CyberCard>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <CyberCard variant="bordered" hover>
            <CyberCardHeader>
              <CyberCardTitle>CyberInput</CyberCardTitle>
              <CyberCardDescription>Icon, helper, focus, and error states.</CyberCardDescription>
            </CyberCardHeader>
            <CyberCardContent className="space-y-5">
              <CyberInput
                label="Operator ID"
                icon={<Search />}
                placeholder="Search inventory"
                helperText="Indexed across 12 active warehouses."
              />
              <CyberInput
                label="Access key"
                icon={<LockKeyhole />}
                placeholder="ZX-404"
                errorText="Signal rejected by relay."
              />
            </CyberCardContent>
          </CyberCard>

          <CyberCard variant="glass" hover className="lg:col-span-2">
            <CyberCardHeader>
              <CyberCardTitle>CyberTabs</CyberCardTitle>
              <CyberCardDescription>Radix tabs with neon active affordance.</CyberCardDescription>
            </CyberCardHeader>
            <CyberCardContent>
              <CyberTabs defaultValue="performance">
                <CyberTabsList>
                  <CyberTabsTrigger value="performance">Performance</CyberTabsTrigger>
                  <CyberTabsTrigger value="thermal">Thermal</CyberTabsTrigger>
                  <CyberTabsTrigger value="security">Security</CyberTabsTrigger>
                </CyberTabsList>
                <CyberTabsContent value="performance">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      ["Latency", "0.8 ms"],
                      ["Refresh", "240 Hz"],
                      ["Sync", "99.98%"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-md border border-white/10 bg-black/35 p-4">
                        <div className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">
                          {label}
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-red-100">{value}</div>
                      </div>
                    ))}
                  </div>
                </CyberTabsContent>
                <CyberTabsContent value="thermal">
                  Active cooling curve, vapor chamber telemetry, and fan noise profile.
                </CyberTabsContent>
                <CyberTabsContent value="security">
                  Encrypted pairing, device attestation, and firmware integrity checks.
                </CyberTabsContent>
              </CyberTabs>
            </CyberCardContent>
          </CyberCard>
        </div>
      </CyberSection>

      <CyberSection
        title="Featured Loadouts"
        subtitle="Product cards designed for premium gaming commerce: responsive image well, badges, ratings, price states, and CTA."
        badge="Storefront"
        glow
        id="products"
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <CyberProductCard key={product.title} {...product} ctaLabel="Configure" />
          ))}
        </div>
      </CyberSection>

      <CyberSection
        title="Platform Features"
        subtitle="Cards for dashboard surfaces, product highlights, landing modules, and account areas."
        badge="System"
        grid
        className="border-y border-white/10"
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <CyberFeatureCard
            icon={<Cpu />}
            title="Adaptive Engine"
            description="Real-time state visuals for hardware, commerce, and account dashboards."
            accent="red"
          />
          <CyberFeatureCard
            icon={<Shield />}
            title="Secure Checkout"
            description="High contrast transaction states with readable, accessible affordances."
            accent="violet"
          />
          <CyberFeatureCard
            icon={<Gauge />}
            title="Telemetry Ready"
            description="Dense but calm panels for comparing specs, stats, and inventory signals."
            accent="lime"
          />
          <CyberFeatureCard
            icon={<RadioTower />}
            title="Live Drops"
            description="Status badges, glow accents, and launch modules without visual overload."
            accent="fuchsia"
          />
        </div>
      </CyberSection>

      <section className="relative bg-black px-4 py-16 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(217,70,239,0.12),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(248,113,113,0.12),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <CyberCard variant="glass" hover>
            <CyberCardHeader>
              <CyberCardTitle>CyberDialog</CyberCardTitle>
              <CyberCardDescription>Glass modal with glowing border and clean spacing.</CyberCardDescription>
            </CyberCardHeader>
            <CyberCardContent>
              <CyberDialog>
                <CyberDialogTrigger asChild>
                  <CyberButton variant="neon">
                    <Sparkles />
                    Open dialog
                  </CyberButton>
                </CyberDialogTrigger>
                <CyberDialogContent>
                  <CyberDialogHeader>
                    <CyberDialogTitle>Neural checkout armed</CyberDialogTitle>
                    <CyberDialogDescription>
                      Confirm the loadout profile before sending it to the assembly queue.
                    </CyberDialogDescription>
                  </CyberDialogHeader>
                  <div className="rounded-lg border border-white/10 bg-black/35 p-4">
                    <div className="flex items-center gap-3">
                      <Layers3 className="size-5 text-red-200" />
                      <div>
                        <div className="font-medium text-white">Aegis RGB Station</div>
                        <div className="text-sm text-zinc-500">Liquid-cooled compact rig</div>
                      </div>
                    </div>
                  </div>
                  <CyberDialogFooter>
                    <CyberButton variant="outline">Review</CyberButton>
                    <CyberButton>Confirm</CyberButton>
                  </CyberDialogFooter>
                </CyberDialogContent>
              </CyberDialog>
            </CyberCardContent>
          </CyberCard>

          <CyberCard variant="glowing" hover>
            <CyberCardHeader>
              <CyberCardTitle>CyberSheet</CyberCardTitle>
              <CyberCardDescription>Side panel for nav, cart, filters, or command surfaces.</CyberCardDescription>
            </CyberCardHeader>
            <CyberCardContent>
              <CyberSheet>
                <CyberSheetTrigger asChild>
                  <CyberButton variant="outline">
                    <Menu />
                    Open sheet
                  </CyberButton>
                </CyberSheetTrigger>
                <CyberSheetContent>
                  <CyberSheetHeader>
                    <CyberSheetTitle>Command rail</CyberSheetTitle>
                    <CyberSheetDescription>
                      Quick actions for the current cyber storefront session.
                    </CyberSheetDescription>
                  </CyberSheetHeader>
                  <Separator />
                  <div className="grid gap-3">
                    {sheetActions.map(([Icon, label]) => (
                      <button
                        key={label}
                        className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-zinc-200 transition hover:border-red-300/30 hover:bg-red-300/10"
                      >
                        <Icon className="size-4 text-red-200" />
                        {label}
                      </button>
                    ))}
                  </div>
                  <CyberSheetFooter>
                    <CyberButton className="w-full" variant="primary">Launch profile</CyberButton>
                  </CyberSheetFooter>
                </CyberSheetContent>
              </CyberSheet>
            </CyberCardContent>
          </CyberCard>
        </div>
      </section>
    </main>
  );
}
