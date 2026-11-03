import { expect, type APIRequestContext, type Page } from "@playwright/test";

/** Seeded admin (revoshop-backend/helper/seed.py). Override for other environments. */
export const ADMIN = {
  email: process.env.E2E_ADMIN_EMAIL ?? "admin@email.com",
  password: process.env.E2E_ADMIN_PASSWORD ?? "admin123",
};

/** Unique suffix so repeated runs against the live database never collide. */
export function uid(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export interface TestCustomer {
  username: string;
  email: string;
  password: string;
}

export function newCustomer(): TestCustomer {
  const id = uid();
  return { username: `e2e_${id}`, email: `e2e_${id}@example.com`, password: "password123" };
}

/** Fill and submit the RegisterForm; lands on / logged in. */
export async function register(page: Page, user: TestCustomer): Promise<void> {
  await page.goto("/register");
  await page.getByLabel("Username").fill(user.username);
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password", { exact: true }).fill(user.password);
  await page.getByLabel("Confirm password").fill(user.password);
  await page.getByRole("button", { name: "Register" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByTestId("header-username")).toHaveText(user.username);
}

/** Fill and submit the LoginForm (no URL assertion; callers check the role redirect). */
export async function login(page: Page, email: string, password: string): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
}

export async function loginAsAdmin(page: Page): Promise<void> {
  await login(page, ADMIN.email, ADMIN.password);
  await expect(page).toHaveURL(/\/dashboard$/);
}

/** API the deployed app talks to; override with E2E_API_BASE_URL for other environments. */
export const API_BASE_URL = (
  process.env.E2E_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://module-2-sann02-hvbj.vercel.app"
).replace(/\/+$/, "");

interface ApiOrder {
  status: string;
  items?: { product_id: number }[];
}

/**
 * Pick delete-guard targets from live data instead of hard-coding names that
 * can be renamed or removed: a product inside an active (not completed or
 * cancelled) order, and a category that still has products.
 */
export async function findGuardedTargets(
  request: APIRequestContext,
): Promise<{ product: string; category: string }> {
  const get = async <T>(path: string): Promise<T> => {
    const res = await request.get(`${API_BASE_URL}${path}`);
    expect(res.ok(), `GET ${path} -> ${res.status()}`).toBeTruthy();
    return (await res.json()) as T;
  };
  const [orders, products, categories] = await Promise.all([
    get<ApiOrder[]>("/orders"),
    get<{ id: number; name: string; category_id: number }[]>("/products"),
    get<{ id: number; name: string }[]>("/categories"),
  ]);

  const activeIds = new Set(
    orders
      .filter((o) => o.status !== "completed" && o.status !== "cancelled")
      .flatMap((o) => (o.items ?? []).map((i) => i.product_id)),
  );
  const product = process.env.E2E_GUARDED_PRODUCT ?? products.find((p) => activeIds.has(p.id))?.name;
  const usedCategoryIds = new Set(products.map((p) => p.category_id));
  const category =
    process.env.E2E_GUARDED_CATEGORY ?? categories.find((c) => usedCategoryIds.has(c.id))?.name;

  if (!product || !category) {
    throw new Error("No product in an active order or no category with products; seed the database first.");
  }
  return { product, category };
}

/** Accept the window.confirm() shown before deletes. */
export function acceptDialogs(page: Page): void {
  page.on("dialog", (dialog) => void dialog.accept());
}
