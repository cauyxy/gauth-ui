/*
 * Checks that the Design System artifact shows what the package ships. Run it after `node artifact/build.ts`.
 *
 *   node artifact/check.ts                       every example in a preview is the picture of that example in the gallery
 *   node artifact/check.ts --published <folder>  also: the files read back from the artifact are the ones just built
 *
 * The first check is pixel for pixel, in Chrome: a preview runs the package's own components and styles, so a difference
 * means the bundle or its stylesheet has lost something. The second finds an artifact that has fallen behind the code:
 * <folder> holds the artifact's `project/` files as its page serves them (an agent reads them with its Artifact tool).
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Page } from 'playwright-core'
import { NAMES } from '../scripts/inventory.ts'
import { chrome, openGallery, serveGallery, STILL } from '../gallery/harness.ts'
import { EXTRA_CARDS, serveCards } from './build.ts'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const PROJECT = `${ROOT}artifact/out/project/`
if (!existsSync(`${PROJECT}components/bundle.js`)) throw new Error('Nothing is built: run `node artifact/build.ts` first.')
const { components } = JSON.parse(readFileSync(`${ROOT}artifact/out/build.json`, 'utf8')) as { components: string[] }
const problems: string[] = []
const unbuilt = [...NAMES, ...EXTRA_CARDS].filter((name) => !components.includes(name))
if (unbuilt.length) problems.push(`no card for ${unbuilt.join(', ')}: run node artifact/build.ts`)

/* ---------- the published files ---------- */

const at = process.argv.indexOf('--published')
if (at > 0) {
  const published = process.argv[at + 1]!.replace(/\/?$/, '/')
  const walk = (dir: string): string[] =>
    readdirSync(`${PROJECT}${dir}`, { withFileTypes: true }).flatMap((entry) => (entry.isDirectory() ? walk(`${dir}${entry.name}/`) : [`${dir}${entry.name}`]))
  /* The commit a file was built from is in tokens.json and so always differs after a commit: it is reported, not compared. */
  const plain = (path: string, text: string) => (path === 'tokens.json' ? text.replace(/"ref": "[^"]*"/, '"ref": ""') : text)
  const behind = walk('').filter((path) => {
    if (path === 'design-system.json') return false
    const theirs = `${published}${path}`
    return !existsSync(theirs) || plain(path, readFileSync(theirs, 'utf8')) !== plain(path, readFileSync(`${PROJECT}${path}`, 'utf8'))
  })
  if (behind.length) problems.push(`the artifact is behind the code in ${behind.length} files: ${behind.join(', ')}`)
  else console.log('published: the artifact holds what this commit builds')
}

/* ---------- previews against the gallery ---------- */

const gallery = await serveGallery(5184)
const cards = await serveCards(5185)
const browser = await chrome()

/**
 * The pictures of the examples a page shows, in order. Each is taken at the top left corner of the window, 920px wide as
 * in the gallery: down a long page an example starts at a part of a pixel, and its letters are then drawn a little differently.
 */
async function shots(page: Page, examples: string) {
  await page.evaluate(() => document.fonts.ready)
  await page.addStyleTag({ content: STILL })
  const pictures: Buffer[] = []
  for (const example of await page.locator(examples).all()) {
    const box = await example.evaluate((el: HTMLElement) => {
      el.dataset.was = el.style.cssText
      el.style.cssText += ';position:fixed;top:0;left:0;width:920px;margin:0;z-index:2147483647;background:#fff'
      const { width, height } = el.getBoundingClientRect()
      /* Whole pixels inside the example: a last row that it covers in part would show the page behind it. */
      return { width: Math.floor(width), height: Math.floor(height) }
    })
    pictures.push(await page.screenshot({ clip: { x: 0, y: 0, ...box } }))
    await example.evaluate((el: HTMLElement) => (el.style.cssText = el.dataset.was ?? ''))
  }
  return pictures
}

const theirs = await openGallery(browser, 5184, { width: 1120, height: 2000, scale: 1 })
let examples = 0
/* The extra cards are the artifact's alone: the gallery has no block to compare them with. */
for (const name of NAMES.filter((name) => components.includes(name))) {
  const ours = await browser.newPage({ viewport: { width: 960, height: 2000 } })
  await ours.goto(`http://localhost:5185/card/${name}`)
  await ours.waitForSelector('.g-example')
  const [a, b] = [await shots(theirs, `#${name}.g-section .g-example`), await shots(ours, '.g-example')]
  if (a.length !== b.length) problems.push(`${name}: the gallery has ${a.length} examples, the preview ${b.length}`)
  else
    a.forEach((picture, i) => {
      if (picture.equals(b[i]!)) return
      /* Both pictures are kept, to look at. */
      mkdirSync(`${ROOT}artifact/out/differs`, { recursive: true })
      writeFileSync(`${ROOT}artifact/out/differs/${name}-${i + 1}-gallery.png`, picture)
      writeFileSync(`${ROOT}artifact/out/differs/${name}-${i + 1}-preview.png`, b[i]!)
      problems.push(`${name}: example ${i + 1} is not the gallery's picture (artifact/out/differs/)`)
    })
  examples += a.length
  await ours.close()
}
await browser.close()
await gallery.close()
cards.close()

if (problems.length) {
  console.error(problems.join('\n'))
  process.exit(1)
}
console.log(`previews: ${examples} examples of ${NAMES.length} components are the gallery's pictures, pixel for pixel`)
