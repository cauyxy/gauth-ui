/// <reference types="vitest/config" />
import tailwind from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/* The JS build. What the package depends on stays an import. Components import no CSS: scripts/build-css.ts writes dist/styles.css, tokens.css and theme.css. */
export default defineConfig({
  plugins: [react(), tailwind()],
  build: {
    lib: { entry: { index: 'src/index.ts', math: 'src/math/index.ts' }, formats: ['es'] },
    rollupOptions: { external: [/^react($|\/)/, /^react-dom($|\/)/, /^radix-ui($|\/)/, /^katex($|\/)/, 'clsx', 'class-variance-authority', 'tailwind-merge'] },
  },
  test: { environment: 'jsdom', globals: true, setupFiles: ['./vitest.setup.ts'], css: false },
})
