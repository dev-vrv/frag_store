"use client";

import { CalendarDays, Hash, SlidersHorizontal } from "lucide-react";

import {
  CyberCard,
  CyberCardContent,
  CyberCardDescription,
  CyberCardHeader,
  CyberCardTitle,
  CyberCheckbox,
  CyberDropdown,
  CyberRadioGroup,
  CyberInput,
  CyberNativeSelect,
  CyberTextarea,
} from "@/components/cyber";

export function TestUiFormControls() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <CyberCard variant="glass" hover>
        <CyberCardHeader>
          <CyberCardTitle>Select + Dropdown</CyberCardTitle>
          <CyberCardDescription>
            Выпадающие списки в угловатом cyberpunk стиле.
          </CyberCardDescription>
        </CyberCardHeader>
        <CyberCardContent className="grid gap-5 sm:grid-cols-2">
          <CyberNativeSelect
            label="Select"
            defaultValue="rog"
            options={[
              { value: "rog", label: "ROG Strix" },
              { value: "razer", label: "Razer Core" },
              { value: "zone", label: "Zone 51" },
              { value: "stealth", label: "Stealth Ops" },
            ]}
            helperText="Native select without external runtime dependency."
          />

          <div className="space-y-2">
            <label className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-400">
              Dropdown
            </label>
            <CyberDropdown
              label="Filters"
              items={[
                { label: "New drops" },
                { label: "Tournament gear" },
                { label: "RGB enabled", checked: true },
                { label: "Low latency" },
                { label: "Restricted sector", danger: true },
              ]}
            />
          </div>
        </CyberCardContent>
      </CyberCard>

      <CyberCard variant="glowing" hover>
        <CyberCardHeader>
          <CyberCardTitle>Radio + Checkbox</CyberCardTitle>
          <CyberCardDescription>
            Состояния checked, unchecked и disabled для форм.
          </CyberCardDescription>
        </CyberCardHeader>
        <CyberCardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <div className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-400">
              Radio
            </div>
            <CyberRadioGroup
              defaultValue="performance"
              options={[
                { value: "performance", label: "Performance" },
                { value: "balanced", label: "Balanced" },
                { value: "silent", label: "Silent" },
                { value: "locked", label: "Locked", disabled: true },
              ]}
            />
          </div>

          <div className="space-y-4">
            <div className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-400">
              Checkbox
            </div>
            {[
              ["sync", "Enable sync", true, false],
              ["alerts", "Drop alerts", false, false],
              ["locked", "Locked option", false, true],
            ].map(([id, label, checked, disabled]) => (
              <CyberCheckbox
                key={String(id)}
                id={String(id)}
                label={label}
                defaultChecked={Boolean(checked)}
                disabled={Boolean(disabled)}
              />
            ))}
            <div className="cyber-cut-small flex items-center gap-3 border border-lime-300/20 bg-black/35 p-3 text-xs text-zinc-500">
              <SlidersHorizontal className="size-4 text-lime-200" />
              Form controls are native and keyboard accessible.
            </div>
          </div>
        </CyberCardContent>
      </CyberCard>

      <CyberCard variant="bordered" hover className="lg:col-span-2">
        <CyberCardHeader>
          <CyberCardTitle>Date / Number / Textarea</CyberCardTitle>
          <CyberCardDescription>
            Нативные поля формы с cut-геометрией, helper и error состояниями.
          </CyberCardDescription>
        </CyberCardHeader>
        <CyberCardContent className="grid gap-5 lg:grid-cols-3">
          <CyberInput
            label="Date"
            type="date"
            icon={<CalendarDays />}
            defaultValue="2026-05-18"
            helperText="Native date picker keeps browser accessibility."
          />
          <CyberInput
            label="Number"
            type="number"
            icon={<Hash />}
            min={1}
            max={99}
            defaultValue={12}
            helperText="Supports min, max, step and keyboard input."
          />
          <CyberInput
            label="Number error"
            type="number"
            defaultValue={404}
            errorText="Value outside allowed sector."
          />
          <div className="lg:col-span-2">
            <CyberTextarea
              label="Textarea"
              placeholder="Describe custom loadout requirements..."
              defaultValue="Low-latency controller, lime accent lighting, matte black shell."
              helperText="Resizable textarea for comments, descriptions and notes."
            />
          </div>
          <CyberTextarea
            label="Textarea error"
            placeholder="Mission note"
            errorText="Description is required."
          />
        </CyberCardContent>
      </CyberCard>
    </div>
  );
}
