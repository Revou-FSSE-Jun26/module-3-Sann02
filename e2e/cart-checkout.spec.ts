import { expect, test } from "@playwright/test";
import { newCustomer, register } from "./helpers";

test.describe("Customer cart and checkout", () => {
  test("cart: empty state, add, persist across refresh, remove, then checkout", async ({ page }) => {
    await register(page, newCustomer());

    // Empty cart: empty state + disabled checkout button.
    await page.goto("/cart");
    await expect(page.getByTestId("cart-empty")).toBeVisible();
    await expect(page.getByRole("button", { name: "Proceed to checkout" })).toBeDisabled();

    // Add the first in-stock product from the listing.
    await page.goto("/products");
    const card = page.locator("article").filter({ has: page.getByRole("button", { name: "Add to Cart" }) }).first();
    const productName = (await card.locator("h3").textContent())?.trim() ?? "";
    await card.getByRole("button", { name: /Increase quantity/ }).click();
    await card.getByRole("button", { name: "Add to Cart" }).click();
    await expect(page.getByText(`Added 2 × ${productName} to your cart.`)).toBeVisible();
    await expect(page.getByTestId("cart-count")).toHaveText("2");

    // Cart table shows the row, and it survives a refresh (localStorage).
    await page.goto("/cart");
    const row = page.getByTestId("cart-row").filter({ hasText: productName });
    await expect(row).toBeVisible();
    await expect(page.getByTestId("cart-item-count")).toHaveText("2");
    await page.reload();
    await expect(row).toBeVisible();
    await expect(page.getByTestId("cart-count")).toHaveText("2");

    // Remove -> empty again.
    await row.getByRole("button", { name: `Remove ${productName} from cart` }).click();
    await expect(page.getByText(`${productName} removed from your cart.`)).toBeVisible();
    await expect(page.getByTestId("cart-empty")).toBeVisible();
    await expect(page.getByRole("button", { name: "Proceed to checkout" })).toBeDisabled();

    // Add again from the detail page and check out.
    await page.goto("/products");
    await page.locator("article").filter({ hasText: productName }).locator("h3 a").click();
    await expect(page).toHaveURL(/\/products\/\d+$/);
    await expect(page.getByRole("heading", { level: 1, name: productName })).toBeVisible();
    await page.getByRole("button", { name: "Add to Cart" }).click();
    await expect(page.getByTestId("cart-count")).toHaveText("1");

    await page.goto("/cart");
    await page.getByRole("button", { name: "Proceed to checkout" }).click();
    await expect(page).toHaveURL(/\/checkout$/);
    await expect(page.getByText(productName)).toBeVisible();
    await page.getByRole("button", { name: "Confirm order" }).click();

    // POST /orders -> cart cleared -> redirected to /orders with the new order.
    await expect(page).toHaveURL(/\/orders$/);
    await expect(page.getByText(/Order #\d+ confirmed/)).toBeVisible();
    await expect(page.getByTestId("cart-count")).toHaveText("0");
    const orderRows = page.getByTestId("order-row");
    await expect(orderRows).toHaveCount(1);

    // Order detail page lists the purchased item.
    await orderRows.first().getByRole("link").click();
    await expect(page).toHaveURL(/\/orders\/\d+$/);
    await expect(page.getByRole("heading", { name: /Order #\d+/ })).toBeVisible();
    await expect(page.getByRole("cell", { name: productName })).toBeVisible();
  });
});
