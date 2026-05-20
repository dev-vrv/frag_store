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
            className="font-tech block text-sm font-semibold uppercase tracking-[0.1em] text-zinc-300"
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
              "cyber-cut-small font-tech h-13 rounded-none border-lime-300/30 bg-black/40 text-base shadow-[inset_0_0_0_1px_rgba(190,242,100,0.04),inset_0_0_18px_rgba(190,242,100,0.05)] placeholder:text-zinc-600 focus-visible:border-lime-300/80 focus-visible:ring-lime-300/25",
              icon && "pl-10",
              invalid &&
                "border-red-400/60 focus-visible:border-red-300 focus-visible:ring-red-400/20",
              className,
            )}
            {...props}
          />
        </div>
        {errorText ? (
          <p className="font-tech text-sm text-red-300">{errorText}</p>
        ) : helperText ? (
          <p className="font-tech text-sm text-zinc-500">{helperText}</p>
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
            className="font-tech block text-sm font-semibold uppercase tracking-[0.1em] text-zinc-300"
          >
            {label}
          </label>
        ) : null}
        <Textarea
          ref={ref}
          id={textareaId}
          aria-invalid={invalid || undefined}
          className={cn(
            "cyber-cut-surface font-tech min-h-36 resize-y rounded-none border-lime-300/30 bg-black/40 text-base shadow-[inset_0_0_0_1px_rgba(190,242,100,0.04),inset_0_0_18px_rgba(190,242,100,0.05)] placeholder:text-zinc-600 focus-visible:border-lime-300/80 focus-visible:ring-lime-300/25",
            invalid &&
              "border-red-400/60 focus-visible:border-red-300 focus-visible:ring-red-400/20",
            className,
          )}
          {...props}
        />
        {errorText ? (
          <p className="font-tech text-sm text-red-300">{errorText}</p>
        ) : helperText ? (
          <p className="font-tech text-sm text-zinc-500">{helperText}</p>
        ) : null}
      </div>
    );
  },
);
CyberTextarea.displayName = "CyberTextarea";

export { CyberInput, CyberTextarea };
