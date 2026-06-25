"use client";

import { useSyncExternalStore } from "react";

export const FAVORITES_STORAGE_KEY = "frag-store-favorites-v1";
export const FAVORITES_CHANGE_EVENT = "frag-store-favorites-change";

const EMPTY_FAVORITES: readonly number[] = Object.freeze([]);

let cachedRaw = "";
let cachedFavorites: readonly number[] = EMPTY_FAVORITES;

function normalizeFavoriteIds(ids: number[]) {
  return [...new Set(ids.filter((id) => Number.isInteger(id) && id > 0))].sort((a, b) => a - b);
}

function parseFavoriteIds(raw: string | null) {
  if (!raw) {
    return EMPTY_FAVORITES;
  }

  try {
    const parsed = normalizeFavoriteIds(JSON.parse(raw) as number[]);
    return parsed.length ? parsed : EMPTY_FAVORITES;
  } catch {
    return EMPTY_FAVORITES;
  }
}

export function readFavoriteIds() {
  if (typeof window === "undefined") {
    return EMPTY_FAVORITES;
  }

  const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY) ?? "";

  if (raw === cachedRaw) {
    return cachedFavorites;
  }

  cachedRaw = raw;
  cachedFavorites = parseFavoriteIds(raw);
  return cachedFavorites;
}

export function writeFavoriteIds(ids: number[]) {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeFavoriteIds(ids);
  const raw = normalized.length ? JSON.stringify(normalized) : "";

  cachedRaw = raw;
  cachedFavorites = normalized.length ? normalized : EMPTY_FAVORITES;

  if (raw) {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, raw);
  } else {
    window.localStorage.removeItem(FAVORITES_STORAGE_KEY);
  }

  window.dispatchEvent(new Event(FAVORITES_CHANGE_EVENT));
}

export function toggleFavorite(productId: number) {
  const current = readFavoriteIds();
  const next = current.includes(productId)
    ? current.filter((id) => id !== productId)
    : [...current, productId];

  writeFavoriteIds(next);
}

export function reconcileFavoriteIds(validProductIds: Iterable<number>) {
  const current = readFavoriteIds();

  if (!current.length) {
    return current;
  }

  const validIdSet = new Set(
    [...validProductIds].filter((id) => Number.isInteger(id) && id > 0),
  );
  const next = current.filter((id) => validIdSet.has(id));

  if (next.length !== current.length) {
    writeFavoriteIds(next);
    return next;
  }

  return current;
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  function handleStorage(event: StorageEvent) {
    if (event.key && event.key !== FAVORITES_STORAGE_KEY) {
      return;
    }

    onStoreChange();
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(FAVORITES_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(FAVORITES_CHANGE_EVENT, onStoreChange);
  };
}

export function useFavoriteIds() {
  return useSyncExternalStore(subscribe, readFavoriteIds, () => EMPTY_FAVORITES);
}

export function useFavoriteSet() {
  return new Set(useFavoriteIds());
}
