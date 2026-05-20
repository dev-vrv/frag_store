import { CyberBadge, CyberCard, CyberCardContent, CyberLaserText } from "@/components/cyber";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { ContactCyberBackground } from "@/components/Pages/ContactsPage/ContactCyberBackground";
import { type Dictionary, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface PlaceholderPageProps {
  locale: Locale;
  dictionary: Dictionary;
  title: string;
  subtitle: string;
  badge?: string;
  animatedBackground?: boolean;
}

export function PlaceholderPage({
  locale,
  dictionary,
  title,
  subtitle,
  badge = "Раздел",
  animatedBackground = false,
}: PlaceholderPageProps) {
  return (
    <main
      className={cn(
        "relative min-h-screen overflow-hidden bg-black px-4 pt-36 text-zinc-50 sm:px-6 lg:px-8",
        animatedBackground && "isolate",
      )}
    >
      <Header locale={locale} dictionary={dictionary.header} />
      {animatedBackground ? (
        <ContactCyberBackground />
      ) : (
        <>
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_18%,rgba(255,23,68,0.2),transparent_30%),radial-gradient(circle_at_80%_16%,rgba(217,70,239,0.12),transparent_28%),linear-gradient(180deg,#050507,#000)]" />
          <div className="cyber-grid absolute inset-0 -z-10 opacity-60" />
        </>
      )}
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-9rem)] max-w-7xl items-center">
        <CyberCard variant="glass" className="w-full max-w-4xl p-2">
          <CyberCardContent className="p-8 sm:p-10">
            <CyberBadge variant="red" glow>
              {badge}
            </CyberBadge>
            <CyberLaserText
              as="h1"
              text={title}
              className="mt-7 block text-5xl text-red-100 sm:text-7xl"
              speedMs={44}
            />
            <p className="mt-6 max-w-2xl text-xl leading-9 text-zinc-400">{subtitle}</p>
          </CyberCardContent>
        </CyberCard>
      </section>
      <Footer locale={locale} dictionary={dictionary} className="-mx-4 sm:-mx-6 lg:-mx-8" />
    </main>
  );
}
