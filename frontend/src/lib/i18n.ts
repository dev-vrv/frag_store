import type { Metadata } from "next";

export const locales = ["ru", "en", "kg"] as const;
export const defaultLocale = "ru";
export const localeLabels: Record<Locale, string> = {
  ru: "RU",
  en: "EN",
  kg: "KG",
};

export type Locale = (typeof locales)[number];

export interface NavItemDictionary {
  href: string;
  label: string;
}

export interface NavDropdownDictionary {
  label: string;
  items: NavItemDictionary[];
}

export interface Dictionary {
  locale: Locale;
  metadata: {
    title: string;
    description: string;
  };
  header: {
    logo: string;
    navAriaLabel: string;
    nav: NavItemDictionary[];
    info: NavDropdownDictionary;
    cart: string;
    comparison: string;
    auth: string;
  };
  auth: {
    brand: string;
    loginTab: string;
    registerTab: string;
    loginWelcomeTitle: string;
    loginWelcomeText: string;
    registerWelcomeTitle: string;
    registerWelcomeText: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    confirmPasswordLabel: string;
    confirmPasswordPlaceholder: string;
    loginSubmit: string;
    registerSubmit: string;
    loginHint: string;
    registerHint: string;
  };
  hero: {
    eyebrow: string;
    titleStart: string;
    titleHighlight: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    metrics: Array<[string, string]>;
    systemCards: Array<[string, string]>;
    loadoutCore: string;
    timeline: string;
    live: string;
    scroll: string;
  };
  pages: Record<
    | "catalog"
    | "contacts"
    | "about"
    | "faq"
    | "auth"
    | "blog"
    | "cart"
    | "comparison"
    | "privacy"
    | "offer",
    {
      title: string;
      subtitle: string;
      badge: string;
      metadata: Metadata;
    }
  >;
}

