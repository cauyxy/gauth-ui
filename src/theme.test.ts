// @vitest-environment node
/* theme.css is what a Tailwind product builds on. This compiles it with Tailwind and checks that the utilities resolve. */
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { compile } from 'tailwindcss'

const ROOT = fileURLToPath(new URL('..', import.meta.url))

async function build(candidates: string[]) {
  const compiler = await compile("@import 'tailwindcss';\n@import './src/styles/theme.css';", {
    base: ROOT,
    loadStylesheet: async (id, base) => {
      const path = id === 'tailwindcss' ? `${ROOT}node_modules/tailwindcss/index.css` : resolve(base, id)
      return { path, base: dirname(path), content: readFileSync(path, 'utf8') }
    },
  })
  return compiler.build(candidates)
}

it('gives the tokens as utilities, and nothing from Tailwind\'s own palette', async () => {
  const css = await build(['bg-ink', 'text-muted', 'text-sm', 'rounded-2xl', 'bg-red-500', 'shadow-lg', 'text-subtle'])
  expect(css).toContain('.bg-ink')
  expect(css).toMatch(/--color-ink:\s*#21252e/)
  expect(css).toContain('.text-muted')
  expect(css).toContain('.rounded-2xl')
  expect(css).not.toContain('.bg-red-500')
  expect(css).not.toContain('.shadow-lg')
  expect(css).not.toContain('.text-subtle')
})

it('emits the colors that the shadows are made of', async () => {
  const css = await build(['shadow-edge', 'shadow-pop', 'shadow-edge-strong'])
  expect(css).toContain('.shadow-edge')
  expect(css).toMatch(/--color-edge:\s*rgb\(80 88 101 \/ 0\.1\)/)
  expect(css).toMatch(/--color-edge-strong:\s*rgb\(80 88 101 \/ 0\.14\)/)
})

it('tints a shadow with a color utility', async () => {
  const css = await build(['shadow-outline', 'shadow-correct'])
  expect(css).toMatch(/\.shadow-outline\s*\{[^}]*--tw-shadow-color/)
  expect(css).toMatch(/\.shadow-correct\s*\{[^}]*--tw-shadow-color/)
})

it('names the movements and their easings', async () => {
  const css = await build(['animate-fade-in', 'animate-spin', 'ease-enter'])
  expect(css).toMatch(/\.animate-fade-in\s*\{[^}]*animation:\s*var\(--animate-fade-in\)/)
  expect(css).toMatch(/--animate-fade-in:\s*gx-fade-in var\(--gx-dur-base\) var\(--ease-enter\) both/)
  expect(css).toMatch(/--ease-enter:\s*cubic-bezier\(0\.22, 1, 0\.36, 1\)/)
  expect(css).toMatch(/--animate-spin:\s*gx-spin/)
})
