/*
 * Builds the files of the Gauth UI Design System artifact from this repository. Nothing in the artifact is written by
 * hand: every file comes from the code and the design rules here, so the artifact shows what the package ships.
 *
 *   node artifact/build.ts               write artifact/out/, then draw every preview in Chrome and measure it
 *   node artifact/build.ts --no-render   the same without Chrome: every preview keeps the default height
 *
 * What it writes, and from what:
 *   out/project/tokens.json                    src/styles/tokens.css, in the shape the artifact's page reads
 *   out/project/README.md                      design/README.md, without its title
 *   out/project/glossary.md                    GLOSSARY.md
 *   out/project/components/<Name>/README.md    design/components/<Name>/README.md
 *   out/project/components/<Name>/preview.html the examples of gallery/examples/<Name>.tsx, drawn by the bundle
 *   out/project/components/Type, Motion        gallery/foundations.tsx and the Type and Motion rules of design/README.md
 *   out/project/components/bundle.js, .css     the package, its examples and their styles (artifact/entry.tsx)
 *   out/project/components/index.d.ts          the types of dist/ (run `pnpm build` first)
 *   out/assets/<Group>/<icon>.svg              src/core/icons.ts, each icon as the `Icon` component draws it
 *   out/build.json                             the commit, the components and each preview's height
 *
 * Chrome is `CHROME=/path/to/chrome`, or the installed Google Chrome.
 */
import tailwind from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'
import { familyTokens, parse, type Token } from '../scripts/token-model.ts'
import { readmeGroups } from '../scripts/inventory.ts'
import { ICONS } from '../src/core/icons.ts'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const OUT = `${ROOT}artifact/out/`
const PROJECT = `${OUT}project/`
const NAMESPACE = 'GauthUI'
const FONT =
  'https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&family=Literata:ital,opsz,wght@0,7..72,400..700;1,7..72,400..700&display=swap'

const read = (path: string) => readFileSync(`${ROOT}${path}`, 'utf8')
const write = (path: string, text: string) => {
  mkdirSync(dirname(`${OUT}${path}`), { recursive: true })
  writeFileSync(`${OUT}${path}`, text)
}

/* ---------- tokens ---------- */

const tokens = parse(read('src/styles/tokens.css'))
const valueOf = new Map(tokens.map((t) => [t.name, t.value]))
/** A value with no `var()` in it and its colors in the comma form, which is what the artifact's page can read. */
const plain = (value: string): string =>
  value
    .replace(/var\(--gx-([\w-]+)\)/g, (_, name: string) => plain(valueOf.get(name) ?? ''))
    .replace(/rgb\((\d+) (\d+) (\d+) \/ ([\d.]+)\)/g, 'rgba($1, $2, $3, $4)')

/**
 * Where a color is used, from design/README.md: the row of the Color table that names it, and for a level's `-ink` and
 * `-soft` the ground it reads on. A note on the token's own line in tokens.css comes first.
 */
