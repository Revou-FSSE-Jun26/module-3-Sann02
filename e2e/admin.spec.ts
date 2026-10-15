import { expect, test, type Page } from "@playwright/test";
import { acceptDialogs, loginAsAdmin, uid } from "./helpers";

/** A product that sits in a seeded *pending* order, so the API refuses to delete it. */
const PRODUCT_IN_ACTIVE_ORDER = process.env.E2E_GUARDED_PRODUCT ?? "Keyboard Mechanical";
/** A seeded category that still has products. */
const CATEGORY_WITH_PRODUCTS = process.env.E2E_GUARDED_CATEGORY ?? "Elektronik";

function productRow(page: Page, name: string) {
  return page.getByTestId("product-row").filter({ has: page.getByRole("cell", { name, exact: true }) });
}

function categoryRow(page: Page, name: string) {
  return page.getByTestId("category-row").filter({ has: page.getByRole("cell", { name, exact: true }) });
}

test.describe("Admin dashboard", () => {
  test.beforeEach(async ({ page }) => {
    acceptDialogs(page);
    await loginAsAdmin(page);
  });

  test("admin lands on /dashboard and sees the product table", async ({ page }) => {
    await expect(page).toHaveTitle("Dashboard | RevoShop");
    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
    await expect(page.getByTestId("product-row").first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Manage categories" })).toBeVisible();
  });

  test("full product CRUD: validate, create, edit, delete", async ({ page }) => {
    const name = `E2E Product ${uid()}`;
    const renamed = `${name} v2`;

    await page.getByRole("button", { name: "+ New product" }).click();
    const form = page.getByRole("form", { name: "New product" });

    // Submitting empty shows the validation messages and creates nothing.
    await form.getByRole("button", { name: "Save product" }).click();
    await expect(form.getByText("Name is required.")).toBeVisible();
    await expect(form.getByText("Please select a category.")).toBeVisible();

    await form.getByLabel("Name").fill(name);
    await form.getByLabel("Price (Rp)").fill("125000");
    await form.getByLabel("Stock").fill("7");
    await form.getByLabel("Category").selectOption({ index: 1 });
    await form.getByLabel(/Description/).fill("Created by Playwright");
    await form.getByRole("button", { name: "Save product" }).click();

    await expect(page.getByText(`"${name}" created.`)).toBeVisible();
    await expect(productRow(page, name)).toBeVisible();

    // Edit
    await productRow(page, name).getByRole("button", { name: `Edit ${name}` }).click();
    const editForm = page.getByRole("form", { name: `Edit "${name}"` });
    await editForm.getByLabel("Name").fill(renamed);
    await editForm.getByLabel("Stock").fill("3");
    await editForm.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByText(`"${renamed}" updated.`)).toBeVisible();
    await expect(productRow(page, renamed)).toContainText("Low stock");

    // Delete (no orders -> allowed)
    await productRow(page, renamed).getByRole("button", { name: `Delete ${renamed}` }).click();
    await expect(page.getByText(`"${renamed}" deleted.`)).toBeVisible();
    await expect(productRow(page, renamed)).toHaveCount(0);
  });

  test("deleting a product with active orders shows a visible error", async ({ page }) => {
    const row = productRow(page, PRODUCT_IN_ACTIVE_ORDER);
    await row.getByRole("button", { name: `Delete ${PRODUCT_IN_ACTIVE_ORDER}` }).click();
    await expect(
      page.getByRole("alert").filter({ hasText: `Cannot delete "${PRODUCT_IN_ACTIVE_ORDER}": it is part of an active order.` }),
    ).toBeVisible();
    await expect(row).toBeVisible();
  });

  test("category CRUD with name validation and the linked-products guard", async ({ page }) => {
    await page.getByRole("link", { name: "Manage categories" }).click();
    await expect(page).toHaveURL(/\/dashboard\/categories$/);
    const form = page.getByRole("form", { name: "New category" });

    // Validation
    await form.getByRole("button", { name: "Create category" }).click();
    await expect(form.getByText("Category name is required")).toBeVisible();

    // Create
    const name = `E2E Category ${uid()}`;
    await form.getByLabel("Category name").fill(name);
    await form.getByLabel("Description (optional)").fill("Created by Playwright");
    await form.getByRole("button", { name: "Create category" }).click();
    await expect(page.getByText(`Category "${name}" created.`)).toBeVisible();
    await expect(categoryRow(page, name)).toBeVisible();

    // Edit
    const renamed = `${name} v2`;
    await categoryRow(page, name).getByRole("button", { name: `Edit ${name}` }).click();
    const editForm = page.getByRole("form", { name: `Edit "${name}"` });
    await editForm.getByLabel("Category name").fill(renamed);
    await editForm.getByRole("button", { name: "Save changes" }).click();
    await expect(categoryRow(page, renamed)).toBeVisible();

    // Guard: a category with products can't be deleted.
    await categoryRow(page, CATEGORY_WITH_PRODUCTS)
      .getByRole("button", { name: `Delete ${CATEGORY_WITH_PRODUCTS}` })
      .click();
    await expect(
      page.getByRole("alert").filter({ hasText: `Cannot delete "${CATEGORY_WITH_PRODUCTS}"` }),
    ).toBeVisible();
    await expect(categoryRow(page, CATEGORY_WITH_PRODUCTS)).toBeVisible();

    // An empty category can.
    await categoryRow(page, renamed).getByRole("button", { name: `Delete ${renamed}` }).click();
    await expect(page.getByText(`Category "${renamed}" deleted.`)).toBeVisible();
    await expect(categoryRow(page, renamed)).toHaveCount(0);
  });

  test("order overview lists every user's orders with a User column", async ({ page }) => {
    await page.goto("/dashboard/orders");
    await expect(page).toHaveTitle("All Orders | RevoShop");
    await expect(page.getByRole("columnheader", { name: "User" })).toBeVisible();
    await expect(page.getByTestId("order-row").first()).toContainText(/User #\d+/);
  });
});
