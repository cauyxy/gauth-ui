/* How the gallery is built: by `pnpm gallery`, and by the scripts that look at it in Chrome (harness.ts). React, and Tailwind for the classes. */
import tailwind from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({ plugins: [react(), tailwind()] })
