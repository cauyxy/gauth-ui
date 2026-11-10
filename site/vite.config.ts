import tailwind from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

/* The docs site (ui.gauthx.app): a static page built to site/dist. `pnpm site` serves it, `pnpm site:build` builds it. */
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react(), tailwind()],
  build: { outDir: 'dist', emptyOutDir: true },
})
