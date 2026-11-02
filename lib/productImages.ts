// Product photos.
//
// Primary source: the backend `image_url` column (real Tokopedia photos,
// populated by the seed). When a product has no image_url (e.g. legacy
// dummy rows), we fall back to a local keyword-matched placeholder in
// public/products so the UI never shows a broken image.
import type { Product } from "@/lib/types";

const PLACEHOLDER = "/products/placeholder.svg";

// Keyword -> local placeholder. Covers both the real catalog categories
// (laptop/mouse/keyboard/bag/etc.) and the legacy dummy catalog.
const IMAGES: Array<[RegExp, string]> = [
  [/laptop|notebook|macbook/, "/products/laptop.jpg"],
  [/mouse/, "/products/mouse.jpg"],
  [/keyboard/, "/products/keyboard.jpg"],
  [/kemeja|flannel|shirt/, "/products/kemeja.jpg"],
  [/celana|jeans/, "/products/celana.jpg"],
  [/indomie|noodle|mie/, "/products/indomie.jpg"],
  [/kopi|coffee/, "/products/kopi.jpg"],
  [/buku|book|python/, "/products/buku.jpg"],
  [/nasi|rice/, "/products/nasi.jpg"],
];

/** Local placeholder image chosen by keywords in the product name. */
export function getPlaceholderImage(name: string): string {
  const lower = name.toLowerCase();
  return IMAGES.find(([pattern]) => pattern.test(lower))?.[1] ?? PLACEHOLDER;
}

/**
 * Best image for a product: the real `image_url` if present, otherwise a
 * local keyword placeholder. Accepts either a full Product or a bare name
 * (for call sites that only have a category/sample name).
 */
export function getProductImage(product: Product | string): string {
  if (typeof product === "string") {
    return getPlaceholderImage(product);
  }
  return product.image_url?.trim() || getPlaceholderImage(product.name);
}
