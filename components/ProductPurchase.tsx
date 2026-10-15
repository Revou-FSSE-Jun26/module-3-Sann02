"use client";

import { useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import QuantityCounter from "@/components/QuantityCounter";
import type { Product } from "@/lib/types";

/** Quantity counter + AddToCartButton for the product detail page. */
export default function ProductPurchase({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);

  if (product.stock_quantity <= 0) {
    return <AddToCartButton product={product} className="w-full sm:w-auto" />;
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <QuantityCounter
        value={Math.min(quantity, product.stock_quantity)}
        max={product.stock_quantity}
        onChange={setQuantity}
        label={product.name}
      />
      <AddToCartButton product={product} quantity={quantity} onAdded={() => setQuantity(1)} />
    </div>
  );
}
