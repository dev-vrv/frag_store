import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cyberBadgeVariants = cva(
  "cyber-cut-small font-tech inline-flex w-fit items-center gap-1 border px-3 py-1.5 text-xs font-bold uppercase leading-none tracking-[0.12em]",
  {
    variants: {
      variant: {
        cyan: "border-cyan-300/45 bg-cyan-300/10 text-cyan-100",
        violet: "border-violet-300/40 bg-violet-400/10 text-violet-100",
        green: "border-lime-300/40 bg-lime-300/10 text-lime-100",
        red: "border-red-300/40 bg-red-400/10 text-red-100",
        warning: "border-amber-300/40 bg-amber-300/10 text-amber-100",
        neutral: "border-white/15 bg-white/7 text-zinc-200",
      },
      glow: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      { variant: "cyan", glow: true, className: "shadow-[0_0_18px_rgba(34,211,238,0.22)]" },
      { variant: "violet", glow: true, className: "shadow-[0_0_18px_rgba(139,92,246,0.22)]" },
      { variant: "green", glow: true, className: "shadow-[0_0_18px_rgba(163,230,53,0.18)]" },
      { variant: "red", glow: true, className: "shadow-[0_0_18px_rgba(248,113,113,0.22)]" },
      { variant: "warning", glow: true, className: "shadow-[0_0_18px_rgba(251,191,36,0.2)]" },
    ],
    defaultVariants: {
      variant: "cyan",
      glow: false,
    },
  },
);

export interface CyberBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof cyberBadgeVariants> {}

const CyberBadge = React.forwardRef<HTMLSpanElement, CyberBadgeProps>(
  ({ className, variant, glow, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(cyberBadgeVariants({ variant, glow }), className)}
      {...props}
    />
  ),
);
CyberBadge.displayName = "CyberBadge";

export { CyberBadge, cyberBadgeVariants };
