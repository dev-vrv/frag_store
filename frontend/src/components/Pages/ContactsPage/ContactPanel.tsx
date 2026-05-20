import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ContactPanelProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function ContactPanel({
  children,
  className,
  contentClassName,
}: ContactPanelProps) {
  return (
    <div className={cn("contact-panel p-px", className)}>
      <div className={cn("contact-panel__content", contentClassName)}>
        {children}
      </div>
    </div>
  );
}
