import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./app",
  testMatch: "**/*.e2e.test.tsx",
  use: {
    baseURL: "http://localhost:5173"
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.production,
    stdout: "ignore",
    stderr: "pipe"
  },
  fullyParallel: false,
  workers: 1
})