const dictionaries: Record<Locale, Dictionary> = {
  ru: {
    locale: "ru",
    metadata: {
      title: "Frag Store",
      description: "Киберпанк-магазин gaming-девайсов и techwear-интерфейсов.",
    },
    header: {
      logo: "FRAG",
      navAriaLabel: "Основная навигация",
      nav: [
        { href: "/", label: "Главная" },
        { href: "/catalog", label: "Каталог" },
        { href: "/blog", label: "Блог" },
      ],
      info: {
        label: "Инфо",
        items: [
          { href: "/about", label: "О нас" },
          { href: "/faq", label: "FAQ" },
          { href: "/contacts", label: "Контакты" },
          { href: "/privacy", label: "Политика конфиденциальности" },
          { href: "/offer", label: "Договор оферты" },
        ],
      },
      cart: "Корзина",
      comparison: "Избранное",
      auth: "Войти",
    },
    auth: {
      brand: "Frag Store",
      loginTab: "Вход",
      registerTab: "Регистрация",
      loginWelcomeTitle: "С возвращением в Frag Store",
      loginWelcomeText:
        "Авторизуйся, чтобы открыть профиль, избранные сборки и быстрый доступ к cyber-drop уведомлениям.",
      registerWelcomeTitle: "Подключайся к Frag Store",
      registerWelcomeText:
        "Создай аккаунт для персонального loadout, истории заказов и раннего доступа к новым игровым девайсам.",
      emailLabel: "Email",
      emailPlaceholder: "you@frag.store",
      passwordLabel: "Пароль",
      passwordPlaceholder: "Введите пароль",
      phoneLabel: "Телефон",
      phonePlaceholder: "+996 000 000 000",
      confirmPasswordLabel: "Повтор пароля",
      confirmPasswordPlaceholder: "Повторите пароль",
      loginSubmit: "Войти",
      registerSubmit: "Создать аккаунт",
      loginHint: "Доступ к профилю и сохраненным сетапам.",
      registerHint: "Регистрация займет меньше минуты.",
    },
    hero: {
      eyebrow: "Frag Store // Техника онлайн",
      titleStart: "Игровая техника для",
      titleHighlight: "точного фрага",
      subtitle:
        "Мышки, клавиатуры, гарнитуры, коврики и аксессуары для ПК в темном cyberpunk-стиле. Собирай сетап, который выглядит агрессивно и играет быстро.",
      primaryCta: "В каталог",
      secondaryCta: "Смотреть новинки",
      metrics: [
        ["Мышки", "120+"],
        ["Клавиатуры", "80+"],
        ["Аксессуары", "24/7"],
      ],
      systemCards: [
        ["Игровые мышки", "120+"],
        ["Клавиатуры", "80+"],
      ],
      loadoutCore: "Центр сетапа",
      timeline: "Новинки недели",
      live: "В наличии",
      scroll: "Листай",
    },
    pages: {
      catalog: {
        title: "КАТАЛОГ",
        subtitle:
          "Скоро здесь появится витрина игровых девайсов, комплектующих и лимитированных cyber-drop коллекций.",
        badge: "Магазин",
        metadata: {
          title: "Каталог | Frag Store",
          description: "Каталог gaming-девайсов Frag Store.",
        },
      },
      contacts: {
        title: "КОНТАКТЫ",
        subtitle:
          "Свяжитесь с Frag Store по вопросам заказов, игровых сборок, наличия и партнерских предложений.",
        badge: "Связь",
        metadata: {
          title: "Контакты | Frag Store",
          description: "Контакты и поддержка Frag Store.",
        },
      },
      about: {
        title: "О НАС",
        subtitle:
          "FRAGSTORE - магазин игровой техники, комплектующих, компьютеров и периферии для продуманного сетапа.",
        badge: "О бренде",
        metadata: {
          title: "О нас | Frag Store",
          description: "О Frag Store и нашей cyberpunk gaming-экосистеме.",
        },
      },
      faq: {
        title: "FAQ",
        subtitle:
          "Ответы на частые вопросы о заказах, доставке, гарантии, возврате и подборе игровой техники.",
        badge: "Поддержка",
        metadata: {
          title: "FAQ | Frag Store",
          description: "Ответы на частые вопросы Frag Store.",
        },
      },
      blog: {
        title: "БЛОГ",
        subtitle:
          "Новости, обзоры и материалы Frag Store о gaming-девайсах, сетапах и cyber-drop коллекциях.",
        badge: "Лента",
        metadata: {
          title: "Блог | Frag Store",
          description: "Блог Frag Store с новостями и обзорами gaming-девайсов.",
        },
      },
      cart: {
        title: "КОРЗИНА",
        subtitle:
          "Здесь будут выбранные игровые девайсы, аксессуары и быстрый переход к оформлению заказа.",
        badge: "Заказ",
        metadata: {
          title: "Корзина | Frag Store",
          description: "Корзина заказов Frag Store.",
        },
      },
      comparison: {
        title: "ИЗБРАННОЕ",
        subtitle:
          "Сохраняйте любимые товары, собирайте шортлист сетапа и возвращайтесь к выбранным девайсам перед покупкой.",
        badge: "Выбор",
        metadata: {
          title: "Избранное | Frag Store",
          description: "Избранные gaming-девайсы Frag Store.",
        },
      },
      privacy: {
        title: "ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ",
        subtitle:
          "Как Frag Store обрабатывает контактные данные, заявки, сообщения и информацию о заказах.",
        badge: "Документы",
        metadata: {
          title: "Политика конфиденциальности | Frag Store",
          description: "Политика конфиденциальности Frag Store.",
        },
      },
      offer: {
        title: "ДОГОВОР ОФЕРТЫ",
        subtitle:
          "Основные условия покупки игровой техники, комплектующих, аксессуаров и готовых сетапов в Frag Store.",
        badge: "Документы",
        metadata: {
          title: "Договор оферты | Frag Store",
          description: "Договор оферты интернет-магазина Frag Store.",
        },
      },
      auth: {
        title: "AUTH",
        subtitle: "Вход и регистрация Frag Store.",
        badge: "Доступ",
        metadata: {
          title: "Auth | Frag Store",
          description: "Вход и регистрация аккаунта Frag Store.",
        },
      },
    },
  },
  en: {
    locale: "en",
    metadata: {
      title: "Frag Store",
      description: "Cyberpunk store for gaming gear and techwear interfaces.",
    },
    header: {
      logo: "FRAG",
      navAriaLabel: "Main navigation",
      nav: [
        { href: "/", label: "Home" },
        { href: "/catalog", label: "Catalog" },
        { href: "/blog", label: "Blog" },
      ],
      info: {
        label: "Маалымат",
        items: [
          { href: "/about", label: "About" },
          { href: "/faq", label: "FAQ" },
          { href: "/contacts", label: "Contacts" },
          { href: "/privacy", label: "Privacy Policy" },
          { href: "/offer", label: "Public Offer" },
        ],
      },
      cart: "Cart",
      comparison: "Favorites",
      auth: "Log in",
    },
    auth: {
      brand: "Frag Store",
      loginTab: "Log in",
      registerTab: "Register",
      loginWelcomeTitle: "Welcome back to Frag Store",
      loginWelcomeText:
        "Sign in to open your profile, saved builds, and fast access to cyber-drop alerts.",
      registerWelcomeTitle: "Join Frag Store",
      registerWelcomeText:
        "Create an account for a personal loadout, order history, and early access to new gaming gear.",
      emailLabel: "Email",
      emailPlaceholder: "you@frag.store",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter password",
      phoneLabel: "Phone",
      phonePlaceholder: "+1 555 000 0000",
      confirmPasswordLabel: "Confirm password",
      confirmPasswordPlaceholder: "Repeat password",
      loginSubmit: "Log in",
      registerSubmit: "Create account",
      loginHint: "Access your profile and saved setups.",
      registerHint: "Registration takes less than a minute.",
    },
    hero: {
      eyebrow: "Frag Store // Gear online",
      titleStart: "Gaming hardware for",
      titleHighlight: "clean frags",
      subtitle:
        "Mice, keyboards, headsets, mousepads, and PC accessories in a dark cyberpunk style. Build a setup that looks aggressive and plays fast.",
      primaryCta: "Enter catalog",
      secondaryCta: "New arrivals",
      metrics: [
        ["Mice", "120+"],
        ["Keyboards", "80+"],
        ["Accessories", "24/7"],
      ],
      systemCards: [
        ["Gaming mice", "120+"],
        ["Keyboards", "80+"],
      ],
      loadoutCore: "Setup Core",
      timeline: "Weekly Drops",
      live: "In stock",
      scroll: "Scroll",
    },
    pages: {
      catalog: {
        title: "CATALOG",
        subtitle:
          "A storefront for gaming devices, components, and limited cyber-drop collections is coming soon.",
        badge: "Дүкөн",
        metadata: {
          title: "Catalog | Frag Store",
          description: "Frag Store gaming gear catalog.",
        },
      },
      contacts: {
        title: "CONTACTS",
        subtitle:
          "Contact Frag Store about orders, gaming builds, stock availability, and partnership requests.",
        badge: "Contacts",
        metadata: {
          title: "Contacts | Frag Store",
          description: "Frag Store contacts and support.",
        },
      },
      about: {
        title: "ABOUT",
        subtitle:
          "FRAGSTORE is a gaming gear, components, computers, and peripherals store for carefully planned setups.",
        badge: "Бренд",
        metadata: {
          title: "About | Frag Store",
          description: "About Frag Store and our cyberpunk gaming ecosystem.",
        },
      },
      faq: {
        title: "FAQ",
        subtitle:
          "Answers to common questions about orders, delivery, warranty, returns, and gaming gear selection.",
        badge: "Support",
        metadata: {
          title: "FAQ | Frag Store",
          description: "Frag Store frequently asked questions.",
        },
      },
      blog: {
        title: "BLOG",
        subtitle:
          "News, reviews, and Frag Store notes about gaming gear, setups, and cyber-drop collections.",
        badge: "Feed",
        metadata: {
          title: "Blog | Frag Store",
          description: "Frag Store blog with gaming gear news and reviews.",
        },
      },
      cart: {
        title: "CART",
        subtitle:
          "Selected gaming gear, accessories, and a quick path to checkout will appear here.",
        badge: "Order",
        metadata: {
          title: "Cart | Frag Store",
          description: "Frag Store shopping cart.",
        },
      },
      comparison: {
        title: "FAVORITES",
        subtitle:
          "Save favorite products, build a setup shortlist, and return to selected gear before checkout.",
        badge: "Choice",
        metadata: {
          title: "Favorites | Frag Store",
          description: "Frag Store favorite gaming gear.",
        },
      },
      privacy: {
        title: "PRIVACY POLICY",
        subtitle:
          "How Frag Store processes contact details, requests, messages, and order information.",
        badge: "Docs",
        metadata: {
          title: "Privacy Policy | Frag Store",
          description: "Frag Store privacy policy.",
        },
      },
      offer: {
        title: "PUBLIC OFFER",
        subtitle:
          "Core purchase terms for gaming gear, components, accessories, and ready setups at Frag Store.",
        badge: "Docs",
        metadata: {
          title: "Public Offer | Frag Store",
          description: "Frag Store public offer agreement.",
        },
      },
      auth: {
        title: "AUTH",
        subtitle: "Frag Store login and registration.",
        badge: "Кирүү",
        metadata: {
          title: "Auth | Frag Store",
          description: "Log in or create a Frag Store account.",
        },
      },
    },
  },
  kg: {
    locale: "kg",
    metadata: {
      title: "Frag Store",
      description: "Gaming жабдыктары үчүн cyberpunk стилиндеги дүкөн.",
    },
    header: {
      logo: "FRAG",
      navAriaLabel: "Негизги навигация",
      nav: [
        { href: "/", label: "Башкы" },
        { href: "/catalog", label: "Каталог" },
        { href: "/blog", label: "Блог" },
      ],
      info: {
        label: "Маалымат",
        items: [
          { href: "/about", label: "Биз жөнүндө" },
          { href: "/faq", label: "FAQ" },
          { href: "/contacts", label: "Байланыш" },
          { href: "/privacy", label: "Купуялык саясаты" },
          { href: "/offer", label: "Оферта келишими" },
        ],
      },
      cart: "Себет",
      comparison: "Тандалгандар",
      auth: "Кирүү",
    },
    auth: {
      brand: "Frag Store",
      loginTab: "Кирүү",
      registerTab: "Катталуу",
      loginWelcomeTitle: "Frag Store'го кайра кош келиңиз",
      loginWelcomeText:
        "Профилди, сакталган сетаптарды жана cyber-drop билдирүүлөрүн ачуу үчүн кириңиз.",
      registerWelcomeTitle: "Frag Store'го кошулуңуз",
      registerWelcomeText:
        "Жеке loadout, заказ тарыхы жана жаңы gaming жабдыктарга эрте жетүү үчүн аккаунт түзүңүз.",
      emailLabel: "Email",
      emailPlaceholder: "you@frag.store",
      passwordLabel: "Сыр сөз",
      passwordPlaceholder: "Сыр сөздү жазыңыз",
      phoneLabel: "Телефон",
      phonePlaceholder: "+996 700 000 000",
      confirmPasswordLabel: "Сыр сөздү кайталоо",
      confirmPasswordPlaceholder: "Сыр сөздү кайталаңыз",
      loginSubmit: "Кирүү",
      registerSubmit: "Аккаунт түзүү",
      loginHint: "Профиль жана сакталган сетаптарга кирүү.",
      registerHint: "Катталуу бир мүнөттөн аз убакыт алат.",
    },
    hero: {
      eyebrow: "Frag Store // Техника онлайн",
      titleStart: "Так фраг үчүн",
      titleHighlight: "gaming техника",
      subtitle:
        "ПК үчүн мышкалар, клавиатуралар, гарнитуралар, ковриктер жана аксессуарлар. Кара-кызыл cyberpunk стилинде агрессивдүү жана тез сетап чогулт.",
      primaryCta: "Каталогго",
      secondaryCta: "Жаңы товарлар",
      metrics: [
        ["Мышкалар", "120+"],
        ["Клавиатура", "80+"],
        ["Аксессуар", "24/7"],
      ],
      systemCards: [
        ["Gaming мышкалар", "120+"],
        ["Клавиатуралар", "80+"],
      ],
      loadoutCore: "Сетап борбору",
      timeline: "Аптанын жаңылыктары",
      live: "Бар",
      scroll: "Төмөн",
    },
    pages: {
      catalog: {
        title: "КАТАЛОГ",
        subtitle:
          "Жакында бул жерде gaming түзмөктөрү, комплекттер жана лимиттелген cyber-drop коллекциялар чыгат.",
        badge: "Дүкөн",
        metadata: {
          title: "Каталог | Frag Store",
          description: "Frag Store gaming жабдыктарынын каталогу.",
        },
      },
      contacts: {
        title: "БАЙЛАНЫШ",
        subtitle:
          "Заказдар, gaming сборкалар, товарлардын бар-жогу жана өнөктөштүк боюнча Frag Store менен байланышыңыз.",
        badge: "Байланыш",
        metadata: {
          title: "Байланыш | Frag Store",
          description: "Frag Store байланыштары жана колдоо.",
        },
      },
      about: {
        title: "БИЗ ЖӨНҮНДӨ",
        subtitle:
          "FRAGSTORE - ойлонулган сетап үчүн gaming техника, комплекттер, компьютерлер жана периферия дүкөнү.",
        badge: "Бренд",
        metadata: {
          title: "Биз жөнүндө | Frag Store",
          description: "Frag Store жана биздин cyberpunk gaming экосистема.",
        },
      },
      faq: {
        title: "FAQ",
        subtitle:
          "Заказ, жеткирүү, кепилдик, кайтаруу жана gaming техникасын тандоо боюнча көп берилген суроолорго жооптор.",
        badge: "Колдоо",
        metadata: {
          title: "FAQ | Frag Store",
          description: "Frag Store боюнча көп берилген суроолор.",
        },
      },
      blog: {
        title: "БЛОГ",
        subtitle:
          "Gaming жабдыктары, сетаптар жана cyber-drop коллекциялар жөнүндө Frag Store жаңылыктары жана материалдары.",
        badge: "Тасма",
        metadata: {
          title: "Блог | Frag Store",
          description: "Frag Store gaming жаңылыктары жана обзорлору.",
        },
      },
      cart: {
        title: "СЕБЕТ",
        subtitle:
          "Тандалган gaming девайстар, аксессуарлар жана заказды тез жол-жоболоштуруу бул жерде чыгат.",
        badge: "Заказ",
        metadata: {
          title: "Себет | Frag Store",
          description: "Frag Store заказ себети.",
        },
      },
      comparison: {
        title: "ТАНДАЛГАНДАР",
        subtitle:
          "Жактырган товарларды сактап, сетап үчүн шортлист түзүп, сатып алардан мурун тандалган девайстарга кайтыңыз.",
        badge: "Тандоо",
        metadata: {
          title: "Тандалгандар | Frag Store",
          description: "Frag Store тандалган gaming девайстары.",
        },
      },
      privacy: {
        title: "КУПУЯЛЫК САЯСАТЫ",
        subtitle:
          "Frag Store байланыш маалыматтарын, билдирүүлөрдү, заявкаларды жана заказ маалыматтарын кантип иштетет.",
        badge: "Документтер",
        metadata: {
          title: "Купуялык саясаты | Frag Store",
          description: "Frag Store купуялык саясаты.",
        },
      },
      offer: {
        title: "ОФЕРТА КЕЛИШИМИ",
        subtitle:
          "Frag Store дүкөнүнөн gaming техника, комплекттер, аксессуарлар жана даяр сетаптарды сатып алуунун негизги шарттары.",
        badge: "Документтер",
        metadata: {
          title: "Оферта келишими | Frag Store",
          description: "Frag Store интернет-дүкөнүнүн оферта келишими.",
        },
      },
      auth: {
        title: "AUTH",
        subtitle: "Frag Store аккаунтуна кирүү жана катталуу.",
        badge: "Кирүү",
        metadata: {
          title: "Auth | Frag Store",
          description: "Frag Store аккаунтуна кирүү же жаңы аккаунт түзүү.",
        },
      },
    },
  },
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getDictionary(locale: Locale = defaultLocale) {
  return dictionaries[locale];
}

export function localizePath(href: string, locale: Locale) {
  if (locale === defaultLocale) {
    return href;
  }

  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}

export function stripLocaleFromPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && isLocale(firstSegment)) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }

  return pathname || "/";
}

export function getPageDictionary(
  locale: Locale,
  page: keyof Dictionary["pages"],
) {
  return getDictionary(locale).pages[page];
}
