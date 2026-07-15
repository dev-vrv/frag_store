"use client";

import React from "react";

type Config = {
	duration?: number;
	delayStep?: number;
	distance?: number;
	fromOpacity?: number;
	toOpacity?: number;
	easing?: string;
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
	as = "div",
}: Props) {
  const Tag = as;

	return (
		<Tag
      className={["inline-block text-center align-middle", className].filter(Boolean).join(" ")}
      style={{ overflow: "visible", wordBreak: "keep-all", whiteSpace: "pre-wrap" }}
    >
      {text}
    </Tag>
	);
}
