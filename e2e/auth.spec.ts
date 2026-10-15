import { expect, test } from "@playwright/test";
import { login, newCustomer, register } from "./helpers";

test.describe("Register and login", () => {
  test("RegisterForm validates all four fields before calling the API", async ({ page }) => {
    await page.goto("/register");
    await expect(page).toHaveTitle("Register | RevoShop");
    await page.getByLabel("Username").fill("   ");
    await page.getByLabel("Email").fill("bad-email");
    await page.getByLabel("Password", { exact: true }).fill("short");
    await page.getByLabel("Confirm password").fill("shor");
    await page.getByRole("button", { name: "Register" }).click();

    await expect(page.getByText("Username is required")).toBeVisible();
    await expect(page.getByText("Enter a valid email address")).toBeVisible();
    await expect(page.getByText("Password must be at least 8 characters")).toBeVisible();
    await expect(page.getByText("Passwords do not match")).toBeVisible();
    await expect(page).toHaveURL(/\/register$/);
  });

  test("successful registration logs in, redirects home and survives a refresh", async ({ page }) => {
    const user = newCustomer();
    await register(page, user);

    await page.reload();
    await expect(page.getByTestId("header-username")).toHaveText(user.username);

    // Logged-in users are kept away from the auth pages.
    await page.goto("/login");
    await expect(page).toHaveURL(/\/$/);
  });

  test("registering an email that already exists shows an error", async ({ page }) => {
    const user = newCustomer();
    await register(page, user);
    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page.getByRole("link", { name: "Login" })).toBeVisible();

    await page.goto("/register");
    await page.getByLabel("Username").fill(user.username);
    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Password", { exact: true }).fill(user.password);
    await page.getByLabel("Confirm password").fill(user.password);
    await page.getByRole("button", { name: "Register" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Email already registered" })).toBeVisible();
  });

  test("LoginForm shows an error on invalid credentials", async ({ page }) => {
    await login(page, "nobody@example.com", "wrong-password");
    await expect(page.getByRole("alert").filter({ hasText: "Invalid email or password" })).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("LoginForm reports an empty field under its input", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();
  });

  test("customer logs in, lands on / and cannot open admin pages", async ({ page }) => {
    const user = newCustomer();
    await register(page, user);
    await page.getByRole("button", { name: "Logout" }).click();

    await login(page, user.email, user.password);
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId("header-username")).toHaveText(user.username);

    for (const path of ["/dashboard", "/dashboard/orders", "/dashboard/categories"]) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/$/);
    }
  });
});
