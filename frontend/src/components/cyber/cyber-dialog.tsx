"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function CyberDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof DialogContent>) {
  return (
    <DialogContent
      className={cn(
        "border-red-300/25 bg-zinc-950/88 shadow-[0_0_70px_rgba(248,113,113,0.18)] backdrop-blur-2xl before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:bg-[linear-gradient(135deg,rgba(248,113,113,0.09),transparent_45%,rgba(217,70,239,0.08))]",
        className,
      )}
      {...props}
    />
  );
}

function CyberSheetContent({
  className,
  ...props
}: React.ComponentProps<typeof SheetContent>) {
  return (
    <SheetContent
      className={cn(
        "border-red-300/25 bg-zinc-950/90 shadow-[0_0_70px_rgba(248,113,113,0.16)] backdrop-blur-2xl",
        className,
      )}
      {...props}
    />
  );
}

const CyberDialog = Dialog;
const CyberDialogTrigger = DialogTrigger;
const CyberDialogHeader = DialogHeader;
const CyberDialogTitle = DialogTitle;
const CyberDialogDescription = DialogDescription;
const CyberDialogFooter = DialogFooter;

const CyberSheet = Sheet;
const CyberSheetTrigger = SheetTrigger;
const CyberSheetHeader = SheetHeader;
const CyberSheetTitle = SheetTitle;
const CyberSheetDescription = SheetDescription;
const CyberSheetFooter = SheetFooter;

export {
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
};
