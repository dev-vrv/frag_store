"use client";

import * as React from "react";

import { BrandLogo } from "@/components/Brand/BrandLogo";

export function CyberLoader() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isHidden, setIsHidden] = React.useState(false);

  React.useEffect(() => {
    let openTimer: number;
    let hideTimer: number;

    function startExit() {
      openTimer = window.setTimeout(() => setIsOpen(true), 260);
      hideTimer = window.setTimeout(() => setIsHidden(true), 1750);
    }

    if (document.readyState === "complete") {
      startExit();
    } else {
      window.addEventListener("load", startExit, { once: true });
    }

    return () => {
      window.removeEventListener("load", startExit);
      window.clearTimeout(openTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (isHidden) {
    return null;
  }

  return (
    <div
      className="cyber-loader"
      data-open={isOpen}
      role="status"
      aria-label="Loading"
      aria-live="polite"
    >
      <div className="cyber-loader__door cyber-loader__door--left" />
      <div className="cyber-loader__door cyber-loader__door--right" />
      <div className="cyber-loader__core">
        <div className="cyber-loader__mark" aria-label="Frag Store">
          <BrandLogo className="w-[10rem] sm:w-[12rem]" imageClassName="brightness-[1.1]" priority />
        </div>
        <div className="cyber-loader__line" />
      </div>
    </div>
  );
}
