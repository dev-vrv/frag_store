"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";

interface RevealOnScrollProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  threshold?: number;
}

export default function RevealOnScroll({
  children,
  as: Component = "div",
  className,
  delay = 0,
  threshold = 0.2,
  style,
  ...props
}: RevealOnScrollProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  const mergedStyle = useMemo<CSSProperties>(
    () => ({
      ...style,
      transitionDelay: `${delay}ms`,
    }),
    [style, delay]
  );

  return (
    <Component
      ref={ref}
      className={["reveal-on-scroll", isVisible ? "is-visible" : "", className]
        .filter(Boolean)
        .join(" ")}
      style={mergedStyle}
      {...props}
    >
      {children}
    </Component>
  );
}
