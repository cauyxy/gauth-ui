// @vitest-environment node
/* The rules in AGENTS.md that a machine can check. A component that breaks one fails here, not in review. */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { snippetsOf } from '../gallery/snippet.ts'
import { staleIcons } from '../scripts/icons.ts'
import { parse, stale } from '../scripts/tokens.ts'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const read = (path: string) => readFileSync(`${ROOT}${path}`, 'utf8')

/** Every component of both groups: [name, folder under src]. */
const components = (['components', 'learning'] as const).flatMap((dir) =>
  readdirSync(`${ROOT}src/${dir}`)
    .filter((f) => /^[A-Z]\w*\.tsx$/.test(f) && !f.endsWith('.test.tsx'))
    .map((f) => [f.slice(0, -'.tsx'.length), dir] as const),
)
const tokens = new Set(parse(read('src/styles/tokens.css')).map((t) => `--gx-${t.name}`))

/** Every class name written in a file: each word of each string, without comments. */
function classesOf(source: string) {
  const code = source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '')
  return [...code.matchAll(/'([^'\n]*)'|"([^"\n]*)"|`([^`]*)`/g)].flatMap((m) => (m[1] ?? m[2] ?? m[3] ?? '').split(/\s+/)).filter(Boolean)
}
/** A class without its variants: `hover:bg-black` is `bg-black`, `[&>svg]:-ms-0.5` is `-ms-0.5`. */
const utilityOf = (word: string) => word.split(/:(?![^[(]*[\])])/).at(-1)!

