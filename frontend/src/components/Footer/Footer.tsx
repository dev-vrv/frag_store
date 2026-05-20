"use client";

import Link from "next/link";
import { Cpu, ShieldCheck } from "lucide-react";

import { ContactSocialButtons } from "@/components/Contacts/ContactSocialButtons";
import { type Dictionary, type Locale, localizePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface FooterProps {
  locale: Locale;
  dictionary: Dictionary;
  className?: string;
}

const footerText: Record<
  Locale,
  {
    tagline: string;
    catalog: string;
    support: string;
    account: string;
    status: string;
    rights: string;
  }
> = {
  ru: {
    tagline: "Gaming-девайсы, сборки и аксессуары для точного сетапа.",
    catalog: "Магазин",
    support: "Поддержка",
    account: "Аккаунт",
    status: "Система онлайн",
    rights: "Все права защищены.",
  },
  en: {
    tagline: "Gaming gear, builds, and accessories for a precise setup.",
    catalog: "Store",
    support: "Support",
    account: "Account",
    status: "System online",
    rights: "All rights reserved.",
  },
  kg: {
    tagline: "Так сетап үчүн gaming девайстар, сборкалар жана аксессуарлар.",
    catalog: "Дүкөн",
    support: "Колдоо",
    account: "Аккаунт",
    status: "Система онлайн",
    rights: "Бардык укуктар корголгон.",
  },
};

export function Footer({ locale, dictionary, className }: FooterProps) {
  const text = footerText[locale];
  const pages = dictionary.pages;

  const storeLinks = [
    { href: "/catalog", label: pages.catalog.title },
    { href: "/cart", label: pages.cart.title },
    { href: "/comparison", label: pages.comparison.title },
    { href: "/blog", label: pages.blog.title },
  ];
  const supportLinks = [
    { href: "/contacts", label: pages.contacts.title },
    { href: "/faq", label: pages.faq.title },
    { href: "/about", label: pages.about.title },
    { href: "/privacy", label: pages.privacy.title },
    { href: "/offer", label: pages.offer.title },
  ];

  return (
    <footer
      className={cn(
        "relative mt-16 border-t border-red-500/15 bg-black/82 px-4 py-10 text-zinc-300 backdrop-blur-xl sm:px-6 lg:px-8",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/70 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.85fr)]">
        <section className="space-y-5">
          <Link
            href={localizePath("/", locale)}
            className="font-display inline-flex border border-red-400/35 bg-red-500/10 px-4 py-2 text-xl tracking-[0.08em] text-red-100"
            aria-label="Frag Store"
          >
            {dictionary.header.logo}
          </Link>
          <p className="max-w-sm text-sm leading-7 text-zinc-400">{text.tagline}</p>
          <ContactSocialButtons locale={locale} />
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-2 border border-lime-300/20 bg-lime-300/5 px-3 py-2 text-lime-100">
              <ShieldCheck className="size-4" aria-hidden="true" />
              {text.status}
            </span>
            <span className="inline-flex items-center gap-2 border border-cyan-300/20 bg-cyan-300/5 px-3 py-2 text-cyan-100">
              <Cpu className="size-4" aria-hidden="true" />
              Frag Store
            </span>
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-3">
          <FooterLinkGroup title={text.catalog} links={storeLinks} locale={locale} />
          <FooterLinkGroup title={text.support} links={supportLinks} locale={locale} />
          <div className="space-y-3">
            <h2 className="font-tech text-sm uppercase text-zinc-500">{text.account}</h2>
            <Link
              href={localizePath("/auth", locale)}
              className="block text-sm uppercase text-zinc-300 transition hover:text-red-100"
            >
              {dictionary.header.auth}
            </Link>
          </div>
        </section>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-2 border-t border-white/10 pt-5 text-xs uppercase tracking-[0.12em] text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Frag Store</span>
        <span>{text.rights}</span>
      </div>
    </footer>
  );
}

function FooterLinkGroup({
  title,
  links,
  locale,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
  locale: Locale;
}) {
  return (
    <div className="space-y-3">
      <h2 className="font-tech text-sm uppercase text-zinc-500">{title}</h2>
      <nav className="space-y-2" aria-label={title}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={localizePath(link.href, locale)}
            className="block text-sm uppercase text-zinc-300 transition hover:text-red-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
