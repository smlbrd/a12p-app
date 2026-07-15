import { defineConfig } from "vite"
import honox from "honox/vite"
import client from "honox/vite/client"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
      plugins: [client(), tailwindcss()]
    }
  }

  return {
    plugins: [honox(), tailwindcss()],
    build: {
      ssr: true,
      rolldownOptions: {
        input: "./app/server.ts",
        output: {
          dir: "./dist",
          entryFileNames: "lambda.js",
          format: "esm"
        }
      }
    },
    ssr: {
      external: ["pg"]
    }
  }
})
