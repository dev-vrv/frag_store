"use client";

import {
  Bell,
  Headphones,
  Mail,
  Menu,
  Shield,
  Sparkles,
  Star,
  type LucideIcon,
} from "lucide-react";

import {
  CyberButton,
  CyberCard,
  CyberCardContent,
  CyberCardDescription,
  CyberCardHeader,
  CyberCardTitle,
  CyberDialog,
  CyberDialogContent,
  CyberDialogDescription,
  CyberDialogFooter,
  CyberDialogHeader,
  CyberDialogTitle,
  CyberDialogTrigger,
  CyberSheet,
  CyberSheetContent,
  CyberSheetDescription,
  CyberSheetFooter,
  CyberSheetHeader,
  CyberSheetTitle,
  CyberSheetTrigger,
} from "@/components/cyber";
import { Separator } from "@/components/ui/separator";

const sheetActions: Array<[LucideIcon, string]> = [
  [Headphones, "Audio stack"],
  [Mail, "Drop alerts"],
  [Shield, "Security"],
];

export function TestUiOverlays() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <CyberCard variant="glass" hover>
        <CyberCardHeader>
          <CyberCardTitle>Dialog</CyberCardTitle>
          <CyberCardDescription>Glowing glass modal surface.</CyberCardDescription>
        </CyberCardHeader>
        <CyberCardContent>
          <CyberDialog>
            <CyberDialogTrigger asChild>
              <CyberButton variant="neon">
                <Sparkles />
                Open dialog
              </CyberButton>
            </CyberDialogTrigger>
            <CyberDialogContent>
              <CyberDialogHeader>
                <CyberDialogTitle>Debug payload preview</CyberDialogTitle>
                <CyberDialogDescription>
                  Overlay style check for spacing, border glow, and close button behavior.
                </CyberDialogDescription>
              </CyberDialogHeader>
              <div className="rounded-lg border border-white/10 bg-black/35 p-4">
                <div className="flex items-center gap-3">
                  <Star className="size-5 text-lime-200" />
                  <span className="text-sm text-zinc-300">Modal body content slot</span>
                </div>
              </div>
              <CyberDialogFooter>
                <CyberButton variant="outline">Cancel</CyberButton>
                <CyberButton>Confirm</CyberButton>
              </CyberDialogFooter>
            </CyberDialogContent>
          </CyberDialog>
        </CyberCardContent>
      </CyberCard>

      <CyberCard variant="glowing" hover>
        <CyberCardHeader>
          <CyberCardTitle>Sheet</CyberCardTitle>
          <CyberCardDescription>Right-side command surface.</CyberCardDescription>
        </CyberCardHeader>
        <CyberCardContent>
          <CyberSheet>
            <CyberSheetTrigger asChild>
              <CyberButton variant="outline">
                <Menu />
                Open sheet
              </CyberButton>
            </CyberSheetTrigger>
            <CyberSheetContent>
              <CyberSheetHeader>
                <CyberSheetTitle>Debug command rail</CyberSheetTitle>
                <CyberSheetDescription>
                  Sheet layout check with grouped navigation actions.
                </CyberSheetDescription>
              </CyberSheetHeader>
              <Separator />
              <div className="grid gap-3">
                {sheetActions.map(([Icon, label]) => (
                  <button
                    key={label}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-zinc-200 transition hover:border-red-300/30 hover:bg-red-300/10"
                  >
                    <Icon className="size-4 text-red-200" />
                    {label}
                  </button>
                ))}
              </div>
              <CyberSheetFooter>
                <CyberButton className="w-full">
                  <Bell />
                  Apply debug state
                </CyberButton>
              </CyberSheetFooter>
            </CyberSheetContent>
          </CyberSheet>
        </CyberCardContent>
      </CyberCard>
    </div>
  );
}
