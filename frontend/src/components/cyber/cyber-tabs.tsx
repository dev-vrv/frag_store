"use client";

import * as React from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

function CyberTabs({ className, ...props }: React.ComponentProps<typeof Tabs>) {
  return <Tabs className={cn("gap-5", className)} {...props} />;
}

function CyberTabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsList>) {
  return (
    <TabsList
      className={cn(
        "h-auto flex-wrap justify-start rounded-lg border border-red-300/15 bg-black/45 p-1 shadow-[inset_0_0_22px_rgba(248,113,113,0.05)] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}

function CyberTabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsTrigger>) {
  return (
    <TabsTrigger
      className={cn(
        "rounded-md px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-zinc-400 data-[state=active]:border-red-300/30 data-[state=active]:bg-red-300/10 data-[state=active]:text-red-100 data-[state=active]:shadow-[0_0_22px_rgba(248,113,113,0.18)]",
        className,
      )}
      {...props}
    />
  );
}

function CyberTabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsContent>) {
  return (
    <TabsContent
      className={cn(
        "rounded-lg border border-white/10 bg-white/[0.045] p-5 text-zinc-300 backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}

export { CyberTabs, CyberTabsContent, CyberTabsList, CyberTabsTrigger };
