import * as React from "react";

import { cn } from "@/lib/utils";

export interface SectionProps {
  id?: string;
  className?: string;
  containerClassName?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Section({
  id,
  className,
  containerClassName,
  fullWidth = false,
  children,
}: SectionProps) {
  return (
    <section id={id} className={cn("NameSection", className)}>
      <div className={cn("section", fullWidth && "section-full", containerClassName)}>
        {children}
      </div>
    </section>
  );
}
