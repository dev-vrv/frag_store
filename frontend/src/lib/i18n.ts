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
    firstNameLabel: string;
    firstNamePlaceholder: string;
    lastNameLabel: string;
    lastNamePlaceholder: string;
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
    errorFallback: string;
    loginSuccessNotice: string;
    registerSuccessNotice: string;
  };
  profile: {
    badge: string;
    title: string;
    subtitle: string;
    editTitle: string;
    editSubtitle: string;
    emailLabel: string;
    emailReadonlyHint: string;
    firstNameLabel: string;
    firstNamePlaceholder: string;
    lastNameLabel: string;
    lastNamePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    cityLabel: string;
    cityPlaceholder: string;
    addressLabel: string;
    addressPlaceholder: string;
    discountLabel: string;
    joinedLabel: string;
    twoFactorLabel: string;
    twoFactorToggle: string;
    emailVerified: string;
    emailNotVerified: string;
    verificationTitle: string;
    verificationSubtitle: string;
    verificationCodeLabel: string;
    verificationCodePlaceholder: string;
    sendCodeLabel: string;
    confirmCodeLabel: string;
    saveLabel: string;
    saveSuccess: string;
    saveSuccessNeedsVerification: string;
    verificationSent: string;
    verificationSuccess: string;
    errorFallback: string;
    ordersBadge: string;
    ordersTitle: string;
    ordersSubtitle: string;
    ordersEmptyTitle: string;
    ordersEmptyText: string;
    catalogLabel: string;
    orderStatusLabel: string;
    orderDateLabel: string;
    orderTotalLabel: string;
    orderDiscountLabel: string;
    orderQuantityLabel: string;
    logoutLabel: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    microcopy: string;
    chips: string[];
    panelEyebrow: string;
    panelTitle: string;
    panelText: string;
    orbitLabels: string[];
    signalLabel: string;
    signalValue: string;
    scroll: string;
  };
  loadout: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    signalLabel: string;
    categoryCta: string;
    categoryAriaLabel: string;
    cards: Array<{
      title: string;
      description: string;
      signal: string;
      stat: string;
    }>;
  };
  service: {
    eyebrow: string;
    title: string;
    subtitle: string;
    metrics: Array<[string, string]>;
    cards: Array<{
      title: string;
      description: string;
      signal: string;
    }>;
  };
  featured: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    priceLabel: string;
    productCta: string;
    detailsCta: string;
    favoriteLabel: string;
    products: Array<{
      name: string;
      category: string;
      description: string;
      price: string;
      oldPrice?: string;
      visual: "mice" | "keyboards" | "headsets" | "components" | "accessories" | "setups";
      badges: Array<{
        label: string;
        variant: "green" | "violet" | "red" | "cyan";
      }>;
    }>;
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
    | "profile"
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
      firstNameLabel: "Имя",
      firstNamePlaceholder: "Алекс",
      lastNameLabel: "Фамилия",
      lastNamePlaceholder: "Иванов",
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
      errorFallback: "Не удалось выполнить запрос. Попробуйте еще раз.",
      loginSuccessNotice: "Вход выполнен. Перенаправляем в профиль...",
      registerSuccessNotice: "Аккаунт создан. Перенаправляем в профиль...",
    },
    profile: {
      badge: "Профиль",
      title: "ЛИЧНЫЙ КАБИНЕТ",
      subtitle:
        "Управляйте профилем, включайте защиту входа и следите за заказами в одном месте.",
      editTitle: "Данные профиля",
      editSubtitle: "Обновляйте контактные данные, адрес доставки и настройки безопасности.",
      emailLabel: "Email",
      emailReadonlyHint: "Email недоступен для редактирования.",
      firstNameLabel: "Имя",
      firstNamePlaceholder: "Алекс",
      lastNameLabel: "Фамилия",
      lastNamePlaceholder: "Иванов",
      phoneLabel: "Телефон",
      phonePlaceholder: "+996 000 000 000",
      cityLabel: "Адрес доставки",
      cityPlaceholder: "Улица, дом, квартира",
      addressLabel: "Адрес доставки",
      addressPlaceholder: "Улица, дом, квартира",
      discountLabel: "Персональная скидка",
      joinedLabel: "Дата регистрации",
      twoFactorLabel: "Двухфакторная защита",
      twoFactorToggle: "Включить 2FA",
      emailVerified: "Email подтвержден. Можно включить дополнительную защиту входа.",
      emailNotVerified: "Для включения 2FA нужно подтвердить email кодом из письма.",
      verificationTitle: "Подтверждение email",
      verificationSubtitle:
        "Отправьте код на email, затем введите его здесь. После подтверждения 2FA активируется.",
      verificationCodeLabel: "Код подтверждения",
      verificationCodePlaceholder: "123456",
      sendCodeLabel: "Отправить код",
      confirmCodeLabel: "Подтвердить",
      saveLabel: "Сохранить изменения",
      saveSuccess: "Профиль обновлен.",
      saveSuccessNeedsVerification: "Профиль обновлен. Подтвердите email, чтобы включить 2FA.",
      verificationSent: "Код отправлен на email.",
      verificationSuccess: "Email подтвержден, 2FA активирована.",
      errorFallback: "Не удалось выполнить запрос. Попробуйте еще раз.",
      ordersBadge: "Заказы",
      ordersTitle: "История заказов",
      ordersSubtitle: "Здесь отображаются оформленные заказы, их статус и состав.",
      ordersEmptyTitle: "Пока без заказов",
      ordersEmptyText: "Когда появится первый заказ, он отобразится здесь вместе с составом и суммой.",
      catalogLabel: "Перейти в каталог",
      orderStatusLabel: "Статус",
      orderDateLabel: "Дата",
      orderTotalLabel: "Итого",
      orderDiscountLabel: "Скидка",
      orderQuantityLabel: "Кол-во",
      logoutLabel: "Выйти",
    },
    hero: {
      eyebrow: "Frag Store // Gaming Gear",
      title: "Техника для гейминга и сильного сетапа",
      subtitle:
        "Мыши, клавиатуры, гарнитуры, коврики и аксессуары, которые реально влияют на комфорт, реакцию и контроль в игре.",
      primaryCta: "Перейти в каталог",
      secondaryCta: "Открыть блог",
      microcopy:
        "Собираем сетап под жанр, бюджет и стиль игры: от одного девайса до полностью укомплектованного рабочего места.",
      chips: ["FPS", "Ranked", "Low Latency", "RGB Control"],
      panelEyebrow: "Combat sync",
      panelTitle: "Enter the match",
      panelText:
        "Быстрый вход в категории и железо, которое ощущается как часть игрового рефлекса, а не просто витрина.",
      orbitLabels: ["Headsets", "Keyboards", "Mice", "Mousepads"],
      signalLabel: "Статус сигнала",
      signalValue: "Target locked",
      scroll: "Листай",
    },
    loadout: {
      eyebrow: "Ключевые категории",
      title: "С чего обычно собирают сильный игровой сетап",
      subtitle:
        "Начните с нужной категории: звук, управление, точность и порядок на столе.",
      primaryCta: "Открыть каталог",
      secondaryCta: "Связаться с нами",
      signalLabel: "Сигнал",
      categoryCta: "Открыть категорию",
      categoryAriaLabel: "Открыть категорию в каталоге",
      cards: [
        {
          title: "Гарнитуры",
          description:
            "Закрытые и открытые модели для чистого позиционирования, командной связи и длинных игровых сессий.",
          signal: "7.1 / Noise Cancel",
          stat: "24 модели",
        },
        {
          title: "Клавиатуры",
          description:
            "Механика и low-profile решения с быстрым откликом, хотсвапом и агрессивной RGB-подачей.",
          signal: "Hot Swap / RGB",
          stat: "18 серий",
        },
        {
          title: "Мыши",
          description:
            "Легкие корпуса, точные сенсоры и формы под claw, palm и fingertip для соревновательной игры.",
          signal: "49 g / 26K DPI",
          stat: "32 варианта",
        },
        {
          title: "Control-аксессуары",
          description:
            "Коврики, стойки, USB-хабы и кабели, которые собирают рабочую зону в цельный cyberpunk-loadout.",
          signal: "Desk Flow / Cable Sync",
          stat: "40+ позиций",
        },
      ],
    },
    service: {
      eyebrow: "Почему покупают у нас",
      title: "Покупка без лишнего риска",
      subtitle:
        "Оригинальная техника, понятная гарантия, живое наличие и помощь с выбором, если нужен сетап под конкретные игры и бюджет.",
      metrics: [
        ["Оригинальная техника", "100%"],
        ["Гарантия", "12 мес"],
        ["Поддержка", "7 дней"],
      ],
      cards: [
        {
          title: "Проверенные бренды",
          description:
            "Работаем только с актуальными линейками gaming-периферии и аксессуаров без серого ассортимента.",
          signal: "Официальные поставки",
        },
        {
          title: "Подбор под сетап",
          description:
            "Помогаем собрать совместимый loadout: гарнитура, коврик, мышь, клавиатура и полезные desktop-аксессуары.",
          signal: "Синхронный подбор",
        },
        {
          title: "Быстрая логистика",
          description:
            "Фокус на наличии и понятной доставке, чтобы клиент видел не только стиль, но и реальную готовность к заказу.",
          signal: "Быстрая отгрузка",
        },
      ],
    },
    featured: {
      eyebrow: "Лидеры продаж",
      title: "Хиты для гейминга",
      subtitle: "Проверенные модели и сильные новинки.",
      primaryCta: "Смотреть все товары",
      secondaryCta: "Смотреть новинки",
      priceLabel: "Цена",
      productCta: "Открыть",
      detailsCta: "Подробнее",
      favoriteLabel: "В избранное",
      products: [
        {
          name: "HX-7 Phantom",
          category: "Игровая гарнитура",
          description: "Гарнитура 7.1 с низкой задержкой, съемным микрофоном и точным позиционированием в шутерах.",
          price: "12 990 сом",
          oldPrice: "14 490 сом",
          visual: "headsets",
          badges: [
            { label: "Хит", variant: "red" },
            { label: "Скидка", variant: "green" },
          ],
        },
        {
          name: "Kurai TKL",
          category: "Механическая клавиатура",
          description: "TKL-клавиатура с hot-swap, rapid trigger и плотной сборкой для соревновательной игры.",
          price: "9 490 сом",
          oldPrice: "10 990 сом",
          visual: "keyboards",
          badges: [
            { label: "Pro", variant: "violet" },
            { label: "Скидка", variant: "green" },
          ],
        },
        {
          name: "Vanta Air Pro",
          category: "Беспроводная мышь",
          description: "Легкая мышь 49 г с сенсором 26K и быстрым откликом для claw и fingertip хвата.",
          price: "7 990 сом",
          visual: "mice",
          badges: [
            { label: "Новинка", variant: "cyan" },
            { label: "Хит", variant: "red" },
          ],
        },
        {
          name: "Zero Drag Mat XL",
          category: "Игровой коврик",
          description: "Большой коврик с контролируемым скольжением и стабильной поверхностью под резкие флики.",
          price: "3 490 сом",
          oldPrice: "3 990 сом",
          visual: "accessories",
          badges: [
            { label: "Скидка", variant: "green" },
          ],
        },
      ],
    },
    pages: {
      catalog: {
        title: "КАТАЛОГ",
        subtitle:
          "Игровые девайсы, комплектующие и актуальные подборки.",
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
      profile: {
        title: "ПРОФИЛЬ",
        subtitle:
          "Личный кабинет пользователя Frag Store с контактными данными и персональным доступом к следующим этапам покупки.",
        badge: "Аккаунт",
        metadata: {
          title: "Профиль | Frag Store",
          description: "Профиль пользователя Frag Store.",
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
      firstNameLabel: "First name",
      firstNamePlaceholder: "Alex",
      lastNameLabel: "Last name",
      lastNamePlaceholder: "Morgan",
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
      errorFallback: "Request failed. Please try again.",
      loginSuccessNotice: "Signed in. Redirecting to your profile...",
      registerSuccessNotice: "Account created. Redirecting to your profile...",
    },
    profile: {
      badge: "Profile",
      title: "ACCOUNT PROFILE",
      subtitle:
        "Manage your account details, enable extra sign-in protection, and review your orders in one place.",
      editTitle: "Profile Details",
      editSubtitle: "Update contact data, delivery address, and security settings.",
      emailLabel: "Email",
      emailReadonlyHint: "Email cannot be edited.",
      firstNameLabel: "First name",
      firstNamePlaceholder: "Alex",
      lastNameLabel: "Last name",
      lastNamePlaceholder: "Morgan",
      phoneLabel: "Phone",
      phonePlaceholder: "+1 555 000 0000",
      cityLabel: "Delivery address",
      cityPlaceholder: "Street, building, apartment",
      addressLabel: "Delivery address",
      addressPlaceholder: "Street, building, apartment",
      discountLabel: "Personal discount",
      joinedLabel: "Joined",
      twoFactorLabel: "Two-factor protection",
      twoFactorToggle: "Enable 2FA",
      emailVerified: "Your email is verified. Extra sign-in protection can be enabled.",
      emailNotVerified: "Email verification is required before 2FA can be enabled.",
      verificationTitle: "Verify email",
      verificationSubtitle:
        "Send a code to your email, then enter it here. Once confirmed, 2FA will be enabled.",
      verificationCodeLabel: "Verification code",
      verificationCodePlaceholder: "123456",
      sendCodeLabel: "Send code",
      confirmCodeLabel: "Confirm",
      saveLabel: "Save changes",
      saveSuccess: "Profile updated.",
      saveSuccessNeedsVerification: "Profile updated. Verify your email to finish enabling 2FA.",
      verificationSent: "Verification code sent to your email.",
      verificationSuccess: "Email verified, 2FA enabled.",
      errorFallback: "Request failed. Please try again.",
      ordersBadge: "Orders",
      ordersTitle: "Order History",
      ordersSubtitle: "Your placed orders, statuses, and line items appear here.",
      ordersEmptyTitle: "No orders yet",
      ordersEmptyText: "Your first completed checkout will appear here with full order details.",
      catalogLabel: "Open catalog",
      orderStatusLabel: "Status",
      orderDateLabel: "Date",
      orderTotalLabel: "Total",
      orderDiscountLabel: "Discount",
      orderQuantityLabel: "Qty",
      logoutLabel: "Log out",
    },
    hero: {
      eyebrow: "Frag Store // Gaming Gear",
      title: "Gear for gaming and a stronger setup",
      subtitle:
        "Mice, keyboards, headsets, mousepads, and accessories that make a real difference in comfort, response, and control.",
      primaryCta: "Open catalog",
      secondaryCta: "Open blog",
      microcopy:
        "We help build setups by genre, budget, and playstyle, from a single upgrade to a complete desk loadout.",
      chips: ["FPS", "Ranked", "Low Latency", "RGB Control"],
      panelEyebrow: "Combat sync",
      panelTitle: "Enter the match",
      panelText:
        "Fast access to categories and hardware that feels wired into gameplay instead of just sitting on a shelf.",
      orbitLabels: ["Headsets", "Keyboards", "Mice", "Mousepads"],
      signalLabel: "Signal status",
      signalValue: "Target locked",
      scroll: "Scroll",
    },
    loadout: {
      eyebrow: "Core Categories",
      title: "Where most gaming setups begin",
      subtitle:
        "Start with the category that matters most: sound, control, precision, or desk organization.",
      primaryCta: "Open catalog",
      secondaryCta: "Contact us",
      signalLabel: "Frag Signal",
      categoryCta: "Open category",
      categoryAriaLabel: "Open category in catalog",
      cards: [
        {
          title: "Headsets",
          description:
            "Closed and open-back options for clean positioning, clear comms, and long gaming sessions.",
          signal: "7.1 / Noise Cancel",
          stat: "24 models",
        },
        {
          title: "Keyboards",
          description:
            "Mechanical and low-profile boards with fast actuation, hot swap support, and aggressive RGB character.",
          signal: "Hot Swap / RGB",
          stat: "18 lines",
        },
        {
          title: "Mice",
          description:
            "Lightweight shells, precise sensors, and shapes tuned for claw, palm, and fingertip playstyles.",
          signal: "49 g / 26K DPI",
          stat: "32 options",
        },
        {
          title: "Control Accessories",
          description:
            "Mousepads, stands, USB hubs, and cables that complete the desk zone into one cyberpunk loadout.",
          signal: "Desk Flow / Cable Sync",
          stat: "40+ items",
        },
      ],
    },
    service: {
      eyebrow: "Why Buy Here",
      title: "A cleaner buying experience",
      subtitle:
        "Authentic gear, clear warranty terms, real stock visibility, and help choosing equipment for your games and budget.",
      metrics: [
        ["Authentic gear", "100%"],
        ["Warranty", "12 mo"],
        ["Support", "7 days"],
      ],
      cards: [
        {
          title: "Verified brands",
          description:
            "We focus on current gaming peripheral lines and accessories instead of gray-market assortment.",
          signal: "Official Supply",
        },
        {
          title: "Setup guidance",
          description:
            "We help users build a compatible loadout across headsets, pads, mice, keyboards, and desk accessories.",
          signal: "Setup Match",
        },
        {
          title: "Fast logistics",
          description:
            "The offer is built around stock visibility and clear delivery expectations, not just atmosphere and visuals.",
          signal: "Fast Dispatch",
        },
      ],
    },
    featured: {
      eyebrow: "Best Sellers",
      title: "Gaming best sellers",
      subtitle: "Proven picks and strong new arrivals.",
      primaryCta: "Browse all products",
      secondaryCta: "See new arrivals",
      priceLabel: "Drop Price",
      productCta: "Open",
      detailsCta: "Details",
      favoriteLabel: "Add to favorites",
      products: [
        {
          name: "HX-7 Phantom",
          category: "Gaming Headset",
          description: "A 7.1 headset with low latency, detachable mic, and clean positional audio for shooters.",
          price: "KGS 12,990",
          oldPrice: "KGS 14,490",
          visual: "headsets",
          badges: [
            { label: "Hit", variant: "red" },
            { label: "Sale", variant: "green" },
          ],
        },
        {
          name: "Kurai TKL",
          category: "Mechanical Keyboard",
          description: "A TKL board with hot-swap support, rapid trigger response, and a dense competitive build.",
          price: "KGS 9,490",
          oldPrice: "KGS 10,990",
          visual: "keyboards",
          badges: [
            { label: "Pro", variant: "violet" },
            { label: "Sale", variant: "green" },
          ],
        },
        {
          name: "Vanta Air Pro",
          category: "Wireless Mouse",
          description: "A 49 g wireless mouse with a 26K sensor and fast response for claw and fingertip play.",
          price: "KGS 7,990",
          visual: "mice",
          badges: [
            { label: "New", variant: "cyan" },
            { label: "Hit", variant: "red" },
          ],
        },
        {
          name: "Zero Drag Mat XL",
          category: "Gaming Mousepad",
          description: "A large control surface built for stable tracking and confident flicks in tactical FPS play.",
          price: "KGS 3,490",
          oldPrice: "KGS 3,990",
          visual: "accessories",
          badges: [
            { label: "Sale", variant: "green" },
          ],
        },
      ],
    },
    pages: {
      catalog: {
        title: "CATALOG",
        subtitle:
          "Gaming devices, components, and current curated drops.",
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
      profile: {
        title: "PROFILE",
        subtitle:
          "Your Frag Store account dashboard with contact details and personal access to the next purchase steps.",
        badge: "Account",
        metadata: {
          title: "Profile | Frag Store",
          description: "Frag Store user profile.",
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
      firstNameLabel: "Атыңыз",
      firstNamePlaceholder: "Алекс",
      lastNameLabel: "Фамилия",
      lastNamePlaceholder: "Иванов",
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
      errorFallback: "Сурам аткарылган жок. Кайра аракет кылыңыз.",
      loginSuccessNotice: "Кирүү аяктады. Профилге багыттап жатабыз...",
      registerSuccessNotice: "Аккаунт түзүлдү. Профилге багыттап жатабыз...",
    },
    profile: {
      badge: "Профиль",
      title: "ЖЕКЕ КАБИНЕТ",
      subtitle:
        "Профилди башкарыңыз, кирүү коргоосун күйгүзүңүз жана заказдарды бир жерден көзөмөлдөңүз.",
      editTitle: "Профиль маалыматы",
      editSubtitle: "Байланыш маалыматын, жеткирүү дарегин жана коопсуздук жөндөөлөрүн жаңыртыңыз.",
      emailLabel: "Email",
      emailReadonlyHint: "Email өзгөртүлбөйт.",
      firstNameLabel: "Атыңыз",
      firstNamePlaceholder: "Алекс",
      lastNameLabel: "Фамилия",
      lastNamePlaceholder: "Иванов",
      phoneLabel: "Телефон",
      phonePlaceholder: "+996 700 000 000",
      cityLabel: "Жеткирүү дареги",
      cityPlaceholder: "Көчө, үй, батир",
      addressLabel: "Жеткирүү дареги",
      addressPlaceholder: "Көчө, үй, батир",
      discountLabel: "Жеке арзандатуу",
      joinedLabel: "Катталган күнү",
      twoFactorLabel: "Эки факторлуу коргоо",
      twoFactorToggle: "2FA күйгүзүү",
      emailVerified: "Email тастыкталган. Кошумча кирүү коргоосун күйгүзсө болот.",
      emailNotVerified: "2FA күйгүзүү үчүн email'ди каттагы код менен тастыктоо керек.",
      verificationTitle: "Email тастыктоо",
      verificationSubtitle:
        "Email'ге код жөнөтүп, андан кийин бул жерге киргизиңиз. Тастыкталгандан кийин 2FA иштейт.",
      verificationCodeLabel: "Тастыктоо коду",
      verificationCodePlaceholder: "123456",
      sendCodeLabel: "Код жөнөтүү",
      confirmCodeLabel: "Тастыктоо",
      saveLabel: "Өзгөртүүлөрдү сактоо",
      saveSuccess: "Профиль жаңыртылды.",
      saveSuccessNeedsVerification: "Профиль жаңыртылды. 2FA күйгүзүү үчүн email'ди тастыктаңыз.",
      verificationSent: "Код email'ге жөнөтүлдү.",
      verificationSuccess: "Email тастыкталды, 2FA күйгүзүлдү.",
      errorFallback: "Сурам аткарылган жок. Кайра аракет кылыңыз.",
      ordersBadge: "Заказдар",
      ordersTitle: "Заказ тарыхы",
      ordersSubtitle: "Бул жерде жасалган заказдар, алардын абалы жана курамы көрсөтүлөт.",
      ordersEmptyTitle: "Азырынча заказ жок",
      ordersEmptyText: "Биринчи заказ чыккандан кийин бул жерде суммасы жана курамы менен көрүнөт.",
      catalogLabel: "Каталогго өтүү",
      orderStatusLabel: "Абалы",
      orderDateLabel: "Дата",
      orderTotalLabel: "Жалпы",
      orderDiscountLabel: "Арзандатуу",
      orderQuantityLabel: "Саны",
      logoutLabel: "Чыгуу",
    },
    hero: {
      eyebrow: "Frag Store // Gaming Gear",
      title: "Гейминг жана күчтүү сетап үчүн техника",
      subtitle:
        "Оюндагы комфортко, реакцияга жана так башкарууга таасир берген чычкандар, клавиатуралар, гарнитуралар жана аксессуарлар.",
      primaryCta: "Каталогду ачуу",
      secondaryCta: "Блогду ачуу",
      microcopy:
        "Биз сетапты жанрга, бюджетке жана оюн стилине жараша чогултабыз: бир девайстан баштап толук жумуш аймагына чейин.",
      chips: ["FPS", "Ranked", "Low Latency", "RGB Control"],
      panelEyebrow: "Combat sync",
      panelTitle: "Enter the match",
      panelText:
        "Категорияларга тез кирүү жана оюн реакциясынын бир бөлүгү болуп сезилген жабдыктар.",
      orbitLabels: ["Headsets", "Keyboards", "Mice", "Mousepads"],
      signalLabel: "Сигнал абалы",
      signalValue: "Target locked",
      scroll: "Төмөн",
    },
    loadout: {
      eyebrow: "Негизги категориялар",
      title: "Күчтүү оюн сетабы көбүнчө ушул жерден башталат",
      subtitle:
        "Алгач керектүү багытты тандаңыз: үн, башкаруу, тактык же стол үстүндөгү тартип.",
      primaryCta: "Каталогду ачуу",
      secondaryCta: "Бизге жазуу",
      signalLabel: "Сигнал",
      categoryCta: "Категорияны ачуу",
      categoryAriaLabel: "Каталогдогу категорияны ачуу",
      cards: [
        {
          title: "Гарнитуралар",
          description:
            "Так позициялоо, таза үн байланышы жана узак оюн сессиялары үчүн жабык жана ачык моделдер.",
          signal: "7.1 / Noise Cancel",
          stat: "24 модель",
        },
        {
          title: "Клавиатуралар",
          description:
            "Тез жооп берген, hot swap колдогон жана күчтүү RGB мүнөзү бар механикалык жана low-profile чечимдер.",
          signal: "Hot Swap / RGB",
          stat: "18 серия",
        },
        {
          title: "Чычкандар",
          description:
            "Жеңил корпус, так сенсор жана claw, palm, fingertip стилине ылайык формалар.",
          signal: "49 g / 26K DPI",
          stat: "32 вариант",
        },
        {
          title: "Control-аксессуарлар",
          description:
            "Килемчелер, стенддер, USB-хабдар жана кабелдер жумуш аймагын толук cyberpunk-loadout кылып чогултат.",
          signal: "Desk Flow / Cable Sync",
          stat: "40+ позиция",
        },
      ],
    },
    service: {
      eyebrow: "Эмнеге бизден алышат",
      title: "Ашыкча тобокелсиз сатып алуу",
      subtitle:
        "Оригинал техника, түшүнүктүү кепилдик, реалдуу бар-жок абалы жана сиздин оюндар менен бюджетиңизге ылайык тандоо боюнча жардам.",
      metrics: [
        ["Оригинал техника", "100%"],
        ["Кепилдик", "12 ай"],
        ["Колдоо", "7 күн"],
      ],
      cards: [
        {
          title: "Текшерилген бренддер",
          description:
            "Биз актуалдуу gaming-периферия жана аксессуар линиялары менен иштейбиз, күмөндүү ассортименти жок.",
          signal: "Расмий жеткирүү",
        },
        {
          title: "Сетап тандоо",
          description:
            "Гарнитура, килемче, чычкан, клавиатура жана desk-аксессуарларды бир-бирине тууралап тандоого жардам беребиз.",
          signal: "Туура шайкештик",
        },
        {
          title: "Тез логистика",
          description:
            "Сунуш товар бар экенин жана жеткирүү шарттарын түшүнүктүү көрсөтүүгө курулган.",
          signal: "Тез жөнөтүү",
        },
      ],
    },
    featured: {
      eyebrow: "Сатуу лидерлери",
      title: "Гейминг хиттери",
      subtitle: "Текшерилген моделдер жана күчтүү жаңылыктар.",
      primaryCta: "Бардык товарларды көрүү",
      secondaryCta: "Жаңы товарларды көрүү",
      priceLabel: "Баасы",
      productCta: "Ачуу",
      detailsCta: "Кененирээк",
      favoriteLabel: "Тандалгандарга",
      products: [
        {
          name: "HX-7 Phantom",
          category: "Gaming гарнитура",
          description: "Төмөн кечигүү, алынуучу микрофон жана так позициялоо менен 7.1 гарнитура.",
          price: "12 990 сом",
          oldPrice: "14 490 сом",
          visual: "headsets",
          badges: [
            { label: "Хит", variant: "red" },
            { label: "Арзан", variant: "green" },
          ],
        },
        {
          name: "Kurai TKL",
          category: "Механикалык клавиатура",
          description: "Hot-swap жана rapid trigger колдоосу бар TKL-клавиатура, атаандаштык оюнга ылайыкталган.",
          price: "9 490 сом",
          oldPrice: "10 990 сом",
          visual: "keyboards",
          badges: [
            { label: "Pro", variant: "violet" },
            { label: "Арзан", variant: "green" },
          ],
        },
        {
          name: "Vanta Air Pro",
          category: "Зымсыз чычкан",
          description: "26K сенсор жана тез жооп менен claw жана fingertip үчүн жеңил 49 г чычкан.",
          price: "7 990 сом",
          visual: "mice",
          badges: [
            { label: "Жаңы", variant: "cyan" },
            { label: "Хит", variant: "red" },
          ],
        },
        {
          name: "Zero Drag Mat XL",
          category: "Gaming килемче",
          description: "Так кыймыл жана туруктуу флик үчүн чоң control-килемче.",
          price: "3 490 сом",
          oldPrice: "3 990 сом",
          visual: "accessories",
          badges: [
            { label: "Арзан", variant: "green" },
          ],
        },
      ],
    },
    pages: {
      catalog: {
        title: "КАТАЛОГ",
        subtitle:
          "Gaming түзмөктөрү, комплекттер жана актуалдуу тандоолор.",
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
      profile: {
        title: "ПРОФИЛЬ",
        subtitle:
          "Frag Store колдонуучусунун жеке кабинети байланыш маалыматтары жана кийинки сатып алуу кадамдарына кирүү менен.",
        badge: "Аккаунт",
        metadata: {
          title: "Профиль | Frag Store",
          description: "Frag Store колдонуучусунун профили.",
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
