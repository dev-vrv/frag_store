"use client";

import { useSyncExternalStore } from "react";

export const COMPARISON_STORAGE_KEY = "frag-store-comparison-v1";
export const COMPARISON_CHANGE_EVENT = "frag-store-comparison-change";

const EMPTY_COMPARISON: readonly number[] = Object.freeze([]);

let cachedRaw = "";
let cachedComparison: readonly number[] = EMPTY_COMPARISON;

function normalizeComparisonIds(ids: number[]) {
  return [...new Set(ids.filter((id) => Number.isInteger(id) && id > 0))].sort((a, b) => a - b);
}

function parseComparisonIds(raw: string | null) {
  if (!raw) {
    return EMPTY_COMPARISON;
  }

  try {
    const parsed = normalizeComparisonIds(JSON.parse(raw) as number[]);
    return parsed.length ? parsed : EMPTY_COMPARISON;
  } catch {
    return EMPTY_COMPARISON;
  }
}

export function readComparisonIds() {
  if (typeof window === "undefined") {
    return EMPTY_COMPARISON;
  }

  const raw = window.localStorage.getItem(COMPARISON_STORAGE_KEY) ?? "";

  if (raw === cachedRaw) {
    return cachedComparison;
  }

  cachedRaw = raw;
  cachedComparison = parseComparisonIds(raw);
  return cachedComparison;
}

export function writeComparisonIds(ids: number[]) {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeComparisonIds(ids);
  const raw = normalized.length ? JSON.stringify(normalized) : "";

  cachedRaw = raw;
  cachedComparison = normalized.length ? normalized : EMPTY_COMPARISON;

  if (raw) {
    window.localStorage.setItem(COMPARISON_STORAGE_KEY, raw);
  } else {
    window.localStorage.removeItem(COMPARISON_STORAGE_KEY);
  }

  window.dispatchEvent(new Event(COMPARISON_CHANGE_EVENT));
}

export function reconcileComparisonIds(validProductIds: Iterable<number>) {
  const current = readComparisonIds();

  if (!current.length) {
    return current;
  }

  const validIdSet = new Set(
    [...validProductIds].filter((id) => Number.isInteger(id) && id > 0),
  );
  const next = current.filter((id) => validIdSet.has(id));

  if (next.length !== current.length) {
    writeComparisonIds(next);
    return next;
  }

  return current;
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  function handleStorage(event: StorageEvent) {
    if (event.key && event.key !== COMPARISON_STORAGE_KEY) {
      return;
    }

    onStoreChange();
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(COMPARISON_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(COMPARISON_CHANGE_EVENT, onStoreChange);
  };
}

export function useComparisonIds() {
  return useSyncExternalStore(subscribe, readComparisonIds, () => EMPTY_COMPARISON);
}
