/*
 * Screenshots of the gallery, one per section, in each language and at desktop and phone width.
 *
 *   node gallery/shot.ts <folder for the screenshots>
 *
 * It also prints what a page must never have: an error in the console, or content wider than a phone.
 */
import { mkdirSync } from 'node:fs'
import { chrome, openGallery, openOverlay, serveGallery } from './harness.ts'

const OUT = process.argv[2]
if (!OUT) throw new Error('Give a folder for the screenshots.')
mkdirSync(OUT, { recursive: true })

const PORT = 5180
const server = await serveGallery(PORT)
const browser = await chrome()
const problems: string[] = []

for (const [name, width] of [
  ['desktop', 1120],
  ['phone', 375],
] as const) {
  for (const locale of ['en', 'es'] as const) {
    const page = await openGallery(browser, PORT, { width, locale, onError: (message) => problems.push(`${name} ${locale}: ${message}`) })
    const wide = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    if (wide > 0) problems.push(`${name} ${locale}: the page scrolls sideways by ${wide}px`)
    const sections = page.locator('.g-section')
    for (let i = 0; i < (await sections.count()); i++) {
      const section = sections.nth(i)
      const title = ((await section.locator('h2').first().textContent()) ?? `${i}`).replace(/[^A-Za-z]+/g, '-').toLowerCase()
      await section.screenshot({ path: `${OUT}/${name}-${locale}-${String(i).padStart(2, '0')}-${title}.png` })
    }
    if (locale === 'en') {
      /* The floating components: each opens, is drawn, closes, and leaves the page. */
      const gone = async (selector: string, timeout = 3000) =>
        page.waitForSelector(selector, { state: 'detached', timeout }).catch(() => problems.push(`${name}: ${selector} stayed after it closed`))
      await openOverlay(page, 'Dialog', 'callout')
      await page.waitForTimeout(400)
      await page.screenshot({ path: `${OUT}/${name}-open-dialog.png` })
      await page.keyboard.press('Escape')
      await gone('.gx-dialog')
      await openOverlay(page, 'Menu', 'open')
      await page.keyboard.press('ArrowDown')
      await page.waitForTimeout(300)
      await page.screenshot({ path: `${OUT}/${name}-open-menu.png` })
      await page.keyboard.press('Enter')
      await gone('.gx-menu')
      await page.waitForSelector('.gx-toast')
      await page.waitForTimeout(300)
      await page.screenshot({ path: `${OUT}/${name}-toast.png` })
      /* F8 moves to the toasts; the first Tab is the toast, the second its dismiss button. */
      await page.keyboard.press('F8')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.locator('.gx-toast').screenshot({ path: `${OUT}/${name}-focus-toast.png` })
      await page.keyboard.press('Enter')
      await gone('.gx-toast')
      /* Keyboard focus: the ring on a field and on an answer option. */
      for (const [what, target] of [
        ['input', page.locator('.gx-input__control').first()],
        ['answer', page.locator('.gx-answer-option:not(:disabled)').first()],
      ] as const) {
        await target.scrollIntoViewIfNeeded()
        await target.focus()
        await page.keyboard.press('Shift+Tab')
        await page.keyboard.press('Tab')
        await target.locator('xpath=ancestor::section').screenshot({ path: `${OUT}/${name}-focus-${what}.png` })
      }
    }
    await page.close()
  }
}

await browser.close()
await server.close()
console.log(problems.length ? problems.join('\n') : 'No console errors, no sideways scroll.')
process.exit(problems.length ? 1 : 0)
