import Link from "next/link";
import { Cpu, Gamepad2, Headphones, ShieldCheck, Sparkles, Wrench } from "lucide-react";

import { ContactSocialButtons } from "@/components/Contacts/ContactSocialButtons";
import { CyberBadge, CyberLaserText } from "@/components/cyber";
import { CyberButton } from "@/components/cyber";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { ContactCyberBackground } from "@/components/Pages/ContactsPage/ContactCyberBackground";
import { ContactPanel } from "@/components/Pages/ContactsPage/ContactPanel";
import { type Dictionary, type Locale, localizePath } from "@/lib/i18n";

interface AboutPageProps {
  locale: Locale;
  dictionary: Dictionary;
}

const aboutContent: Record<
  Locale,
  {
    intro: string[];
    offerTitle: string;
    offers: Array<{
      title: string;
      text: string;
    }>;
    advantagesTitle: string;
    advantages: string[];
    closing: string;
    contactLead: string;
    contactButton: string;
  }
> = {
  ru: {
    intro: [
      "FRAGSTORE - надежный партнер в мире игровых компонентов, компьютеров и периферии. Мы помогаем собрать систему, которая выглядит уверенно, работает стабильно и дает нужный запас производительности.",
      "Мы объединяем современные технологии, проверенные бренды и практический опыт, чтобы геймеры получали не просто товар, а продуманный игровой сетап под свои задачи.",
    ],
    offerTitle: "Что мы предлагаем",
    offers: [
      {
        title: "Игровые комплектующие",
        text: "Процессоры, видеокарты, материнские платы, оперативная память, накопители, блоки питания и другие компоненты для мощных игровых систем.",
      },
      {
        title: "Компьютеры и сборки",
        text: "Готовые игровые ПК и индивидуальные сборки под бюджет, задачи, дизайн и требования к производительности.",
      },
      {
        title: "Аксессуары и периферия",
        text: "Игровые мыши, клавиатуры, гарнитуры, мониторы, коврики, микрофоны и аксессуары для комфортного сетапа.",
      },
    ],
    advantagesTitle: "Наши преимущества",
    advantages: [
      "Высокое качество продукции и услуг.",
      "Широкий ассортимент игровой техники и комплектующих.",
      "Профессиональный подход и индивидуальный подбор.",
      "Конкурентоспособные цены и гибкие условия.",
    ],
    closing:
      "Мы гордимся тем, что помогаем клиентам выбирать надежные решения для игр, работы и апгрейда. Обращайтесь в FRAGSTORE, и мы вместе соберем сетап, который будет готов к будущему.",
    contactLead:
      "Готовы обсудить сборку или подобрать технику? Напишите нам удобным способом - быстро сориентируем по вариантам.",
    contactButton: "Связаться с нами",
  },
  en: {
    intro: [
      "FRAGSTORE is a reliable partner in gaming components, computers, and peripherals. We help build systems that look sharp, run stable, and deliver the performance headroom players need.",
      "We combine modern technology, trusted brands, and practical experience so gamers receive not just products, but a carefully planned setup for their goals.",
    ],
    offerTitle: "What we offer",
    offers: [
      {
        title: "Gaming components",
        text: "CPUs, graphics cards, motherboards, memory, storage, power supplies, and other parts for powerful gaming systems.",
      },
      {
        title: "Computers and builds",
        text: "Ready-made gaming PCs and custom builds tailored to budget, workload, visual style, and performance requirements.",
      },
      {
        title: "Accessories and peripherals",
        text: "Gaming mice, keyboards, headsets, monitors, mousepads, microphones, and accessories for a comfortable setup.",
      },
    ],
    advantagesTitle: "Why choose us",
    advantages: [
      "High-quality products and service.",
      "Wide range of gaming gear and components.",
      "Professional guidance and individual selection.",
      "Competitive prices and flexible terms.",
    ],
    closing:
      "We are proud to help customers choose reliable solutions for gaming, work, and upgrades. Contact FRAGSTORE, and together we will build a setup ready for the future.",
    contactLead:
      "Ready to discuss a build or choose gear? Contact us in a convenient way and we will quickly guide you through the options.",
    contactButton: "Contact us",
  },
  kg: {
    intro: [
      "FRAGSTORE - gaming комплекттер, компьютерлер жана периферия дүйнөсүндөгү ишенимдүү өнөктөш. Биз туруктуу иштеген, күчтүү жана көрүнүшү жакшы сетап чогултууга жардам беребиз.",
      "Биз заманбап технологияларды, текшерилген бренддерди жана практикалык тажрыйбаны бириктирип, геймерлерге жөн гана товар эмес, максатына туура келген ойлонулган сетап сунуштайбыз.",
    ],
    offerTitle: "Эмне сунуштайбыз",
    offers: [
      {
        title: "Gaming комплекттер",
        text: "Процессорлор, видеокарталар, материндик платалар, оперативдик эс, накопителдер, блок питания жана күчтүү gaming системалар үчүн башка компоненттер.",
      },
      {
        title: "Компьютерлер жана сборкалар",
        text: "Даяр gaming ПК жана бюджетке, тапшырмага, дизайнга жана өндүрүмдүүлүк талаптарына ылайык жеке сборкалар.",
      },
      {
        title: "Аксессуарлар жана периферия",
        text: "Gaming мышкалар, клавиатуралар, гарнитуралар, мониторлор, ковриктер, микрофондор жана ыңгайлуу сетап үчүн аксессуарлар.",
      },
    ],
    advantagesTitle: "Биздин артыкчылыктар",
    advantages: [
      "Товарлардын жана кызматтын жогорку сапаты.",
      "Gaming техника жана комплекттердин кеңири ассортименти.",
      "Профессионалдуу мамиле жана жеке тандоо.",
      "Атаандаш баалар жана ийкемдүү шарттар.",
    ],
    closing:
      "Биз кардарларга оюн, жумуш жана апгрейд үчүн ишенимдүү чечим тандоого жардам бергенибизге сыймыктанабыз. FRAGSTORE менен байланышыңыз, келечекке даяр сетапты чогуу түзөбүз.",
    contactLead:
      "Сборканы талкуулайлы же техника тандайлыбы? Ыңгайлуу жол менен жазыңыз, варианттарды тез сунуштайбыз.",
    contactButton: "Биз менен байланышуу",
  },
};

