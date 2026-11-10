// @vitest-environment node
/* The rules in AGENTS.md that a machine can check. A component that breaks one fails here, not in review. */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parse, stale } from '../scripts/tokens.ts'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const read = (path: string) => readFileSync(`${ROOT}${path}`, 'utf8')
const kebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

const components = readdirSync(`${ROOT}src/components`)
  .filter((f) => /^[A-Z]\w*\.tsx$/.test(f) && !f.endsWith('.test.tsx'))
  .map((f) => f.slice(0, -'.tsx'.length))
const tokens = new Set(parse(read('src/styles/tokens.css')).map((t) => `--gx-${t.name}`))

/** Every `selector { … }` rule of a CSS file, with the at-rules it sits in. */
function rulesOf(css: string) {
  const rules: { selector: string; body: string; within: string[] }[] = []
  const stack: string[] = []
  let prelude = ''
  let body: string | null = null
  for (const ch of css.replace(/\/\*[\s\S]*?\*\//g, '')) {
    if (body !== null) {
      if (ch === '}') {
        rules.push({ selector: stack.pop()!, body, within: [...stack] })
        body = null
      } else body += ch
    } else if (ch === '{') {
      const head = prelude.trim()
      stack.push(head)
      prelude = ''
      if (!head.startsWith('@') || head.startsWith('@font-face')) body = ''
    } else if (ch === '}') {
      stack.pop()
      prelude = ''
    } else if (ch === ';') prelude = ''
    else prelude += ch
  }
  return rules
}

it('theme.css and tokens.json match tokens.css', () => {
  expect(stale()).toEqual([])
})

describe.each(components)('%s', (name) => {
  const cssPath = `src/components/${kebab(name)}.css`

  it('has its style file, test, guideline and exports', () => {
    expect(existsSync(`${ROOT}${cssPath}`), cssPath).toBe(true)
    expect(existsSync(`${ROOT}src/components/${name}.test.tsx`), `${name}.test.tsx`).toBe(true)
    expect(existsSync(`${ROOT}design/components/${name}/README.md`), `design/components/${name}/README.md`).toBe(true)
    expect(read('src/styles.css')).toContain(`@import './components/${kebab(name)}.css';`)
    expect(read('src/index.ts')).toContain(`'./components/${name}'`)
  })

  it('styles use tokens only', () => {
    const css = read(cssPath).replace(/\/\*[\s\S]*?\*\//g, '')
    expect(css.match(/#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab)\(/gi) ?? [], 'color literals').toEqual([])
    expect(css.match(/font-size:(?!\s*var\(--gx-text-)[^;]+/g) ?? [], 'font sizes off the scale').toEqual([])
    expect(css.match(/font-weight:(?!\s*var\(--gx-font-weight-)[^;]+/g) ?? [], 'font weights that are not tokens').toEqual([])
    expect(css.match(/(?<![\w.-])\d*\.?\d+m?s\b/g) ?? [], 'durations that are not tokens').toEqual([])
    expect(css, 'reduced motion is handled once, by --gx-ms').not.toContain('prefers-reduced-motion')
    const local = new Set(css.match(/--gx-[\w-]+(?=\s*:)/g) ?? [])
    const unknown = (css.match(/var\(--gx-[\w-]+/g) ?? []).map((v) => v.slice(4)).filter((v) => !tokens.has(v) && !local.has(v))
    expect(unknown, 'tokens that do not exist').toEqual([])
  })

  it('styles are in no cascade layer, under gx- class names, with hover behind (hover: hover)', () => {
    expect(read(cssPath)).not.toContain('@layer')
    for (const rule of rulesOf(read(cssPath))) {
      expect(rule.selector.match(/\.(?!gx-)[A-Za-z_][\w-]*/g) ?? [], rule.selector).toEqual([])
      if (rule.selector.includes(':hover')) expect(rule.within, rule.selector).toContain('@media (hover: hover)')
    }
  })
})
