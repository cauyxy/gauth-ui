// @vitest-environment node
/* What the docs say about the tokens is what tokens.css has. A number or a name that is changed in one place only fails here. So does a component that README.md does not list. */
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { keysOf, parse } from '../scripts/token-model.ts'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const read = (path: string) => readFileSync(`${ROOT}${path}`, 'utf8')

const tokens = parse(read('src/styles/tokens.css'))
const value = new Map(tokens.map((t) => [t.name, t.value]))
const usage = new Map(tokens.map((t) => [t.name, t.usage]))
/** The names of one family without its prefix: `of('radius')` is xs, sm, md … */
const of = (family: string) => keysOf(tokens, family)
const px = (name: string) => {
  const v = value.get(name) ?? ''
  return v.endsWith('rem') ? Number.parseFloat(v) * 16 : Number.parseFloat(v)
}

const readme = read('design/README.md')
/** One `## Title` section of design/README.md. */
function section(title: string) {
  const start = readme.indexOf(`\n## ${title}\n`)
  if (start < 0) throw new Error(`design/README.md has no "## ${title}"`)
  const end = readme.indexOf('\n## ', start + 1)
  return readme.slice(start, end < 0 ? undefined : end)
}
/** Every `name` in backticks in a text. */
const named = (text: string) => [...text.matchAll(/`([\w-]+)`/g)].map((m) => m[1]!)
/** The one sentence of the README that starts a list of values. A sentence that was reworded fails with its name. */
function sentence(pattern: RegExp, what: string) {
  const found = readme.match(pattern)?.[1]
  if (!found) throw new Error(`design/README.md: the sentence with ${what} is not where docs.test.ts looks for it`)
  return found
}
const sorted = (names: string[]) => names.toSorted()

