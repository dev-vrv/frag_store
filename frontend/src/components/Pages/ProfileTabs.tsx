"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";

import {
  CyberTabs,
  CyberTabsContent,
  CyberTabsList,
  CyberTabsTrigger,
} from "@/components/cyber";

const PROFILE_TAB_STORAGE_KEY = "frag-store-profile-tab";
const PROFILE_TAB_CHANGE_EVENT = "frag-store-profile-tab-change";

type ProfileTabValue = "details" | "orders";

interface ProfileTabsProps {
  detailsLabel: string;
  ordersLabel: string;
  activeOrdersCount: number;
  detailsContent: ReactNode;
  ordersContent: ReactNode;
}

function isProfileTabValue(value: string): value is ProfileTabValue {
  return value === "details" || value === "orders";
}

function getStoredProfileTab() {
  if (typeof window === "undefined") {
    return "details" as ProfileTabValue;
  }

  const savedTab = window.localStorage.getItem(PROFILE_TAB_STORAGE_KEY);
  return savedTab && isProfileTabValue(savedTab) ? savedTab : "details";
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleChange = () => callback();

  window.addEventListener("storage", handleChange);
  window.addEventListener(PROFILE_TAB_CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(PROFILE_TAB_CHANGE_EVENT, handleChange);
  };
}

export function ProfileTabs({
  detailsLabel,
  ordersLabel,
  activeOrdersCount,
  detailsContent,
  ordersContent,
}: ProfileTabsProps) {
  const searchParams = useSearchParams();
  const activeTab = useSyncExternalStore(
    subscribe,
    getStoredProfileTab,
    () => "details",
  );
  const searchParamTab = searchParams.get("tab");
  const resolvedTab = isProfileTabValue(searchParamTab ?? "") ? searchParamTab : activeTab;

  useEffect(() => {
    if (!isProfileTabValue(searchParamTab ?? "") || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(PROFILE_TAB_STORAGE_KEY, searchParamTab);
    window.dispatchEvent(new Event(PROFILE_TAB_CHANGE_EVENT));
  }, [searchParamTab]);

  function handleValueChange(value: string) {
    if (!isProfileTabValue(value) || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(PROFILE_TAB_STORAGE_KEY, value);
    window.dispatchEvent(new Event(PROFILE_TAB_CHANGE_EVENT));
  }

  return (
    <CyberTabs value={resolvedTab} onValueChange={handleValueChange} className="gap-6">
      <CyberTabsList className="w-full gap-2 p-2">
        <CyberTabsTrigger value="details" className="min-h-14 min-w-[180px] justify-between gap-3 px-5 py-3 text-left">
          <span>{detailsLabel}</span>
        </CyberTabsTrigger>
        <CyberTabsTrigger value="orders" className="min-h-14 min-w-[220px] justify-between gap-3 px-5 py-3 text-left">
          <span>{ordersLabel}</span>
          {activeOrdersCount ? (
            <span className="inline-flex min-w-8 items-center justify-center rounded-full border border-lime-300/30 bg-lime-300/12 px-2 py-1 text-xs text-lime-100">
              {activeOrdersCount}
            </span>
          ) : null}
        </CyberTabsTrigger>
      </CyberTabsList>

      <CyberTabsContent value="details" className="border-none bg-transparent p-0 shadow-none">
        {detailsContent}
      </CyberTabsContent>

      <CyberTabsContent value="orders" className="border-none bg-transparent p-0 shadow-none">
        {ordersContent}
      </CyberTabsContent>
    </CyberTabs>
  );
}
