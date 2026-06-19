import { ContactSection } from "@/components/Sections/ContactSection";
import { FeaturedDrops } from "@/components/Sections/FeaturedDrops";
import { Hero } from "@/components/Sections/Hero";
import { LoadoutZones } from "@/components/Sections/LoadoutZones";
import { ServiceProtocol } from "@/components/Sections/ServiceProtocol";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { type Dictionary, type Locale } from "@/lib/i18n";

export interface MainProps {
  locale: Locale;
  dictionary: Dictionary;
}

export function Main({ locale, dictionary }: MainProps) {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-black">
      <Header locale={locale} dictionary={dictionary.header} />
      <Hero locale={locale} content={dictionary.hero} />
      <LoadoutZones locale={locale} content={dictionary.loadout} />
      <FeaturedDrops locale={locale} content={dictionary.featured} />
      <ServiceProtocol content={dictionary.service} />
      <ContactSection locale={locale} />
      <Footer locale={locale} dictionary={dictionary} />
    </main>
  );
}
