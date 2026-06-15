import { type Locale } from "@/lib/i18n";

export interface ContactFormDictionary {
  title: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submit: string;
  success: string;
  error: string;
}

export interface ContactInfoDictionary {
  title: string;
  empty: string;
  helpTitle: string;
  helpItems: string[];
  directTitle: string;
  extraTitle: string;
  fallbackPhone: string;
  fallbackEmail: string;
}

export interface ContactSectionDictionary {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export interface ContactContentDictionary {
  intro: string;
  mapTitle: string;
  form: ContactFormDictionary;
  info: ContactInfoDictionary;
  home: ContactSectionDictionary;
}

export const contactContent: Record<Locale, ContactContentDictionary> = {
  ru: {
    intro:
      "Ответим по наличию, сборкам и заказам. Оставьте сообщение или выберите удобный канал связи.",
    mapTitle: "Карта",
    form: {
      title: "Оставить сообщение",
      nameLabel: "Имя",
      namePlaceholder: "Ваше имя",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      phoneLabel: "Телефон",
      phonePlaceholder: "+996 000 000 000",
      messageLabel: "Сообщение",
      messagePlaceholder: "Опишите вопрос или заявку",
      submit: "Отправить",
      success: "Сообщение отправлено. Мы свяжемся с вами.",
      error: "Не удалось отправить сообщение. Попробуйте позже.",
    },
    info: {
      title: "Контакты",
      empty: "Контактные данные для этой локали пока не добавлены.",
      helpTitle: "С чем поможем",
      helpItems: [
        "Подбор gaming-девайсов и аксессуаров",
        "Заявки на сборки и апгрейд сетапа",
        "Наличие, заказ и резерв товара",
        "Партнерские и корпоративные запросы",
      ],
      directTitle: "Соцсети и мессенджеры",
      extraTitle: "Дополнительно",
      fallbackPhone: "Телефон",
      fallbackEmail: "Email",
    },
    home: {
      eyebrow: "Связаться с нами",
      title: "Подберем технику, ответим по наличию и примем заявку на сетап",
      subtitle:
        "Форма и контактные данные вынесены в отдельные компоненты, чтобы один и тот же блок работал и на главной, и на странице контактов без дублирования структуры.",
    },
  },
  en: {
    intro:
      "Ask about stock, builds, or orders. Leave a message or choose the channel that works best for you.",
    mapTitle: "Map",
    form: {
      title: "Leave a message",
      nameLabel: "Name",
      namePlaceholder: "Your name",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      phoneLabel: "Phone",
      phonePlaceholder: "+1 555 000 0000",
      messageLabel: "Message",
      messagePlaceholder: "Describe your question or request",
      submit: "Send",
      success: "Message sent. We will contact you.",
      error: "Could not send the message. Try again later.",
    },
    info: {
      title: "Contacts",
      empty: "Contacts for this locale have not been added yet.",
      helpTitle: "How we can help",
      helpItems: [
        "Gaming gear and accessory selection",
        "Build requests and setup upgrades",
        "Stock, orders, and item reservations",
        "Partnership and business requests",
      ],
      directTitle: "Socials and messengers",
      extraTitle: "More",
      fallbackPhone: "Phone",
      fallbackEmail: "Email",
    },
    home: {
      eyebrow: "Contact Us",
      title: "We can help with gear choice, stock checks, and full setup requests",
      subtitle:
        "The form and contact data are now isolated into reusable components so the same contact block works on both the homepage and the contacts page.",
    },
  },
  kg: {
    intro:
      "Товарлар, сборкалар жана заказдар боюнча жооп беребиз. Билдирүү калтырыңыз же ыңгайлуу байланыш каналын тандаңыз.",
    mapTitle: "Карта",
    form: {
      title: "Билдирүү калтыруу",
      nameLabel: "Атыңыз",
      namePlaceholder: "Атыңыз",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      phoneLabel: "Телефон",
      phonePlaceholder: "+996 700 000 000",
      messageLabel: "Билдирүү",
      messagePlaceholder: "Сурооңузду же өтүнүчүңүздү жазыңыз",
      submit: "Жөнөтүү",
      success: "Билдирүү жөнөтүлдү. Биз сиз менен байланышабыз.",
      error: "Билдирүү жөнөтүлгөн жок. Кийинчерээк аракет кылыңыз.",
    },
    info: {
      title: "Байланыш",
      empty: "Бул тил үчүн байланыш маалыматтары азырынча кошула элек.",
      helpTitle: "Кандай жардам беребиз",
      helpItems: [
        "Gaming девайстарды жана аксессуарларды тандоо",
        "Сборка жана сетапты жаңыртуу боюнча сурамдар",
        "Товарлардын бар-жогу, заказ жана резерв",
        "Өнөктөштүк жана бизнес сурамдар",
      ],
      directTitle: "Соцтармактар жана мессенджерлер",
      extraTitle: "Кошумча",
      fallbackPhone: "Телефон",
      fallbackEmail: "Email",
    },
    home: {
      eyebrow: "Биз менен байланыш",
      title: "Техника тандоого жардам беребиз, бар-жогун тактайбыз жана сетап боюнча заявка алабыз",
      subtitle:
        "Форма менен байланыш маалыматтары эми өзүнчө компоненттерде, ошондуктан ошол эле блок башкы бетте да, байланыш бетинде да кайра колдонулат.",
    },
  },
};
