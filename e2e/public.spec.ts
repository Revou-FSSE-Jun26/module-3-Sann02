import { expect, test } from "@playwright/test";

test.describe("Logged-out visitor", () => {
  test("home page lists featured products from the API", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Home | RevoShop");
    await expect(page.getByRole("heading", { name: "Featured products" })).toBeVisible();
    await expect(page.locator('a[href^="/products/"]').first()).toBeVisible();
    // Logged-out header shows the auth links.
    await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Register" })).toBeVisible();
  });

  test("product listing search updates the URL and filters results", async ({ page }) => {
    await page.goto("/products");
    await expect(page).toHaveTitle("Products | RevoShop");
    const cards = page.locator("article");
    await expect(cards.first()).toBeVisible();

    const before = await cards.count();
    await page.getByLabel("Search products").fill("mouse");
    await expect(page).toHaveURL(/search=mouse/);
    // The catalog changes over time, so check the filter itself, not an exact count:
    // fewer cards than before, and every remaining title mentions "mouse".
    await expect(async () => {
      const titles = await page.locator("article h3").allTextContents();
      expect(titles.length).toBeGreaterThan(0);
      expect(titles.length).toBeLessThan(before);
      for (const title of titles) expect(title).toMatch(/mouse/i);
    }).toPass();
  });

  test("product detail page has a dynamic title", async ({ page }) => {
    await page.goto("/products");
    // The title link (the image link is aria-hidden and has no text).
    const firstLink = page.locator("article h3 a").first();
    const name = (await firstLink.textContent())?.trim() ?? "";
    await firstLink.click();
    await expect(page).toHaveURL(/\/products\/\d+$/);
    await expect(page.getByRole("heading", { level: 1, name })).toBeVisible();
    await expect(page).toHaveTitle(`${name} | RevoShop`);
  });

  test("category listing renders categories from the API", async ({ page }) => {
    await page.goto("/categories");
    await expect(page).toHaveTitle("Categories | RevoShop");
    await expect(page.getByRole("link", { name: /View products/ }).first()).toBeVisible();
  });

  test("Add to Cart sends a guest to /login", async ({ page }) => {
    await page.goto("/products");
    await page.getByRole("button", { name: "Add to Cart" }).first().click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByText("Please log in to add items to your cart.")).toBeVisible();
  });

  for (const path of ["/cart", "/checkout", "/orders", "/dashboard", "/dashboard/orders", "/dashboard/categories"]) {
    test(`guest opening ${path} is redirected to /login`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(/\/login$/);
      await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
    });
  }
});
