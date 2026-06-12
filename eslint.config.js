import js from "@eslint/js"
import { defineConfig } from "eslint/config"
import * as tseslint from "typescript-eslint"

export default defineConfig([
  {
    ignores: [
      "**/coverage/**",
      "**/dist/**",
      "**/node_modules/**",
      "eslint.config.js",
      "drizzle.config.ts",
      "vitest.config.ts",
      "scripts/*"
    ]
  },
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": ["warn", { allow: ["warn", "error"] }]
    }
  }
])
