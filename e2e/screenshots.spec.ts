import { expect, test } from "@playwright/test";
import { loginAsAdmin, newCustomer, register } from "./helpers";

/**
 * Not part of the regular suite: captures the README screenshots.
 *   CAPTURE_SCREENSHOTS=1 npx playwright test e2e/screenshots.spec.ts
 */
test.skip(!process.env.CAPTURE_SCREENSHOTS, "Set CAPTURE_SCREENSHOTS=1 to capture README screenshots");

const DIR = "screenshots/checkpoint-3";

test.use({ viewport: { width: 1280, height: 800 } });

test("capture public pages", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Featured products" })).toBeVisible();
  await page.screenshot({ path: `${DIR}/01-home.png`, fullPage: true });

  await page.goto("/products");
  await expect(page.locator("article").first()).toBeVisible();
  await page.screenshot({ path: `${DIR}/02-products.png`, fullPage: true });

  await page.locator("article h3 a").first().click();
  await expect(page).toHaveURL(/\/products\/\d+$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.screenshot({ path: `${DIR}/03-product-detail.png`, fullPage: true });

  await page.goto("/categories");
  await expect(page.getByRole("link", { name: /View products/ }).first()).toBeVisible();
  await page.screenshot({ path: `${DIR}/04-categories.png`, fullPage: true });

  await page.goto("/register");
  await page.getByLabel("Email").fill("bad-email");
  await page.getByLabel("Password", { exact: true }).fill("short");
  await page.getByLabel("Confirm password").fill("shor");
  await page.getByRole("button", { name: "Register" }).click();
  await expect(page.getByText("Passwords do not match")).toBeVisible();
  await page.screenshot({ path: `${DIR}/05-register-validation.png`, fullPage: true });

  await page.goto("/login");
  await page.getByLabel("Email").fill("nobody@example.com");
  await page.getByLabel("Password").fill("wrong-password");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Invalid email or password" })).toBeVisible();
  await page.screenshot({ path: `${DIR}/06-login-error.png`, fullPage: true });
});

test("capture customer cart, checkout and orders", async ({ page }) => {
  await register(page, newCustomer());
  await page.goto("/products");
  await page.getByRole("button", { name: "Add to Cart" }).nth(0).click();
  await page.getByRole("button", { name: "Add to Cart" }).nth(1).click();
  await expect(page.getByTestId("cart-count")).toHaveText("2");

  await page.goto("/cart");
  await expect(page.getByTestId("cart-row").first()).toBeVisible();
  await page.screenshot({ path: `${DIR}/07-cart.png`, fullPage: true });

  await page.getByRole("button", { name: "Proceed to checkout" }).click();
  await expect(page.getByRole("button", { name: "Confirm order" })).toBeVisible();
  await page.screenshot({ path: `${DIR}/08-checkout.png`, fullPage: true });

  await page.getByRole("button", { name: "Confirm order" }).click();
  await expect(page).toHaveURL(/\/orders$/);
  await expect(page.getByTestId("order-row").first()).toBeVisible();
  await page.screenshot({ path: `${DIR}/09-my-orders.png`, fullPage: true });
});

test("capture admin dashboard", async ({ page }) => {
  await loginAsAdmin(page);
  await expect(page.getByTestId("product-row").first()).toBeVisible();
  await page.getByRole("button", { name: "+ New product" }).click();
  await page.screenshot({ path: `${DIR}/10-admin-dashboard.png`, fullPage: true });

  await page.goto("/dashboard/categories");
  await expect(page.getByTestId("category-row").first()).toBeVisible();
  await page.screenshot({ path: `${DIR}/11-admin-categories.png`, fullPage: true });

  await page.goto("/dashboard/orders");
  await expect(page.getByTestId("order-row").first()).toBeVisible();
  await page.screenshot({ path: `${DIR}/12-admin-orders.png`, fullPage: true });
});
