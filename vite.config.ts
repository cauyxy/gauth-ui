/// <reference types="vitest/config" />
import tailwind from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/*
 * The JS build. What the package depends on stays an import. Components import no CSS: scripts/build-css.ts writes dist/styles.css, tokens.css and theme.css.
 * Each source file is its own file in dist/, so a product's bundler leaves out the components it does not import, and a
 * file keeps its `'use client'` line. Names are not shortened: a product minifies its own bundle, and React DevTools shows `Button`.
 */
export default defineConfig({
  plugins: [react(), tailwind()],
  build: {
    minify: false,
    lib: { entry: { index: 'src/index.ts', 'math/index': 'src/math/index.ts' }, formats: ['es'] },
    rollupOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^radix-ui($|\/)/, /^katex($|\/)/, 'clsx', 'class-variance-authority', 'tailwind-merge'],
      output: { preserveModules: true, preserveModulesRoot: 'src', entryFileNames: '[name].js' },
    },
  },
  test: { environment: 'jsdom', globals: true, setupFiles: ['./vitest.setup.ts'], css: false },
})