describe('design/README.md', () => {
  it('Type: each size and its role are the token and its comment', () => {
    const rows = [...section('Type').matchAll(/^\| `(\w+)`\s*\| (\d+) px\s*\| (.+?)\s*\|$/gm)].map((m) => ({ name: m[1]!, px: Number(m[2]), role: m[3]! }))
    expect(sorted(rows.map((r) => r.name))).toEqual(sorted(of('text')))
    for (const row of rows) {
      expect(px(`text-${row.name}`), `text-${row.name}`).toBe(row.px)
      expect(usage.get(`text-${row.name}`), `the comment of --gx-text-${row.name} in tokens.css`).toBe(`${row.px}px. ${row.role}`)
    }
  })

  it('Type: the weights, line heights and letter spacings', () => {
    const type = section('Type')
    const weights = [...sentence(/\nWeights: (.+?)\. /, 'the weights').matchAll(/(\d{3}) for/g)].map((m) => m[1]!)
    expect(weights).toEqual(of('font-weight').map((name) => value.get(`font-weight-${name}`)))

    const leading = [...type.matchAll(/`leading-(\w+)` ([\d.]+)/g)]
    expect(sorted(leading.map((m) => m[1]!))).toEqual(sorted(of('leading')))
    for (const [, name, n] of leading) expect(Number(value.get(`leading-${name}`)), `leading-${name}`).toBe(Number(n))

    const tracking = [...type.matchAll(/`tracking-(\w+)` ([−+][\d.]+)em/g)]
    expect(sorted(tracking.map((m) => m[1]!))).toEqual(sorted(of('tracking')))
    for (const [, name, n] of tracking) expect(Number.parseFloat(value.get(`tracking-${name}`)!), `tracking-${name}`).toBe(Number(n!.replace('−', '-')))
  })

  it('Color: every color has a row, and every name in a row is a color', () => {
    const colors = of('color')
    /* The Tokens column of Color, and every column of Skill levels after the level's name. */
    const cells = (title: string) => [...section(title).matchAll(/^\|.+\|$/gm)].map((m) => m[0].split('|').slice(2))
    const rows = [...cells('Color').map((row) => row[0]!), ...cells('Skill levels').flat()].flatMap(named)
    /* White and black are the ground and the pressed ink button: they have no meaning to explain. */
    expect(colors.filter((c) => c !== 'white' && c !== 'black' && !rows.includes(c))).toEqual([])
    expect(rows.filter((name) => !colors.includes(name))).toEqual([])
  })

  it('Surfaces and layout: radii, shadows, control heights, spacing, widths and layers', () => {
    const surfaces = section('Surfaces and layout')

    const radii = sentence(/Radii: (.+?) px\./, 'the radii')
      .split(' · ')
      .map((part) => part.replaceAll('`', '').split(' '))
    expect(radii.map(([name]) => name)).toEqual(of('radius'))
    for (const [name, n] of radii) expect(px(`radius-${name}`), `radius-${name}`).toBe(Number(n))

    expect(sorted(named(sentence(/Shadows are only (.+?)\. `shadow-pop`/, 'the shadows')))).toEqual(sorted(of('shadow')))

    const heights = [...surfaces.matchAll(/`--gx-h-(\w+)` (\d+)/g)]
    expect(heights.map((m) => m[1]!)).toEqual(of('h'))
    for (const [, name, n] of heights) expect(px(`h-${name}`), `h-${name}`).toBe(Number(n))

    const steps = sentence(/\(`--gx-space-\*`\): ([\d, ]+)px/, 'the spacing scale')
      .split(', ')
      .map(Number)
    expect(steps).toEqual(of('space').map((name) => px(`space-${name}`)))
    expect(surfaces).toContain(`a ${steps.length}-step scale`)

    const widths = [...surfaces.matchAll(/`container-(\w+)` (\d+)px/g)]
    expect(widths.map((m) => m[1]!)).toEqual(of('container'))
    for (const [, name, n] of widths) expect(px(`container-${name}`), `container-${name}`).toBe(Number(n))

    expect([...surfaces.matchAll(/`z-(\w+)`/g)].map((m) => m[1]!)).toEqual(of('z'))
  })

  it('Motion: each duration and its use, the easings and the named movements', () => {
    const motion = section('Motion')
    const rows = [...motion.matchAll(/^\| `dur-(\w+)`\s*\| (\d+) ms\s*\| (.+?)\s*\|$/gm)].map((m) => ({ name: m[1]!, ms: m[2]!, use: m[3]! }))
    expect(rows.map((r) => r.name)).toEqual(of('dur'))
    for (const row of rows) {
      expect(value.get(`dur-${row.name}`), `dur-${row.name}`).toContain(`${row.ms}ms`)
      expect(usage.get(`dur-${row.name}`), `the comment of --gx-dur-${row.name} in tokens.css`).toBe(row.use)
    }
    expect(sorted([...motion.matchAll(/`ease-(\w+)`/g)].map((m) => m[1]!))).toEqual(sorted(of('ease')))
    expect(sorted(named(sentence(/Named movements[^:]*: (.+?)\.\n/, 'the named movements')))).toEqual(sorted(of('animate')))
  })
})

it('README.md lists every component, and nothing that is not one', () => {
  const list = (title: string) => {
    const line = read('README.md').match(new RegExp(`^\\*\\*${title}[^*]*\\*\\*(.*)$`, 'm'))?.[1]
    if (!line) throw new Error(`README.md has no "**${title}" line under Components`)
    return line.match(/\b[A-Z]\w+/g) ?? []
  }
  const files = (dir: string) =>
    readdirSync(`${ROOT}src/${dir}`)
      .filter((f) => /^[A-Z]\w*\.tsx$/.test(f) && !f.endsWith('.test.tsx'))
      .map((f) => f.replace('.tsx', ''))
  expect(list('Core')).toEqual(sorted([...files('components'), 'Icon']))
  expect(list('Math')).toEqual(sorted(files('math')))
  expect(list('Learning')).toEqual(sorted(files('learning')))
})

it('every --gx-* token a page names exists', () => {
  const pages = [
    'AGENTS.md',
    'README.md',
    'GLOSSARY.md',
    'docs/from-gauthx.md',
    'design/README.md',
    ...readdirSync(`${ROOT}design/components`).map((name) => `design/components/${name}/README.md`),
  ]
  const missing = pages.flatMap((page) =>
    [...read(page).matchAll(/--gx-([a-z][\w-]*)/g)]
      /* `--gx-space-*` and `--gx-h-` name a family: one token of it is enough. */
      .map((m) => m[1]!.replace(/-$/, ''))
      .filter((name) => !value.has(name) && !tokens.some((t) => t.name.startsWith(`${name}-`)))
      .map((name) => `${page}: --gx-${name}`),
  )
  expect(missing).toEqual([])
})
