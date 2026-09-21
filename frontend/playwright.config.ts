import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "with-model",
      testMatch: /flow\.spec\.ts/,
      use: { baseURL: "http://localhost:5176" },
    },
    {
      name: "no-model",
      testMatch: /no-model\.spec\.ts/,
      use: { baseURL: "http://localhost:5177" },
    },
  ],
})