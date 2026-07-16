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
        exclude: ["node_modules", "**/*.e2e.test.tsx"],
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
          exclude: ["**/db/**", "**/scripts/**", "**/routes/*.tsx", "**/*.e2e.test.tsx", "**/dist/**"]
        }
      }
    })
  )
})
