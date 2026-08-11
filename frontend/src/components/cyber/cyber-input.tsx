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
  labelClassName?: string;
  tone?: "lime" | "red" | "neutral";
}

const CyberInput = React.forwardRef<HTMLInputElement, CyberInputProps>(
  (
    {
      className,
      icon,
      helperText,
      errorText,
      label,
      labelClassName,
      tone = "lime",
      id,
      "aria-invalid": ariaInvalid,
      ...props
    },
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
            className={cn(
              "font-tech type-label block text-zinc-300",
              labelClassName,
            )}
          >
            {label}
          </label>
        ) : null}
        <div className="relative">
          {icon ? (
            <span
              className={cn(
                "pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 [&_svg]:size-4",
                tone === "red"
                  ? "text-red-200/90"
                  : tone === "neutral"
                    ? "contact-tone-muted"
                    : "text-lime-200/80",
              )}
            >
              {icon}
            </span>
          ) : null}
          <Input
            ref={ref}
            id={inputId}
            aria-invalid={invalid || undefined}
            className={cn(
              "cyber-cut-small font-tech h-13 text-base font-normal placeholder:text-zinc-500",
              tone === "red"
                ? "rounded-none border-red-300/30 bg-zinc-950/60 text-zinc-100 shadow-[inset_0_0_0_1px_rgba(248,113,113,0.04),inset_0_0_20px_rgba(255,23,68,0.05)] [clip-path:polygon(0_0,calc(100%-9px)_0,100%_9px,100%_100%,9px_100%,0_calc(100%-9px))] transition-[clip-path,border-color,background-color,box-shadow] duration-300 hover:border-red-300/50 hover:bg-red-500/[0.07] focus-visible:border-red-200/80 focus-visible:bg-red-500/[0.08] focus-visible:ring-red-300/25 focus-visible:shadow-[0_0_24px_rgba(255,23,68,0.12)] focus-visible:[clip-path:polygon(0_0,calc(100%-13px)_0,100%_13px,100%_100%,13px_100%,0_calc(100%-13px))]"
                : tone === "neutral"
                  ? "contact-field rounded-none [clip-path:polygon(0_0,calc(100%-9px)_0,100%_9px,100%_100%,9px_100%,0_calc(100%-9px))] transition-[clip-path,border-color,background-color,box-shadow] duration-300 focus-visible:[clip-path:polygon(0_0,calc(100%-13px)_0,100%_13px,100%_100%,13px_100%,0_calc(100%-13px))]"
                  : "rounded-sm border-lime-300/30 bg-surface/40 shadow-[inset_0_0_0_1px_rgba(190,242,100,0.04),inset_0_0_18px_rgba(190,242,100,0.05)] focus-visible:border-lime-300/80 focus-visible:ring-lime-300/25",
              icon && "pl-10",
              invalid &&
                "border-red-400/60 focus-visible:border-red-300 focus-visible:ring-red-400/20",
              className,
            )}
            {...props}
          />
        </div>
        {errorText ? (
          <p className="font-tech type-body-sm text-red-300">{errorText}</p>
        ) : helperText ? (
          <p className="font-tech type-body-sm text-zinc-500">{helperText}</p>
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
  labelClassName?: string;
  tone?: "lime" | "red" | "neutral";
}

const CyberTextarea = React.forwardRef<HTMLTextAreaElement, CyberTextareaProps>(
  (
    {
      className,
      helperText,
      errorText,
      label,
      labelClassName,
      tone = "lime",
      id,
      "aria-invalid": ariaInvalid,
      ...props
    },
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
            className={cn(
              "font-tech type-label block text-zinc-300",
              labelClassName,
            )}
          >
            {label}
          </label>
        ) : null}
        <Textarea
          ref={ref}
          id={textareaId}
          aria-invalid={invalid || undefined}
          className={cn(
            "font-tech min-h-36 resize-y text-base font-normal placeholder:text-zinc-500",
            tone === "red"
              ? "rounded-none border-red-300/30 bg-zinc-950/60 text-zinc-100 shadow-[inset_0_0_0_1px_rgba(248,113,113,0.04),inset_0_0_20px_rgba(255,23,68,0.05)] [clip-path:polygon(0_0,calc(100%-9px)_0,100%_9px,100%_100%,9px_100%,0_calc(100%-9px))] transition-[clip-path,border-color,background-color,box-shadow] duration-300 hover:border-red-300/50 hover:bg-red-500/[0.07] focus-visible:border-red-200/80 focus-visible:bg-red-500/[0.08] focus-visible:ring-red-300/25 focus-visible:shadow-[0_0_24px_rgba(255,23,68,0.12)] focus-visible:[clip-path:polygon(0_0,calc(100%-13px)_0,100%_13px,100%_100%,13px_100%,0_calc(100%-13px))]"
              : tone === "neutral"
                ? "contact-field rounded-none [clip-path:polygon(0_0,calc(100%-9px)_0,100%_9px,100%_100%,9px_100%,0_calc(100%-9px))] transition-[clip-path,border-color,background-color,box-shadow] duration-300 focus-visible:[clip-path:polygon(0_0,calc(100%-13px)_0,100%_13px,100%_100%,13px_100%,0_calc(100%-13px))]"
                : "cyber-cut-surface rounded-sm border-lime-300/30 bg-surface/40 shadow-[inset_0_0_0_1px_rgba(190,242,100,0.04),inset_0_0_18px_rgba(190,242,100,0.05)] focus-visible:border-lime-300/80 focus-visible:ring-lime-300/25",
            invalid &&
              "border-red-400/60 focus-visible:border-red-300 focus-visible:ring-red-400/20",
            className,
          )}
          {...props}
        />
        {errorText ? (
          <p className="font-tech type-body-sm text-red-300">{errorText}</p>
        ) : helperText ? (
          <p className="font-tech type-body-sm text-zinc-500">{helperText}</p>
        ) : null}
      </div>
    );
  },
);
CyberTextarea.displayName = "CyberTextarea";

export { CyberInput, CyberTextarea };
