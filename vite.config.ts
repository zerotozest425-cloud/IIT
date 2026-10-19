import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = fileURLToPath(new URL(".", import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  cacheDir: "node_modules/.vite-standalone",
  resolve: {
    alias: {
      "@": path.resolve(projectRoot, "src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT ?? 8443),
    strictPort: true,
  },
  preview: {
    host: "0.0.0.0",
    port: Number(process.env.PORT ?? 8443),
  },
})