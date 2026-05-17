import * as React from "react";

import { cn } from "@/lib/utils";

export interface SectionProps {
  className?: string;
  children: React.ReactNode;
}

export function Section({ className, children }: SectionProps) {
  return <section className={cn("NameSection", className)}>{children}</section>;
}
