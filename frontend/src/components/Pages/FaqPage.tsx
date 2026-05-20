import { HelpCircle } from "lucide-react";

import { CyberBadge, CyberLaserText } from "@/components/cyber";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { ContactCyberBackground } from "@/components/Pages/ContactsPage/ContactCyberBackground";
import { ContactPanel } from "@/components/Pages/ContactsPage/ContactPanel";
import { type Dictionary, type Locale } from "@/lib/i18n";

interface FaqPageProps {
  locale: Locale;
  dictionary: Dictionary;
}

type FaqSection = {
  title: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
};

const faqContent: Record<Locale, FaqSection[]> = {
  ru: [
    {
      title: "Заказы и оплата",
      items: [
        {
          question: "Что продает Frag Store?",
          answer:
            "Frag Store специализируется на игровой технике: мышках, клавиатурах, гарнитурах, ковриках, геймпадах, комплектующих, аксессуарах для ПК и готовых решениях для игрового сетапа.",
        },
        {
          question: "Как оформить заказ?",
          answer:
            "Выберите товар в каталоге, добавьте его в корзину и оставьте контактные данные. Если нужна консультация по совместимости или подбору, напишите нам через форму контактов или мессенджеры.",
        },
        {
          question: "Какие способы оплаты доступны?",
          answer:
            "Доступные способы оплаты зависят от региона и статуса заказа. Обычно доступны наличная оплата при получении, перевод, банковская карта или согласованный онлайн-платеж.",
        },
        {
          question: "Можно ли зарезервировать товар?",
          answer:
            "Да, товар можно зарезервировать после подтверждения наличия менеджером. Срок резерва и условия оплаты уточняются индивидуально.",
        },
      ],
    },
    {
      title: "Доставка и получение",
      items: [
        {
          question: "Есть ли доставка?",
          answer:
            "Да, доставка доступна по согласованию. Стоимость и сроки зависят от города, габаритов товара и выбранного способа отправки.",
        },
        {
          question: "Можно ли забрать заказ самостоятельно?",
          answer:
            "Самовывоз возможен после подтверждения заказа. Точный адрес, время выдачи и готовность товара менеджер сообщит заранее.",
        },
        {
          question: "Как быстро отправляется заказ?",
          answer:
            "Товары в наличии обычно готовятся к выдаче или отправке после подтверждения заказа. Если товар под заказ, менеджер заранее согласует срок поставки.",
        },
      ],
    },
    {
      title: "Гарантия и возврат",
      items: [
        {
          question: "Есть ли гарантия на товары?",
          answer:
            "Да, на товары распространяется гарантия производителя или магазина. Срок и условия зависят от конкретной категории, бренда и состояния товара.",
        },
        {
          question: "Что делать, если товар оказался неисправным?",
          answer:
            "Свяжитесь с нами, опишите проблему и приложите фото или видео. Мы подскажем порядок диагностики, обмена, ремонта или возврата по гарантийным условиям.",
        },
        {
          question: "Можно ли вернуть товар, если он не подошел?",
          answer:
            "Возврат или обмен возможен при сохранении товарного вида, комплектации и упаковки, если товар не имеет следов использования и подходит под условия возврата.",
        },
      ],
    },
    {
      title: "Подбор техники",
      items: [
        {
          question: "Помогаете ли вы подобрать мышку, клавиатуру или гарнитуру?",
          answer:
            "Да. Мы учитываем жанры игр, хват мыши, размер руки, тип переключателей, уровень шума, посадку гарнитуры, микрофон, бюджет и совместимость с вашим сетапом.",
        },
        {
          question: "Можно ли собрать комплект под конкретный бюджет?",
          answer:
            "Да, мы можем предложить несколько вариантов сетапа: базовый, сбалансированный и продвинутый. Так проще сравнить цену, качество и запас на будущее.",
        },
        {
          question: "Продаете ли вы комплектующие для апгрейда ПК?",
          answer:
            "Да, в ассортименте могут быть комплектующие и аксессуары для апгрейда. По совместимости лучше уточнить модель вашей материнской платы, корпуса, блока питания и текущей сборки.",
        },
      ],
    },
  ],
  en: [
    {
      title: "Orders and payment",
      items: [
        {
          question: "What does Frag Store sell?",
          answer:
            "Frag Store focuses on gaming gear: mice, keyboards, headsets, mousepads, gamepads, PC components, accessories, and complete setup solutions.",
        },
        {
          question: "How do I place an order?",
          answer:
            "Choose a product, add it to the cart, and leave your contact details. If you need help with compatibility or selection, contact us through the form or messengers.",
        },
        {
          question: "Which payment methods are available?",
          answer:
            "Payment options depend on region and order status. Cash on pickup, transfer, bank card, or an agreed online payment may be available.",
        },
        {
          question: "Can I reserve a product?",
          answer:
            "Yes. A product can be reserved after stock is confirmed by a manager. Reservation period and payment terms are agreed individually.",
        },
      ],
    },
    {
      title: "Delivery and pickup",
      items: [
        {
          question: "Do you offer delivery?",
          answer:
            "Yes, delivery is available by agreement. Cost and timing depend on city, product size, and shipping method.",
        },
        {
          question: "Can I pick up my order?",
          answer:
            "Pickup is available after order confirmation. A manager will confirm the address, pickup time, and product readiness.",
        },
        {
          question: "How fast do you ship orders?",
          answer:
            "In-stock items are usually prepared after order confirmation. For preorder items, the manager will confirm the expected delivery date in advance.",
        },
      ],
    },
    {
      title: "Warranty and returns",
      items: [
        {
          question: "Do products have warranty?",
          answer:
            "Yes, products are covered by manufacturer or store warranty. Terms depend on category, brand, and product condition.",
        },
        {
          question: "What if the product is defective?",
          answer:
            "Contact us, describe the issue, and attach photos or video. We will explain the diagnostics, exchange, repair, or return process.",
        },
        {
          question: "Can I return a product if it does not fit my needs?",
          answer:
            "Return or exchange may be possible if the product keeps its original condition, packaging, complete accessory set, and meets return terms.",
        },
      ],
    },
    {
      title: "Gear selection",
      items: [
        {
          question: "Can you help choose a mouse, keyboard, or headset?",
          answer:
            "Yes. We consider game genres, mouse grip, hand size, switch type, noise level, headset fit, microphone quality, budget, and setup compatibility.",
        },
        {
          question: "Can you build a setup for a specific budget?",
          answer:
            "Yes. We can suggest basic, balanced, and advanced setup options, making it easier to compare price, quality, and upgrade potential.",
        },
        {
          question: "Do you sell PC upgrade components?",
          answer:
            "Yes, components and accessories may be available. For compatibility, share your motherboard, case, power supply, and current build details.",
        },
      ],
    },
  ],
  kg: [
    {
      title: "Заказ жана төлөм",
      items: [
        {
          question: "Frag Store эмнелерди сатат?",
          answer:
            "Frag Store gaming техникасына адистешет: мышкалар, клавиатуралар, гарнитуралар, ковриктер, геймпаддар, ПК комплекттери, аксессуарлар жана толук сетап чечимдери.",
        },
        {
          question: "Заказды кантип берсе болот?",
          answer:
            "Каталогдон товар тандап, себетке кошуп, байланыш маалыматын калтырыңыз. Шайкештик же тандоо боюнча жардам керек болсо, форма же мессенджерлер аркылуу жазыңыз.",
        },
        {
          question: "Кандай төлөм түрлөрү бар?",
          answer:
            "Төлөм түрлөрү регионго жана заказдын статусуна жараша болот. Нак төлөм, которуу, банк картасы же макулдашылган онлайн төлөм болушу мүмкүн.",
        },
        {
          question: "Товарды резервге койсо болобу?",
          answer:
            "Ооба. Товар бар экени менеджер тарабынан ырасталгандан кийин резервге коюлат. Резерв мөөнөтү жана төлөм шарттары өзүнчө макулдашылат.",
        },
      ],
    },
    {
      title: "Жеткирүү жана алуу",
      items: [
        {
          question: "Жеткирүү барбы?",
          answer:
            "Ооба, жеткирүү макулдашуу менен жүргүзүлөт. Баасы жана мөөнөтү шаарга, товардын көлөмүнө жана жөнөтүү ыкмасына жараша болот.",
        },
        {
          question: "Заказды өзүм алып кетсем болобу?",
          answer:
            "Ооба, заказ ырасталгандан кийин самовывоз мүмкүн. Дарек, алуу убактысы жана товардын даярдыгы тууралуу менеджер алдын ала айтат.",
        },
        {
          question: "Заказ канчалык тез жөнөтүлөт?",
          answer:
            "Бар товарлар заказ ырасталгандан кийин даярдалат. Эгер товар заказ менен келсе, менеджер жеткирүү мөөнөтүн алдын ала макулдашат.",
        },
      ],
    },
    {
      title: "Кепилдик жана кайтаруу",
      items: [
        {
          question: "Товарларга кепилдик барбы?",
          answer:
            "Ооба, товарларга өндүрүүчүнүн же дүкөндүн кепилдиги берилет. Мөөнөтү жана шарттары категорияга, брендге жана товардын абалына жараша болот.",
        },
        {
          question: "Товар бузук болуп чыкса эмне кылуу керек?",
          answer:
            "Бизге байланышыңыз, көйгөйдү сүрөттөп, фото же видео тиркеңиз. Диагностика, алмаштыруу, оңдоо же кайтаруу тартибин түшүндүрөбүз.",
        },
        {
          question: "Товар туура келбесе кайтарса болобу?",
          answer:
            "Товар колдонулбаган, комплекти жана таңгактары сакталган болсо, кайтаруу же алмаштыруу шарттарга жараша мүмкүн.",
        },
      ],
    },
    {
      title: "Техниканы тандоо",
      items: [
        {
          question: "Мышка, клавиатура же гарнитура тандоого жардам бересиздерби?",
          answer:
            "Ооба. Оюн жанрын, мышка кармоо түрүн, кол өлчөмүн, переключатель түрүн, үндүн деңгээлин, гарнитуранын отурушун, микрофонду, бюджетти жана сетапка шайкештикти эске алабыз.",
        },
        {
          question: "Белгилүү бюджетке сетап чогултса болобу?",
          answer:
            "Ооба. Базалык, тең салмактуу жана күчтүү варианттарды сунуштай алабыз. Ошондо баа, сапат жана келечектеги апгрейдди салыштыруу жеңил болот.",
        },
        {
          question: "ПК апгрейд үчүн комплекттер барбы?",
          answer:
            "Ооба, комплекттер жана аксессуарлар болушу мүмкүн. Шайкештик үчүн материндик плата, корпус, блок питания жана азыркы сборка тууралуу маалымат бергениңиз жакшы.",
        },
      ],
    },
  ],
};

