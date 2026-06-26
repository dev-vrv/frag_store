"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const HERO_ROTATION_MS = 6200;
const HERO_TRANSITION_MS = 950;
const HERO_OVERLAP_DELAY_MS = 110;

export interface HeroMediaRotatorProps {
  images: string[];
}

export function HeroMediaRotator({ images }: HeroMediaRotatorProps) {
  const heroImages = useMemo(() => images.filter(Boolean), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const activeIndexRef = useRef(0);
  const frameTimeoutRef = useRef<number | null>(null);

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
      if (frameTimeoutRef.current !== null) {
        window.clearTimeout(frameTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (heroImages.length <= 1 || reducedMotion) {
      return undefined;
    }

    const clearFrameTimeout = () => {
      if (frameTimeoutRef.current !== null) {
        window.clearTimeout(frameTimeoutRef.current);
        frameTimeoutRef.current = null;
      }
    };

    const scheduleCycle = () => {
      clearFrameTimeout();

      frameTimeoutRef.current = window.setTimeout(() => {
        const nextIndex = (activeIndexRef.current + 1) % heroImages.length;

        setPreviousIndex(activeIndexRef.current);
        setActiveIndex(nextIndex);
        setIsTransitioning(false);
        activeIndexRef.current = nextIndex;

        frameTimeoutRef.current = window.setTimeout(() => {
          setIsTransitioning(true);

          frameTimeoutRef.current = window.setTimeout(() => {
            setPreviousIndex(null);
            setIsTransitioning(false);
            scheduleCycle();
          }, HERO_TRANSITION_MS);
        }, HERO_OVERLAP_DELAY_MS);
      }, HERO_ROTATION_MS);
    };

    scheduleCycle();

    return () => {
      clearFrameTimeout();
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
  const displayPreviousIndex =
    reducedMotion || previousIndex === null ? null : previousIndex % heroImages.length;

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

      {displayPreviousIndex !== null ? (
        <div
          className={
            isTransitioning
              ? "hero-media-layer hero-media-layer--outgoing"
              : "hero-media-layer hero-media-layer--visible"
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImages[displayPreviousIndex]}
            alt=""
            className="hero-media-image"
            draggable={false}
          />
        </div>
      ) : null}

      <div
        className={
          displayPreviousIndex !== null
            ? isTransitioning
              ? "hero-media-layer hero-media-layer--active"
              : "hero-media-layer hero-media-layer--hidden"
            : "hero-media-layer hero-media-layer--visible"
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImages[displayActiveIndex]}
          alt=""
          className="hero-media-image"
          draggable={false}
        />
      </div>
    </div>
  );
}
