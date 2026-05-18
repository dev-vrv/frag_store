import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { CyberCard, CyberCardContent } from "./cyber-card";

const featureAccentVariants = cva("", {
  variants: {
    accent: {
      cyan: "text-red-200 shadow-red-500/20",
      violet: "text-violet-200 shadow-violet-500/20",
      fuchsia: "text-fuchsia-200 shadow-fuchsia-500/20",
      lime: "text-lime-200 shadow-lime-500/20",
      red: "text-red-200 shadow-red-500/20",
    },
  },
  defaultVariants: {
    accent: "cyan",
  },
});

export interface CyberFeatureCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof featureAccentVariants> {
  icon: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
}

const CyberFeatureCard = React.forwardRef<HTMLDivElement, CyberFeatureCardProps>(
  ({ className, icon, title, description, accent, ...props }, ref) => (
    <CyberCard
      ref={ref}
      variant="glass"
      className={cn(
        "h-full transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_0_34px_rgba(248,113,113,0.12)]",
        className,
      )}
      {...props}
    >
      <CyberCardContent className="p-5">
        <div
          className={cn(
            "cyber-cut-small mb-5 flex size-13 items-center justify-center border border-white/10 bg-white/7 shadow-xl transition-shadow duration-300 [&_svg]:size-6",
            featureAccentVariants({ accent }),
          )}
        >
          {icon}
        </div>
        <h3 className="font-display text-2xl font-normal tracking-[0.04em] text-white">{title}</h3>
        <p className="mt-3 text-base leading-7 text-zinc-400">{description}</p>
      </CyberCardContent>
    </CyberCard>
  ),
);
CyberFeatureCard.displayName = "CyberFeatureCard";

export { CyberFeatureCard };
