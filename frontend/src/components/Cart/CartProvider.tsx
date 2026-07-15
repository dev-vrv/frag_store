"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  CART_STORAGE_KEY,
  normalizeCartItems,
  writeCartStorage,
  type CartItemInput,
} from "@/lib/cart";

const CART_CHANGE_EVENT = "frag-cart-change";
const EMPTY_CART: CartItemInput[] = [];
let cachedSnapshot: CartItemInput[] = EMPTY_CART;
let cachedRawSnapshot: string | null = null;

function emitCartChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(CART_CHANGE_EVENT));
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  function handleStorage(event: StorageEvent) {
    if (event.key === CART_STORAGE_KEY) {
      callback();
    }
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(CART_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CART_CHANGE_EVENT, callback);
  };
}

function getSnapshot() {
  if (typeof window === "undefined") {
    return EMPTY_CART;
  }

  const raw = window.localStorage.getItem(CART_STORAGE_KEY);

  if (raw === cachedRawSnapshot) {
    return cachedSnapshot;
  }

  cachedRawSnapshot = raw;

  if (!raw) {
    cachedSnapshot = EMPTY_CART;
    return cachedSnapshot;
  }

  try {
    cachedSnapshot = normalizeCartItems(JSON.parse(raw) as CartItemInput[]);
  } catch {
    cachedSnapshot = EMPTY_CART;
  }

  return cachedSnapshot;
}

function getServerSnapshot() {
  return EMPTY_CART;
}

interface CartContextValue {
  items: CartItemInput[];
  itemsCount: number;
  quantityTotal: number;
  hydrated: boolean;
  replaceItems: (items: CartItemInput[]) => void;
  addItem: (productId: number, quantity?: number, selectedColorId?: number | null) => void;
  setQuantity: (productId: number, quantity: number, selectedColorId?: number | null) => void;
  setItemColor: (
    productId: number,
    currentColorId: number | null | undefined,
    nextColorId: number | null | undefined,
  ) => void;
  removeItem: (productId: number, selectedColorId?: number | null) => void;
  clearCart: () => void;
  hasItem: (productId: number, selectedColorId?: number | null) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value = useMemo<CartContextValue>(() => {
    function updateItems(updater: (current: CartItemInput[]) => CartItemInput[]) {
      const nextItems = normalizeCartItems(updater(getSnapshot()));
      writeCartStorage(nextItems);
      emitCartChange();
    }

    return {
      items,
      hydrated: true,
      itemsCount: items.length,
      quantityTotal: items.reduce((total, item) => total + item.quantity, 0),
      replaceItems(nextItems) {
        writeCartStorage(normalizeCartItems(nextItems));
        emitCartChange();
      },
      addItem(productId, quantity = 1, selectedColorId = null) {
        updateItems((current) => [...current, { productId, quantity, selectedColorId }]);
      },
      setQuantity(productId, quantity, selectedColorId = null) {
        updateItems((current) => {
          if (quantity <= 0) {
            return current.filter(
              (item) =>
                !(
                  item.productId === productId &&
                  (item.selectedColorId ?? null) === (selectedColorId ?? null)
                ),
            );
          }

          const exists = current.some(
            (item) =>
              item.productId === productId &&
              (item.selectedColorId ?? null) === (selectedColorId ?? null),
          );
          if (!exists) {
            return [...current, { productId, quantity, selectedColorId }];
          }

          return current.map((item) =>
            item.productId === productId &&
            (item.selectedColorId ?? null) === (selectedColorId ?? null)
              ? { ...item, quantity, selectedColorId }
              : item,
          );
        });
      },
      setItemColor(productId, currentColorId = null, nextColorId = null) {
        updateItems((current) => {
          const target = current.find(
            (item) =>
              item.productId === productId &&
              (item.selectedColorId ?? null) === (currentColorId ?? null),
          );

          if (!target) {
            return current;
          }

          return [
            ...current.filter(
              (item) =>
                !(
                  item.productId === productId &&
                  (item.selectedColorId ?? null) === (currentColorId ?? null)
                ),
            ),
            {
              productId,
              quantity: target.quantity,
              selectedColorId: nextColorId ?? null,
            },
          ];
        });
      },
      removeItem(productId, selectedColorId = null) {
        updateItems((current) =>
          current.filter(
            (item) =>
              !(
                item.productId === productId &&
                (item.selectedColorId ?? null) === (selectedColorId ?? null)
              ),
          ),
        );
      },
      clearCart() {
        writeCartStorage([]);
        emitCartChange();
      },
      hasItem(productId, selectedColorId = null) {
        return items.some(
          (item) =>
            item.productId === productId &&
            (item.selectedColorId ?? null) === (selectedColorId ?? null),
        );
      },
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider.");
  }

  return context;
}
