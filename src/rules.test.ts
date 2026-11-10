// @vitest-environment node
/* The rules in AGENTS.md that a machine can check. A component that breaks one fails here, not in review. */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parse, stale } from '../scripts/tokens.ts'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const read = (path: string) => readFileSync(`${ROOT}${path}`, 'utf8')
const kebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

/** Every component of both groups: [name, folder under src]. */
const components = (['components', 'learning'] as const).flatMap((dir) =>
  readdirSync(`${ROOT}src/${dir}`)
    .filter((f) => /^[A-Z]\w*\.tsx$/.test(f) && !f.endsWith('.test.tsx'))
    .map((f) => [f.slice(0, -'.tsx'.length), dir] as const),
)
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

/** The values of a property family in a CSS file that are not on the allowed list. */
const offToken = (css: string, property: string, allowed: RegExp) =>
  [...css.matchAll(new RegExp(`(?<![\\w-])(${property}):\\s*([^;}]+)`, 'g'))]
    .flatMap((m) =>
      m[2]!
        .trim()
        .split(/\s+(?![^(]*\))/)
        .map((part) => [m[1]!, part] as const),
    )
    .filter(([, part]) => !allowed.test(part))
    .map(([prop, part]) => `${prop}: ${part}`)

it('theme.css and tokens.json match tokens.css', () => {
  expect(stale()).toEqual([])
})

it('core does not import learning', () => {
  for (const dir of ['components', 'core'])
    for (const file of readdirSync(`${ROOT}src/${dir}`)) expect(read(`src/${dir}/${file}`), `${dir}/${file}`).not.toMatch(/from '\.\.\/learning\//)
})

describe('math', () => {
  const css = read('src/math/math.css').replace(/\/\*[\s\S]*?\*\//g, '')

  it('is its own entry: the main entry and its styles do not load KaTeX', () => {
    expect(read('src/index.ts')).not.toContain('math')
    expect(read('src/styles.css')).not.toContain('math')
    for (const dir of ['components', 'learning', 'core'])
      for (const file of readdirSync(`${ROOT}src/${dir}`)) expect(read(`src/${dir}/${file}`), `${dir}/${file}`).not.toMatch(/katex|\.\.\/math\//)
  })

  it.each(['Tex', 'RichText'])('%s has its test, guideline and export', (name) => {
    expect(existsSync(`${ROOT}src/math/${name}.test.tsx`)).toBe(true)
    expect(existsSync(`${ROOT}design/components/${name}/README.md`)).toBe(true)
    expect(read('src/math/index.ts')).toContain(`'./${name}'`)
  })

  it('styles use tokens only', () => {
    expect(css.match(/#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab)\(/gi) ?? [], 'color literals').toEqual([])
    const unknown = (css.match(/var\(--gx-[\w-]+/g) ?? []).map((v) => v.slice(4)).filter((v) => !tokens.has(v))
    expect(unknown, 'tokens that do not exist').toEqual([])
  })
})

describe.each(components)('%s', (name, dir) => {
  const cssPath = `src/${dir}/${kebab(name)}.css`

  it('has its style file, test, guideline and exports', () => {
    expect(existsSync(`${ROOT}${cssPath}`), cssPath).toBe(true)
    expect(existsSync(`${ROOT}src/${dir}/${name}.test.tsx`), `${name}.test.tsx`).toBe(true)
    expect(existsSync(`${ROOT}design/components/${name}/README.md`), `design/components/${name}/README.md`).toBe(true)
    expect(read('src/styles.css')).toContain(`@import './${dir}/${kebab(name)}.css';`)
    expect(read('src/index.ts')).toContain(`'./${dir}/${name}'`)
  })

  it('styles use tokens only', () => {
    const css = read(cssPath).replace(/\/\*[\s\S]*?\*\//g, '')
    expect(css.match(/#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab)\(/gi) ?? [], 'color literals').toEqual([])
    expect(css.match(/font-size:(?!\s*var\(--gx-text-)[^;]+/g) ?? [], 'font sizes off the scale').toEqual([])
    expect(css.match(/font-weight:(?!\s*var\(--gx-font-weight-)[^;]+/g) ?? [], 'font weights that are not tokens').toEqual([])
    expect(css.match(/(?<![\w.-])\d*\.?\d+m?s\b/g) ?? [], 'durations that are not tokens').toEqual([])
    expect(css, 'reduced motion is handled once, by --gx-ms').not.toContain('prefers-reduced-motion')
    expect(
      offToken(css, '(?:padding|margin|gap|row-gap|column-gap)(?:-[a-z-]+)?', /^(?:0|auto|inherit|-?1px|var\(--gx-space-[\w-]+\)|calc\(.+\))$/),
      'spacing that is not on the space scale',
    ).toEqual([])
    expect(offToken(css, 'line-height', /^(?:normal|inherit|var\(--gx-leading-[\w-]+\))$/), 'line heights that are not tokens').toEqual([])
    expect(offToken(css, 'letter-spacing', /^(?:normal|inherit|var\(--gx-tracking-[\w-]+\))$/), 'letter spacing that is not a token').toEqual([])
    expect(offToken(css, 'z-index', /^(?:0|1|auto|var\(--gx-z-[\w-]+\))$/), 'layers that are not tokens').toEqual([])
    expect(css.match(/box-shadow:(?!\s*(?:none|var\(--gx-[\w-]+\));)[^;]+/g) ?? [], 'shadows that are not tokens').toEqual([])
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

  it('shows keyboard focus with the shared ring', () => {
    const css = read(cssPath).replace(/\/\*[\s\S]*?\*\//g, '')
    expect(css.match(/(?<![\w-])outline:(?!\s*(?:0\b|none\b|var\(--gx-focus-ring\)))[^;]+/g) ?? [], 'outlines use --gx-focus-ring').toEqual([])
    if (/cursor:\s*pointer/.test(css)) expect(css, 'a control that takes clicks shows keyboard focus').toMatch(/:focus-visible|:focus-within/)
  })

  it('says nothing by itself: its words come from messages or from props', () => {
    const jsx = read(`src/${dir}/${name}.tsx`).replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '')
    expect(jsx.match(/>\s*[A-Za-z][A-Za-z ,.'’!?-]*[a-z]\s*<\//g) ?? [], 'text written in the markup').toEqual([])
    expect(jsx.match(/(?:aria-label|title|placeholder|alt)="[^"]*[A-Za-z][^"]*"/g) ?? [], 'a label written in the markup').toEqual([])
  })
})
