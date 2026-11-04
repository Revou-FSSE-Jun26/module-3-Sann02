// Product photos.
//
// Primary source: the backend `image_url` column (real Tokopedia photos,
// populated by the seed). When a product has no image_url (e.g. legacy
// dummy rows), we fall back to a keyword-matched photo so the image still
// fits the product name and the UI never shows a broken image.
import type { Product } from "@/lib/types";

const PLACEHOLDER = "/products/placeholder.svg";

// Keyword -> image. Most specific type first: many accessory names also contain
// "laptop" ("Mouse ... untuk Laptop"), so generic laptop must match last.
const IMAGES: Array<[RegExp, string]> = [
  [/mousepad|deskmat/, "https://images.unsplash.com/photo-1629429407759-01cd3d7cfb38?w=640&q=80"],
  [/keyboard/, "/products/keyboard.jpg"],
  [/mouse/, "/products/mouse.jpg"],
  [/tas|ransel|backpack|sling|sleeve|handbag/, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=640&q=80"],
  [/hub|splitter|docking/, "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=640&q=80"],
  [/wifi|wireless adapter/, "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=640&q=80"],
  [/charger|adaptor|adapter|\bgan\b|kabel|cable/, "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=640&q=80"],
  [/stand|holder|dudukan/, "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=640&q=80"],
  [/cooler|pendingin|\bfan\b|kipas/, "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=640&q=80"],
  [/\bram\b|memory|sodimm/, "https://images.unsplash.com/photo-1562976540-1502c2145186?w=640&q=80"],
  [/joystick|game pad/, "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=640&q=80"],
  [/laptop|notebook|macbook/, "/products/laptop.jpg"],
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
