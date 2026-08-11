"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cyberButtonVariants = cva(
  "cyber-cut-button font-tech group relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap border-2 text-sm font-semibold tracking-[0.04em] outline-none [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))] transition-[color,background-color,border-color,box-shadow,transform] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(110deg,transparent_20%,rgba(var(--theme-contrast-rgb),0.12)_50%,transparent_80%)] before:opacity-0 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.22,1,0.36,1)] after:pointer-events-none after:absolute after:inset-x-4 after:bottom-0 after:h-px after:origin-center after:scale-x-0 after:bg-current after:opacity-60 after:transition-[background-color,transform] after:duration-300 after:ease-[cubic-bezier(0.22,1,0.36,1)] hover:before:opacity-100 hover:after:scale-x-100 active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 focus-visible:ring-2 focus-visible:ring-lime-300/50 motion-reduce:transition-none motion-reduce:hover:transform-none motion-reduce:before:transition-none motion-reduce:after:transition-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "border-lime-300 bg-zinc-950 text-lime-200 shadow-[0_0_24px_rgba(190,242,100,0.18)] hover:bg-lime-300 hover:text-zinc-950 hover:shadow-[0_0_34px_rgba(190,242,100,0.38)]",
        secondary:
          "border-cyan-300/55 bg-cyan-500/10 text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.16)] hover:bg-cyan-300/18 hover:shadow-[0_0_32px_rgba(34,211,238,0.28)]",
        ghost:
          "border-white/20 bg-transparent text-zinc-300 hover:border-lime-300/55 hover:bg-lime-300/5 hover:text-lime-100",
        danger:
          "border-red-400/70 bg-red-500/12 text-red-100 shadow-[0_0_22px_rgba(248,113,113,0.16)] hover:bg-red-500/25 hover:shadow-[0_0_32px_rgba(248,113,113,0.3)]",
        neon:
          "border-fuchsia-300/70 bg-fuchsia-500/10 text-fuchsia-100 shadow-[0_0_26px_rgba(217,70,239,0.24)] hover:bg-fuchsia-500/20 hover:text-white hover:shadow-[0_0_38px_rgba(217,70,239,0.36)]",
        outline:
          "border-lime-300/65 bg-zinc-950/30 text-lime-100 shadow-[inset_0_0_0_1px_rgba(var(--theme-contrast-rgb),0.03)] hover:border-lime-200 hover:bg-lime-300/10 hover:shadow-[0_0_28px_rgba(190,242,100,0.22)]",
      },
      size: {
        sm: "h-10 px-6 text-sm",
        md: "h-12 px-8 text-sm sm:text-base",
        lg: "h-14 px-10 text-base",
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
    const content = (
      <>
        {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
        <span className="relative z-10 inline-flex items-center gap-2 px-3 py-1">
          {children}
        </span>
      </>
    );

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
        {content}
      </Comp>
    );
  },
);
CyberButton.displayName = "CyberButton";

export { CyberButton, cyberButtonVariants };
