// ============================================================
// Type definitions for the product catalog.
// Demonstrates: interfaces, type aliases, and union types.
// ============================================================

// UNION TYPE — a value that can take one of a few fixed shapes/states.
export type Category = "electronics" | "accessory" | "wearable";

// UNION TYPE — stock status modelled as a small set of literals.
export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

// TYPE ALIAS — a plain alias over a primitive, for readable code.
export type Rupiah = number;

// INTERFACE — the shape of a single product.
// Note the nested array (`tags`) and the union-typed fields.
export interface Product {
  id: number;
  name: string;
  price: Rupiah;
  category: Category;
  status: StockStatus;
  rating: number;
  tags: string[]; // nested array of strings
}

// INTERFACE — a product once it's in the cart (nested object usage:
// an array of CartItem is stored on the app state).
export interface CartItem {
  product: Product; // nested object
  quantity: number;
}

// TYPE ALIAS over an array of interface objects — the whole catalog.
export type Catalog = Product[];
