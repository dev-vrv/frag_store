"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cyberButtonVariants = cva(
  "cyber-cut-button font-display group relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden border-2 font-normal uppercase tracking-[0.08em] text-sm outline-none transition-all duration-200 before:absolute before:inset-0 before:opacity-0 before:transition-opacity after:pointer-events-none after:absolute after:right-2 after:top-2 after:h-5 after:w-5 after:border-t-2 after:border-r-2 active:translate-y-px disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 focus-visible:ring-2 focus-visible:ring-lime-300/50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "border-lime-300 bg-zinc-950 text-lime-200 shadow-[0_0_24px_rgba(190,242,100,0.18)] before:bg-lime-300/12 after:border-lime-300 hover:bg-lime-300 hover:text-zinc-950 hover:shadow-[0_0_34px_rgba(190,242,100,0.38)] hover:before:opacity-100",
        secondary:
          "border-cyan-300/55 bg-cyan-500/10 text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.16)] before:bg-cyan-300/10 after:border-cyan-300 hover:bg-cyan-300/18 hover:shadow-[0_0_32px_rgba(34,211,238,0.28)]",
        ghost:
          "border-white/20 bg-transparent text-zinc-300 before:bg-white/5 after:border-white/35 hover:border-lime-300/55 hover:text-lime-100 hover:before:opacity-100",
        danger:
          "border-red-400/70 bg-red-500/12 text-red-100 shadow-[0_0_22px_rgba(248,113,113,0.16)] before:bg-red-300/10 after:border-red-300 hover:bg-red-500/25 hover:shadow-[0_0_32px_rgba(248,113,113,0.3)]",
        neon:
          "border-fuchsia-300/70 bg-fuchsia-500/10 text-fuchsia-100 shadow-[0_0_26px_rgba(217,70,239,0.24)] before:bg-gradient-to-r before:from-lime-300/20 before:via-fuchsia-300/25 before:to-cyan-300/20 after:border-fuchsia-300 hover:text-white hover:shadow-[0_0_38px_rgba(217,70,239,0.36)] hover:before:opacity-100",
        outline:
          "border-lime-300/65 bg-zinc-950/30 text-lime-100 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] before:bg-lime-300/10 after:border-lime-300 hover:border-lime-200 hover:bg-lime-300/10 hover:shadow-[0_0_28px_rgba(190,242,100,0.22)]",
      },
      size: {
        sm: "h-10 px-5 text-xs",
        md: "h-12 px-7",
        lg: "h-14 px-9 text-base",
        icon: "size-12 p-0 tracking-normal",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface CyberButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof cyberButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const CyberButton = React.forwardRef<HTMLButtonElement, CyberButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    if (asChild) {
      return (
        <Comp
          ref={ref}
          className={cn(cyberButtonVariants({ variant, size }), className)}
          aria-busy={loading || undefined}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        ref={ref}
        className={cn(cyberButtonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </Comp>
    );
  },
);
CyberButton.displayName = "CyberButton";

export { CyberButton, cyberButtonVariants };
