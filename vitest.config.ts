import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    fileParallelism: false,
    sequence: {
      concurrent: false
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "json"],
      reportOnFailure: true,
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80
      },

      exclude: ["**/database/schema.ts", "**/scripts/**"]
    }
  }
})
