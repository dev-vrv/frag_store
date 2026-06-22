"use client";

import { ChevronUp } from "lucide-react";
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
      <span className="back-to-top__pulse back-to-top__pulse--outer" />
      <span className="back-to-top__pulse back-to-top__pulse--inner" />
      <span className="back-to-top__icon" aria-hidden="true">
        <ChevronUp className="size-6" strokeWidth={2.2} />
      </span>
    </button>
  );
}
