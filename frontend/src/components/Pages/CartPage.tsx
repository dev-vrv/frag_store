"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCheck,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Ticket,
  Trash2,
  Truck,
} from "lucide-react";

import {
  CyberBadge,
  CyberButton,
  CyberCard,
  CyberCardContent,
  CyberDialog,
  CyberDialogContent,
  CyberDialogDescription,
  CyberDialogFooter,
  CyberDialogHeader,
  CyberDialogTitle,
  CyberDialogTrigger,
  CyberInput,
  CyberNativeSelect,
  CyberTextarea,
} from "@/components/cyber";
import { useCart } from "@/components/Cart/CartProvider";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { ProductDetailsDialog } from "@/components/Products/ProductDetailsDialog";
import { type AuthUser } from "@/lib/auth";
import {
  fetchCartSummary,
  formatCartMoney,
  normalizeCartItems,
  submitCartCheckout,
  type CartCheckoutResponse,
  type CartSummary,
} from "@/lib/cart";
import {
  getProductBySlug,
  type Product,
} from "@/lib/products";
import { type Dictionary, type Locale, localizePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface CartPageProps {
  locale: Locale;
  dictionary: Dictionary;
  user: AuthUser | null;
}

type DeliveryMethod = "courier" | "pickup";

interface CartFormState {
  delivery_method: DeliveryMethod;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  comment: string;
}

const cartText = {
  ru: {
    badge: "Корзина",
    title: "Готово к оформлению",
    subtitle:
      "Проверь состав, скорректируй количество и отправь заказ. Итоги считаются по живым данным склада и промокодам.",
    emptyTitle: "Корзина пуста",
    emptyText: "Добавьте товары из каталога, и здесь появится полный состав заказа.",
    catalogCta: "Перейти в каталог",
    clear: "Очистить корзину",
    summary: "Сводка",
    items: "Позиции",
    subtotal: "Сумма",
    discount: "Скидка",
    promoDiscount: "Промокод",
    total: "Итого",
    promoLabel: "Промокод",
    promoPlaceholder: "FRAG10",
    promoHint: "Промокод применяется только после отдельной проверки.",
    promoApply: "Проверить промокод",
    promoApplied: "Промокод активирован",
    clearConfirmTitle: "Очистить корзину?",
    clearConfirmText: "Все товары будут удалены из корзины без возможности восстановления.",
    cancel: "Отмена",
    confirmClear: "Очистить",
    contacts: "Контакты",
    contactsHint: "Эти данные нужны для подтверждения заказа и согласования доставки.",
    profileAutofill: "Данные из профиля подставлены автоматически.",
    delivery: "Доставка",
    deliveryHint: "Укажите один полный адрес для доставки или удобную точку самовывоза.",
    customerName: "Имя",
    customerEmail: "Email",
    customerPhone: "Телефон",
    customerAddress: "Адрес",
    comment: "Комментарий",
    commentPlaceholder: "Например: позвонить за час, собрать заказ в один чек, уточнить совместимость.",
    deliveryMethod: "Способ получения",
    courier: "Курьер",
    pickup: "Самовывоз",
    checkout: "Оформить заказ",
    checkoutPending: "Оформляем...",
    successTitle: "Заказ отправлен",
    successText: "Менеджер подтвердит наличие, стоимость и детали доставки.",
    guestSuccessText: "Заказ сформирован. Наш менеджер свяжется с вами для подтверждения и уточнения деталей.",
    successRedirect: "Автопереход в раздел заказов через",
    guestSuccessRedirect: "Автопереход в каталог через",
    successRedirectSeconds: "сек.",
    successViewOrders: "Перейти к заказам",
    successGoToCatalog: "Перейти в каталог",
    orderNumber: "Номер заказа",
    continueShopping: "Продолжить покупки",
    qty: "Кол-во",
    available: "В наличии",
    itemTotal: "Сумма позиции",
    unitPrice: "Цена за шт.",
    colorLabel: "Цвет",
    details: "Подробнее",
    detailsLead: "Полные характеристики и описание",
    specsLabel: "Спецификации",
    highlightsLabel: "Ключевые преимущества",
    sku: "Артикул",
    brandLabel: "Марка",
    categoryLabel: "Категория",
    availabilityLabel: "Наличие",
    inStock: "В наличии",
    outOfStock: "Нет в наличии",
    addToCart: "В корзину",
    alreadyInCart: "Уже в корзине",
    close: "Закрыть",
    remove: "Удалить",
    loading: "Пересчитываем корзину...",
    stockWarning: "Количество скорректируйте под доступный остаток.",
    secure: "Расчёт и остатки проверяются на сервере перед оформлением.",
    requiredError: "Заполните обязательные поля.",
  },
  en: {
    badge: "Cart",
    title: "Ready for checkout",
    subtitle:
      "Review the items, adjust quantities, and submit the order. Totals are calculated against live stock and promo data.",
    emptyTitle: "Cart is empty",
    emptyText: "Add products from the catalog and the full order composition will appear here.",
    catalogCta: "Go to catalog",
    clear: "Clear cart",
    summary: "Summary",
    items: "Items",
    subtotal: "Subtotal",
    discount: "Discount",
    promoDiscount: "Promo code",
    total: "Total",
    promoLabel: "Promo code",
    promoPlaceholder: "FRAG10",
    promoHint: "The promo code is applied only after explicit validation.",
    promoApply: "Check promo code",
    promoApplied: "Promo code applied",
    clearConfirmTitle: "Clear cart?",
    clearConfirmText: "All items will be removed from the cart and cannot be restored.",
    cancel: "Cancel",
    confirmClear: "Clear",
    contacts: "Contact details",
    contactsHint: "These details are required to confirm the order and arrange delivery.",
    profileAutofill: "Profile details were filled in automatically.",
    delivery: "Delivery",
    deliveryHint: "Use one full address field for delivery or a convenient pickup point.",
    customerName: "Name",
    customerEmail: "Email",
    customerPhone: "Phone",
    customerAddress: "Address",
    comment: "Comment",
    commentPlaceholder: "Example: call one hour before, keep items in one invoice, verify compatibility.",
    deliveryMethod: "Delivery method",
    courier: "Courier",
    pickup: "Pickup",
    checkout: "Place order",
    checkoutPending: "Submitting...",
    successTitle: "Order submitted",
    successText: "A manager will confirm stock, final amount, and delivery details.",
    guestSuccessText: "The order has been created. Our manager will contact you to confirm the details.",
    successRedirect: "Auto redirect to orders in",
    guestSuccessRedirect: "Auto redirect to catalog in",
    successRedirectSeconds: "sec.",
    successViewOrders: "Open orders",
    successGoToCatalog: "Open catalog",
    orderNumber: "Order number",
    continueShopping: "Continue shopping",
    qty: "Qty",
    available: "Available",
    itemTotal: "Line total",
    unitPrice: "Unit price",
    colorLabel: "Color",
    details: "Details",
    detailsLead: "Full description and product details",
    specsLabel: "Specifications",
    highlightsLabel: "Highlights",
    sku: "SKU",
    brandLabel: "Brand",
    categoryLabel: "Category",
    availabilityLabel: "Availability",
    inStock: "In stock",
    outOfStock: "Out of stock",
    addToCart: "Add to cart",
    alreadyInCart: "Already in cart",
    close: "Close",
    remove: "Remove",
    loading: "Recalculating cart...",
    stockWarning: "Adjust quantity to the available stock.",
    secure: "Pricing and stock are revalidated on the server before checkout.",
    requiredError: "Fill in the required fields.",
  },
  kg: {
    badge: "Себет",
    title: "Заказга даяр",
    subtitle:
      "Товарларды текшерип, санын өзгөртүп, заказды жөнөтүңүз. Жалпы сумма кампадагы калдык жана промокод боюнча эсептелет.",
    emptyTitle: "Себет бош",
    emptyText: "Каталогдон товар кошуңуз, заказдын толук курамы ушул жерде көрүнөт.",
    catalogCta: "Каталогго өтүү",
    clear: "Себетти тазалоо",
    summary: "Жыйынтык",
    items: "Позициялар",
    subtotal: "Сумма",
    discount: "Арзандатуу",
    promoDiscount: "Промокод",
    total: "Жалпы",
    promoLabel: "Промокод",
    promoPlaceholder: "FRAG10",
    promoHint: "Промокод өзүнчө текшерилгенден кийин гана колдонулат.",
    promoApply: "Промокодду текшерүү",
    promoApplied: "Промокод колдонулду",
    clearConfirmTitle: "Себетти тазалайсызбы?",
    clearConfirmText: "Бардык товарлар себеттен өчүрүлөт жана кайра калыбына келтирилбейт.",
    cancel: "Жокко чыгаруу",
    confirmClear: "Тазалоо",
    contacts: "Байланыш маалыматтары",
    contactsHint: "Бул маалыматтар заказды ырастоо жана жеткирүүнү макулдашуу үчүн керек.",
    profileAutofill: "Профилдеги маалыматтар автоматтык түрдө толтурулду.",
    delivery: "Жеткирүү",
    deliveryHint: "Жеткирүү үчүн бир толук даректи же алып кетүү чекитин көрсөтүңүз.",
    customerName: "Аты",
    customerEmail: "Email",
    customerPhone: "Телефон",
    customerAddress: "Дарек",
    comment: "Комментарий",
    commentPlaceholder: "Мисалы: бир саат мурун чалуу, бир чекке чогултуу, шайкештикти тактоо.",
    deliveryMethod: "Алуу ыкмасы",
    courier: "Курьер",
    pickup: "Өзү алып кетүү",
    checkout: "Заказды жөнөтүү",
    checkoutPending: "Жөнөтүлүүдө...",
    successTitle: "Заказ жөнөтүлдү",
    successText: "Менеджер калдыкты, акыркы сумманы жана жеткирүү шарттарын тактайт.",
    guestSuccessText: "Заказ түзүлдү. Биздин менеджер сиз менен байланышып, деталдарды тактайт.",
    successRedirect: "Заказдар бөлүмүнө автоматтык өтүү",
    guestSuccessRedirect: "Каталогго автоматтык өтүү",
    successRedirectSeconds: "сек. кийин",
    successViewOrders: "Заказдарды ачуу",
    successGoToCatalog: "Каталогго өтүү",
    orderNumber: "Заказ номери",
    continueShopping: "Сооданы улантуу",
    qty: "Саны",
    available: "Кампада",
    itemTotal: "Позиция суммасы",
    unitPrice: "Бир даанасы",
    colorLabel: "Түс",
    details: "Кененирээк",
    detailsLead: "Толук сүрөттөмө жана товар маалыматы",
    specsLabel: "Спецификациялар",
    highlightsLabel: "Негизги артыкчылыктар",
    sku: "Артикул",
    brandLabel: "Марка",
    categoryLabel: "Категория",
    availabilityLabel: "Жеткиликтүүлүк",
    inStock: "Бар",
    outOfStock: "Жок",
    addToCart: "Себетке",
    alreadyInCart: "Себетте бар",
    close: "Жабуу",
    remove: "Өчүрүү",
    loading: "Себет кайра эсептелүүдө...",
    stockWarning: "Санды жеткиликтүү калдыкка жараша тууралаңыз.",
    secure: "Баалар жана калдык заказ алдында серверде кайра текшерилет.",
    requiredError: "Милдеттүү талааларды толтуруңуз.",
  },
} as const;

function buildSingleAddress(user: AuthUser | null) {
  if (!user) {
    return "";
  }

  return [user.city?.trim(), user.address?.trim()].filter(Boolean).join(", ");
}

function createInitialFormState(user: AuthUser | null): CartFormState {
  return {
    delivery_method: "courier",
    customer_name: user?.full_name || user?.first_name || "",
    customer_email: user?.email || "",
    customer_phone: user?.phone || "",
    delivery_address: buildSingleAddress(user),
    comment: "",
  };
}

export function CartPage({ locale, dictionary, user }: CartPageProps) {
  const text = cartText[locale];
  const { items, hydrated, replaceItems, setQuantity, setItemColor, removeItem, clearCart } = useCart();
  const router = useRouter();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState("");
  const [summary, setSummary] = useState<CartSummary | null>(null);
  const [summaryError, setSummaryError] = useState("");
  const [promoStatus, setPromoStatus] = useState("");
  const [form, setForm] = useState<CartFormState>(() => createInitialFormState(user));
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState<CartCheckoutResponse | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);
  const [isClearCartDialogOpen, setIsClearCartDialogOpen] = useState(false);
  const [previewProductSlug, setPreviewProductSlug] = useState<string | null>(null);
  const [previewCartItemColorId, setPreviewCartItemColorId] = useState<number | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [previewSelectedColorId, setPreviewSelectedColorId] = useState<number | null>(null);
  const [previewSelectedMediaIndex, setPreviewSelectedMediaIndex] = useState(0);
  const catalogHref = localizePath("/catalog", locale);
  const profileHref = localizePath("/profile", locale);
  const profileOrdersHref = `${profileHref}?tab=orders`;
  const successRedirectHref = user ? profileOrdersHref : catalogHref;
  const successDescription = user ? text.successText : text.guestSuccessText;
  const successRedirectLabel = user ? text.successRedirect : text.guestSuccessRedirect;
  const successActionLabel = user ? text.successViewOrders : text.successGoToCatalog;
  const isSummaryLoading = items.length > 0 && !summary && !summaryError;
  const previewResolvedColorId = previewSelectedColorId ?? previewProduct?.color_options[0]?.id ?? null;

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (items.length === 0) {
      return;
    }

    let active = true;

    fetchCartSummary(items, appliedPromoCode)
      .then((nextSummary) => {
        if (!active) {
          return;
        }

        const normalizedSummaryItems = normalizeCartItems(
          nextSummary.items.map((item) => ({
            productId: item.product_id,
            quantity: item.quantity,
            selectedColorId: item.selected_color_id,
          })),
        );

        if (JSON.stringify(normalizedSummaryItems) !== JSON.stringify(items)) {
          replaceItems(normalizedSummaryItems);
        }

        setSummary(nextSummary);
        setSummaryError("");
      })
      .catch((error: Error) => {
        if (!active) {
          return;
        }

        setSummary(null);
        setSummaryError(error.message);
      });

    return () => {
      active = false;
    };
  }, [hydrated, items, appliedPromoCode, replaceItems]);

  useEffect(() => {
    if (!previewProductSlug) {
      return;
    }

    let active = true;

    getProductBySlug(previewProductSlug)
      .then((product) => {
        if (!active) {
          return;
        }

        if (!product) {
          setPreviewError("Failed to load product.");
          return;
        }

        setPreviewProduct(product);
        setPreviewSelectedColorId(
          product.color_options.some((option) => option.id === previewCartItemColorId)
            ? previewCartItemColorId
            : product.color_options[0]?.id ?? null,
        );
      })
      .finally(() => {
        if (active) {
          setIsPreviewLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [previewCartItemColorId, previewProductSlug]);

  useEffect(() => {
    if (!checkoutSuccess) {
      return;
    }

    const countdownId = window.setInterval(() => {
      setRedirectCountdown((current) => (current > 1 ? current - 1 : 1));
    }, 1000);

    const timeoutId = window.setTimeout(() => {
      router.push(successRedirectHref);
    }, 10000);

    return () => {
      window.clearInterval(countdownId);
      window.clearTimeout(timeoutId);
    };
  }, [checkoutSuccess, router, successRedirectHref]);

  const canSubmit = useMemo(() => {
    if (!summary || summary.items.length === 0) {
      return false;
    }

    if (!form.customer_name.trim() || !form.customer_email.trim() || !form.customer_phone.trim()) {
      return false;
    }

    if (form.delivery_method === "courier" && !form.delivery_address.trim()) {
      return false;
    }

    return true;
  }, [form, summary]);

  async function handleCheckoutSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCheckoutError("");

    if (!canSubmit || !summary) {
      setCheckoutError(text.requiredError);
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await submitCartCheckout({
        ...form,
        delivery_city: "",
        promo_code: appliedPromoCode.trim(),
        items: items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
          selected_color_id: item.selectedColorId ?? null,
        })),
      });

      setCheckoutSuccess(order);
      setRedirectCountdown(10);
      clearCart();
      setPromoCode("");
      setAppliedPromoCode("");
      setPromoStatus("");
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Request failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePromoCheck() {
    const normalizedPromoCode = promoCode.trim().toUpperCase();

    if (!normalizedPromoCode) {
      setAppliedPromoCode("");
      setPromoStatus("");
      return;
    }

    setIsCheckingPromo(true);
    setSummaryError("");
    setPromoStatus("");

    try {
      const nextSummary = await fetchCartSummary(items, normalizedPromoCode);
      setAppliedPromoCode(normalizedPromoCode);
      setPromoCode(normalizedPromoCode);
      setSummary(nextSummary);
      setPromoStatus(text.promoApplied);
    } catch (error) {
      setAppliedPromoCode("");
      setPromoStatus("");
      setSummaryError(error instanceof Error ? error.message : "Request failed.");
    } finally {
      setIsCheckingPromo(false);
    }
  }

  function closeProductPreview() {
    setIsPreviewLoading(false);
    setPreviewProductSlug(null);
    setPreviewCartItemColorId(null);
    setPreviewProduct(null);
    setPreviewError("");
    setPreviewSelectedColorId(null);
    setPreviewSelectedMediaIndex(0);
  }

  function openProductPreview(productSlug: string, cartItemColorId: number | null) {
    setIsPreviewLoading(true);
    setPreviewProduct(null);
    setPreviewError("");
    setPreviewSelectedColorId(null);
    setPreviewSelectedMediaIndex(0);
    setPreviewCartItemColorId(cartItemColorId);
    setPreviewProductSlug(productSlug);
  }

  return (
    <main className="page-shell relative isolate overflow-hidden bg-[linear-gradient(180deg,#050505_0%,#0c0909_34%,#070506_100%)] px-4 pt-32 text-zinc-50 sm:px-6 lg:px-8">
      <Header locale={locale} dictionary={dictionary.header} />
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_12%_16%,rgba(255,23,68,0.2),transparent_24%),radial-gradient(circle_at_88%_12%,rgba(34,211,238,0.14),transparent_24%),radial-gradient(circle_at_50%_88%,rgba(163,230,53,0.1),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 -z-20 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:52px_52px]" />
      <section className="relative z-10 w-full max-w-7xl mx-auto pb-16">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CyberBadge variant="red" glow>
              {text.badge}
            </CyberBadge>
            <h1 className="mt-4 font-display text-3xl uppercase tracking-[0.06em] text-white sm:text-4xl">
              {text.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400 sm:text-[15px]">
              {text.subtitle}
            </p>
          </div>
        </div>

        {!hydrated ? (
          <div className="py-16 text-sm text-zinc-500">{text.loading}</div>
        ) : items.length === 0 ? (
          <div className="mt-8 grid gap-5">
            <CyberCard variant="glass" className="border border-white/10 bg-black/35">
              <CyberCardContent className="flex flex-col items-center gap-6 px-6 py-14 text-center sm:px-10 sm:py-16">
                <div className="grid size-18 place-items-center rounded-full border border-red-300/20 bg-red-500/10 text-red-100 shadow-[0_0_34px_rgba(255,23,68,0.14)]">
                  <ShoppingCart className="size-8" />
                </div>
                <div>
                  <h2 className="font-display text-3xl uppercase tracking-[0.06em] text-white">
                    {text.emptyTitle}
                  </h2>
                  <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
                    {text.emptyText}
                  </p>
                </div>
                <CyberButton asChild variant="primary">
                  <Link href={catalogHref}>{text.catalogCta}</Link>
                </CyberButton>
              </CyberCardContent>
            </CyberCard>
          </div>
        ) : (
          <div className="mt-8 grid gap-7 xl:grid-cols-[minmax(0,1.3fr)_400px]">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 sm:px-3.5">
                <div className="text-[13px] text-zinc-400">
                  {summary ? `${summary.items_count} ${text.items.toLowerCase()}` : ""}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={catalogHref}
                    className="inline-flex h-8 items-center justify-center rounded-md border border-white/12 bg-white/[0.03] px-3 text-[10px] uppercase tracking-[0.14em] text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                  >
                    {text.catalogCta}
                  </Link>
                  {items.length ? (
                    <CyberDialog open={isClearCartDialogOpen} onOpenChange={setIsClearCartDialogOpen}>
                      <CyberDialogTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-red-400/18 bg-red-500/[0.05] px-3 text-[10px] uppercase tracking-[0.14em] text-red-100 transition hover:border-red-300/28 hover:bg-red-500/[0.12]"
                        >
                          <Trash2 aria-hidden="true" />
                          {text.clear}
                        </button>
                      </CyberDialogTrigger>
                      <CyberDialogContent className="sm:max-w-md">
                        <CyberDialogHeader>
                          <CyberDialogTitle className="font-display text-2xl uppercase tracking-[0.05em] text-white">
                            {text.clearConfirmTitle}
                          </CyberDialogTitle>
                          <CyberDialogDescription className="text-sm leading-6 text-zinc-300">
                            {text.clearConfirmText}
                          </CyberDialogDescription>
                        </CyberDialogHeader>
                        <CyberDialogFooter className="gap-3 sm:justify-end">
                          <CyberButton
                            type="button"
                            variant="ghost"
                            onClick={() => setIsClearCartDialogOpen(false)}
                          >
                            {text.cancel}
                          </CyberButton>
                          <CyberButton
                            type="button"
                            variant="outline"
                            className="border-red-300/30 bg-red-500/[0.08] text-red-100 hover:border-red-300/45 hover:bg-red-500/[0.16]"
                            onClick={() => {
                              clearCart();
                              setIsClearCartDialogOpen(false);
                            }}
                          >
                            {text.confirmClear}
                          </CyberButton>
                        </CyberDialogFooter>
                      </CyberDialogContent>
                    </CyberDialog>
                  ) : null}
                </div>
              </div>

              {summaryError ? (
                <div className="inline-flex max-w-max items-center gap-2 border border-red-400/25 bg-red-500/[0.06] px-3 py-2 text-xs uppercase tracking-[0.12em] text-red-100">
                  <AlertTriangle className="size-3.5 shrink-0" />
                  <span>{summaryError}</span>
                </div>
              ) : null}

              {summary?.items.map((item) => {
                const unitPriceAmount = Number(item.unit_price);
                const oldPriceAmount = item.unit_old_price ? Number(item.unit_old_price) : null;
                const hasDiscount =
                  oldPriceAmount !== null &&
                  Number.isFinite(oldPriceAmount) &&
                  Number.isFinite(unitPriceAmount) &&
                  oldPriceAmount > unitPriceAmount;
                const discountPercent = hasDiscount
                  ? Math.round(((oldPriceAmount - unitPriceAmount) / oldPriceAmount) * 100)
                  : null;

                return (
                  <CyberCard
                    key={item.product_id}
                    variant="glass"
                    className="group/cart-item overflow-visible !rounded-md border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,94,77,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.08),transparent_26%),linear-gradient(180deg,rgba(15,15,17,0.96),rgba(10,10,12,0.98))] shadow-[0_20px_48px_rgba(0,0,0,0.28)] transition-[transform,border-color,box-shadow] duration-300 hover:border-red-300/20 hover:shadow-[0_26px_62px_rgba(0,0,0,0.34)]"
                  >
                    <CyberCardContent className="relative grid gap-4 overflow-visible p-4 sm:gap-5 sm:p-5 xl:grid-cols-[172px_minmax(0,1fr)] xl:items-start">
                      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-red-300/40 to-transparent opacity-80" />

                      <div className="grid gap-3">
                        <div className="relative overflow-hidden rounded-md border border-white/10 bg-[radial-gradient(circle_at_18%_16%,rgba(255,94,77,0.16),transparent_28%),radial-gradient(circle_at_78%_12%,rgba(251,191,36,0.1),transparent_24%),linear-gradient(160deg,rgba(22,11,12,0.98),rgba(9,7,8,1))]">
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:22px_22px] opacity-30" />
                          {discountPercent ? (
                            <div className="absolute left-3 top-3 z-20 rounded-full border border-amber-200/20 bg-amber-300/12 px-2.5 py-1 font-tech text-[10px] uppercase tracking-[0.16em] text-amber-100 backdrop-blur">
                              -{discountPercent}%
                            </div>
                          ) : null}
                          {item.primary_media ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.primary_media}
                              alt={item.product_name}
                              className="relative z-10 max-w-7xl mx-auto aspect-square h-full w-full object-cover transition duration-700 group-hover/cart-item:scale-[1.045]"
                            />
                          ) : (
                            <div className="relative z-10 max-w-7xl mx-auto grid aspect-square place-items-center text-zinc-500">
                              <PackageCheck className="size-10" />
                            </div>
                          )}
                        </div>

                        <div className="rounded-md border border-amber-200/14 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.12),transparent_36%),linear-gradient(180deg,rgba(251,191,36,0.06),rgba(255,255,255,0.025))] p-4">
                          <div>
                            <p className="font-tech text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                              {text.itemTotal}
                            </p>
                            <p className="mt-2 font-display text-[1.55rem] leading-none text-amber-100">
                              {formatCartMoney(item.line_total, item.currency, locale)}
                            </p>
                          </div>

                          <div className="my-3 h-px bg-white/8" />

                          <div className="grid gap-1">
                            <p className="font-tech text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                              {text.unitPrice}
                            </p>
                            <p className="text-sm font-medium text-zinc-100">
                              {formatCartMoney(item.unit_price, item.currency, locale)}
                            </p>
                            {item.unit_old_price ? (
                              <p className="text-xs text-zinc-500 line-through">
                                {formatCartMoney(item.unit_old_price, item.currency, locale)}
                              </p>
                            ) : null}
                          </div>

                          {discountPercent ? (
                            <div className="mt-3 inline-flex w-max items-center rounded-full border border-lime-300/18 bg-lime-300/[0.08] px-2.5 py-1 font-tech text-[10px] uppercase tracking-[0.16em] text-lime-100">
                              -{discountPercent}%
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="min-w-0 space-y-4">
                        <div className="flex flex-col gap-3 border-b border-white/8 pb-4 sm:gap-4">
                          <div className="min-w-0 space-y-2">
                            <p className="font-display text-[1.2rem] uppercase tracking-[0.04em] text-white sm:text-[1.45rem]">
                              {item.product_name}
                            </p>
                            <p className="max-w-3xl text-[13px] leading-6 text-zinc-400 sm:text-sm">
                              {item.short_description}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-zinc-300">
                              SKU {item.product_sku}
                            </span>
                            <span className="rounded-full border border-cyan-300/12 bg-cyan-300/[0.05] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-cyan-100">
                              {item.brand_name}
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-zinc-300">
                              {item.category_name}
                            </span>
                            {item.selected_color_name ? (
                              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200/14 bg-amber-200/[0.06] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-amber-100">
                                {item.selected_color_hex ? (
                                  <span
                                    className="size-2.5 rounded-full border border-white/20 shadow-[0_0_0_3px_rgba(255,255,255,0.03)]"
                                    style={{ backgroundColor: item.selected_color_hex }}
                                  />
                                ) : null}
                                {item.selected_color_name}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="grid gap-3 rounded-md border border-white/8 p-3">
                          <div className="relative z-30 min-w-0">
                            {item.color_options.length ? (
                              <CyberNativeSelect
                                label={text.colorLabel}
                                value={String(item.selected_color_id ?? item.color_options[0]?.id ?? "")}
                                onValueChange={(value) =>
                                  setItemColor(item.product_id, item.selected_color_id, Number(value))
                                }
                                options={item.color_options.map((option) => ({
                                  value: String(option.id),
                                  label: option.name,
                                }))}
                                className="border-red-300/22 bg-red-500/[0.05] text-red-50 hover:bg-red-500/[0.08] focus-visible:border-red-300/60 focus-visible:ring-red-300/20"
                              />
                            ) : (
                              <div className="rounded-md border border-white/8 px-4 py-3">
                                <p className="font-tech text-[11px] uppercase tracking-[0.14em] text-zinc-500">{text.colorLabel}</p>
                                <p className="mt-2 text-sm text-zinc-200">{item.selected_color_name || "—"}</p>
                              </div>
                            )}
                          </div>

                          <div className="grid gap-3 xl:grid-cols-[auto_minmax(0,1fr)] xl:items-center">
                            <div className="inline-flex items-center overflow-hidden rounded-md border border-white/10 bg-black/40 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
                              <button
                                type="button"
                                onClick={() =>
                                  setQuantity(item.product_id, item.quantity - 1, item.selected_color_id)
                                }
                                className="grid size-9 place-items-center border-r border-white/10 text-zinc-300 transition hover:bg-white/10 hover:text-white"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="size-3.5" />
                              </button>
                              <div className="min-w-10 px-3 text-center font-tech text-[11px] uppercase tracking-[0.14em] text-white">
                                {item.quantity}
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setQuantity(
                                    item.product_id,
                                    Math.min(item.quantity + 1, item.quantity_in_stock),
                                    item.selected_color_id,
                                  )
                                }
                                className="grid size-9 place-items-center border-l border-white/10 text-zinc-300 transition hover:bg-white/10 hover:text-white"
                                aria-label="Increase quantity"
                              >
                                <Plus className="size-3.5" />
                              </button>
                            </div>

                            <div className="grid gap-3">
                              <div className="grid gap-1 text-[13px] text-zinc-400">
                                <p>
                                  {text.available}:{" "}
                                  <span className="font-medium text-zinc-100">{item.quantity_in_stock}</span>
                                </p>
                                {item.quantity >= item.quantity_in_stock ? (
                                  <p className="text-xs text-amber-200">{text.stockWarning}</p>
                                ) : null}
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => openProductPreview(item.product_slug, item.selected_color_id)}
                                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/12 bg-white/[0.04] px-4 text-[10px] uppercase tracking-[0.16em] text-zinc-200 transition hover:border-white/22 hover:bg-white/[0.08] hover:text-white"
                                >
                                  {text.details}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeItem(item.product_id, item.selected_color_id)}
                                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-red-400/20 bg-red-500/[0.06] px-4 text-[10px] uppercase tracking-[0.16em] text-red-100 transition hover:border-red-300/32 hover:bg-red-500/[0.14]"
                                >
                                  <Trash2 className="size-4" />
                                  {text.remove}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CyberCardContent>
                  </CyberCard>
                );
              })}
            </div>

            <div className="grid content-start gap-6 xl:sticky xl:top-32">
              <CyberCard
                variant="glass"
                className="overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,94,77,0.12),transparent_26%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.08),transparent_24%),linear-gradient(180deg,rgba(15,15,17,0.96),rgba(10,10,12,0.98))] shadow-[0_20px_56px_rgba(0,0,0,0.28)]"
              >
                <CyberCardContent className="space-y-5 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-display text-2xl uppercase tracking-[0.05em] text-white">
                        {text.summary}
                      </p>
                      <p className="mt-2 text-sm text-zinc-400">{text.secure}</p>
                    </div>
                    <div className="grid size-11 shrink-0 place-items-center rounded-full border border-lime-300/20 bg-lime-300/10 text-lime-100">
                      <ShieldCheck className="size-5" />
                    </div>
                  </div>

                  <CyberInput
                    label={text.promoLabel}
                    icon={<Ticket aria-hidden="true" />}
                    placeholder={text.promoPlaceholder}
                    helperText={text.promoHint}
                    value={promoCode}
                    onChange={(event) => {
                      const nextValue = event.target.value.toUpperCase();
                      setPromoCode(nextValue);
                      if (nextValue.trim() !== appliedPromoCode) {
                        setAppliedPromoCode("");
                        setPromoStatus("");
                      }
                    }}
                  />
                  <CyberButton
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={!promoCode.trim() || isCheckingPromo || items.length === 0}
                    onClick={handlePromoCheck}
                  >
                    {text.promoApply}
                  </CyberButton>
                  {promoStatus && appliedPromoCode ? (
                    <div className="rounded-md border border-lime-300/18 bg-lime-300/[0.08] px-4 py-3 text-sm text-lime-100">
                      {text.promoApplied}: <span className="font-semibold">{appliedPromoCode}</span>
                    </div>
                  ) : null}

                  <div className="rounded-md border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4 text-sm text-zinc-300">
                    <div className="space-y-3">
                    <SummaryRow label={text.items} value={summary?.quantity_total ?? items.reduce((total, item) => total + item.quantity, 0)} />
                    <SummaryRow
                      label={text.subtotal}
                      value={summary ? formatCartMoney(summary.subtotal, summary.currency, locale) : "—"}
                    />
                    <SummaryRow
                      label={text.discount}
                      value={summary ? formatCartMoney(summary.discount_total, summary.currency, locale) : "—"}
                      accent="text-amber-200"
                    />
                    <SummaryRow
                      label={text.promoDiscount}
                      value={summary ? formatCartMoney(summary.promo_discount_total, summary.currency, locale) : "—"}
                      accent="text-cyan-100"
                    />
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="font-tech text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                        {text.total}
                      </span>
                      <span className="font-display text-[2.2rem] leading-none text-lime-100">
                        {summary ? formatCartMoney(summary.total, summary.currency, locale) : "—"}
                      </span>
                    </div>
                    </div>
                  </div>
                </CyberCardContent>
              </CyberCard>

              <CyberCard
                variant="glass"
                className="overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,94,77,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.08),transparent_24%),linear-gradient(180deg,rgba(15,15,17,0.96),rgba(10,10,12,0.98))] shadow-[0_20px_56px_rgba(0,0,0,0.28)]"
              >
                <CyberCardContent className="p-6">
                  <form className="space-y-5" onSubmit={handleCheckoutSubmit}>
                    <div>
                      <p className="font-display text-2xl uppercase tracking-[0.05em] text-white">
                        {text.contacts}
                      </p>
                      <p className="mt-2 text-sm text-zinc-400">{text.contactsHint}</p>
                      {user ? (
                        <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-lime-300/18 bg-lime-300/[0.08] px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-lime-100">
                          <ShieldCheck className="size-3.5" />
                          {text.profileAutofill}
                        </div>
                      ) : null}
                    </div>

                    <div className="grid gap-4 rounded-md border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4 sm:p-5">
                      <CyberInput
                        label={text.customerName}
                        value={form.customer_name}
                        onChange={(event) => setForm((current) => ({ ...current, customer_name: event.target.value }))}
                      />
                      <CyberInput
                        type="email"
                        label={text.customerEmail}
                        value={form.customer_email}
                        onChange={(event) => setForm((current) => ({ ...current, customer_email: event.target.value }))}
                      />
                      <CyberInput
                        label={text.customerPhone}
                        value={form.customer_phone}
                        onChange={(event) => setForm((current) => ({ ...current, customer_phone: event.target.value }))}
                      />
                    </div>

                    <div className="border-t border-white/10 pt-5">
                      <div className="mb-4 flex items-start gap-4">
                        <div className="grid size-12 shrink-0 place-items-center rounded-full border border-red-300/18 bg-red-300/10 text-red-100">
                          <Truck className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-display text-xl uppercase tracking-[0.05em] text-white">
                            {text.delivery}
                          </p>
                          <p className="mt-1 text-sm text-zinc-400">{text.deliveryHint}</p>
                        </div>
                      </div>

                      <div className="grid gap-4 rounded-md border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4 sm:p-5">
                        <CyberNativeSelect
                          label={text.deliveryMethod}
                          value={form.delivery_method}
                          onValueChange={(value) =>
                            setForm((current) => ({
                              ...current,
                              delivery_method: value as DeliveryMethod,
                            }))
                          }
                          options={[
                            { value: "courier", label: text.courier },
                            { value: "pickup", label: text.pickup },
                          ]}
                        />
                        <CyberInput
                          label={text.customerAddress}
                          value={form.delivery_address}
                          onChange={(event) => setForm((current) => ({ ...current, delivery_address: event.target.value }))}
                          helperText={user ? text.profileAutofill : undefined}
                        />
                        <CyberTextarea
                          label={text.comment}
                          placeholder={text.commentPlaceholder}
                          value={form.comment}
                          onChange={(event) => setForm((current) => ({ ...current, comment: event.target.value }))}
                          className="min-h-28"
                        />
                      </div>
                    </div>

                    {checkoutError ? (
                      <div className="rounded-md border border-red-400/25 bg-red-500/[0.06] px-3 py-2 text-xs uppercase tracking-[0.12em] text-red-100">
                        {checkoutError}
                      </div>
                    ) : null}

                    <CyberButton
                      type="submit"
                      variant="primary"
                      className={cn("w-full", !canSubmit && "opacity-70")}
                      disabled={!canSubmit || isSubmitting || isSummaryLoading}
                    >
                      {isSubmitting ? text.checkoutPending : text.checkout}
                    </CyberButton>
                  </form>
                </CyberCardContent>
              </CyberCard>
            </div>
          </div>
        )}
      </section>
      <ProductDetailsDialog
        open={Boolean(previewProductSlug)}
        onOpenChange={(open) => !open && closeProductPreview()}
        locale={locale}
        product={previewProduct}
        labels={text}
        selectedColorId={previewResolvedColorId}
        onSelectColor={setPreviewSelectedColorId}
        selectedMediaIndex={previewSelectedMediaIndex}
        onSelectMediaIndex={setPreviewSelectedMediaIndex}
        actionLabel={text.remove}
        actionVariant="danger"
        actionClassName="border-red-300/45 bg-red-500/[0.12] text-red-100 hover:border-red-300/60 hover:bg-red-500/[0.2]"
        actionDisabled={!previewProduct}
        onAction={() => {
          if (previewProduct) {
            removeItem(previewProduct.id, previewCartItemColorId);
            closeProductPreview();
          }
        }}
        loadingText={isPreviewLoading ? text.loading : undefined}
        errorText={previewError || undefined}
      />
      {checkoutSuccess ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_20%_18%,rgba(163,230,53,0.16),transparent_22%),radial-gradient(circle_at_82%_16%,rgba(34,211,238,0.12),transparent_20%),linear-gradient(180deg,rgba(5,5,7,0.82),rgba(3,3,5,0.94))] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:52px_52px]" />
          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[linear-gradient(90deg,transparent,rgba(190,242,100,0.34),transparent)]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-lime-300/14 opacity-40 animate-ping" />

          <div className="relative z-10 mx-4 w-full max-w-2xl animate-[successOverlayReveal_700ms_cubic-bezier(0.16,1,0.3,1)_both] rounded-md border border-lime-300/18 bg-[radial-gradient(circle_at_top_left,rgba(163,230,53,0.14),transparent_26%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_24%),linear-gradient(180deg,rgba(14,16,12,0.96),rgba(6,8,6,0.98))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.42)] sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="grid size-20 place-items-center rounded-full border border-lime-300/30 bg-lime-300/[0.10] text-lime-100 shadow-[0_0_42px_rgba(190,242,100,0.22)]">
                <CheckCheck className="size-10" />
              </div>
              <p className="mt-6 font-display text-3xl uppercase tracking-[0.08em] text-white sm:text-4xl">
                {text.successTitle}
              </p>
              <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
                {successDescription}
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-white/10 bg-black/20 px-4 py-4">
                <p className="font-tech text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                  {text.orderNumber}
                </p>
                <p className="mt-2 font-display text-2xl text-white">{checkoutSuccess.number}</p>
              </div>
              <div className="rounded-md border border-white/10 bg-black/20 px-4 py-4">
                <p className="font-tech text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                  {text.total}
                </p>
                <p className="mt-2 font-display text-2xl text-lime-100">
                  {formatCartMoney(checkoutSuccess.total, checkoutSuccess.currency, locale)}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-md border border-cyan-300/14 bg-cyan-300/[0.05] px-4 py-3 text-center font-tech text-[11px] uppercase tracking-[0.16em] text-cyan-100">
              {successRedirectLabel} {redirectCountdown} {text.successRedirectSeconds}
            </div>

            <CyberButton
              type="button"
              variant="primary"
              className="mt-4 w-full"
              onClick={() => router.push(successRedirectHref)}
            >
              {successActionLabel}
            </CyberButton>
          </div>

          <style jsx>{`
            @keyframes successOverlayReveal {
              from {
                opacity: 0;
                transform: translateY(26px) scale(0.96);
                filter: blur(14px);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
                filter: blur(0);
              }
            }
          `}</style>
        </div>
      ) : null}
      <Footer locale={locale} dictionary={dictionary} className="-mx-4 sm:-mx-6 lg:-mx-8" />
    </main>
  );
}

function SummaryRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-zinc-500">{label}</span>
      <span className={cn("text-right text-zinc-100", accent)}>{value}</span>
    </div>
  );
}
