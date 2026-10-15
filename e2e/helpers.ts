import { expect, type Page } from "@playwright/test";

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

/** Accept the window.confirm() shown before deletes. */
export function acceptDialogs(page: Page): void {
  page.on("dialog", (dialog) => void dialog.accept());
}
