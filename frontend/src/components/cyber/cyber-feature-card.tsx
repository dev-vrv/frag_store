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
    <CyberCard ref={ref} variant="glass" hover className={cn("h-full", className)} {...props}>
      <CyberCardContent className="p-5">
        <div
          className={cn(
            "mb-5 flex size-12 items-center justify-center rounded-lg border border-white/10 bg-white/7 shadow-2xl [&_svg]:size-5",
            featureAccentVariants({ accent }),
          )}
        >
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>
      </CyberCardContent>
    </CyberCard>
  ),
);
CyberFeatureCard.displayName = "CyberFeatureCard";

export { CyberFeatureCard };
