import { defineConfig, devices } from "@playwright/test";

/**
 * E2E tests for RevoShop.
 *
 * - Against production: PLAYWRIGHT_BASE_URL=https://<your-app>.vercel.app npm run test:e2e
 * - Locally (default): builds nothing itself; it starts `next start` on port 3100,
 *   so run `npm run build` first.
 *
 * Tests talk to the real API (NEXT_PUBLIC_API_BASE_URL baked into the build) and
 * create their own uniquely-named users, products and categories, then clean up.
 */
const PORT = 3100;
const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./e2e",
  // Flows share one live database, so run files one at a time for predictable state.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  // The serverless API can cold-start or hit a slow network, so allow retries.
  retries: 2,
  timeout: 90_000,
  expect: { timeout: 20_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: externalBaseURL ?? `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      // PLAYWRIGHT_CHANNEL=msedge (or chrome) reuses an installed browser instead
      // of the one from `npx playwright install chromium`.
      use: { ...devices["Desktop Chrome"], channel: process.env.PLAYWRIGHT_CHANNEL || undefined },
    },
  ],
  webServer: externalBaseURL
    ? undefined
    : {
        command: `npm run start -- -p ${PORT}`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
