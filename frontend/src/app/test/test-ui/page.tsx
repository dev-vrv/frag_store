import { notFound } from "next/navigation";
import {
  Cpu,
  Gauge,
  LockKeyhole,
  Mail,
  Search,
  Zap,
} from "lucide-react";

import {
  CyberBadge,
  CyberButton,
  CyberCard,
  CyberCardContent,
  CyberCardDescription,
  CyberCardFooter,
  CyberCardHeader,
  CyberCardTitle,
  CyberFeatureCard,
  CyberHero,
  CyberInput,
  CyberLaserText,
  CyberProductCard,
  CyberSection,
  CyberTabs,
  CyberTabsContent,
  CyberTabsList,
  CyberTabsTrigger,
} from "@/components/cyber";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { TestUiFormControls } from "@/app/test/test-ui/test-ui-form-controls";
import { TestUiOverlays } from "@/app/test/test-ui/test-ui-overlays";
import { defaultLocale, getDictionary } from "@/lib/i18n";

const isDebugUi =
  process.env.NODE_ENV !== "production" ||
  process.env.DEBUG_UI === "true" ||
  process.env.NEXT_PUBLIC_DEBUG_UI === "true";

const buttonVariants = ["primary", "secondary", "ghost", "danger", "neon", "outline"] as const;
const buttonSizes = ["sm", "md", "lg", "icon"] as const;
const cardVariants = ["default", "glowing", "bordered", "glass", "product"] as const;
const badgeVariants = ["red", "violet", "green", "warning", "neutral"] as const;
const featureAccents = ["red", "violet", "fuchsia", "lime"] as const;

