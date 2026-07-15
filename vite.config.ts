import { defineConfig } from "vite"
import honox from "honox/vite"
import client from "honox/vite/client"
import tailwindcss from "@tailwindcss/vite"
import build from "@hono/vite-build/node"

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
      plugins: [client()]
    }
  }
  return {
    plugins: [
      honox(),
      tailwindcss(),
      build({
        entry: "./app/server.ts",
        output: "lambda.js"
      })
    ],
    ssr: {
      external: ["pg"]
    }
  }
})
