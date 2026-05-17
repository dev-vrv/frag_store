"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cyberButtonVariants = cva(
  "group relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-md border font-mono font-semibold uppercase tracking-[0.16em] text-xs outline-none transition-all duration-200 before:absolute before:inset-0 before:opacity-0 before:transition-opacity active:translate-y-px disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 focus-visible:ring-2 focus-visible:ring-red-300/50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "border-red-300/45 bg-red-500 text-white shadow-[0_0_24px_rgba(248,113,113,0.24)] before:bg-white/25 hover:border-red-100 hover:bg-red-400 hover:shadow-[0_0_34px_rgba(248,113,113,0.44)] hover:before:opacity-100",
        secondary:
          "border-violet-400/35 bg-violet-500/15 text-violet-100 shadow-[0_0_22px_rgba(139,92,246,0.16)] before:bg-violet-300/10 hover:bg-violet-500/25 hover:shadow-[0_0_32px_rgba(139,92,246,0.28)]",
        ghost:
          "border-transparent bg-transparent text-zinc-300 before:bg-white/5 hover:border-white/10 hover:text-white hover:before:opacity-100",
        danger:
          "border-red-400/45 bg-red-500/15 text-red-100 shadow-[0_0_22px_rgba(248,113,113,0.16)] before:bg-red-300/10 hover:bg-red-500/25 hover:shadow-[0_0_32px_rgba(248,113,113,0.3)]",
        neon:
          "border-red-300/50 bg-red-500/10 text-red-100 shadow-[0_0_26px_rgba(248,113,113,0.24)] before:bg-gradient-to-r before:from-red-300/25 before:via-rose-300/20 before:to-amber-300/15 hover:text-white hover:shadow-[0_0_38px_rgba(248,113,113,0.36)] hover:before:opacity-100",
        outline:
          "border-red-300/30 bg-zinc-950/30 text-red-100 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] before:bg-red-300/10 hover:border-red-200/60 hover:bg-red-300/10 hover:shadow-[0_0_28px_rgba(248,113,113,0.18)]",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-sm",
        icon: "size-10 p-0 tracking-normal",
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
