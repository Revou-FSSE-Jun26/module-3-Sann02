"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import Badge from "@/components/Badge";
import Card from "@/components/Card";
import QuantityCounter from "@/components/QuantityCounter";
import { getPlaceholderImage, getProductImage } from "@/lib/productImages";
import type { Product } from "@/lib/types";
import { cn, formatPrice, getStockStatus } from "@/lib/utils";

export interface ProductCardProps {
  product: Product;
  /** Currency prefix for prices. */
  currency?: string;
  /** Highlights the card with a ring and a "Best seller" ribbon. */
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
  // Resolved image source. If the remote image_url fails to load (e.g. an
  // expired CDN link), swap to the local keyword placeholder so the UI never
  // shows a broken image.
  const [imageSrc, setImageSrc] = useState(() => getProductImage(product));

  const status = getStockStatus(product.stock_quantity);
  const inStock = status !== "out-of-stock";
  // Never show more than what is in stock, even if the stock changed after a refetch.
  const safeQuantity = Math.min(quantity, Math.max(product.stock_quantity, 1));

  const fallbackSrc = getPlaceholderImage(product.name);
  const image = (
    <Image
      src={imageSrc}
      alt=""
      width={640}
      height={640}
      sizes="(min-width: 1280px) 20vw, (min-width: 640px) 33vw, 100vw"
      onError={() => {
        // Guard against an infinite loop if the placeholder itself fails.
        if (imageSrc !== fallbackSrc) setImageSrc(fallbackSrc);
      }}
      className={cn(
        "aspect-square h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105",
        !inStock && "opacity-60 grayscale",
      )}
    />
  );

  return (
    <Card
      as="article"
      className={cn(
        "group flex h-full flex-col gap-3 p-3 transition-shadow duration-200 hover:shadow-card-hover",
        featured && "ring-2 ring-brand-500",
      )}
    >
      <div className="relative overflow-hidden rounded-xl bg-slate-100">
        {href ? (
          // Image link is a duplicate of the title link, so keep it out of the tab order.
          <Link href={href} tabIndex={-1} aria-hidden="true">
            {image}
          </Link>
        ) : (
          image
        )}
        <div className="pointer-events-none absolute inset-x-2 top-2 flex items-start justify-between gap-2">
          {featured ? (
            <span className="rounded-full bg-accent-500 px-2.5 py-0.5 text-xs font-bold text-slate-950 shadow-sm">
              Best seller
            </span>
          ) : (
            <span />
          )}
          <Badge variant={status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-1">
        <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug text-slate-900">
          {href ? (
            <Link href={href} className="transition-colors duration-200 hover:text-brand-700">
              {product.name}
            </Link>
          ) : (
            product.name
          )}
        </h3>

        {product.description && (
          <p className="line-clamp-2 text-sm text-slate-500">{product.description}</p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <p className="font-display text-lg font-bold text-slate-900">
            {formatPrice(product.price, currency)}
          </p>
          <p className="text-xs font-medium text-slate-500">
            {inStock ? `${product.stock_quantity} left` : "Sold out"}
          </p>
        </div>
      </div>

      {showActions &&
        (inStock ? (
          <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-1 pt-3">
            <QuantityCounter
              value={safeQuantity}
              max={product.stock_quantity}
              onChange={setQuantity}
              label={product.name}
            />
            <AddToCartButton
              product={product}
              quantity={safeQuantity}
              onAdded={() => setQuantity(1)}
              className="flex-1"
            />
          </div>
        ) : (
          <AddToCartButton product={product} className="w-full" />
        ))}
    </Card>
  );
}
