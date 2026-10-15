"use client";

import Link from "next/link";
import { useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import Badge from "@/components/Badge";
import Card from "@/components/Card";
import QuantityCounter from "@/components/QuantityCounter";
import type { Product } from "@/lib/types";
import { cn, formatPrice, getStockStatus } from "@/lib/utils";

export interface ProductCardProps {
  product: Product;
  /** Currency prefix for prices. */
  currency?: string;
  /** Highlights the card with a ring. */
  featured?: boolean;
  /** Show the quantity counter and Add to Cart button. */
  showActions?: boolean;
  /** Detail page link. */
  href?: string;
}

export default function ProductCard({
  product,
  currency = "Rp",
  featured = false,
  showActions = true,
  href,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);

  const status = getStockStatus(product.stock_quantity);
  const inStock = status !== "out-of-stock";
  // Never show more than what is in stock, even if the stock changed after a refetch.
  const safeQuantity = Math.min(quantity, Math.max(product.stock_quantity, 1));

  const title = href ? (
    <Link href={href} className="hover:text-blue-600 hover:underline">
      {product.name}
    </Link>
  ) : (
    product.name
  );

  return (
    <Card
      as="article"
      className={cn(
        "flex h-full flex-col gap-3",
        featured && "ring-2 ring-blue-500",
        !inStock && "bg-gray-50",
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "flex h-32 items-center justify-center rounded-lg text-3xl font-bold",
          inStock
            ? "bg-linear-to-br from-blue-100 to-indigo-100 text-blue-500"
            : "bg-gray-200 text-gray-400",
        )}
      >
        {product.name.charAt(0).toUpperCase()}
      </div>

      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <Badge variant={status} />
      </div>

      {product.description && (
        <p className="line-clamp-2 text-sm text-gray-500">{product.description}</p>
      )}

      <div className="mt-auto flex items-end justify-between gap-2">
        <p className="text-lg font-bold text-blue-700">
          {formatPrice(product.price, currency)}
        </p>
        <p className="text-xs text-gray-500">Stock: {product.stock_quantity}</p>
      </div>

      {showActions &&
        (inStock ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <QuantityCounter
              value={safeQuantity}
              max={product.stock_quantity}
              onChange={setQuantity}
              label={product.name}
            />
            <AddToCartButton product={product} quantity={safeQuantity} onAdded={() => setQuantity(1)} />
          </div>
        ) : (
          <AddToCartButton product={product} className="w-full" />
        ))}
    </Card>
  );
}
