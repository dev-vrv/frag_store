import { FileText } from "lucide-react";

import { CyberBadge, CyberLaserText } from "@/components/cyber";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { ContactCyberBackground } from "@/components/Pages/ContactsPage/ContactCyberBackground";
import { ContactPanel } from "@/components/Pages/ContactsPage/ContactPanel";
import { type Dictionary, type Locale } from "@/lib/i18n";

type LegalPageKind = "privacy" | "offer";

interface LegalPageProps {
  locale: Locale;
  dictionary: Dictionary;
  page: LegalPageKind;
}

type LegalSection = {
  title: string;
  body: string;
};

const legalContent: Record<Locale, Record<LegalPageKind, LegalSection[]>> = {
  ru: {
    privacy: [
      {
        title: "Какие данные мы получаем",
        body: "Мы можем получать имя, телефон, email, текст сообщения, данные о выбранных товарах и техническую информацию, необходимую для работы сайта и обработки заказа.",
      },
      {
        title: "Зачем используются данные",
        body: "Данные используются для связи с клиентом, консультации, подтверждения заказа, доставки, гарантийного обслуживания и улучшения качества сервиса Frag Store.",
      },
      {
        title: "Передача третьим лицам",
        body: "Мы не продаем персональные данные. Передача возможна только службам доставки, платежным сервисам или иным партнерам, когда это необходимо для выполнения заказа.",
      },
      {
        title: "Хранение и защита",
        body: "Мы принимаем разумные меры для защиты данных от несанкционированного доступа. Срок хранения зависит от цели обработки, требований учета и гарантийных обязательств.",
      },
      {
        title: "Обращения по данным",
        body: "Клиент может обратиться в Frag Store, чтобы уточнить, обновить или запросить удаление своих данных, если это не противоречит требованиям закона и обязательствам по заказу.",
      },
    ],
    offer: [
      {
        title: "Предмет договора",
        body: "Frag Store предлагает приобрести игровые комплектующие, компьютеры, периферию, аксессуары и готовые сетапы на условиях, указанных на сайте и согласованных при подтверждении заказа.",
      },
      {
        title: "Оформление заказа",
        body: "Заказ считается принятым после подтверждения менеджером наличия, цены, комплектации, способа оплаты и условий получения или доставки.",
      },
      {
        title: "Цена и оплата",
        body: "Цены могут изменяться до подтверждения заказа. Итоговая стоимость фиксируется при согласовании заказа и может включать доставку или дополнительные услуги.",
      },
      {
        title: "Доставка и получение",
        body: "Сроки и стоимость доставки зависят от региона, габаритов товара и выбранного способа отправки. Самовывоз возможен после подтверждения готовности заказа.",
      },
      {
        title: "Гарантия и возврат",
        body: "Гарантия, обмен и возврат осуществляются с учетом категории товара, состояния, комплектации, упаковки и гарантийных условий производителя или магазина.",
      },
    ],
  },
  en: {
    privacy: [
      {
        title: "Data we collect",
        body: "We may collect name, phone, email, message text, selected product details, and technical information required for site operation and order processing.",
      },
      {
        title: "How data is used",
        body: "Data is used to contact customers, provide consultation, confirm orders, arrange delivery, support warranty service, and improve Frag Store service quality.",
      },
      {
        title: "Sharing with third parties",
        body: "We do not sell personal data. Sharing may happen only with delivery services, payment services, or partners when required to complete an order.",
      },
      {
        title: "Storage and protection",
        body: "We take reasonable measures to protect data from unauthorized access. Storage period depends on processing purpose, accounting requirements, and warranty obligations.",
      },
      {
        title: "Data requests",
        body: "Customers may contact Frag Store to clarify, update, or request deletion of their data, unless this conflicts with legal requirements or order obligations.",
      },
    ],
    offer: [
      {
        title: "Subject of agreement",
        body: "Frag Store offers gaming components, computers, peripherals, accessories, and ready setups under the terms shown on the site and confirmed during order approval.",
      },
      {
        title: "Order placement",
        body: "An order is accepted after a manager confirms availability, price, contents, payment method, and pickup or delivery terms.",
      },
      {
        title: "Price and payment",
        body: "Prices may change before order confirmation. The final amount is fixed when the order is agreed and may include delivery or additional services.",
      },
      {
        title: "Delivery and pickup",
        body: "Delivery timing and cost depend on region, product size, and shipping method. Pickup is available after order readiness is confirmed.",
      },
      {
        title: "Warranty and returns",
        body: "Warranty, exchange, and return depend on product category, condition, contents, packaging, and manufacturer or store warranty terms.",
      },
    ],
  },
  kg: {
    privacy: [
      {
        title: "Кандай маалымат алабыз",
        body: "Биз аты-жөнүн, телефонун, email дарегин, билдирүү текстин, тандалган товарлар тууралуу маалыматты жана сайт иштеши үчүн керектүү техникалык маалыматты ала алабыз.",
      },
      {
        title: "Маалымат эмне үчүн колдонулат",
        body: "Маалымат кардар менен байланышуу, консультация берүү, заказды ырастоо, жеткирүү, кепилдик тейлөө жана Frag Store сервисин жакшыртуу үчүн колдонулат.",
      },
      {
        title: "Үчүнчү жактарга берүү",
        body: "Биз жеке маалыматтарды сатпайбыз. Маалымат заказды аткаруу үчүн керек болгондо гана жеткирүү, төлөм кызматтарына же өнөктөштөргө берилет.",
      },
      {
        title: "Сактоо жана коргоо",
        body: "Маалыматты уруксатсыз жетүүдөн коргоо үчүн акылга сыярлык чараларды көрөбүз. Сактоо мөөнөтү иштетүү максатына, эсепке алуу жана кепилдик милдеттерине жараша болот.",
      },
      {
        title: "Маалымат боюнча кайрылуу",
        body: "Кардар маалыматты тактоо, жаңыртуу же өчүрүү үчүн Frag Store менен байланыша алат, эгер бул мыйзам талаптарына жана заказ боюнча милдеттерге каршы келбесе.",
      },
    ],
    offer: [
      {
        title: "Келишимдин предмети",
        body: "Frag Store сайтта көрсөтүлгөн жана заказ ырасталганда макулдашылган шарттар боюнча gaming комплекттерди, компьютерлерди, периферияны, аксессуарларды жана даяр сетаптарды сунуштайт.",
      },
      {
        title: "Заказ берүү",
        body: "Заказ менеджер товар бар экенин, баасын, комплектациясын, төлөм ыкмасын жана алуу же жеткирүү шарттарын ырастагандан кийин кабыл алынган болуп эсептелет.",
      },
      {
        title: "Баа жана төлөм",
        body: "Баалар заказ ырасталганга чейин өзгөрүшү мүмкүн. Акыркы сумма заказ макулдашылганда бекитилет жана жеткирүү же кошумча кызматтарды камтышы мүмкүн.",
      },
      {
        title: "Жеткирүү жана алуу",
        body: "Жеткирүү мөөнөтү жана баасы регионго, товардын көлөмүнө жана жөнөтүү ыкмасына жараша болот. Самовывоз заказ даяр болгондон кийин мүмкүн.",
      },
      {
        title: "Кепилдик жана кайтаруу",
        body: "Кепилдик, алмаштыруу жана кайтаруу товардын категориясына, абалына, комплектациясына, таңгактарына жана өндүрүүчү же дүкөн шарттарына жараша жүргүзүлөт.",
      },
    ],
  },
};

