/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/* The JS build. Components import no CSS: scripts/build-css.ts writes dist/styles.css, tokens.css and theme.css. */
export default defineConfig({
  plugins: [react()],
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'index' },
    rollupOptions: { external: [/^react($|\/)/, /^react-dom($|\/)/, /^radix-ui($|\/)/] },
  },
  test: { environment: 'jsdom', globals: true, setupFiles: ['./vitest.setup.ts'], css: false },
})
