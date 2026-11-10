/*
 * Compares the computed styles of each gauthx component with the gauth-ui component that replaces it, for the switch of
 * gauthx to this package. It serves compare/main.tsx twice, once with each theme, and reads each side on its own page in
 * Chrome: at rest, hovered, and with keyboard focus.
 *
 *   pnpm build && node compare/run.ts [path to the gauthx checkout, default ../gauthx] [folder for screenshots]
 *
 * The two differ on purpose now (see docs/from-gauthx.md), so read the list: a change here should add only the
 * properties it meant to change. This is a tool for the switch, not a regression test of this package.
 */
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium, type Page } from 'playwright-core'
import { createServer } from 'vite'

const HERE = fileURLToPath(new URL('.', import.meta.url))
const GAUTHX = resolve(process.argv[2] ?? `${HERE}../../gauthx`)
const SHOTS = process.argv[3]

mkdirSync(`${HERE}.tmp`, { recursive: true })
const sources = ["@source '../';", `@source '${GAUTHX}/apps/teach/src/components';`, '']
writeFileSync(`${HERE}.tmp/old.css`, ["@import 'tailwindcss';", `@import '${GAUTHX}/packages/ui/src/theme.css';`, `@source '${GAUTHX}/packages/ui/src';`, ...sources].join('\n'))
writeFileSync(`${HERE}.tmp/new.css`, ["@import 'tailwindcss';", "@import '../../dist/styles.css';", ...sources].join('\n'))

const server = await createServer({
  configFile: false,
  root: HERE,
  logLevel: 'error',
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom', 'radix-ui'],
    alias: {
      '@gauthx/ui': `${GAUTHX}/packages/ui/src/index.ts`,
      '@gauthx-teach': `${GAUTHX}/apps/teach/src/components`,
    },
  },
  server: { port: 5179, strictPort: true, fs: { strict: false } },
})
await server.listen()

type Node = { path: string; cls: string; style: Record<string, string>; w: number; h: number }
type Trees = Record<string, Node[]>

const browser = await chromium.launch({ channel: 'chrome' })

/** The computed styles of an element and everything in it. Runs in the page. */
function readTree(sel: string): Node[] | null {
  const PROPS = [
    'display', 'position', 'top', 'left', 'box-sizing', 'min-width', 'min-height', 'max-width', 'max-height',
    'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
    'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
    'background-color', 'background-image', 'color', 'box-shadow', 'filter', 'fill',
    'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'font-variant-numeric', 'white-space',
    'text-overflow', 'text-decoration-line', 'text-align', 'overflow-x', 'overflow-y', 'cursor', 'pointer-events', 'user-select',
    'flex-direction', 'flex-wrap', 'flex-grow', 'flex-shrink', 'flex-basis', 'align-items', 'justify-content', 'justify-items',
    'row-gap', 'column-gap', 'z-index', 'outline-style', 'outline-width',
    'transition-property', 'transition-duration', 'transition-timing-function',
    'animation-duration', 'animation-timing-function', 'animation-iteration-count', 'animation-delay', 'animation-fill-mode',
  ]
  /* Tailwind composes shadows and transitions from empty layers and its own variables; they paint nothing. */
  const norm = (v: string) =>
    v
      .replace(/rgba\(0, 0, 0, 0\) 0px 0px 0px 0px(, )?/g, '')
      .replace(/, $/, '')
      .replace(/, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to/, '') || 'none'
  const walk = (el: Element, path: string, out: Node[]) => {
    const cs = getComputedStyle(el)
    const rect = el.getBoundingClientRect()
    const style = Object.fromEntries(PROPS.map((p) => [p, norm(cs.getPropertyValue(p))]))
    if (!cs.animationName || cs.animationName === 'none') style.opacity = cs.opacity
    /* An outline with no width or no style paints nothing, however it is written. */
    if (style['outline-style'] === 'none' || style['outline-width'] === '0px') Object.assign(style, { 'outline-style': 'none', 'outline-width': '0px' })
    out.push({ path, cls: typeof el.className === 'string' ? el.className : '', style, w: rect.width, h: rect.height })
    ;[...el.children].forEach((child, i) => walk(child, `${path}>${child.tagName.toLowerCase()}[${i}]`, out))
    return out
  }
  const el = document.querySelector(sel)
  return el ? walk(el, 'root', []) : null
}

async function collect(state?: 'hover' | 'focus'): Promise<Trees> {
  const trees: Trees = {}
  for (const side of ['old', 'new']) {
    const page: Page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 })
    page.on('pageerror', (e) => console.error('page error:', e.message))
    await page.goto(`http://localhost:5179/?${side}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)
    if (!state && SHOTS) await page.screenshot({ path: `${SHOTS}/compare-${side}.png`, fullPage: true })
    const names: string[] = await page.evaluate(() => [...document.querySelectorAll('[data-new]')].map((e) => e.getAttribute('data-new')!))
    for (const name of names) {
      const sel = `[data-${side}="${name}"] > *`
      const target = page.locator(sel).first()
      if (!(await target.count())) continue
      if (state === 'hover') await target.hover({ force: true })
      if (state === 'focus') {
        if (!(await target.evaluate((e) => e.matches('button, a')))) continue
        await page.keyboard.press('Tab')
        await target.focus()
        if (!(await target.evaluate((e) => e.matches(':focus-visible')))) continue
      }
      if (state) await page.waitForTimeout(260)
      const tree = await page.evaluate(readTree, sel)
      if (tree) trees[`${side}:${name}`] = tree
    }
    if (!state)
      for (const kind of ['tooltip', 'popover']) {
        const tree = await page.evaluate(readTree, `[data-portal="${side}-${kind}"]`)
        if (tree) trees[`${side}:${kind}-content`] = tree
      }
    await page.close()
  }
  return trees
}

let total = 0
function report(title: string, trees: Trees) {
  const diffs: string[] = []
  let pairs = 0
  for (const key of Object.keys(trees).filter((k) => k.startsWith('old:'))) {
    const name = key.slice(4)
    const a = trees[key]!
    const b = trees[`new:${name}`]
    pairs++
    if (!b || a.length !== b.length) {
      diffs.push(`${name}: old has ${a.length} elements, new has ${b?.length ?? 0}`)
      continue
    }
    a.forEach((na, i) => {
      const nb = b[i]!
      for (const [p, va] of Object.entries(na.style)) if (va !== nb.style[p]) diffs.push(`${name} ${na.path} ${p}: old "${va}" new "${nb.style[p]}"`)
      if (Math.abs(na.w - nb.w) > 0.01 || Math.abs(na.h - nb.h) > 0.01) diffs.push(`${name} ${na.path} size: old ${na.w}x${na.h} new ${nb.w}x${nb.h}`)
    })
  }
  total += diffs.length
  console.log(`${title}: ${pairs} pairs, ${diffs.length} differences`)
  for (const d of diffs) console.log(`  ${d}`)
}

try {
  report('At rest', await collect())
  report('Hovered', await collect('hover'))
  report('Keyboard focus', await collect('focus'))
} finally {
  await browser.close()
  await server.close()
}
console.log(`${total} differences in all`)