export function LegalPage({ locale, dictionary, page }: LegalPageProps) {
  const pageDictionary = dictionary.pages[page];

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-black px-4 pb-16 pt-36 text-zinc-50 sm:px-6 lg:px-8">
      <Header locale={locale} dictionary={dictionary.header} />
      <ContactCyberBackground />

      <section className="relative z-10 mx-auto max-w-7xl">
        <CyberBadge variant="red" glow>
          {pageDictionary.badge}
        </CyberBadge>
        <CyberLaserText
          as="h1"
          text={pageDictionary.title}
          className="mt-7 block text-4xl text-red-100 sm:text-6xl"
          speedMs={34}
        />
        <p className="mt-6 max-w-3xl text-xl leading-9 text-zinc-400">
          {pageDictionary.subtitle}
        </p>
      </section>

      <section className="relative z-10 mx-auto mt-10 grid max-w-7xl gap-5 lg:grid-cols-2">
        {legalContent[locale][page].map((section) => (
          <ContactPanel key={section.title} contentClassName="h-full p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid size-10 place-items-center border border-red-400/25 bg-red-500/10 text-red-100">
                <FileText className="size-5" aria-hidden="true" />
              </div>
              <h2 className="font-display text-2xl uppercase text-red-100">
                {section.title}
              </h2>
            </div>
            <p className="text-base leading-8 text-zinc-400">{section.body}</p>
          </ContactPanel>
        ))}
      </section>

      <Footer locale={locale} dictionary={dictionary} className="-mx-4 sm:-mx-6 lg:-mx-8" />
    </main>
  );
}
