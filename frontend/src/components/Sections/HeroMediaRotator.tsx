"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const HERO_ROTATION_MS = 6200;
const HERO_TRANSITION_MS = 1400;
const HERO_GAP_MS = 180;

export interface HeroMediaRotatorProps {
  images: string[];
}

type HeroMediaPhase = "visible" | "hiding" | "hidden" | "showing";

export function HeroMediaRotator({ images }: HeroMediaRotatorProps) {
  const heroImages = useMemo(() => images.filter(Boolean), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<HeroMediaPhase>("visible");
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
        setPhase("hiding");

        frameTimeoutRef.current = window.setTimeout(() => {
          const nextIndex = (activeIndexRef.current + 1) % heroImages.length;

          setPhase("hidden");
          setActiveIndex(nextIndex);
          activeIndexRef.current = nextIndex;
          frameTimeoutRef.current = window.setTimeout(() => {
            setPhase("showing");

            frameTimeoutRef.current = window.setTimeout(() => {
              setPhase("visible");
              scheduleCycle();
            }, HERO_TRANSITION_MS);
          }, 34);
        }, HERO_TRANSITION_MS + HERO_GAP_MS);
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
  const renderPhase: HeroMediaPhase =
    reducedMotion || heroImages.length <= 1 ? "visible" : phase;
  const mediaLayerClassName =
    renderPhase === "hiding"
      ? "hero-media-layer hero-media-layer--outgoing"
      : renderPhase === "hidden"
        ? "hero-media-layer hero-media-layer--hidden"
        : renderPhase === "showing"
        ? "hero-media-layer hero-media-layer--active"
        : "hero-media-layer hero-media-layer--visible";

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
        className={mediaLayerClassName}
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
