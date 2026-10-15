"use client";

import { useContext } from "react";
import { CartContext, type CartContextValue } from "@/context/CartContext";

/** Read and update the shopping cart. Throws outside <CartProvider>. */
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (ctx === null) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
