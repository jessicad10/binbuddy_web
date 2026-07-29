import { defineConfig, devices } from "@playwright/test";
import fs from "fs";
import path from "path";

// Create mock active flag file for Next.js server context detection
fs.writeFileSync(path.join(__dirname, ".playwright-mock-active"), "true");

// Ensure clean up on exit
process.on("exit", () => {
  try {
    fs.unlinkSync(path.join(__dirname, ".playwright-mock-active"));
  } catch (e) {}
});

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  timeout: 90000,
  expect: {
    timeout: 10000,
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120 * 1000,
    env: {
      NEXT_PUBLIC_PLAYWRIGHT_TEST: "true",
      PLAYWRIGHT_TEST: "true",
    },
  },
});