function colorNotes() {
  const rules = read('design/README.md')
  const own = new Map(familyTokens(tokens, 'color').map((t) => [t.key, t.note]))
  const notes = new Map<string, string>()
  for (const row of rules.matchAll(/^\| ([\w ,]+?) *\| (`[^|\n]+?) *\| ([^|\n]+?) *\|$/gm))
    for (const name of row[2]!.matchAll(/`([\w-]+)`/g)) notes.set(name[1]!, `${row[1]}. ${row[3]!.replace(/`/g, '')}`)
  for (const row of rules.matchAll(/^\| (\w[\w ]*?)\s*\| `([\w-]+)`\s*\| `([\w-]+)`\s*\| `([\w-]+)`\s*\|$/gm)) {
    const [, level, , ink, soft] = row as unknown as [string, string, string, string, string]
    if (!ink.endsWith('-ink')) continue
    notes.set(ink, `Text in the ${level} color, on ${soft}.`)
    notes.set(soft, `The soft ground of ${level}. Text on it is ${ink}.`)
  }
  return (name: string, fallback: string) => [own.get(name), notes.get(name)].filter(Boolean).join('. ') || fallback
}

export function tokensJson(commit: string) {
  const of = (family: string) => familyTokens(tokens, family)
  const list = (found: Token[], rename = (name: string) => name, note = (_name: string, usage: string) => usage) => ({
    tokens: found.map((t) => ({
      name: rename(t.name),
      value: plain(t.value.startsWith('#') ? t.value.toLowerCase() : t.value),
      usage: note(rename(t.name), t.usage),
    })),
  })
  const weights = of('font-weight')
  const stacks = of('font')
  const body = valueOf.get('text-sm')!
  /* A type style is `gx-<token>`, not `text-sm`: the page writes a class for each style, and that class must not be a Tailwind utility. */
  const style = (t: Token, more: Record<string, string | number>) => ({ name: `gx-${t.name}`, usage: t.usage, ...more })
  return {
    name: 'Gauth UI',
    version: 1,
    meta: {
      source: 'github',
      repo: 'cauyxy/gauth-ui',
      ref: commit,
      paths: { tokens: ['src/styles/tokens.css'], assets: ['src/core/icons.ts'], docs: ['design/README.md', 'design/components', 'GLOSSARY.md'] },
      built: 'node artifact/build.ts',
    },
    color: { themes: [{ id: 'light', name: 'Light' }], ...list(of('color'), (name) => name.slice('color-'.length), colorNotes()) },
    type: {
      fonts: [],
      families: Object.fromEntries(stacks.map((t) => [t.key, t.value])),
      groups: [
        { name: 'Scale', family: 'sans', styles: of('text').toReversed().map((t) => style(t, { fontSize: t.value, fontWeight: 400 })) }, // oxfmt-ignore
        { name: 'Weights', family: 'sans', styles: weights.map((t) => style(t, { fontSize: body, fontWeight: Number(t.value) })) },
        { name: 'Reading', family: 'reading', styles: stacks.filter((t) => t.name === 'font-reading').map((t) => style(t, { fontSize: valueOf.get('text-lg')!, fontWeight: 400 })) }, // oxfmt-ignore
        { name: 'Mono', family: 'mono', styles: stacks.filter((t) => t.name === 'font-mono').map((t) => style(t, { fontSize: body, fontWeight: 400 })) }, // oxfmt-ignore
      ],
    },
    spacing: list(of('space')),
    radius: list(of('radius')),
    shadow: list(of('shadow')),
    height: list(of('h')),
    leading: list(of('leading')),
    tracking: list(of('tracking')),
    container: list(of('container')),
  }
}
/** The tokens no family above holds: motion, which the page has no section for. The README's Motion section names them. */
export const leftOut = () => tokens.filter((t) => ['ms', 'dur', 'delay', 'ease', 'animate'].includes(t.family)).map((t) => t.name)
/** The tokens nobody picks a value from: the layers and the focus ring. A component sets them, and the rules say what they are. */
export const inside = () => tokens.filter((t) => ['z', 'focus'].includes(t.family)).map((t) => t.name)

/** The icons in the groups of scripts/icons.ts: a comment in its list starts a group. */
export function iconGroups() {
  const list = read('scripts/icons.ts').match(/export const NAMES[^{]*\{([\s\S]*?)\n\}/)![1]!
  const groups = [{ title: 'General', folder: 'Icons', names: [] as string[] }]
  for (const line of list.split('\n')) {
    if (/^\s*\/\* Learning/.test(line)) groups.push({ title: 'Learning', folder: 'Learning-icons', names: [] })
    if (/^\s*\/\* Subjects/.test(line)) groups.push({ title: 'Subjects and tools', folder: 'Learning-icons', names: [] })
    const name = line.match(/^\s*'?([\w-]+)'?:/)?.[1]
    if (name) groups.at(-1)!.names.push(name)
  }
  return groups
}

/** One icon as a file: what `Icon` draws at 20px, in ink, because an image cannot take the color of the text around it. */
const iconSvg = (name: keyof typeof ICONS) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${valueOf.get('color-ink')}" stroke-width="2.16" stroke-linecap="round" stroke-linejoin="round">${ICONS[
    name
  ]
    .map(
      ([tag, attrs]) =>
        `<${tag} ${Object.entries(attrs)
          .map(([key, value]) => `${key}="${value}"`)
          .join(' ')}/>`,
    )
    .join('')}</svg>\n`

/* ---------- previews ---------- */

/** The cards that are not a component of the inventory: Icon (src/core/Icon.tsx) and the Type and Motion foundations. */
export const EXTRA_CARDS = ['Icon', 'Type', 'Motion']

/** What opens above the page needs room in its card: the height a card of that component gets at least. */
const ROOM: Record<string, number> = {
  Dialog: 420,
  Sheet: 480,
  Menu: 320,
  Popover: 320,
  Tooltip: 200,
  Toast: 320,
  Select: 320,
  Combobox: 400,
  DatePicker: 460,
  DateRangePicker: 460,
}
const attr = (text: string) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/-->/g, '').replace(/</g, '&lt;')
/** The first sentence of a guideline, as the line under the card's name. */
const summaryOf = (guideline: string) =>
  guideline
    .replace(/^# .*\n+/, '')
    .split('\n')[0]!
    .match(/^.*?[.!?](?=\s|$)/)?.[0]
    ?.replace(/`/g, '') ?? ''
const preview = (group: string, height: number, subtitle: string, script: string) =>
  [
    `<!-- @dsCard group="${attr(group)}" height=${height} subtitle="${attr(subtitle)}" -->`,
    `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`,
    `<link rel="stylesheet" href="${FONT}">`,
    `<div id="root"></div>`,
    `<script>${script}</script>`,
    '',
  ].join('\n')

const COVER = `<!-- @dsCard height=320 -->
<link rel="stylesheet" href="${FONT}">
<style>
.cv{position:relative;width:960px;height:320px;overflow:hidden;background:var(--white);font-family:var(--font-sans)}
.cv svg{position:absolute;inset:0}
.ink{fill:var(--ink)} .dot{fill:var(--white)}
.attempted{fill:var(--attempted)} .familiar{fill:var(--familiar)} .proficient{fill:var(--proficient)} .mastered{fill:var(--mastered)}
.step{rx:var(--radius-3xl)} .panel{rx:var(--radius-2xl)}
.name{position:absolute;left:48px;bottom:44px;width:420px}
.name h1{margin:0;font-size:88px;line-height:.95;font-weight:700;letter-spacing:-0.03em;color:var(--ink)}
.name p{margin:16px 0 0;font-size:14px;color:var(--muted)}
</style>
<div class="cv">
<svg width="960" height="320" viewBox="0 0 960 320" aria-hidden="true">
<!--
blocks: the four levels (attempted, familiar, proficient, mastered) as steps 96 wide (space-6 x 4), and ink as one panel 208 by 128
arrangement: a ladder that climbs from warm to cool and runs off the bottom edge, the ink panel above its two lowest steps
pattern: a dot grid cut out of the ink panel at one pitch, because the system is ink on white on a 4px grid
steps and radii: gaps of space-4 (16), a pitch of space-4, radius-3xl (24) on the steps, radius-2xl (16) on the panel
-->
<rect class="ink panel" x="496" y="32" width="208" height="128"/>
${[0, 1, 2, 3, 4].flatMap((row) => [0, 1, 2, 3, 4, 5, 6, 7, 8].map((col) => `<circle class="dot" cx="${536 + col * 16}" cy="${64 + row * 16}" r="2"/>`)).join('')}
<rect class="attempted step" x="496" y="224" width="96" height="144"/>
<rect class="familiar step" x="608" y="176" width="96" height="192"/>
<rect class="proficient step" x="720" y="128" width="96" height="240"/>
<rect class="mastered step" x="832" y="80" width="96" height="288"/>
</svg>
<div class="name"><h1>Gauth UI</h1><p>Ink on white, hairline cards and one skill ladder.</p></div>
</div>
`

/* ---------- the build ---------- */

async function bundle() {
  const dir = `${OUT}.vite`
  await build({
    configFile: false,
    root: ROOT,
    logLevel: 'warn',
    plugins: [react(), tailwind()],
    define: { 'process.env.NODE_ENV': '"production"' },
    build: {
      outDir: dir,
      emptyOutDir: true,
      /* The formulas' fonts go into the stylesheet: a preview loads nothing but the bundle. */
      assetsInlineLimit: 100_000_000,
      lib: { entry: `${ROOT}artifact/entry.tsx`, formats: ['iife'], name: NAMESPACE, fileName: () => 'bundle.js', cssFileName: 'bundle' },
    },
  })
  const names = [...readmeGroups().map((c) => c.name), ...EXTRA_CARDS]
  const header = `/* @ds-bundle: ${JSON.stringify({ format: 4, namespace: NAMESPACE, components: names.map((name) => ({ name })) })} */`
  /* The page may write the script into its own HTML, where these two would end it. In a string they mean the same with the backslash. */
  const js = readFileSync(`${dir}/bundle.js`, 'utf8')
    .replace(/<\/script/gi, '<\\/script')
    .replace(/<!--/g, '<\\!--')
  /* KaTeX offers each font as woff2, woff and ttf. Every browser that runs the page reads woff2. */
  const css = readFileSync(`${dir}/bundle.css`, 'utf8').replace(/,\s*url\((["']?)data:font\/(?:woff|ttf);[^)]*\1\)\s*format\(["'](?:woff|truetype)["']\)/g, '')
  write('project/components/bundle.js', `${header}\n${js}`)
  write('project/components/bundle.css', css)
  rmSync(dir, { recursive: true })
}

function types() {
  if (!existsSync(`${ROOT}dist/index.d.ts`)) return console.warn('no dist/: run `pnpm build` first to add components/index.d.ts')
  const parts = ['/* The types of gauth-ui, as `pnpm build` writes them. For reading: one file, its imports left out. */']
  for (const dir of ['core', 'components', 'learning', 'math'])
    for (const file of readdirSync(`${ROOT}dist/${dir}`).sort())
      if (file.endsWith('.d.ts') && file !== 'index.d.ts' && file !== 'icons.d.ts')
        parts.push(`/* ${dir}/${file.slice(0, -'.d.ts'.length)} */\n${read(`dist/${dir}/${file}`).replace(/^import .*\n/gm, '').replace(/^export \{\};?\n/gm, '').trim()}`) // oxfmt-ignore
  write('project/components/index.d.ts', `${parts.join('\n\n')}\n`)
}

/** The page's own tokens.css, near enough for a preview drawn here: each token as `--name`. */
function localTokens(json: Omit<ReturnType<typeof tokensJson>, 'meta'>) {
  const lists = [json.color, json.spacing, json.radius, json.shadow, json.height, json.leading, json.tracking, json.container]
  const families = Object.entries(json.type.families).map(([key, stack]) => `--font-${key}:${stack}`)
  return `:root{${[...lists.flatMap((l) => l.tokens.map((t) => `--${t.name}:${t.value}`)), ...families].join(';')}}`
}

/** Serves the built files, and each preview at /card/<Name> inside the frame the artifact's page gives it. */
export async function serveCards(port: number) {
  const tokensCss = localTokens(JSON.parse(readFileSync(`${PROJECT}tokens.json`, 'utf8')))
  const server = createServer((request, response) => {
    const path = decodeURIComponent(new URL(request.url!, 'http://x').pathname).slice(1)
    const card = path.match(/^card\/(\w+)$/)?.[1]
    if (card) {
      response.setHeader('content-type', 'text/html; charset=utf-8')
      return response.end(
        `<!doctype html><html data-theme="light"><head><meta charset="utf-8"><style>${tokensCss}</style><link rel="stylesheet" href="/components/bundle.css"><script src="/components/bundle.js"></script></head><body>${readFileSync(`${PROJECT}components/${card}/preview.html`, 'utf8')}</body></html>`,
      )
    }
    if (!existsSync(`${PROJECT}${path}`)) return response.writeHead(404).end()
    response.setHeader('content-type', path.endsWith('.css') ? 'text/css' : 'text/javascript')
    response.end(readFileSync(`${PROJECT}${path}`))
  })
  await new Promise<void>((done) => server.listen(port, done))
  return server
}
/** Chrome: `CHROME=/path/to/chrome`, or the installed Google Chrome. Drawn without the graphics card, so a page gives the same pixels each time. */
export async function chrome() {
  const { chromium } = await import('playwright-core')
  const args = ['--disable-gpu', '--force-color-profile=srgb']
  return chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME, args } : { channel: 'chrome', args })
}

/** Draws every preview as the artifact's page does, fails on one that is empty or throws, and returns each one's height. */
async function render(names: string[]) {
  const server = await serveCards(5183)
  const browser = await chrome()
  const heights: Record<string, number> = {}
  const broken: string[] = []
  for (const name of names) {
    const page = await browser.newPage({ viewport: { width: 880, height: 200 } })
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (message) => message.type() === 'error' && !/Failed to load resource|ERR_/.test(message.text()) && errors.push(message.text()))
    await page.goto(`http://localhost:5183/card/${name}`)
    await page.waitForTimeout(150)
    const { height, drawn } = await page.evaluate(() => ({
      height: Math.ceil(document.body.getBoundingClientRect().height),
      drawn: document.querySelectorAll('#root *, .cv *').length,
    }))
    if (errors.length || drawn < 2) broken.push(`${name}: ${errors[0] ?? 'nothing drawn'}`)
    heights[name] = height
    await page.close()
  }
  await browser.close()
  server.close()
  if (broken.length) throw new Error(`previews that do not draw:\n  ${broken.join('\n  ')}`)
  return heights
}

