import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-base text-zinc-50 shadow-xs outline-none transition-[color,box-shadow,border-color] placeholder:text-zinc-500 selection:bg-red-300 selection:text-white file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-red-300/70 focus-visible:ring-2 focus-visible:ring-red-300/20 aria-invalid:border-red-400/70 aria-invalid:ring-red-400/20",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
