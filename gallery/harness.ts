/*
 * What the scripts that look at the gallery in Chrome share: the gallery served as `pnpm gallery` serves it, Chrome, a
 * page made ready to look at, and the floating components opened the way a person opens them. gallery/shot.ts,
 * pixels.ts and optical.ts, site/shot.ts and the artifact's build and check use it.
 */
import { fileURLToPath } from 'node:url'
import type { Browser, Page } from 'playwright-core'
import { createServer } from 'vite'

const GALLERY = fileURLToPath(new URL('.', import.meta.url))

/** The gallery on this port, built with gallery/vite.config.ts. */
export async function serveGallery(port: number) {
  const server = await createServer({ root: GALLERY, configFile: `${GALLERY}vite.config.ts`, logLevel: 'error', server: { port, strictPort: true } })
  await server.listen()
  return server
}

/** Chrome: `CHROME=/path/to/chrome`, or the installed Google Chrome. Drawn without the graphics card, so a page gives the same pixels each time. */
export async function chrome(): Promise<Browser> {
  const { chromium } = await import('playwright-core')
  const args = ['--disable-gpu', '--force-color-profile=srgb']
  return chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME, args } : { channel: 'chrome', args })
}

/** Stops movement and hides the caret, so a picture does not depend on the moment it is taken. */
export const STILL = '*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }'

type Open = {
  width: number
  height?: number
  /** Device pixels for each CSS pixel. */
  scale?: number
  locale?: 'en' | 'es'
  /** Stop movement once the page is ready. */
  still?: boolean
  /** Told each error in the console and each error the page throws, from the start. */
  onError?: (message: string) => void
}

/** The gallery in a new page: its sections drawn, in the language asked for, its fonts loaded. */
export async function openGallery(
  browser: Browser,
  port: number,
  { width, height = 900, scale = 2, locale = 'en', still = false, onError }: Open,
): Promise<Page> {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale })
  if (onError) {
    page.on('console', (m) => m.type() === 'error' && onError(m.text()))
    page.on('pageerror', (e) => onError(e.message))
  }
  await page.goto(`http://localhost:${port}/`)
  await page.waitForSelector('.g-section')
  if (locale === 'es') await page.getByRole('radio', { name: 'Español' }).click()
  await page.evaluate(() => document.fonts.ready)
  if (still) await page.addStyleTag({ content: STILL })
  return page
}

/** A floating component of an example, and how a person opens it: by the words of the example's trigger. */
export type Overlay = { component: string; name: string; shown: string; open: (page: Page) => Promise<void> }

/* In the gallery a trigger is looked for in its component's section; on a page of the docs site, which shows one component, in the page. */
const sectionOf = async (page: Page, component: string) => {
  const section = page.locator(`.g-section#${component}`)
  return (await section.count()) ? section : page
}
const click =
  (component: string, name: string, exact = false) =>
  async (page: Page) =>
    (await sectionOf(page, component)).getByRole('button', { name, exact }).click()
const hover = (component: string, name: string) => async (page: Page) => (await sectionOf(page, component)).getByRole('button', { name }).hover()

/** Every floating component of the examples, opened. A changed word in an example is changed here, once. */
export const OVERLAYS: Overlay[] = [
  { component: 'Dialog', name: 'callout', shown: '.gx-dialog', open: click('Dialog', 'Publish practice') },
  { component: 'Dialog', name: 'plain', shown: '.gx-dialog', open: click('Dialog', 'Remove from class') },
  { component: 'Menu', name: 'open', shown: '.gx-menu', open: click('Menu', 'Devon Carter') },
  { component: 'Popover', name: 'open', shown: '.gx-popover', open: click('Popover', 'Open', true) },
  { component: 'Tooltip', name: 'open', shown: '.gx-tooltip', open: hover('Tooltip', 'Hover me') },
  ...['Copy link', 'Publish', 'Save offline', 'Assign', 'Remove student'].map((name) => ({
    component: 'Toast',
    name,
    shown: '.gx-toast',
    open: click('Toast', name, true),
  })),
]

/** Opens one floating component and waits until it is drawn. */
export async function openOverlay(page: Page, component: string, name: string) {
  const overlay = OVERLAYS.find((o) => o.component === component && o.name === name)
  if (!overlay) throw new Error(`no overlay ${component} ${name} in gallery/harness.ts`)
  await overlay.open(page)
  await page.waitForSelector(overlay.shown)
}
