import * as React from "react";

import { cn } from "@/lib/utils";
import { CyberBadge } from "./cyber-badge";

export interface CyberSectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  grid?: boolean;
  glow?: boolean;
  headerClassName?: string;
}

const CyberSection = React.forwardRef<HTMLElement, CyberSectionProps>(
  (
    {
      className,
      children,
      title,
      subtitle,
      badge,
      grid = false,
      glow = false,
      headerClassName,
      ...props
    },
    ref,
  ) => (
    <section
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-zinc-950 px-4 py-16 text-zinc-50 sm:px-6 lg:px-8",
        grid &&
          "bg-[linear-gradient(rgba(248,113,113,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(248,113,113,0.07)_1px,transparent_1px)] bg-[size:34px_34px]",
        className,
      )}
      {...props}
    >
      {glow ? (
        <>
          <div className="pointer-events-none absolute -top-32 left-1/4 size-80 rounded-full bg-red-400/12 blur-3xl" />
          <div className="pointer-events-none absolute right-0 bottom-0 size-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
        </>
      ) : null}
      <div className="relative mx-auto max-w-7xl">
        <div className={cn("mb-10 max-w-3xl", headerClassName)}>
          {badge ? (
            <div className="mb-4">
              {typeof badge === "string" ? (
                <CyberBadge glow>{badge}</CyberBadge>
              ) : (
                badge
              )}
            </div>
          ) : null}
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
              {subtitle}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  ),
);
CyberSection.displayName = "CyberSection";

export { CyberSection };
