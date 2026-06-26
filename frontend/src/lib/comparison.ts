"use client";

import { useSyncExternalStore } from "react";

export const COMPARISON_STORAGE_KEY = "frag-store-comparison-v2";
export const COMPARISON_CHANGE_EVENT = "frag-store-comparison-change";

export type ComparisonGroups = Record<string, readonly number[]>;

const EMPTY_COMPARISON_GROUPS: ComparisonGroups = Object.freeze({});
const LEGACY_GROUP_KEY = "__legacy__";

let cachedRaw = "";
let cachedGroups: ComparisonGroups = EMPTY_COMPARISON_GROUPS;

function normalizeComparisonIds(ids: number[]) {
  return [...new Set(ids.filter((id) => Number.isInteger(id) && id > 0))].sort((a, b) => a - b);
}

function normalizeComparisonGroups(groups: Record<string, number[]>) {
  const normalizedEntries = Object.entries(groups)
    .map(([key, ids]) => [key, normalizeComparisonIds(ids)] as const)
    .filter(([, ids]) => ids.length);

  if (!normalizedEntries.length) {
    return EMPTY_COMPARISON_GROUPS;
  }

  return Object.fromEntries(normalizedEntries) as ComparisonGroups;
}

function parseComparisonGroups(raw: string | null) {
  if (!raw) {
    return EMPTY_COMPARISON_GROUPS;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (Array.isArray(parsed)) {
      const legacyIds = normalizeComparisonIds(parsed as number[]);
      return legacyIds.length
        ? ({ [LEGACY_GROUP_KEY]: legacyIds } as ComparisonGroups)
        : EMPTY_COMPARISON_GROUPS;
    }

    if (!parsed || typeof parsed !== "object") {
      return EMPTY_COMPARISON_GROUPS;
    }

    const groups: Record<string, number[]> = {};

    Object.entries(parsed as Record<string, unknown>).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        groups[key] = value as number[];
      }
    });

    return normalizeComparisonGroups(groups);
  } catch {
    return EMPTY_COMPARISON_GROUPS;
  }
}

export function readComparisonGroups() {
  if (typeof window === "undefined") {
    return EMPTY_COMPARISON_GROUPS;
  }

  const raw = window.localStorage.getItem(COMPARISON_STORAGE_KEY) ?? "";

  if (raw === cachedRaw) {
    return cachedGroups;
  }

  cachedRaw = raw;
  cachedGroups = parseComparisonGroups(raw);
  return cachedGroups;
}

export function writeComparisonGroups(groups: Record<string, number[] | readonly number[]>) {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeComparisonGroups(
    Object.fromEntries(
      Object.entries(groups).map(([key, ids]) => [key, [...ids]]),
    ),
  );
  const raw = Object.keys(normalized).length ? JSON.stringify(normalized) : "";

  cachedRaw = raw;
  cachedGroups = normalized;

  if (raw) {
    window.localStorage.setItem(COMPARISON_STORAGE_KEY, raw);
  } else {
    window.localStorage.removeItem(COMPARISON_STORAGE_KEY);
  }

  window.dispatchEvent(new Event(COMPARISON_CHANGE_EVENT));
}

export function reconcileComparisonGroups(
  validProducts: Iterable<{ id: number; categorySlug: string }>,
) {
  const current = readComparisonGroups();
  const validEntries = [...validProducts].filter(
    (product) => Number.isInteger(product.id) && product.id > 0 && product.categorySlug,
  );

  if (!Object.keys(current).length || !validEntries.length) {
    return current;
  }

  const categoryById = new Map(validEntries.map((product) => [product.id, product.categorySlug]));
  const nextGroups: Record<string, number[]> = {};

  Object.entries(current).forEach(([groupKey, ids]) => {
    ids.forEach((id) => {
      const categorySlug = categoryById.get(id);

      if (!categorySlug) {
        return;
      }

      const resolvedGroupKey = groupKey === LEGACY_GROUP_KEY ? categorySlug : groupKey;
      nextGroups[resolvedGroupKey] = [...(nextGroups[resolvedGroupKey] ?? []), id];
    });
  });

  const normalizedNext = normalizeComparisonGroups(nextGroups);
  const currentRaw = JSON.stringify(current);
  const nextRaw = JSON.stringify(normalizedNext);

  if (currentRaw !== nextRaw) {
    writeComparisonGroups(normalizedNext);
    return normalizedNext;
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

export function useComparisonGroups() {
  return useSyncExternalStore(subscribe, readComparisonGroups, () => EMPTY_COMPARISON_GROUPS);
}
