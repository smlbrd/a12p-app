import { defineConfig, mergeConfig } from "vitest/config"
import viteConfig from "./vite.config.ts"

export default defineConfig((configEnv) => {
  return mergeConfig(
    viteConfig(configEnv),
    defineConfig({
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
          exclude: ["**/db/schema.ts", "**/scripts/**", "**.*.e2e.test.tsx"]
        }
      }
    })
  )
})