export default function TestUiPage() {
  if (!isDebugUi) {
    notFound();
  }

  const dictionary = getDictionary(defaultLocale);

  return (
    <main className="min-h-screen overflow-hidden bg-black text-zinc-50">
      <Header locale={defaultLocale} dictionary={dictionary.header} />
      <CyberHero
        eyebrow="Debug UI Lab"
        title="Cyber component"
        highlightedTitle="test bench"
        subtitle="Internal-only page for checking every reusable cyber UI component, variant, size, and state in one place."
        actions={[
          { label: "Buttons", href: "#buttons", variant: "primary" },
          { label: "Products", href: "#products", variant: "outline" },
        ]}
      />

      <CyberSection
        id="buttons"
        title="CyberButton"
        subtitle="All visual variants, sizes, disabled and loading states."
        badge="Actions"
        grid
        glow
        className="border-y border-white/10"
      >
        <div className="space-y-6">
          <CyberCard variant="glass">
            <CyberCardContent className="space-y-5 p-5">
              {buttonVariants.map((variant) => (
                <div key={variant} className="flex flex-wrap items-center gap-3">
                  <div className="w-28 font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">
                    {variant}
                  </div>
                  {buttonSizes.map((size) => (
                    <CyberButton
                      key={size}
                      variant={variant}
                      size={size}
                      aria-label={`${variant} ${size}`}
                    >
                      {size === "icon" ? <Zap /> : size}
                    </CyberButton>
                  ))}
                  <CyberButton variant={variant} loading>
                    Loading
                  </CyberButton>
                  <CyberButton variant={variant} disabled>
                    Disabled
                  </CyberButton>
                </div>
              ))}
            </CyberCardContent>
          </CyberCard>
        </div>
      </CyberSection>

      <CyberSection
        title="CyberCard + CyberBadge"
        subtitle="Every card shell and badge color, including glow states."
        badge="Surfaces"
        glow
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {cardVariants.map((variant) => (
            <CyberCard key={variant} variant={variant} hover>
              <CyberCardHeader>
                <CyberCardTitle className="capitalize">{variant}</CyberCardTitle>
                <CyberCardDescription>Reusable cyber surface.</CyberCardDescription>
              </CyberCardHeader>
              <CyberCardContent>
                <div className="h-20 rounded-md border border-white/10 bg-[linear-gradient(135deg,rgba(248,113,113,0.16),rgba(217,70,239,0.08),transparent)]" />
              </CyberCardContent>
              <CyberCardFooter>
                <CyberButton size="sm" variant="outline">
                  Inspect
                </CyberButton>
              </CyberCardFooter>
            </CyberCard>
          ))}
        </div>

        <CyberCard variant="glass" className="mt-6">
          <CyberCardContent className="flex flex-wrap gap-3 p-5">
            {badgeVariants.map((variant) => (
              <CyberBadge key={variant} variant={variant}>
                {variant}
              </CyberBadge>
            ))}
            {badgeVariants.map((variant) => (
              <CyberBadge key={`${variant}-glow`} variant={variant} glow>
                {variant} glow
              </CyberBadge>
            ))}
          </CyberCardContent>
        </CyberCard>
      </CyberSection>

      <CyberSection
        title="CyberInput"
        subtitle="Default, icon, helper, error, disabled, and filled input states."
        badge="Forms"
        grid
        className="border-y border-white/10"
      >
        <div className="grid gap-5 lg:grid-cols-3">
          <CyberCard variant="bordered">
            <CyberCardContent className="space-y-5 p-5">
              <CyberInput label="Default" placeholder="Operator name" />
              <CyberInput label="With icon" icon={<Search />} placeholder="Search gear" />
            </CyberCardContent>
          </CyberCard>
          <CyberCard variant="glass">
            <CyberCardContent className="space-y-5 p-5">
              <CyberInput
                label="Helper"
                icon={<Mail />}
                placeholder="agent@zone51.dev"
                helperText="Used for restock and security alerts."
              />
              <CyberInput label="Filled" defaultValue="NOVA-X9-240HZ" icon={<Cpu />} />
            </CyberCardContent>
          </CyberCard>
          <CyberCard variant="glowing">
            <CyberCardContent className="space-y-5 p-5">
              <CyberInput
                label="Error"
                icon={<LockKeyhole />}
                placeholder="Access key"
                errorText="Debug auth rejected."
              />
              <CyberInput label="Disabled" placeholder="Offline node" disabled />
            </CyberCardContent>
          </CyberCard>
        </div>
      </CyberSection>

      <CyberSection
        title="Dropdown / Select / Radio / Checkbox"
        subtitle="Radix-based interactive form controls with cyber cut corners and keyboard-friendly behavior."
        badge="Controls"
        glow
      >
        <TestUiFormControls />
      </CyberSection>

      <CyberSection
        title="CyberLaserText"
        subtitle="Animated text reveal with a laser engraving beam, per-character burn-in and reduced-motion fallback."
        badge="Text FX"
        grid
        glow
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <CyberCard variant="glass" hover>
            <CyberCardHeader>
              <CyberCardTitle>Hero engraving</CyberCardTitle>
              <CyberCardDescription>Large headline-grade laser reveal.</CyberCardDescription>
            </CyberCardHeader>
            <CyberCardContent>
              <CyberLaserText
                as="h2"
                text="FRAG STORE"
                className="text-5xl text-red-100 sm:text-7xl"
                speedMs={58}
              />
            </CyberCardContent>
          </CyberCard>

          <CyberCard variant="glowing" hover>
            <CyberCardHeader>
              <CyberCardTitle>Interface labels</CyberCardTitle>
              <CyberCardDescription>Short UI strings with faster engraving.</CyberCardDescription>
            </CyberCardHeader>
            <CyberCardContent className="space-y-5">
              <CyberLaserText
                text="SYSTEM ONLINE"
                className="text-3xl text-red-100"
                speedMs={34}
              />
              <CyberLaserText
                text="LOADOUT CALIBRATED"
                className="block text-2xl text-rose-100"
                speedMs={28}
                delayMs={220}
              />
              <CyberLaserText
                text="NO BEAM MODE"
                className="block text-xl text-zinc-200"
                speedMs={24}
                delayMs={420}
                beam={false}
              />
            </CyberCardContent>
          </CyberCard>
        </div>
      </CyberSection>

      <CyberSection
        id="products"
        title="CyberProductCard"
        subtitle="Responsive product card states with image well, badges, rating, price and old price."
        badge="Commerce"
        glow
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <CyberProductCard
            title="NOVA X-9 Controller"
            description="Hall-effect sticks, haptic triggers, and tournament grade latency."
            price="$189"
            oldPrice="$229"
            rating={4.8}
            badges={[
              { label: "New", variant: "red" },
              { label: "Pro", variant: "violet" },
            ]}
            ctaLabel="Configure"
          />
          <CyberProductCard
            title="Aegis RGB Station"
            description="Liquid-cooled compact rig with silent airflow and OLED telemetry."
            price="$2,499"
            oldPrice="$2,799"
            rating={4.9}
            badges={[{ label: "Elite", variant: "green" }]}
            ctaLabel="Add to cart"
          />
          <CyberProductCard
            title="Specter Audio Mask"
            description="Spatial audio headset with active noise isolation and voice EQ."
            price="$329"
            rating={4.7}
            badges={[{ label: "Low stock", variant: "warning" }]}
            ctaLabel="Reserve"
          />
        </div>
      </CyberSection>

      <CyberSection
        title="CyberFeatureCard"
        subtitle="All accent colors for feature, metric, and dashboard highlight cards."
        badge="Features"
        grid
        className="border-y border-white/10"
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {featureAccents.map((accent) => (
            <CyberFeatureCard
              key={accent}
              icon={<Gauge />}
              title={`${accent} accent`}
              description="Compact feature module with hover lift, glow, and readable copy."
              accent={accent}
            />
          ))}
        </div>
      </CyberSection>

      <CyberSection title="CyberTabs" subtitle="Styled shadcn/Radix tabs states." badge="Navigation" glow>
        <CyberCard variant="glass">
          <CyberCardContent className="p-5">
            <CyberTabs defaultValue="overview">
              <CyberTabsList>
                <CyberTabsTrigger value="overview">Overview</CyberTabsTrigger>
                <CyberTabsTrigger value="thermal">Thermal</CyberTabsTrigger>
                <CyberTabsTrigger value="security">Security</CyberTabsTrigger>
                <CyberTabsTrigger value="disabled" disabled>
                  Disabled
                </CyberTabsTrigger>
              </CyberTabsList>
              <CyberTabsContent value="overview">
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    ["Latency", "0.8 ms"],
                    ["Refresh", "240 Hz"],
                    ["Signal", "99.98%"],
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
                Vapor chamber telemetry, fan curve, and case pressure indicators.
              </CyberTabsContent>
              <CyberTabsContent value="security">
                Firmware attestation, encrypted pairing, and operator session status.
              </CyberTabsContent>
            </CyberTabs>
          </CyberCardContent>
        </CyberCard>
      </CyberSection>

      <CyberSection
        title="CyberDialog + CyberSheet"
        subtitle="Modal and side-panel examples using shadcn/Radix accessibility primitives."
        badge="Overlays"
        grid
        className="border-y border-white/10"
      >
        <TestUiOverlays />
      </CyberSection>
      <Footer locale={defaultLocale} dictionary={dictionary} />
    </main>
  );
}
