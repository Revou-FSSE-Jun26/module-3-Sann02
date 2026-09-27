// ============================================================
// The typed product data — an array of typed Product objects
// (nested objects and arrays typed correctly via the Catalog alias).
// This is the same data that will become the React ProductCard
// source in Checkpoint 2.
// ============================================================
import type { Catalog } from "./types.js";

export const products: Catalog = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 590000,
    category: "electronics",
    status: "in-stock",
    rating: 4.6,
    tags: ["audio", "bluetooth"],
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    price: 750000,
    category: "accessory",
    status: "low-stock",
    rating: 4.8,
    tags: ["typing", "rgb"],
  },
  {
    id: 3,
    name: "4K Monitor",
    price: 4200000,
    category: "electronics",
    status: "out-of-stock",
    rating: 4.7,
    tags: ["display", "uhd"],
  },
  {
    id: 4,
    name: "USB-C Hub",
    price: 350000,
    category: "accessory",
    status: "in-stock",
    rating: 4.2,
    tags: ["connectivity", "ports"],
  },
  {
    id: 5,
    name: "Smart Watch",
    price: 1250000,
    category: "wearable",
    status: "in-stock",
    rating: 4.4,
    tags: ["fitness", "notifications"],
  },
  {
    id: 6,
    name: "Wireless Mouse",
    price: 250000,
    category: "accessory",
    status: "low-stock",
    rating: 4.3,
    tags: ["ergonomic", "bluetooth"],
  },
  {
    id: 7,
    name: "Portable SSD 1TB",
    price: 1450000,
    category: "electronics",
    status: "in-stock",
    rating: 4.9,
    tags: ["storage", "fast"],
  },
  {
    id: 8,
    name: "Fitness Band",
    price: 480000,
    category: "wearable",
    status: "out-of-stock",
    rating: 4.1,
    tags: ["fitness", "heart-rate"],
  },
];
