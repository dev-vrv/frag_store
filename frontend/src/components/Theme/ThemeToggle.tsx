"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { type Locale } from "@/lib/i18n";
import {
  applyDocumentTheme,
  getDocumentThemePreference,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  type ThemeChangeDetail,
  type ThemePreference,
} from "@/lib/theme";
import { cn } from "@/lib/utils";

const labels: Record<Locale, Record<ThemePreference | "pending", string>> = {
  ru: {
    system: "Тема: системная. Включить светлую тему",
    light: "Тема: светлая. Включить тёмную тему",
    dark: "Тема: тёмная. Использовать системную тему",
    pending: "Переключить цветовую тему",
  },
  en: {
    system: "Theme: system. Switch to light theme",
    light: "Theme: light. Switch to dark theme",
    dark: "Theme: dark. Use system theme",
    pending: "Toggle color theme",
  },
  kg: {
    system: "Тема: системалык. Жарык темага өтүү",
    light: "Тема: жарык. Караңгы темага өтүү",
    dark: "Тема: караңгы. Системалык теманы колдонуу",
    pending: "Түстүү теманы которуу",
  },
};

const nextPreference: Record<ThemePreference, ThemePreference> = {
  system: "light",
  light: "dark",
  dark: "system",
};

interface ThemeToggleProps {
  locale: Locale;
  className?: string;
}

export function ThemeToggle({ locale, className }: ThemeToggleProps) {
  const [preference, setPreference] = useState<ThemePreference | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function syncTheme() {
      setPreference(getDocumentThemePreference());
    }

    function handleThemeChange(event: Event) {
      setPreference((event as CustomEvent<ThemeChangeDetail>).detail.preference);
    }

    function handleStorage(event: StorageEvent) {
      if (event.key !== THEME_STORAGE_KEY) {
        return;
      }

      const nextPreference = event.newValue === "dark" || event.newValue === "light"
        ? event.newValue
        : "system";
      applyDocumentTheme(nextPreference, false);
    }

    function handleSystemThemeChange() {
      if (getDocumentThemePreference() !== "system") {
        return;
      }

      applyDocumentTheme("system", false);
    }

    syncTheme();
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    window.addEventListener("storage", handleStorage);
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
      window.removeEventListener("storage", handleStorage);
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  const activePreference = preference ?? "system";
  const label = preference ? labels[locale][preference] : labels[locale].pending;

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      data-theme-preference={activePreference}
      onClick={() => applyDocumentTheme(nextPreference[activePreference])}
      className={cn(
        "group relative grid size-10 shrink-0 place-items-center overflow-hidden border border-cyan-300/40 bg-surface/30 text-cyan-100 outline-none [clip-path:polygon(0_0,calc(100%-7px)_0,100%_7px,100%_100%,7px_100%,0_calc(100%-7px))] transition-[transform,background-color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(110deg,transparent_20%,rgba(var(--theme-contrast-rgb),0.12)_50%,transparent_80%)] before:opacity-0 before:transition-opacity before:duration-200 after:pointer-events-none after:absolute after:inset-x-2 after:bottom-0 after:h-px after:origin-center after:scale-x-0 after:bg-cyan-200 after:transition-transform after:duration-200 after:ease-out hover:border-cyan-200/70 hover:bg-cyan-300/12 hover:shadow-[0_0_26px_rgba(34,211,238,0.18)] hover:before:opacity-100 hover:after:scale-x-100 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-cyan-300/35 motion-reduce:transition-none motion-reduce:hover:transform-none motion-reduce:before:transition-none motion-reduce:after:transition-none [&_svg]:relative [&_svg]:z-10",
        className,
      )}
    >
      {activePreference === "system" ? (
        <Monitor className="size-[1.1rem]" aria-hidden="true" />
      ) : activePreference === "light" ? (
        <Sun className="size-[1.1rem]" aria-hidden="true" />
      ) : (
        <Moon className="size-[1.1rem]" aria-hidden="true" />
      )}
    </button>
  );
}
