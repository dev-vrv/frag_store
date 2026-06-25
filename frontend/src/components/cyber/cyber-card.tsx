import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const cyberCardVariants = cva(
  "group relative overflow-hidden rounded-lg border text-zinc-50 transition-all duration-300 before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(248,113,113,0.08),transparent_35%,rgba(217,70,239,0.08))] before:opacity-70 after:pointer-events-none after:absolute after:inset-x-6 after:top-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-red-200/70 after:to-transparent",
  {
    variants: {
      variant: {
        default: "border-white/10 bg-zinc-950/85 shadow-xl shadow-black/20",
        glowing:
          "border-red-300/30 bg-zinc-950/85 shadow-[0_0_36px_rgba(248,113,113,0.14)] hover:shadow-[0_0_46px_rgba(248,113,113,0.22)]",
        bordered:
          "border-violet-300/30 bg-zinc-950/80 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]",
        glass:
          "border-white/12 bg-white/[0.065] shadow-2xl shadow-black/30 backdrop-blur-xl",
        product:
          "border-red-300/16 bg-[radial-gradient(circle_at_top_left,rgba(255,94,77,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(251,146,60,0.12),transparent_24%),linear-gradient(180deg,rgba(18,9,11,0.98),rgba(8,5,6,0.99))] shadow-2xl shadow-black/40 hover:shadow-[0_0_44px_rgba(255,94,77,0.14)]",
      },
      hover: {
        true: "hover:-translate-y-1",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      hover: false,
    },
  },
);

export interface CyberCardProps
  extends React.ComponentProps<typeof Card>,
    VariantProps<typeof cyberCardVariants> {}

const CyberCard = React.forwardRef<HTMLDivElement, CyberCardProps>(
  ({ className, variant, hover, ...props }, ref) => (
    <Card
      ref={ref}
      className={cn(cyberCardVariants({ variant, hover }), className)}
      {...props}
    />
  ),
);
CyberCard.displayName = "CyberCard";

const CyberCardHeader = CardHeader;
const CyberCardTitle = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CardTitle>
>(({ className, ...props }, ref) => (
  <CardTitle
    ref={ref}
    className={cn("font-display text-xl font-normal tracking-[0.04em]", className)}
    {...props}
  />
));
CyberCardTitle.displayName = "CyberCardTitle";
const CyberCardDescription = CardDescription;
const CyberCardContent = CardContent;
const CyberCardFooter = CardFooter;

export {
  CyberCard,
  CyberCardHeader,
  CyberCardTitle,
  CyberCardDescription,
  CyberCardContent,
  CyberCardFooter,
  cyberCardVariants,
};