if (import.meta.main) {
  const git = (...args: string[]) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim()
  /* The branch and the commit the files come from, so the artifact says when it shows work that is not on main yet. */
  const commit = `${git('rev-parse', '--abbrev-ref', 'HEAD')}@${git('rev-parse', '--short', 'HEAD')}`
  rmSync(OUT, { recursive: true, force: true })

  const json = tokensJson(commit)
  write('project/tokens.json', `${JSON.stringify(json, null, 2)}\n`)
  write(
    'project/README.md',
    `${read('design/README.md').replace(/^# .*\n+/, '')}\n## Not in the tokens\n\nThe token lists hold what a page picks a value from. Motion (the durations, the easings and the named movements) has no list: the Motion card shows each one, and the Motion rules above say when to use it. The layers and the focus ring have no list either: the components set them, and Surfaces and Focus above say what they are. Google Sans and Literata have no font file here: a product loads them from Google Fonts.\n`,
  )
  write('project/glossary.md', read('GLOSSARY.md'))

  const components = readmeGroups()
  const icons = iconGroups()
  const cards: Record<string, (height: number) => string> = {}
  for (const { group, name } of components) {
    const guideline = read(`design/components/${name}/README.md`)
    write(`project/components/${name}/README.md`, guideline)
    cards[name] = (height) => preview(group, Math.max(height, ROOM[name] ?? 0), summaryOf(guideline), `${NAMESPACE}.show(${JSON.stringify(name)})`)
  }
  const iconGuide = [
    '# Icon',
    '',
    `One line icon by its name: \`<Icon name="lesson" />\`. \`Icon\` in \`src/core/Icon.tsx\`; the ${Object.keys(ICONS).length} names are the list in \`scripts/icons.ts\`.`,
    '',
    ...read('design/README.md').split('\n').filter((line) => line.startsWith('- **One icon family: Lucide.**')), // oxfmt-ignore
    '- It is decoration: the control that holds it carries the accessible name. A button that shows only an icon is an `IconButton` with a `label`.',
    '- It takes the color of the text around it. `size` is in pixels (20 by default) and the stroke grows with it.',
    '- The names say what an icon is for, not what it draws: `lesson`, `hint`, `streak`. The Learning rules say which one a page uses.',
    '',
  ].join('\n')
  write('project/components/Icon/README.md', iconGuide)
  cards.Icon = (height) => preview('Icons', height, summaryOf(iconGuide), `${NAMESPACE}.showIcons(${JSON.stringify(icons.map(({ title, names }) => ({ title, names })))})`) // oxfmt-ignore

  /* Type and motion are not components. Each gets a card that draws it, with its rules from design/README.md as the guideline. */
  const rules = read('design/README.md')
  for (const name of ['Type', 'Motion'] as const) {
    const section = rules.match(new RegExp(`^## ${name}\\n+([\\s\\S]*?)(?=^## )`, 'm'))![1]!.trim()
    write(`project/components/${name}/README.md`, `# ${name}\n\n${section}\n`)
    cards[name] = (height) => preview('Foundations', height, summaryOf(section), `${NAMESPACE}.showFoundation(${JSON.stringify(name)})`)
  }

  for (const { folder, names } of icons) for (const name of names) write(`assets/${folder}/${name}.svg`, iconSvg(name as keyof typeof ICONS))
  write(
    'project/assets/Icons/README.md',
    'The general icons of `Icon`, as files: 20px, a 1.8px stroke, round ends, drawn in `ink` (#21252e). In a product use `<Icon name="…" />`, which takes the color of its text. Drawings: Lucide, ISC license.\n',
  )
  write(
    'project/assets/Learning-icons/README.md',
    'The learning and subject icons of `Icon`, as files: one name for each thing a student does or a teacher gives, and one for each subject. Drawn in `ink` (#21252e); a subject has no color of its own. Drawings: Lucide, ISC license.\n',
  )
  write('project/components/Cover/preview.html', COVER)

  await bundle()
  types()

  const names = Object.keys(cards)
  for (const name of names) write(`project/components/${name}/preview.html`, cards[name]!(120))
  let heights: Record<string, number> = {}
  if (!process.argv.includes('--no-render')) {
    heights = await render([...names, 'Cover'])
    for (const name of names) write(`project/components/${name}/preview.html`, cards[name]!(heights[name]!))
  }
  write('build.json', `${JSON.stringify({ commit, components: names, icons: icons.map(({ folder, names }) => ({ folder, names })), heights }, null, 2)}\n`)
  console.log(
    `artifact/out: ${names.length} components, ${Object.keys(ICONS).length} icons, ${tokens.length - leftOut().length - inside().length} tokens, from ${commit}`,
  )
}
