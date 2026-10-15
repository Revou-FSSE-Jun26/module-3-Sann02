"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/lib/types";
import { cn, getButtonClasses } from "@/lib/utils";

interface AddToCartButtonProps {
  product: Product;
  /** Units to add (from the card's quantity counter). */
  quantity?: number;
  /** Called after units were added, e.g. to reset the counter. */
  onAdded?: () => void;
  className?: string;
}

/**
 * Adds a product to the CartContext (persisted to localStorage) with a toast.
 * Guests are sent to /login first; the cart belongs to a logged-in customer.
 */
export default function AddToCartButton({ product, quantity = 1, onAdded, className }: AddToCartButtonProps) {
  const { isLoggedIn } = useAuth();
  const { addItem, items } = useCart();
  const router = useRouter();

  const inCart = items.find((item) => item.product.id === product.id)?.quantity ?? 0;
  const outOfStock = product.stock_quantity <= 0;
  const maxedOut = !outOfStock && inCart >= product.stock_quantity;

  function handleClick() {
    if (!isLoggedIn) {
      toast.error("Please log in to add items to your cart.");
      router.push("/login");
      return;
    }
    const added = addItem(product, quantity);
    if (added === 0) {
      toast.error(`You already have all ${product.stock_quantity} in your cart.`);
      return;
    }
    toast.success(
      added < quantity
        ? `Added ${added} × ${product.name} (stock limit reached).`
        : `Added ${added} × ${product.name} to your cart.`,
    );
    onAdded?.();
  }

  if (outOfStock) {
    return (
      <button type="button" disabled className={cn(getButtonClasses(false), className)}>
        Out of Stock
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={maxedOut}
      className={cn(getButtonClasses(!maxedOut), className)}
    >
      {maxedOut ? "Max in cart" : "Add to Cart"}
    </button>
  );
}
