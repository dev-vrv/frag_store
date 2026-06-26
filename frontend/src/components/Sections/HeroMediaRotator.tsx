"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const HERO_ROTATION_MS = 6200;
const HERO_TRANSITION_MS = 1200;

export interface HeroMediaRotatorProps {
  images: string[];
}

export function HeroMediaRotator({ images }: HeroMediaRotatorProps) {
  const heroImages = useMemo(() => images.filter(Boolean), [images]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  const [isFading, setIsFading] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const currentIndexRef = useRef(0);
  const rotationTimeoutRef = useRef<number | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      setReducedMotion(mediaQuery.matches);
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    return () => {
      if (rotationTimeoutRef.current !== null) {
        window.clearTimeout(rotationTimeoutRef.current);
      }
      if (fadeTimeoutRef.current !== null) {
        window.clearTimeout(fadeTimeoutRef.current);
      }
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (heroImages.length <= 1 || reducedMotion) {
      return undefined;
    }

    const clearTimers = () => {
      if (rotationTimeoutRef.current !== null) {
        window.clearTimeout(rotationTimeoutRef.current);
        rotationTimeoutRef.current = null;
      }
      if (fadeTimeoutRef.current !== null) {
        window.clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = null;
      }
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const scheduleNext = () => {
      clearTimers();

      rotationTimeoutRef.current = window.setTimeout(() => {
        const nextIndex = (currentIndexRef.current + 1) % heroImages.length;

        setIncomingIndex(nextIndex);
        setIsFading(false);

        rafRef.current = window.requestAnimationFrame(() => {
          rafRef.current = window.requestAnimationFrame(() => {
            setIsFading(true);
          });
        });

        fadeTimeoutRef.current = window.setTimeout(() => {
          setCurrentIndex(nextIndex);
          currentIndexRef.current = nextIndex;
          setIncomingIndex(null);
          setIsFading(false);
          scheduleNext();
        }, HERO_TRANSITION_MS);
      }, HERO_ROTATION_MS);
    };

    scheduleNext();

    return () => {
      clearTimers();
    };
  }, [heroImages.length, reducedMotion]);

  if (heroImages.length === 0) {
    return (
      <div aria-hidden="true" className="hero-media-rotator">
        <div className="hero-media-ambient hero-media-ambient--primary" />
        <div className="hero-media-ambient hero-media-ambient--secondary" />
      </div>
    );
  }

  const visibleIndex = reducedMotion ? 0 : currentIndex % heroImages.length;
  const nextIndex =
    reducedMotion || heroImages.length <= 1 || incomingIndex === null
      ? null
      : incomingIndex % heroImages.length;

  return (
    <div
      aria-hidden="true"
      className="hero-media-rotator"
      style={{ ["--hero-transition-duration" as string]: `${HERO_TRANSITION_MS}ms` }}
    >
      <div className="hero-media-ambient hero-media-ambient--primary" />
      <div className="hero-media-ambient hero-media-ambient--secondary" />
      <div className="hero-media-glow hero-media-glow--warm" />
      <div className="hero-media-glow hero-media-glow--cool" />
      <div className="hero-media-beam" />

      {heroImages.map((imageSrc, index) => {
        let layerClassName = "hero-media-layer hero-media-layer--hidden";

        if (index === visibleIndex) {
          layerClassName =
            nextIndex !== null
              ? isFading
                ? "hero-media-layer hero-media-layer--fading-out"
                : "hero-media-layer hero-media-layer--visible"
              : "hero-media-layer hero-media-layer--visible";
        }

        if (nextIndex !== null && index === nextIndex) {
          layerClassName = isFading
            ? "hero-media-layer hero-media-layer--fading-in"
            : "hero-media-layer hero-media-layer--hidden";
        }

        return (
          <div key={imageSrc} className={layerClassName}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt=""
              className="hero-media-image"
              draggable={false}
              loading="eager"
            />
          </div>
        );
      })}
    </div>
  );
}
