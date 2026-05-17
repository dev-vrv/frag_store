import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full min-w-0 border border-white/10 bg-white/5 px-3 py-2 text-base text-zinc-50 shadow-xs outline-none transition-[color,box-shadow,border-color] placeholder:text-zinc-500 selection:bg-lime-300 selection:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-lime-300/70 focus-visible:ring-2 focus-visible:ring-lime-300/20 aria-invalid:border-red-400/70 aria-invalid:ring-red-400/20",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
