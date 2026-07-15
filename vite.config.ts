import { defineConfig } from "vite"
import honox from "honox/vite"
import client from "honox/vite/client"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
      plugins: [client()]
    }
  }
  return {
    plugins: [honox(), tailwindcss()],
    ssr: {
      external: ["pg"]
    }
  }
})
