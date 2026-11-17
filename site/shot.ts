/*
 * Screenshots of the docs site at desktop and phone width, and a check of every component's page.
 *
 *   node site/shot.ts <folder for the screenshots> [address of a running site]
 *
 * Without an address it serves the site from this folder. It prints what a page must never have: an error in the console,
 * content wider than the window, a component's page with no example or an example with no code, or components without their styles.
 */
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { chrome, openOverlay } from '../gallery/harness.ts'
import { NAMES } from '../scripts/inventory.ts'

const [OUT, address] = process.argv.slice(2)
if (!OUT) throw new Error('Give a folder for the screenshots.')
mkdirSync(OUT, { recursive: true })

const server = address
  ? null
  : await createServer({ configFile: fileURLToPath(new URL('vite.config.ts', import.meta.url)), logLevel: 'error', server: { port: 5187, strictPort: true } })
await server?.listen()
const base = address ?? 'http://localhost:5187'
const browser = await chrome()
const problems: string[] = []
const SHOWN = ['/', '/components/button', '/components/table', '/components/message', '/components/answeroption', '/components/tex', '/install', '/tokens']

for (const [size, width] of [
  ['desktop', 1280],
  ['phone', 375],
] as const) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 2 })
  let at = ''
  page.on('console', (m) => m.type() === 'error' && problems.push(`${size} ${at}: ${m.text()}`))
  page.on('pageerror', (e) => problems.push(`${size} ${at}: ${e.message}`))
  const open = async (path: string) => {
    at = path
    await page.goto(base + path)
    await page.waitForSelector('.s-title')
    await page.evaluate(() => document.fonts.ready)
    const wide = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    if (wide > 0) problems.push(`${size} ${path}: the page scrolls sideways by ${wide}px`)
  }
  for (const path of SHOWN) {
    await open(path)
    await page.screenshot({ path: `${OUT}/${size}${path.replace(/\W+/g, '-').replace(/-$/, '') || '-home'}.png`, fullPage: path !== '/' })
  }
  await open('/')
  const cards = await page.locator('.s-card').count()
  if (cards < NAMES.length) problems.push(`${size} /: ${cards} cards for ${NAMES.length} components`)
  await page.screenshot({ path: `${OUT}/${size}-home-full.png`, fullPage: true })

  for (const name of NAMES) {
    await open(`/components/${name.toLowerCase()}`)
    const title = await page.locator('.s-title').textContent()
    if (title !== name) problems.push(`${size} ${at}: the page shows "${title}"`)
    const preview = page.locator('.s-preview').first()
    if ((await preview.count()) === 0 || (await preview.evaluate((el) => el.querySelector('[class*="gx-"]') === null)))
      problems.push(`${size} ${at}: no example`)
    const [examples, codes] = [await page.locator('.s-example').count(), await page.locator('.s-example__bar button').count()]
    if (examples !== codes) problems.push(`${size} ${at}: ${examples} examples, ${codes} with code`)
  }

  /* The styles are there: the classes are names only until Tailwind has made their CSS from the tokens. */
  await open('/components/button')
  const ink = await page
    .locator('.s-preview .gx-btn--ink')
    .first()
    .evaluate((el) => {
      const s = getComputedStyle(el)
      return `${s.backgroundColor} ${s.height} ${s.fontWeight} ${s.borderRadius}`
    })
  if (ink !== 'rgb(33, 37, 46) 34px 500 8px') problems.push(`${size} ${at}: the ink button is drawn as "${ink}"`)

  /* An example's code opens, and it is what a product writes: imports from the package. */
  await page.locator('.s-example__bar button').first().click()
  const code = (await page.locator('.s-code code').first().textContent()) ?? ''
  if (!code.includes("import { Button } from 'gauth-ui'") || !code.includes('<Button variant="soft">Review</Button>'))
    problems.push(`${size} ${at}: the code of the first example is "${code.slice(0, 80)}"`)
  await page.screenshot({ path: `${OUT}/${size}-code.png`, fullPage: true })

  if (size === 'desktop') {
    /* The floating components open on their own pages, and a toast shows once. */
    await open('/components/dialog')
    await openOverlay(page, 'Dialog', 'callout')
    await page.waitForTimeout(400)
    await page.screenshot({ path: `${OUT}/${size}-open-dialog.png` })
    await page.getByRole('button', { name: 'Publish', exact: true }).click()
    await page.waitForSelector('.gx-toast')
    await open('/components/menu')
    await openOverlay(page, 'Menu', 'open')
    await page.waitForTimeout(300)
    await page.screenshot({ path: `${OUT}/${size}-open-menu.png` })
    await page.keyboard.press('Escape')
    await open('/components/toast')
    await openOverlay(page, 'Toast', 'Copy link')
    await page.waitForTimeout(400)
    const toasts = await page.locator('.gx-toast').count()
    if (toasts !== 1) problems.push(`${size} ${at}: one toast was asked for, ${toasts} show`)
    await page.screenshot({ path: `${OUT}/${size}-open-toast.png` })
    /* A link in the list of pages changes the page in place, and the keyboard's ring is whole inside the frame. */
    await page.getByRole('link', { name: 'Button', exact: true }).click()
    await page.waitForFunction(() => document.querySelector('.s-title')?.textContent === 'Button')
    await page.locator('.s-preview .gx-btn').first().focus()
    await page.keyboard.press('Tab')
    await page.keyboard.press('Shift+Tab')
    await page
      .locator('.s-preview')
      .first()
      .screenshot({ path: `${OUT}/${size}-focus-button.png` })
  }
  await page.close()
}

await browser.close()
await server?.close()
console.log(problems.length ? problems.join('\n') : 'No problems.')
process.exit(problems.length ? 1 : 0)