const offerIcons = [Cpu, Wrench, Headphones];

export function AboutPage({ locale, dictionary }: AboutPageProps) {
  const page = dictionary.pages.about;
  const content = aboutContent[locale];

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-black px-4 pb-16 pt-36 text-zinc-50 sm:px-6 lg:px-8">
      <Header locale={locale} dictionary={dictionary.header} />
      <ContactCyberBackground />

      <section className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
        <div>
          <CyberBadge variant="red" glow>
            {page.badge}
          </CyberBadge>
          <CyberLaserText
            as="h1"
            text={page.title}
            className="mt-7 block text-5xl text-red-100 sm:text-7xl"
            speedMs={44}
          />
          <div className="mt-6 max-w-3xl space-y-4 text-xl leading-9 text-zinc-400">
            {content.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <ContactPanel contentClassName="p-6">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center border border-lime-300/25 bg-lime-300/8 text-lime-100">
              <Gamepad2 className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-tech text-xs uppercase text-zinc-500">FRAGSTORE</p>
              <p className="font-display text-2xl uppercase text-red-100">
                Gaming Tech
              </p>
            </div>
          </div>
          <p className="mt-5 text-base leading-7 text-zinc-400">{content.closing}</p>
          <p className="mt-5 text-base leading-7 text-zinc-300">{content.contactLead}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <CyberButton asChild variant="primary" size="sm">
              <Link href={localizePath("/contacts", locale)}>
                {content.contactButton}
              </Link>
            </CyberButton>
            <ContactSocialButtons
              locale={locale}
              channels={["telegram", "whatsapp"]}
              linkClassName="size-10"
            />
          </div>
        </ContactPanel>
      </section>

      <section className="relative z-10 mx-auto mt-12 max-w-7xl">
        <h2 className="font-display text-3xl uppercase text-red-100">
          {content.offerTitle}
        </h2>
        <div className="mt-6 grid auto-rows-fr gap-6 md:grid-cols-3">
          {content.offers.map((offer, index) => {
            const Icon = offerIcons[index] ?? Sparkles;

            return (
              <ContactPanel key={offer.title} contentClassName="h-full p-6">
                <div className="grid size-11 place-items-center border border-red-400/25 bg-red-500/10 text-red-100">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-display text-2xl uppercase text-zinc-50">
                  {offer.title}
                </h3>
                <p className="mt-3 text-base leading-8 text-zinc-400">{offer.text}</p>
              </ContactPanel>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-8 grid max-w-7xl gap-6 lg:grid-cols-[24rem_minmax(0,1fr)]">
        <ContactPanel contentClassName="p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-6 text-lime-200" aria-hidden="true" />
            <h2 className="font-display text-3xl uppercase text-red-100">
              {content.advantagesTitle}
            </h2>
          </div>
        </ContactPanel>

        <ContactPanel contentClassName="p-6">
          <ul className="grid gap-3 sm:grid-cols-2">
            {content.advantages.map((advantage) => (
              <li
                key={advantage}
                className="border border-white/10 bg-white/[0.035] px-4 py-3 text-zinc-300"
              >
                {advantage}
              </li>
            ))}
          </ul>
        </ContactPanel>
      </section>

      <Footer locale={locale} dictionary={dictionary} className="-mx-4 sm:-mx-6 lg:-mx-8" />
    </main>
  );
}
