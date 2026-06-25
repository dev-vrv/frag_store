import { ContactSection } from "@/components/Sections/ContactSection";
import { FeaturedDrops } from "@/components/Sections/FeaturedDrops";
import { Hero } from "@/components/Sections/Hero";
import { LoadoutZones } from "@/components/Sections/LoadoutZones";
import { ServiceProtocol } from "@/components/Sections/ServiceProtocol";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { type Dictionary, type Locale } from "@/lib/i18n";
import { type Product, type ProductCategory } from "@/lib/products";

export interface MainProps {
  locale: Locale;
  dictionary: Dictionary;
  bestSellerProducts: Product[];
  categories: ProductCategory[];
}

export function Main({ locale, dictionary, bestSellerProducts, categories }: MainProps) {
  return (
    <main className="page-shell w-full overflow-x-hidden bg-black">
      <Header locale={locale} dictionary={dictionary.header} />
      <Hero locale={locale} content={dictionary.hero} />
      <FeaturedDrops locale={locale} content={dictionary.featured} products={bestSellerProducts} />
      <LoadoutZones locale={locale} content={dictionary.loadout} categories={categories} />
      <ServiceProtocol content={dictionary.service} />
      <ContactSection locale={locale} />
      <Footer locale={locale} dictionary={dictionary} />
    </main>
  );
}
