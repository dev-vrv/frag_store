import { CyberBadge, CyberCard, CyberCardContent } from "@/components/cyber";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
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
        "page-shell relative overflow-hidden bg-transparent px-4 pt-36 text-zinc-50 sm:px-6 lg:px-8",
        animatedBackground && "isolate",
      )}
    >
      <Header locale={locale} dictionary={dictionary.header} />
      <section className="relative z-10 max-w-7xl mx-auto flex min-h-[calc(100vh-9rem)] max-w-7xl items-center">
        <CyberCard variant="glass" className="w-full max-w-4xl p-2">
          <CyberCardContent className="p-8 sm:p-10">
            <CyberBadge variant="red" glow>
              {badge}
            </CyberBadge>
            <h1 className="font-display type-h1 mt-7 max-w-2xl text-red-100">
              {title}
            </h1>
            <p className="font-tech type-body-lg mt-6 max-w-2xl text-zinc-400">{subtitle}</p>
          </CyberCardContent>
        </CyberCard>
      </section>
      <Footer locale={locale} dictionary={dictionary} className="-mx-4 sm:-mx-6 lg:-mx-8" />
    </main>
  );
}
