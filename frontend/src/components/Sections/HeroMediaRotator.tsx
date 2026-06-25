"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const HERO_ROTATION_MS = 6200;
const HERO_TRANSITION_MS = 2800;

export interface HeroMediaRotatorProps {
  images: string[];
}

export function HeroMediaRotator({ images }: HeroMediaRotatorProps) {
  const heroImages = useMemo(() => images.filter(Boolean), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const activeIndexRef = useRef(0);
  const clearOutgoingTimeoutRef = useRef<number | null>(null);

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
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    return () => {
      if (clearOutgoingTimeoutRef.current !== null) {
        window.clearTimeout(clearOutgoingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (heroImages.length <= 1 || reducedMotion) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      const currentIndex = activeIndexRef.current;
      const nextIndex = (currentIndex + 1) % heroImages.length;

      setOutgoingIndex(currentIndex);
      setActiveIndex(nextIndex);
      activeIndexRef.current = nextIndex;

      if (clearOutgoingTimeoutRef.current !== null) {
        window.clearTimeout(clearOutgoingTimeoutRef.current);
      }

      clearOutgoingTimeoutRef.current = window.setTimeout(() => {
        setOutgoingIndex(null);
      }, HERO_TRANSITION_MS);
    }, HERO_ROTATION_MS);

    return () => {
      window.clearInterval(intervalId);
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

  const displayActiveIndex = reducedMotion ? 0 : activeIndex % heroImages.length;
  const displayOutgoingIndex =
    reducedMotion || outgoingIndex === null ? null : outgoingIndex % heroImages.length;

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

      <div
        className="hero-media-layer hero-media-layer--active"
        key={`active-${heroImages[displayActiveIndex]}`}
        style={{ backgroundImage: `url(${heroImages[displayActiveIndex]})` }}
      />

      {displayOutgoingIndex !== null && displayOutgoingIndex !== displayActiveIndex ? (
        <div
          className="hero-media-layer hero-media-layer--outgoing"
          key={`outgoing-${heroImages[displayOutgoingIndex]}`}
          style={{ backgroundImage: `url(${heroImages[displayOutgoingIndex]})` }}
        />
      ) : null}
    </div>
  );
}
