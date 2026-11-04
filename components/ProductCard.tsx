"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import Badge from "@/components/Badge";
import Card from "@/components/Card";
import QuantityCounter from "@/components/QuantityCounter";
import { HeartIcon, StarIcon } from "@/components/Icons";
import { getPlaceholderImage, getProductImage } from "@/lib/productImages";
import type { Product } from "@/lib/types";
import { cn, formatPrice, getStockStatus } from "@/lib/utils";

export interface ProductCardProps {
  product: Product;
  currency?: string;
  featured?: boolean;
  showActions?: boolean;
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
  const [imageSrc, setImageSrc] = useState(() => getProductImage(product));
  const [wished, setWished] = useState(false);

  const status = getStockStatus(product.stock_quantity);
  const inStock = status !== "out-of-stock";
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
        if (imageSrc !== fallbackSrc) setImageSrc(fallbackSrc);
      }}
      className={cn(
        "aspect-square h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110",
        !inStock && "opacity-50 grayscale",
      )}
    />
  );

  return (
    <Card
      as="article"
      className={cn(
        "group flex h-full flex-col gap-0 overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover",
        featured && "ring-2 ring-brand-500 ring-offset-2",
      )}
    >
      {/* ── Image area ── */}
      <div className="relative overflow-hidden bg-slate-100">
        {href ? (
          <Link href={href} tabIndex={-1} aria-hidden="true">
            {image}
          </Link>
        ) : (
          image
        )}

        {/* Gradient overlay on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Top badges */}
        <div className="pointer-events-none absolute inset-x-2.5 top-2.5 flex items-start justify-between gap-2">
          {featured ? (
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-slate-950 shadow-md"
              style={{ background: "linear-gradient(135deg, #fb923c, #f97316)" }}
            >
              <StarIcon size={10} fill="currentColor" aria-hidden="true" />
              Featured
            </span>
          ) : (
            <span />
          )}
          <Badge variant={status} />
        </div>

        {/* Wishlist button */}
        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => { e.preventDefault(); setWished((w) => !w); }}
          className={cn(
            "absolute right-2.5 bottom-2.5 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200",
            wished
              ? "bg-rose-500 text-white shadow-md"
              : "bg-white/80 text-slate-400 opacity-0 shadow backdrop-blur-sm group-hover:opacity-100 hover:text-rose-500",
          )}
        >
          <HeartIcon size={14} fill={wished ? "currentColor" : "none"} />
        </button>
      </div>

      {/* ── Info area ── */}
      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div>
          <h3 className="line-clamp-2 font-display text-sm font-semibold leading-snug text-slate-900">
            {href ? (
              <Link href={href} className="transition-colors duration-200 hover:text-brand-700">
                {product.name}
              </Link>
            ) : (
              product.name
            )}
          </h3>

          {product.description && (
            <p className="mt-1 line-clamp-1 text-xs text-slate-400">{product.description}</p>
          )}
        </div>

        {/* Price row */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <div>
            <p className="font-display text-base font-extrabold text-slate-900">
              {formatPrice(product.price, currency)}
            </p>
            <p className="text-xs text-slate-400">
              {inStock ? (
                <span className={status === "low-stock" ? "text-accent-600 font-semibold" : ""}>
                  {product.stock_quantity} left
                </span>
              ) : (
                <span className="text-rose-500">Sold out</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ── Actions (slide up on hover) ── */}
      {showActions && (
        <div className="translate-y-0 border-t border-slate-100 transition-all duration-300">
          {inStock ? (
            <div className="flex items-center gap-2 p-3">
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
            <div className="p-3">
              <AddToCartButton product={product} className="w-full" />
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
