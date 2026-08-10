"use client";

import { ChevronUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { getLocaleFromPathname } from "@/lib/i18n";

const backToTopLabels = {
  ru: "Наверх",
  en: "Back to top",
  kg: "Жогору",
} as const;

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > window.innerHeight);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      aria-label={backToTopLabels[locale]}
      onClick={scrollToTop}
      className={["floating-control back-to-top cyber-cut-small", isVisible ? "is-visible" : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="floating-control__icon back-to-top__icon" aria-hidden="true">
        <ChevronUp className="size-4" strokeWidth={2.35} />
      </span>
      <span className="floating-control__copy">
        <span className="floating-control__eyebrow">01 // NAV</span>
        <span className="floating-control__label">{backToTopLabels[locale]}</span>
      </span>
      <span className="floating-control__status" aria-hidden="true" />
    </button>
  );
}
