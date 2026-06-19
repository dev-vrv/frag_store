"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

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
      aria-label="Back to top"
      onClick={scrollToTop}
      className={["back-to-top", isVisible ? "is-visible" : ""].filter(Boolean).join(" ")}
    >
      <span className="back-to-top__rail back-to-top__rail--left" />
      <span className="back-to-top__core">
        <ArrowUp className="size-4" />
      </span>
      <span className="font-tech text-[10px] uppercase tracking-[0.18em] text-white/88">
        Up
      </span>
      <span className="back-to-top__rail back-to-top__rail--right" />
    </button>
  );
}
