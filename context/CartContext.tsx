"use client";

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem, Product } from "@/lib/types";

export const CART_STORAGE_KEY = "cart";

export interface CartContextValue {
  items: CartItem[];
  /** Total units across all lines (what the Header badge shows). */
  itemCount: number;
  /** Sum of price x quantity. */
  total: number;
  /** False until the saved cart has been read from localStorage. */
  isReady: boolean;
  /** Adds `quantity` units, capped at the product's stock. Returns the units actually added. */
  addItem: (product: Product, quantity?: number) => number;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is CartItem =>
          typeof item?.product?.id === "number" && Number.isInteger(item?.quantity) && item.quantity > 0,
      );
    }
  } catch {
    // Corrupt value: start with an empty cart.
  }
  return [];
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Restore the saved cart once after mount (localStorage is browser-only).
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time sync from localStorage after hydration */
    setItems(readStoredCart());
    setIsReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Persist every change. Skipped until the restore ran, so the initial empty
  // array never overwrites the saved cart.
  useEffect(() => {
    if (isReady) localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, isReady]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    const current = items.find((item) => item.product.id === product.id)?.quantity ?? 0;
    const added = Math.max(0, Math.min(quantity, product.stock_quantity - current));
    if (added === 0) return 0;
    // Immutable updates: new array, new object for the changed line.
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (!existing) return [...prev, { product, quantity: added }];
      return prev.map((item) =>
        item.product.id === product.id ? { ...item, product, quantity: item.quantity + added } : item,
      );
    });
    return added;
  }, [items]);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.product.stock_quantity)) }
          : item,
      ),
    );
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    return { items, itemCount, total, isReady, addItem, updateQuantity, removeItem, clearCart };
  }, [items, isReady, addItem, updateQuantity, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
