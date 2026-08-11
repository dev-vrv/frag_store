import { type Locale } from "@/lib/i18n";

export interface ContactFormDictionary {
  eyebrow: string;
  title: string;
  description: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  optionalLabel: string;
  phonePlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submit: string;
  responseNote: string;
  success: string;
  error: string;
}

export interface ContactInfoDictionary {
  eyebrow: string;
  title: string;
  statusLabel: string;
  phoneLabel: string;
  emailLabel: string;
  addressLabel: string;
  emptyTitle: string;
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
      eyebrow: "Канал связи // 01",
      title: "Оставить сообщение",
      description:
        "Передайте задачу — менеджер ответит по указанным контактам.",
      nameLabel: "Имя",
      namePlaceholder: "Ваше имя",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      phoneLabel: "Телефон",
      optionalLabel: "необязательно",
      phonePlaceholder: "+996 000 000 000",
      messageLabel: "Сообщение",
      messagePlaceholder: "Опишите вопрос или заявку",
      submit: "Отправить",
      responseNote: "Используем контакты только для ответа на вашу заявку.",
      success: "Сообщение отправлено. Мы свяжемся с вами.",
      error: "Не удалось отправить сообщение. Попробуйте позже.",
    },
    info: {
      eyebrow: "FRAG // Центр связи",
      title: "Контакты",
      statusLabel: "Система готова",
      phoneLabel: "Телефон",
      emailLabel: "Email",
      addressLabel: "Адрес",
      emptyTitle: "Прямые каналы настраиваются",
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
      title: "Поможем с выбором и наличием",
      subtitle: "Напишите нам по товару, заказу или подбору.",
    },
  },
  en: {
    intro:
      "Ask about stock, builds, or orders. Leave a message or choose the channel that works best for you.",
    mapTitle: "Map",
    form: {
      eyebrow: "Contact channel // 01",
      title: "Leave a message",
      description:
        "Send the details and our team will reply using the contacts you provide.",
      nameLabel: "Name",
      namePlaceholder: "Your name",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      phoneLabel: "Phone",
      optionalLabel: "optional",
      phonePlaceholder: "+1 555 000 0000",
      messageLabel: "Message",
      messagePlaceholder: "Describe your question or request",
      submit: "Send",
      responseNote: "We use your contact details only to reply to this request.",
      success: "Message sent. We will contact you.",
      error: "Could not send the message. Try again later.",
    },
    info: {
      eyebrow: "FRAG // Comms center",
      title: "Contacts",
      statusLabel: "System ready",
      phoneLabel: "Phone",
      emailLabel: "Email",
      addressLabel: "Address",
      emptyTitle: "Direct channels are being configured",
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
      title: "We can help with gear and stock",
      subtitle: "Message us about products, orders, or selection.",
    },
  },
  kg: {
    intro:
      "Товарлар, сборкалар жана заказдар боюнча жооп беребиз. Билдирүү калтырыңыз же ыңгайлуу байланыш каналын тандаңыз.",
    mapTitle: "Карта",
    form: {
      eyebrow: "Байланыш каналы // 01",
      title: "Билдирүү калтыруу",
      description:
        "Сурооңузду жазыңыз — менеджер көрсөтүлгөн байланыш аркылуу жооп берет.",
      nameLabel: "Атыңыз",
      namePlaceholder: "Атыңыз",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      phoneLabel: "Телефон",
      optionalLabel: "милдеттүү эмес",
      phonePlaceholder: "+996 700 000 000",
      messageLabel: "Билдирүү",
      messagePlaceholder: "Сурооңузду же өтүнүчүңүздү жазыңыз",
      submit: "Жөнөтүү",
      responseNote: "Байланыш маалыматын сурооңузга жооп берүү үчүн гана колдонобуз.",
      success: "Билдирүү жөнөтүлдү. Биз сиз менен байланышабыз.",
      error: "Билдирүү жөнөтүлгөн жок. Кийинчерээк аракет кылыңыз.",
    },
    info: {
      eyebrow: "FRAG // Байланыш борбору",
      title: "Байланыш",
      statusLabel: "Система даяр",
      phoneLabel: "Телефон",
      emailLabel: "Email",
      addressLabel: "Дарек",
      emptyTitle: "Түз байланыш каналдары жөндөлүүдө",
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
      title: "Тандоого жана бар-жогуна жардам беребиз",
      subtitle: "Товар, заказ же тандоо боюнча бизге жазыңыз.",
    },
  },
};
