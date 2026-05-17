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
          "border-white/10 bg-[linear-gradient(180deg,rgba(39,39,42,0.82),rgba(9,9,11,0.96))] shadow-2xl shadow-black/30 hover:border-red-300/35 hover:shadow-[0_0_38px_rgba(248,113,113,0.16)]",
      },
      hover: {
        true: "hover:-translate-y-1 hover:border-red-300/35",
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
const CyberCardTitle = CardTitle;
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