const SPACE = new Set(['0', 'px', 'auto', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '5', '6', '8', '10'])
/** What each kind of utility may end in. A class of that kind with another ending is off the tokens. */
const KINDS: [what: string, kind: RegExp, allowed: (value: string) => boolean][] = [
  [
    'spacing that is not on the space scale',
    /^-?(?:p[xytrblse]?|m[xytrblse]?|gap(?:-[xy])?|space-[xy])-(.+)$/,
    (v) => SPACE.has(v) || /^\[calc\(.+\)\]$/.test(v),
  ],
  ['a font weight that is not a token', /^font-(.+)$/, (v) => /^(?:sans|mono|body|control|title|strong)$/.test(v)],
  ['a line height that is not a token', /^leading-(.+)$/, (v) => /^(?:figure|title|heading|body|normal)$/.test(v)],
  ['letter spacing that is not a token', /^tracking-(.+)$/, (v) => /^(?:display|title|label|normal)$/.test(v)],
  ['a layer that is not a token', /^z-(.+)$/, (v) => /^(?:0|1|auto|\(--gx-z-(?:overlay|pop|toast)\))$/.test(v)],
  ['a duration that is not a token', /^(?:duration|delay)-(.+)$/, (v) => /^\(--gx-(?:dur|delay)-[\w-]+\)$/.test(v)],
  ['an outline that is not the shared ring', /^-?outline-(.+)$/, (v) => /^(?:0|none|white|offset-(?:\d+|\[-?\d+px\]))$/.test(v)],
  [
    'a shadow written in the component',
    /^(?:shadow|inset-shadow|drop-shadow|ring|inset-ring)-(.+)$/,
    (v) => !/^[[\d]/.test(v) && (!v.startsWith('(') || v.startsWith('(--gx-')),
  ],
  ['a type size off the scale', /^text-(\[.+)$/, () => false],
]

it('theme.css and tokens.json match tokens.css', () => {
  expect(stale()).toEqual([])
})

it('icons.ts matches the list in scripts/icons.ts', () => {
  expect(staleIcons()).toEqual([])
})

it('core does not import learning', () => {
  for (const dir of ['components', 'core'])
    for (const file of readdirSync(`${ROOT}src/${dir}`)) expect(read(`src/${dir}/${file}`), `${dir}/${file}`).not.toMatch(/from '\.\.\/learning\//)
})

describe('examples', () => {
  const names = readdirSync(`${ROOT}design/components`)
  const groups = read('gallery/examples.ts')

  it.each(names)('%s has examples that a product can copy', (name) => {
    expect(groups, `${name} is in no group of gallery/examples.ts, so the gallery and the docs site do not show it`).toContain(`'${name}'`)
    expect(existsSync(`${ROOT}gallery/examples/${name}.tsx`), `gallery/examples/${name}.tsx`).toBe(true)
    const snippets = snippetsOf(read(`gallery/examples/${name}.tsx`))
    expect(snippets.length, 'at least one `export function`').toBeGreaterThan(0)
    for (const { name: example, code } of snippets) {
      /* Every component the code draws is imported from the package or written in the snippet itself. */
      const known = new Set([...code.matchAll(/import \{([^}]*)\}/g)].flatMap((m) => m[1]!.split(',').map((n) => n.trim().replace(/^type /, ''))))
      for (const m of code.matchAll(/^(?:export )?(?:function|const|type) (\w+)/gm)) known.add(m[1]!)
      const drawn = [...new Set([...code.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(?<![\w.])<([A-Z]\w*)/g)].map((m) => m[1]!))]
      expect(
        drawn.filter((tag) => !known.has(tag)),
        `${name} ${example}: used and not in the snippet`,
      ).toEqual([])
      expect(code, `${name} ${example}: the snippet uses the component`).toMatch(/from 'gauth-ui(?:\/math)?'/)
      expect(code, `${name} ${example}: gallery classes are not for a product`).not.toMatch(/className="[^"]*\bg-/)
    }
  })

  it('no example file is left without a component', () => {
    expect(
      readdirSync(`${ROOT}gallery/examples`)
        .map((f) => f.replace(/\.tsx$/, ''))
        .sort(),
    ).toEqual([...names].sort())
  })

  it('the icon example shows every icon', async () => {
    const { ICONS } = await import('./core/icons')
    const shown = read('gallery/examples/IconButton.tsx')
      .match(/const ICONS: IconName\[\] = \[([\s\S]*?)\]/)![1]!
      .match(/[a-z-]+/g)!
    expect([...shown].sort()).toEqual(Object.keys(ICONS).sort())
  })
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

it('the class rules catch what they are for', () => {
  const broken = (c: string) => KINDS.some(([, kind, allowed]) => { const value = utilityOf(c).match(kind)?.[1]; return value !== undefined && !allowed(value) }) // oxfmt-ignore
  for (const bad of [
    'p-7',
    'hover:mt-[3px]',
    'gap-x-9',
    'font-semibold',
    'leading-6',
    'tracking-wide',
    'z-50',
    'duration-150',
    'delay-75',
    'outline-2',
    'focus-visible:outline-blue',
    'shadow-[0_1px_2px_black]',
    'shadow-(--my-shadow)',
    'ring-2',
    'text-[13px]',
  ])
    expect(broken(bad), bad).toBe(true)
  for (const good of [
    'p-3.5',
    '-ms-0.5',
    'mx-auto',
    '[&>svg:first-child]:-ms-0.5',
    'pe-[calc(var(--gx-space-0-5)+0.5px)]',
    'font-control',
    'leading-heading',
    'z-(--gx-z-pop)',
    'duration-(--gx-dur-fast)',
    'outline-0',
    'focus-visible:outline-offset-2',
    '-outline-offset-2',
    'shadow-edge',
    'shadow-correct',
    'shadow-(--gx-avatar-edge)',
    'text-sm',
    'text-muted',
    'max-w-[34rem]',
    'min-h-(--gx-h-xl)',
    'place-items-center',
    'pointer-events-none',
  ])
    expect(broken(good), good).toBe(false)
})

it('the package has no stylesheet of its own rules: the base styles are in the base layer, and no component has a CSS file', () => {
  const styles = read('src/styles.css')
  expect(styles).toContain("@import './styles/base.css' layer(base);")
  expect(styles.match(/@import '\.\/(?:components|learning)\/[^']+';/g) ?? [], 'component style files').toEqual([])
  for (const dir of ['components', 'learning'])
    expect(
      readdirSync(`${ROOT}src/${dir}`).filter((f) => f.endsWith('.css')),
      dir,
    ).toEqual([])
})

describe.each(components)('%s', (name, dir) => {
  const source = read(`src/${dir}/${name}.tsx`)
  const classes = classesOf(source)

  it('has its test, guideline and export, and a gx- name on its root', () => {
    expect(existsSync(`${ROOT}src/${dir}/${name}.test.tsx`), `${name}.test.tsx`).toBe(true)
    expect(existsSync(`${ROOT}design/components/${name}/README.md`), `design/components/${name}/README.md`).toBe(true)
    expect(read('src/index.ts')).toContain(`'./${dir}/${name}'`)
    expect(
      classes.some((c) => c.startsWith('gx-')),
      'a gx- class on the root, for tests and tools to find it',
    ).toBe(true)
  })

  it('writes its styles as whole Tailwind classes, from the tokens only', () => {
    expect(source, 'styles are classes, not CSS').not.toMatch(/@apply|\.css['"]/)
    expect(
      classes.filter((c) => /\[#|\b(?:rgba?|hsla?|oklch|oklab)\(/.test(c)),
      'color literals',
    ).toEqual([])
    expect(
      classes.filter((c) => /(?<![\w.-])\d*\.?\d+m?s\b/.test(c)),
      'durations that are not tokens',
    ).toEqual([])
    expect(
      classes.filter((c) => /motion-(?:reduce|safe):/.test(c)),
      'reduced motion is handled once, by --gx-ms',
    ).toEqual([])
    for (const [what, kind, allowed] of KINDS)
      expect(classes.filter((c) => { const value = utilityOf(c).match(kind)?.[1]; return value !== undefined && !allowed(value) }), what).toEqual([]) // oxfmt-ignore
    /* Tailwind reads the files as text: a class it must write is whole in the source. Only a gx- name is put together. */
    const built = [...source.matchAll(/`([^`]*\$\{[^`]*)`/g)].map((m) => m[1]!)
    const utility =
      /(?:^|[\s:])-?(?:bg|text|border|shadow|fill|stroke|outline|decoration|from|via|to|h|w|size|min-[hw]|max-[hw]|p[xytrblse]?|m[xytrblse]?|gap|inset|top|left|right|bottom|rounded|font|leading|tracking|z|duration|ease|animate|grid-cols|col-span|opacity)-[\w-]*\$\{/
    expect(
      built.filter((t) => utility.test(t)),
      'class names put together from parts',
    ).toEqual([])
    const code = source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '')
    const local = new Set(code.match(/--gx-[\w-]+(?=['"]?\s*:)/g) ?? [])
    const unknown = (code.match(/--gx-[a-z][\w-]*/g) ?? []).filter((v) => !tokens.has(v) && !local.has(v) && !v.endsWith('-'))
    expect([...new Set(unknown)], 'tokens that do not exist').toEqual([])
  })

  it('shows hover and keyboard focus the shared way', () => {
    expect(
      classes.filter((c) => /\[[^\]]*:hover/.test(c)),
      'hover is the `hover:` variant, which touch screens do not get',
    ).toEqual([])
    if (classes.some((c) => utilityOf(c) === 'cursor-pointer'))
      expect(
        classes.some((c) => /focus-visible:focus-ring$|focus-within:|has-\[[^\]]*:focus-visible/.test(c)),
        'a control that takes clicks shows keyboard focus',
      ).toBe(true)
  })

  it('says nothing by itself: its words come from messages or from props', () => {
    const jsx = source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '')
    expect(jsx.match(/>\s*[A-Za-z][A-Za-z ,.'’!?-]*[a-z]\s*<\//g) ?? [], 'text written in the markup').toEqual([])
    expect(jsx.match(/(?:aria-label|title|placeholder|alt)="[^"]*[A-Za-z][^"]*"/g) ?? [], 'a label written in the markup').toEqual([])
  })
})