export function FaqPage({ locale, dictionary }: FaqPageProps) {
  const page = dictionary.pages.faq;

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-black px-4 pb-16 pt-36 text-zinc-50 sm:px-6 lg:px-8">
      <Header locale={locale} dictionary={dictionary.header} />
      <ContactCyberBackground />

      <section className="relative z-10 mx-auto max-w-7xl">
        <CyberBadge variant="red" glow>
          {page.badge}
        </CyberBadge>
        <CyberLaserText
          as="h1"
          text={page.title}
          className="mt-7 block text-5xl text-red-100 sm:text-7xl"
          speedMs={44}
        />
        <p className="mt-6 max-w-3xl text-xl leading-9 text-zinc-400">
          {page.subtitle}
        </p>
      </section>

      <section className="relative z-10 mx-auto mt-12 grid max-w-7xl auto-rows-fr gap-6 lg:grid-cols-2">
        {faqContent[locale].map((section) => (
          <ContactPanel key={section.title} className="h-full" contentClassName="flex h-full flex-col p-6 sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="grid size-10 place-items-center border border-red-400/30 bg-red-500/10 text-red-100">
                  <HelpCircle className="size-5" aria-hidden="true" />
                </div>
                <h2 className="font-display text-2xl uppercase text-red-100">
                  {section.title}
                </h2>
              </div>

              <div className="flex flex-1 flex-col gap-3">
                {section.items.map((item) => (
                  <details
                    key={item.question}
                    className="group border border-white/10 bg-black/28 p-4 open:border-red-400/30 open:bg-red-500/[0.055]"
                  >
                    <summary className="font-tech flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-semibold uppercase tracking-[0.06em] text-zinc-200 [&::-webkit-details-marker]:hidden">
                      <span>{item.question}</span>
                      <span className="mt-1 h-2 w-2 shrink-0 rotate-45 border-b border-r border-red-200 transition group-open:rotate-[225deg]" />
                    </summary>
                    <p className="mt-4 text-base leading-8 text-zinc-400">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
          </ContactPanel>
        ))}
      </section>

      <Footer locale={locale} dictionary={dictionary} className="-mx-4 sm:-mx-6 lg:-mx-8" />
    </main>
  );
}
