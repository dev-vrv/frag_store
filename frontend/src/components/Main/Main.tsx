import { ContactSection } from "@/components/Sections/ContactSection";
import { FeaturedDrops } from "@/components/Sections/FeaturedDrops";
import { Hero } from "@/components/Sections/Hero";
import { MainCategories } from "@/components/Sections/MainCategories";
import { ServiceProtocol } from "@/components/Sections/ServiceProtocol";
import { GeometricBackdrop } from "@/components/Background/GeometricBackdrop";
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
    <main className="page-shell relative isolate w-full overflow-x-hidden bg-[rgba(var(--theme-surface-rgb),1)]">
      <div aria-hidden="true" className="home-shared-backdrop">
        <div className="home-shared-backdrop__base" />
        <div className="cyber-grid home-shared-backdrop__grid" />
      </div>
      <GeometricBackdrop
        className="absolute inset-0 z-0"
        variant="home"
        gridOpacityClassName="opacity-[0.24]"
        scanlineOpacityClassName="opacity-[0.12]"
      />
      <div className="relative z-10 w-full mx-auto">
        <Header locale={locale} dictionary={dictionary.header} />
        <Hero locale={locale} content={dictionary.hero} categories={categories} />
        <MainCategories locale={locale} categories={categories} />
        <FeaturedDrops locale={locale} content={dictionary.featured} products={bestSellerProducts} />
        <ServiceProtocol content={dictionary.service} />
        <ContactSection locale={locale} />
        <Footer locale={locale} dictionary={dictionary} />
      </div>
    </main>
  );
}
