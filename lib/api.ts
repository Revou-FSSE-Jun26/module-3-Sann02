// ============================================================
// Server-side data access for the RevoShop Flask API.
// Imported only by Server Components (pages / generateMetadata), so every
// request runs on the server and API_SECRET_KEY never reaches the browser.
// Browser-side calls (auth, cart checkout, dashboard CRUD) live in
// lib/apiClient.ts.
// ============================================================
import { ApiError } from "@/lib/errors";
import type { Category, Order, Product } from "@/lib/types";

// Thrown for non-2xx responses so the route's error.tsx boundary can catch it.
export { ApiError };

function getBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set. Copy .env.example to .env.local.");
  }
  return base.replace(/\/+$/, "");
}

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = { Accept: "application/json" };
  // Server-only secret (no NEXT_PUBLIC_ prefix). Sent when configured so the
  // API can require it later; the current Flask API does not check it yet.
  const secret = process.env.API_SECRET_KEY;
  if (secret) headers["X-API-Key"] = secret;
  return headers;
}

/** Optional artificial latency for demoing loading.tsx locally (0 by default). */
async function demoDelay(): Promise<void> {
  const ms = Number(process.env.API_DEMO_DELAY_MS ?? 0);
  if (Number.isFinite(ms) && ms > 0) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}

async function request(path: string): Promise<Response> {
  await demoDelay();
  // no-store: always fresh data, rendered at request time (never at build time).
  return fetch(`${getBaseUrl()}${path}`, { cache: "no-store", headers: buildHeaders() });
}

async function getJson<T>(path: string, resource: string): Promise<T> {
  const res = await request(path);
  if (!res.ok) {
    throw new ApiError(`Failed to load ${resource} (${res.status})`, res.status);
  }
  return (await res.json()) as T;
}

export interface ProductFilters {
  search?: string;
  categoryId?: number;
}

/** GET /products?search=&category_id= */
export function getProducts({ search, categoryId }: ProductFilters = {}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (categoryId) params.set("category_id", String(categoryId));
  const qs = params.toString();
  return getJson<Product[]>(`/products${qs ? `?${qs}` : ""}`, "products");
}

/** GET /products/:id; resolves to null on 404 so the page can call notFound(). */
export async function getProduct(id: number): Promise<Product | null> {
  const res = await request(`/products/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new ApiError(`Failed to load product ${id} (${res.status})`, res.status);
  }
  return (await res.json()) as Product;
}

/** GET /categories */
export function getCategories(): Promise<Category[]> {
  return getJson<Category[]>("/categories", "categories");
}

/** GET /orders */
export function getOrders(): Promise<Order[]> {
  return getJson<Order[]>("/orders", "orders");
}
