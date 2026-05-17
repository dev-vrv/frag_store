"use client";

import * as React from "react";
import { Check, ChevronDown, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

export interface CyberSelectOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface CyberNativeSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: React.ReactNode;
  options: CyberSelectOption[];
  helperText?: React.ReactNode;
}

const CyberNativeSelect = React.forwardRef<HTMLSelectElement, CyberNativeSelectProps>(
  ({ className, label, options, helperText, id, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id ?? generatedId;

    return (
      <div className="w-full space-y-2">
        {label ? (
          <label
            htmlFor={selectId}
            className="block font-mono text-xs font-semibold uppercase tracking-[0.16em] text-zinc-300"
          >
            {label}
          </label>
        ) : null}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "cyber-cut-small h-12 w-full appearance-none border border-lime-300/35 bg-black/45 px-4 pr-10 font-mono text-xs uppercase tracking-[0.14em] text-lime-100 outline-none shadow-[inset_0_0_18px_rgba(190,242,100,0.05)] transition focus-visible:border-lime-300/80 focus-visible:ring-2 focus-visible:ring-lime-300/25 disabled:cursor-not-allowed disabled:opacity-50",
              className,
            )}
            {...props}
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="bg-zinc-950 text-lime-100"
              >
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-lime-200" />
        </div>
        {helperText ? <p className="font-mono text-xs text-zinc-500">{helperText}</p> : null}
      </div>
    );
  },
);
CyberNativeSelect.displayName = "CyberNativeSelect";

export interface CyberDropdownProps {
  label: React.ReactNode;
  items: Array<{
    label: React.ReactNode;
    checked?: boolean;
    disabled?: boolean;
    danger?: boolean;
  }>;
  className?: string;
}

function CyberDropdown({ label, items, className }: CyberDropdownProps) {
  return (
    <details className={cn("group relative w-full", className)}>
      <summary className="cyber-cut-button flex h-12 list-none items-center justify-between border-2 border-lime-300/65 bg-zinc-950/30 px-7 font-mono text-xs font-black uppercase tracking-[0.18em] text-lime-100 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] outline-none transition hover:bg-lime-300/10 [&::-webkit-details-marker]:hidden">
        {label}
        <ChevronDown className="size-4 transition group-open:rotate-180" />
      </summary>
      <div className="cyber-cut-surface absolute left-0 top-[calc(100%+0.5rem)] z-40 w-64 border border-lime-300/30 bg-zinc-950/95 p-2 font-mono text-xs uppercase tracking-[0.12em] shadow-[0_0_36px_rgba(190,242,100,0.16)]">
        {items.map((item, index) => (
          <button
            key={index}
            type="button"
            disabled={item.disabled}
            className={cn(
              "cyber-cut-small flex w-full items-center gap-2 border border-transparent px-3 py-2 text-left text-zinc-300 outline-none transition hover:border-lime-300/25 hover:bg-lime-300/10 hover:text-lime-100 disabled:cursor-not-allowed disabled:opacity-45",
              item.danger && "text-red-300 hover:border-red-300/25 hover:bg-red-300/10",
            )}
          >
            <span className="flex size-4 items-center justify-center">
              {item.checked ? <Check className="size-3.5 text-lime-200" /> : null}
            </span>
            {item.label}
          </button>
        ))}
      </div>
    </details>
  );
}

export interface CyberRadioGroupProps {
  value?: string;
  defaultValue?: string;
  name?: string;
  options: Array<{
    value: string;
    label: React.ReactNode;
    disabled?: boolean;
  }>;
  className?: string;
  onValueChange?: (value: string) => void;
}

function CyberRadioGroup({
  value,
  defaultValue,
  name,
  options,
  className,
  onValueChange,
}: CyberRadioGroupProps) {
  const generatedName = React.useId();
  const groupName = name ?? generatedName;

  return (
    <div className={cn("grid gap-3", className)} role="radiogroup">
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "flex items-center gap-3 text-sm text-zinc-300",
            option.disabled && "text-zinc-600",
          )}
        >
          <span className="relative flex size-5 items-center justify-center">
            <input
              type="radio"
              name={groupName}
              value={option.value}
              defaultChecked={value === undefined ? defaultValue === option.value : undefined}
              checked={value !== undefined ? value === option.value : undefined}
              disabled={option.disabled}
              onChange={() => onValueChange?.(option.value)}
              className="peer sr-only"
            />
            <span className="cyber-cut-small flex size-5 items-center justify-center border border-lime-300/45 bg-black/50 text-lime-200 transition peer-checked:bg-lime-300/15 peer-focus-visible:ring-2 peer-focus-visible:ring-lime-300/35 peer-disabled:opacity-45 peer-checked:[&_svg]:opacity-100">
              <Circle className="size-2 fill-current opacity-0" />
            </span>
          </span>
          {option.label}
        </label>
      ))}
    </div>
  );
}

export interface CyberCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
}

const CyberCheckbox = React.forwardRef<HTMLInputElement, CyberCheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id ?? generatedId;

    const control = (
      <span className="relative flex size-5 items-center justify-center">
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          className="peer sr-only"
          {...props}
        />
        <span
          className={cn(
            "cyber-cut-small flex size-5 items-center justify-center border border-lime-300/45 bg-black/50 text-zinc-950 transition peer-checked:bg-lime-300 peer-focus-visible:ring-2 peer-focus-visible:ring-lime-300/35 peer-disabled:opacity-45 peer-checked:[&_svg]:opacity-100",
            className,
          )}
        >
          <Check className="size-3.5 opacity-0" />
        </span>
      </span>
    );

    if (!label) {
      return control;
    }

    return (
      <label htmlFor={checkboxId} className="flex items-center gap-3 text-sm text-zinc-300">
        {control}
        {label}
      </label>
    );
  },
);
CyberCheckbox.displayName = "CyberCheckbox";

export {
  CyberCheckbox,
  CyberDropdown,
  CyberNativeSelect,
  CyberRadioGroup,
};
