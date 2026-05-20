"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface CyberLaserTextProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  text: string;
  as?: "span" | "p" | "div" | "h1" | "h2" | "h3";
  speedMs?: number;
  delayMs?: number;
  beam?: boolean;
  once?: boolean;
  rootMargin?: string;
}

export function CyberLaserText({
  text,
  as: Comp = "span",
  speedMs = 42,
  delayMs = 0,
  beam = true,
  once = true,
  rootMargin = "0px 0px -12% 0px",
  className,
  ...props
}: CyberLaserTextProps) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const characters = Array.from(text);
  const duration = Math.max(characters.length * speedMs, 1);

  React.useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      const frame = globalThis.requestAnimationFrame(() => setIsVisible(true));

      return () => globalThis.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        rootMargin,
        threshold: 0.25,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [once, rootMargin]);

  return (
    <Comp
      ref={ref as never}
      data-visible={isVisible}
      className={cn(
        "cyber-laser-text font-display relative inline-block pb-[0.14em] leading-[1.12] text-white",
        className,
      )}
      style={
        {
          "--laser-duration": `${duration}ms`,
          "--laser-delay": `${delayMs}ms`,
        } as React.CSSProperties
      }
      aria-label={text}
      {...props}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="relative inline-flex flex-wrap">
        {characters.map((character, index) => (
          <span
            key={`${character}-${index}`}
            className="cyber-laser-char"
            data-char={character === " " ? "\u00A0" : character}
            style={
              {
                "--char-delay": `${delayMs + index * speedMs}ms`,
              } as React.CSSProperties
            }
          >
            {character === " " ? "\u00A0" : character}
          </span>
        ))}
      </span>
      {beam ? <span aria-hidden="true" className="cyber-laser-beam" /> : null}
    </Comp>
  );
}
