"use client";

import * as React from "react";
import { Check, ChevronDown, Circle } from "lucide-react";
import { usePathname } from "next/navigation";

import { getLocaleFromPathname } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const selectPlaceholderLabels = {
  ru: "Выберите вариант",
  en: "Select option",
  kg: "Вариант тандаңыз",
} as const;

export interface CyberSelectOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface CyberNativeSelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange"> {
  label?: React.ReactNode;
  options: CyberSelectOption[];
  helperText?: React.ReactNode;
  tone?: "lime" | "red";
  value?: string;
  defaultValue?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  onValueChange?: (value: string) => void;
}

const CyberNativeSelect = React.forwardRef<HTMLDivElement, CyberNativeSelectProps>(
  (
    {
      className,
      label,
      options,
      helperText,
      tone = "lime",
      id,
      value,
      defaultValue,
      name,
      disabled,
      required,
      onValueChange,
      ...props
    },
    ref,
  ) => {
    const pathname = usePathname();
    const locale = getLocaleFromPathname(pathname);
    const generatedId = React.useId();
    const selectId = id ?? generatedId;
    const listboxId = `${selectId}-listbox`;
    const wrapperRef = React.useRef<HTMLDivElement | null>(null);
    const [open, setOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(
      defaultValue ?? options.find((option) => !option.disabled)?.value ?? "",
    );
    const selectedValue = value ?? internalValue;
    const selectedOption = options.find((option) => option.value === selectedValue);

    React.useEffect(() => {
      if (!open) {
        return;
      }

      function handlePointerDown(event: PointerEvent) {
        if (!wrapperRef.current?.contains(event.target as Node)) {
          setOpen(false);
        }
      }

      document.addEventListener("pointerdown", handlePointerDown);

      return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, [open]);

    function selectOption(option: CyberSelectOption) {
      if (option.disabled) {
        return;
      }

      if (value === undefined) {
        setInternalValue(option.value);
      }

      onValueChange?.(option.value);
      setOpen(false);
    }

    return (
      <div
        ref={(node) => {
          wrapperRef.current = node;

          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className="w-full space-y-2"
        {...props}
      >
        {label ? (
          <label
            htmlFor={selectId}
            className="font-tech type-label block text-zinc-300"
          >
            {label}
          </label>
        ) : null}
        <div className="relative">
          <button
            type="button"
            id={selectId}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            disabled={disabled}
            onClick={() => setOpen((current) => !current)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setOpen(false);
              }
            }}
            className={cn(
              "cyber-cut-small font-tech flex h-13 w-full cursor-pointer items-center justify-between border px-4 pr-10 text-left text-base font-medium tracking-[0.02em] outline-none disabled:cursor-not-allowed disabled:opacity-50",
              tone === "red"
                ? "group relative overflow-hidden rounded-none border-red-300/30 bg-zinc-950/60 text-zinc-100 shadow-[inset_0_0_0_1px_rgba(248,113,113,0.04),inset_0_0_20px_rgba(255,23,68,0.05)] [clip-path:polygon(0_0,calc(100%-9px)_0,100%_9px,100%_100%,9px_100%,0_calc(100%-9px))] transition-[transform,border-color,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(110deg,transparent_20%,rgba(var(--theme-contrast-rgb),0.1)_50%,transparent_80%)] before:opacity-0 before:transition-opacity before:duration-200 after:pointer-events-none after:absolute after:inset-x-4 after:bottom-0 after:h-px after:origin-center after:scale-x-0 after:bg-red-200/85 after:transition-transform after:duration-200 after:ease-out hover:border-red-300/55 hover:bg-red-500/[0.08] hover:shadow-[0_0_24px_rgba(255,23,68,0.1)] hover:before:opacity-100 hover:after:scale-x-100 focus-visible:border-red-200/80 focus-visible:ring-2 focus-visible:ring-red-300/25 motion-reduce:transition-none motion-reduce:hover:transform-none motion-reduce:before:transition-none motion-reduce:after:transition-none"
                : "rounded-sm border-lime-300/35 bg-surface/45 text-lime-100 shadow-[inset_0_0_18px_rgba(190,242,100,0.05)] transition hover:bg-lime-300/8 focus-visible:border-lime-300/80 focus-visible:ring-2 focus-visible:ring-lime-300/25",
              className,
            )}
          >
            <span className="relative z-10">
              {selectedOption?.label ?? selectPlaceholderLabels[locale]}
            </span>
          </button>
          <ChevronDown
            className={cn(
              "pointer-events-none absolute right-4 top-1/2 z-10 size-4 -translate-y-1/2 transition-transform duration-300",
              tone === "red" ? "text-red-200" : "text-lime-200",
              open && "rotate-180",
            )}
          />
          {open ? (
            <div
              id={listboxId}
              role="listbox"
              aria-required={required || undefined}
              className={cn(
                "cyber-cut-surface font-tech absolute left-0 top-[calc(100%+0.5rem)] z-40 max-h-72 w-full overflow-y-auto border bg-zinc-950/95 p-2 text-sm font-medium tracking-[0.02em]",
                tone === "red"
                  ? "rounded-none border-red-300/30 text-zinc-200 shadow-[0_0_36px_rgba(255,23,68,0.16)] [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))]"
                  : "rounded-sm border-lime-300/30 shadow-[0_0_36px_rgba(190,242,100,0.16)]",
              )}
            >
              {options.map((option) => {
                const selected = option.value === selectedValue;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    disabled={option.disabled}
                    onClick={() => selectOption(option)}
                    className={cn(
                      "cyber-cut-small flex w-full cursor-pointer items-center gap-2 border border-transparent px-3 py-2.5 text-left text-zinc-300 outline-none transition disabled:cursor-not-allowed disabled:opacity-45",
                      tone === "red"
                        ? "rounded-none [clip-path:polygon(0_0,calc(100%-6px)_0,100%_6px,100%_100%,6px_100%,0_calc(100%-6px))] hover:border-red-300/35 hover:bg-red-500/10 hover:text-white focus-visible:border-red-300/55 focus-visible:ring-2 focus-visible:ring-red-300/20"
                        : "rounded-sm hover:border-lime-300/25 hover:bg-lime-300/10 hover:text-lime-100",
                      selected &&
                        (tone === "red"
                          ? "border-red-300/45 bg-red-500/14 text-white shadow-[inset_2px_0_0_rgba(248,113,113,0.8)]"
                          : "border-lime-300/30 bg-lime-300/10 text-lime-100"),
                    )}
                  >
                    <span className="flex size-4 items-center justify-center">
                      {selected ? (
                        <Check
                          className={cn(
                            "size-3.5",
                            tone === "red" ? "text-red-200" : "text-lime-200",
                          )}
                        />
                      ) : null}
                    </span>
                    {option.label}
                  </button>
                );
              })}
            </div>
          ) : null}
          {name ? <input type="hidden" name={name} value={selectedValue} required={required} /> : null}
        </div>
        {helperText ? <p className="font-tech type-body-sm text-zinc-500">{helperText}</p> : null}
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
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className={cn("group relative w-full", className)}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="cyber-cut-button font-tech flex h-13 w-full list-none items-center justify-between border-2 border-lime-300/65 bg-zinc-950/30 px-7 text-sm font-semibold tracking-[0.04em] text-lime-100 shadow-[inset_0_0_0_1px_rgba(var(--theme-contrast-rgb),0.03)] outline-none transition hover:bg-lime-300/10"
      >
        {label}
        <ChevronDown className={cn("size-4 transition", open && "rotate-180")} />
      </button>
      {open ? (
        <div
          className="cyber-cut-surface font-tech absolute left-0 top-[calc(100%+0.5rem)] z-40 w-72 border border-lime-300/30 bg-zinc-950/95 p-2 text-sm font-medium tracking-[0.02em] shadow-[0_0_36px_rgba(190,242,100,0.16)]"
          role="menu"
        >
          {items.map((item, index) => (
            <button
              key={index}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => setOpen(false)}
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
      ) : null}
    </div>
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
            <span className="cyber-cut-small flex size-5 items-center justify-center border border-lime-300/45 bg-surface/50 text-lime-200 transition peer-checked:bg-lime-300/15 peer-focus-visible:ring-2 peer-focus-visible:ring-lime-300/35 peer-disabled:opacity-45 peer-checked:[&_svg]:opacity-100">
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
            "cyber-cut-small flex size-5 items-center justify-center border border-lime-300/45 bg-surface/50 text-zinc-950 transition peer-checked:bg-lime-300 peer-focus-visible:ring-2 peer-focus-visible:ring-lime-300/35 peer-disabled:opacity-45 peer-checked:[&_svg]:opacity-100",
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
