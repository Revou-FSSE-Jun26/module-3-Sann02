// ============================================================
// Shared types for RevoShop.
// Product / Category / Order mirror the Flask API JSON exactly
// (see revoshop-backend/models.py -> to_dict), including snake_case
// field names, so fetched data drops straight into the components.
// ============================================================

/** GET /products, GET /products/:id */
export interface Product {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  created_at: string | null;
}

/** GET /categories */
export interface Category {
  id: number;
  name: string;
  description: string | null;
}

/** GET /categories/:id embeds the category's products. */
export interface CategoryWithProducts extends Category {
  products: Product[];
}

/** Known order states; the backend stores status as free text. */
export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "completed"
  | "cancelled";

/** GET /orders */
export interface Order {
  id: number;
  user_id: number;
  // `string & {}` keeps autocomplete for the known literals while still
  // accepting any other status string the API might return.
  status: OrderStatus | (string & {});
  total_amount: number;
  created_at: string | null;
}

/** Stock state derived from stock_quantity; drives badge + button styling. */
export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

/** One line in the client-side cart. */
export interface CartItem {
  product: Product;
  quantity: number;
}

/** Fields POST /products expects (wired to local state in this checkpoint). */
export interface ProductFormData {
  name: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  description: string;
}

/** One optional message per invalid field. */
export type ProductFormErrors = Partial<Record<keyof ProductFormData, string>>;
