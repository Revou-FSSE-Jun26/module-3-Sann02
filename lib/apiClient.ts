// ============================================================
// Browser-side calls to the RevoShop Flask API.
// Used by Client Components (auth forms, cart checkout, dashboard CRUD).
// The base URL comes from NEXT_PUBLIC_API_BASE_URL, which Next.js inlines
// into the client bundle at build time. The API enables CORS for this.
// ============================================================

import { ApiError } from "@/lib/errors";
import type {
  Category,
  CategoryFormData,
  LoginResponse,
  OrderWithItems,
  Product,
  ProductFormData,
  User,
} from "@/lib/types";

function baseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set. Copy .env.example to .env.local.");
  }
  return base.replace(/\/+$/, "");
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  /** JWT from POST /auth/login, sent as Authorization: Bearer <token>. */
  token?: string | null;
}

/** fetch + JSON + uniform errors: any non-2xx becomes an ApiError with the API's message. */
async function request<T>(path: string, { method = "GET", body, token }: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${baseUrl()}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Can't reach the RevoShop API. Check your connection and try again.", 0);
  }

  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const payload = (data ?? {}) as { error?: string; field?: string };
    throw new ApiError(payload.error ?? `Request failed (${res.status})`, res.status, payload.field);
  }
  return data as T;
}

// ---------- Auth ----------

/** POST /users -> 201 { id, username, email, role }. 409 when the email is taken. */
export function registerUser(data: { username: string; email: string; password: string }) {
  return request<User>("/users", { method: "POST", body: data });
}

/** POST /auth/login -> 200 { user, access_token }. 401 on bad credentials, 400 on a missing field. */
export function loginUser(data: { email: string; password: string }) {
  return request<LoginResponse>("/auth/login", { method: "POST", body: data });
}

// ---------- Products ----------

export function fetchProducts() {
  return request<Product[]>("/products");
}

export function createProduct(data: ProductFormData) {
  return request<Product>("/products", { method: "POST", body: toProductBody(data) });
}

export function updateProduct(id: number, data: ProductFormData) {
  return request<Product>(`/products/${id}`, { method: "PUT", body: toProductBody(data) });
}

/** 409 when the product is in an active (not completed/cancelled) order. */
export function deleteProduct(id: number) {
  return request<{ message: string }>(`/products/${id}`, { method: "DELETE" });
}

function toProductBody(data: ProductFormData) {
  return {
    name: data.name.trim(),
    price: data.price,
    stock_quantity: data.stock_quantity,
    category_id: data.category_id,
    description: data.description.trim(),
  };
}

// ---------- Categories ----------

export function fetchCategories() {
  return request<Category[]>("/categories");
}

export function createCategory(data: CategoryFormData) {
  return request<Category>("/categories", {
    method: "POST",
    body: { name: data.name.trim(), description: data.description.trim() },
  });
}

export function updateCategory(id: number, data: CategoryFormData) {
  return request<Category>(`/categories/${id}`, {
    method: "PUT",
    body: { name: data.name.trim(), description: data.description.trim() },
  });
}

/** 409 when products still belong to the category. */
export function deleteCategory(id: number) {
  return request<{ message: string }>(`/categories/${id}`, { method: "DELETE" });
}

// ---------- Orders ----------

/**
 * GET /orders. With a token the API returns only that user's orders;
 * without one it returns every order (the admin overview).
 */
export function fetchOrders(token?: string | null) {
  return request<OrderWithItems[]>("/orders", { token });
}

export function fetchOrder(id: number) {
  return request<OrderWithItems>(`/orders/${id}`);
}

/** POST /orders -> 201 with the new order; user comes from the JWT. */
export function createOrder(items: { product_id: number; quantity: number }[], token: string) {
  return request<OrderWithItems>("/orders", { method: "POST", body: { items }, token });
}
