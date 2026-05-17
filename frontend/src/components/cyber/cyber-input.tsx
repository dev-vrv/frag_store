import * as React from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface CyberInputProps
  extends Omit<React.ComponentProps<typeof Input>, "prefix"> {
  icon?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  label?: React.ReactNode;
}

const CyberInput = React.forwardRef<HTMLInputElement, CyberInputProps>(
  (
    { className, icon, helperText, errorText, label, id, "aria-invalid": ariaInvalid, ...props },
    ref,
  ) => {
    const invalid = Boolean(errorText) || ariaInvalid === true || ariaInvalid === "true";
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    return (
      <div className="w-full space-y-2">
        {label ? (
          <label
            htmlFor={inputId}
            className="block font-mono text-xs font-semibold uppercase tracking-[0.16em] text-zinc-300"
          >
            {label}
          </label>
        ) : null}
        <div className="relative">
          {icon ? (
            <span className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-lime-200/80 [&_svg]:size-4">
              {icon}
            </span>
          ) : null}
          <Input
            ref={ref}
            id={inputId}
            aria-invalid={invalid || undefined}
            className={cn(
              "cyber-cut-small h-12 border-lime-300/25 bg-black/35 font-mono text-sm shadow-[inset_0_0_18px_rgba(190,242,100,0.05)] placeholder:text-zinc-600 focus-visible:border-lime-300/80 focus-visible:ring-lime-300/25",
              icon && "pl-10",
              invalid &&
                "border-red-400/60 focus-visible:border-red-300 focus-visible:ring-red-400/20",
              className,
            )}
            {...props}
          />
        </div>
        {errorText ? (
          <p className="font-mono text-xs text-red-300">{errorText}</p>
        ) : helperText ? (
          <p className="font-mono text-xs text-zinc-500">{helperText}</p>
        ) : null}
      </div>
    );
  },
);
CyberInput.displayName = "CyberInput";

export interface CyberTextareaProps
  extends React.ComponentProps<typeof Textarea> {
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  label?: React.ReactNode;
}

const CyberTextarea = React.forwardRef<HTMLTextAreaElement, CyberTextareaProps>(
  (
    { className, helperText, errorText, label, id, "aria-invalid": ariaInvalid, ...props },
    ref,
  ) => {
    const invalid = Boolean(errorText) || ariaInvalid === true || ariaInvalid === "true";
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;

    return (
      <div className="w-full space-y-2">
        {label ? (
          <label
            htmlFor={textareaId}
            className="block font-mono text-xs font-semibold uppercase tracking-[0.16em] text-zinc-300"
          >
            {label}
          </label>
        ) : null}
        <Textarea
          ref={ref}
          id={textareaId}
          aria-invalid={invalid || undefined}
          className={cn(
            "cyber-cut-surface min-h-32 resize-y border-lime-300/25 bg-black/35 font-mono text-sm shadow-[inset_0_0_18px_rgba(190,242,100,0.05)] placeholder:text-zinc-600 focus-visible:border-lime-300/80 focus-visible:ring-lime-300/25",
            invalid &&
              "border-red-400/60 focus-visible:border-red-300 focus-visible:ring-red-400/20",
            className,
          )}
          {...props}
        />
        {errorText ? (
          <p className="font-mono text-xs text-red-300">{errorText}</p>
        ) : helperText ? (
          <p className="font-mono text-xs text-zinc-500">{helperText}</p>
        ) : null}
      </div>
    );
  },
);
CyberTextarea.displayName = "CyberTextarea";

export { CyberInput, CyberTextarea };
