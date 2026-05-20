import Link from "next/link";
import { FaUserAstronaut } from "react-icons/fa";

import { CyberButton } from "@/components/cyber";
import { LocaleSwitcher } from "@/components/Header/LocaleSwitcher";
import { Nav } from "@/components/Nav/Nav";
import { type Dictionary, type Locale, localizePath } from "@/lib/i18n";

export interface HeaderProps {
  locale: Locale;
  dictionary: Dictionary["header"];
}

export function Header({ locale, dictionary }: HeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-red-500/15 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        <Link
          href={localizePath("/", locale)}
          className="cyber-cut-small font-display border border-red-400/35 bg-red-500/10 px-4 py-2 text-xl font-normal tracking-[0.08em] text-red-100 shadow-[0_0_24px_rgba(255,23,68,0.18)]"
          aria-label="Frag Store"
        >
          {dictionary.logo}
        </Link>

        <Nav
          className="hidden lg:flex"
          items={dictionary.nav}
          info={dictionary.info}
          locale={locale}
          ariaLabel={dictionary.navAriaLabel}
        />

        <div className="flex items-center gap-3">
          <LocaleSwitcher locale={locale} label="Сменить язык" />
          <CyberButton asChild variant="primary" size="sm">
            <Link href={localizePath("/auth", locale)}>
              <FaUserAstronaut aria-hidden="true" />
              <span>{dictionary.auth}</span>
            </Link>
          </CyberButton>
        </div>
      </div>
      <div className="border-t border-white/5 px-4 py-3 lg:hidden">
        <Nav
          className="justify-center"
          items={dictionary.nav}
          info={dictionary.info}
          locale={locale}
          ariaLabel={dictionary.navAriaLabel}
        />
      </div>
    </header>
  );
}
