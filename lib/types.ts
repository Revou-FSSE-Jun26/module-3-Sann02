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
  /** Included by GET /orders and GET /orders/:id. */
  items?: OrderItem[];
}

/** One line of an order (order_items row joined with the product name). */
export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string | null;
  quantity: number;
  price_at_purchase: number;
}

/** GET /orders/:id always returns the items. */
export interface OrderWithItems extends Order {
  items: OrderItem[];
}

/** Roles the API assigns: seeded admins, self-registered customers ("user" on older rows). */
export type UserRole = "admin" | "customer" | (string & {});

/** Public profile kept in AuthContext + localStorage. Never holds the password. */
export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

/** POST /auth/login 200 response. */
export interface LoginResponse {
  user: User & { created_at?: string | null };
  access_token: string;
  token_type: string;
}

/** RegisterForm fields; confirmPassword is client-only and never sent. */
export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/** LoginForm fields. */
export interface LoginFormData {
  email: string;
  password: string;
}

/** CategoryForm fields (POST/PUT /categories). */
export interface CategoryFormData {
  name: string;
  description: string;
}

/** Stock state derived from stock_quantity; drives badge + button styling. */
export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

/** One line in the client-side cart. */
export interface CartItem {
  product: Product;
  quantity: number;
}

/** Fields POST /products and PUT /products/:id accept. */
export interface ProductFormData {
  name: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  description: string;
}

/** One optional message per invalid field. */
export type ProductFormErrors = Partial<Record<keyof ProductFormData, string>>;
