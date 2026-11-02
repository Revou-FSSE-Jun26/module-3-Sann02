"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { getPlaceholderImage, getProductImage } from "@/lib/productImages";
import type { Product } from "@/lib/types";

type ProductImageProps = Omit<ImageProps, "src" | "alt"> & {
  /** Product (or bare name) to resolve the image from. */
  product: Product | string;
  alt?: string;
};

/**
 * next/image for a product with a built-in error fallback: if the resolved
 * image_url fails to load (e.g. an expired remote CDN link), it swaps to the
 * local keyword placeholder so the UI never shows a broken image.
 */
export default function ProductImage({ product, alt = "", ...rest }: ProductImageProps) {
  const name = typeof product === "string" ? product : product.name;
  const [src, setSrc] = useState(() => getProductImage(product));
  const fallback = getPlaceholderImage(name);

  return (
    <Image
      {...rest}
      src={src}
      alt={alt}
      onError={() => {
        // Guard against an infinite loop if the placeholder itself fails.
        if (src !== fallback) setSrc(fallback);
      }}
    />
  );
}
