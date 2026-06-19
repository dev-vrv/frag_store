"use client";

import React, { useEffect, useState, useRef } from "react";

type Config = {
	duration?: number;
	delayStep?: number;
	distance?: number;
	fromOpacity?: number;
	toOpacity?: number;
	easing?: string;
};

const defaultConfig: Required<Config> = {
	duration: 0.2,
	delayStep: 30,
	distance: 40,
	fromOpacity: 0,
	toOpacity: 1,
	easing: "ease-out",
};

type Props = {
	text: string;
	className?: string;
	config?: Config;
	delay?: number;
	as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
};

export default function AnimatedText({
	text,
	className,
	config = {},
	delay = 0,
	as = "div",
}: Props) {
	const mergedConfig: Required<Config> = {
		...defaultConfig,
		...config,
	};
  const Tag = as;

  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const beginObserve = () => {
      if (observer) return;
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (observer) {
              observer.disconnect();
            }
          }
        },
        { threshold: 0.1 }
      );
      if (ref.current) observer.observe(ref.current);
    };

    // If loader overlay is still visible, defer start until 'app:ready'
    const loading = typeof document !== 'undefined' && document.documentElement.getAttribute('data-app-loading') === '1';
    if (loading) {
      const onReady = () => {
        beginObserve();
        window.removeEventListener('app:ready', onReady);
      };
      window.addEventListener('app:ready', onReady);
      return () => window.removeEventListener('app:ready', onReady);
    } else {
      beginObserve();
      return () => {
        if (observer) {
          observer.disconnect();
        }
      };
    }
  }, []);

	// Split text into words and spaces to avoid breaking in the middle of words
	const segments = React.useMemo(() => text.split(/(\s+)/), [text]);

	let charCounter = 0;

	return (
		<div ref={ref}>
      <Tag
        className={["inline-block text-center align-middle", className]
          .filter(Boolean)
          .join(" ")}
        style={{ overflow: "visible", wordBreak: "keep-all", whiteSpace: "pre-wrap" }}
      >
			{segments.map((seg, wi) => {
				// Render whitespace segments as-is to preserve natural wrapping
				if (/^\s+$/.test(seg)) {
					return <span key={`ws-${wi}`}>{seg}</span>;
				}

				// Animate characters inside each word, but keep the whole word together
				const chars = seg.split("");
				return (
					<span key={`w-${wi}`} className="inline-block">
						{chars.map((ch, ci) => {
							const idx = charCounter++;
							return (
								<span
									key={`c-${wi}-${ci}`}
									className="inline-block will-change-transform align-baseline"
									style={{
										display: "inline-block",
										lineHeight: 1,
										opacity: isVisible ? mergedConfig.toOpacity : mergedConfig.fromOpacity,
										transform: isVisible
											? "translate(0, 0) rotate(0deg) translateZ(0)"
											: `translate(-${mergedConfig.distance / 1.5}px, ${mergedConfig.distance / 1.5}px) rotate(-15deg) translateZ(0)`,
										transition: `transform ${mergedConfig.duration / 2}s ${mergedConfig.easing} ${(delay + idx * mergedConfig.delayStep) / 1000}s, opacity ${mergedConfig.duration / 2}s ${mergedConfig.easing} ${(delay + idx * mergedConfig.delayStep) / 1000}s`,
									}}
								>
									{ch}
								</span>
							);
						})}
					</span>
				);
			})}
      </Tag>
		</div>
	);
}
