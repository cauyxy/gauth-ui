/*
 * The look of every component as pixels, to prove that a change to how the styles are written changes nothing on screen.
 *
 *   node gallery/pixels.ts take <folder>             before the change, and again after it
 *   node gallery/pixels.ts compare <before> <after>  every picture that is not the same, pixel for pixel
 *
 * `take` also reads `--only Button,Chip` (those blocks of the gallery alone; `compare` then looks at those alone) and
 * `--port 5190` (so two runs can go at the same time).
 *
 * It takes each block of the gallery in both languages at desktop and phone width, each control with the pointer on it and
 * with keyboard focus, and each floating component open. Movement is stopped for the pictures; `motion.json` holds what
 * moves and how fast, read before it is stopped.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import type { Page } from 'playwright-core'
import { chrome, openGallery, OVERLAYS, serveGallery } from './harness.ts'

const flag = (name: string) => {
  const at = process.argv.indexOf(`--${name}`)
  return at < 0 ? undefined : process.argv.splice(at, 2)[1]
}
const ONLY = flag('only')?.split(',')
const PORT = Number(flag('port') ?? 5182)
const [command, A, B] = process.argv.slice(2)
const fileOf = (title: string) => title.replace(/[^A-Za-z]+/g, '-').toLowerCase()
const browser = await chrome()

if (command === 'take' && A) await take(A)
else if (command === 'compare' && A && B) await compare(A, B)
else throw new Error('Use: take <folder>, or compare <before> <after>.')
await browser.close()

async function take(out: string) {
  mkdirSync(out, { recursive: true })
  const server = await serveGallery(PORT)
  const open = (width: number, locale: 'en' | 'es', still = true): Promise<Page> => openGallery(browser, PORT, { width, locale, still })

  /* What moves, before movement is stopped. */
  const moving = await open(1120, 'en', false)
  const motion = await moving.evaluate(() =>
    [...document.querySelectorAll('.g-section *')].map((el) => {
      const s = getComputedStyle(el)
      const hook = [...el.classList].filter((c) => c.startsWith('gx-')).join('.')
      return [
        `${el.closest('.g-section')!.id}: ${el.tagName.toLowerCase()}.${hook}`,
        s.animationName,
        s.animationDuration,
        s.animationTimingFunction,
        s.animationIterationCount,
        s.transitionDuration,
        s.transitionTimingFunction,
      ].join(' | ')
    }),
  )
  const wanted = (title: string) => !ONLY || ONLY.includes(title)
  writeFileSync(
    `${out}/motion.json`,
    JSON.stringify(
      motion.filter((line) => wanted(line.slice(0, line.indexOf(':')))),
      null,
      1,
    ),
  )
  writeFileSync(`${out}/only.json`, JSON.stringify(ONLY ?? null))
  await moving.close()

  for (const [size, width] of [
    ['desktop', 1120],
    ['phone', 375],
  ] as const)
    for (const locale of ['en', 'es'] as const) {
      const page = await open(width, locale)
      const sections = page.locator('.g-section')
      for (let i = 0; i < (await sections.count()); i++) {
        const title = (await sections.nth(i).getAttribute('id'))!
        if (wanted(title)) await sections.nth(i).screenshot({ path: `${out}/${size}-${locale}-${fileOf(title)}.png` })
      }
      await page.close()
    }

  /* Each control with the pointer on it, then with keyboard focus. */
  const page = await open(1120, 'en')
  await page.keyboard.press('Tab')
  for (const title of await page.locator('.g-section').evaluateAll((all) => all.map((el) => el.id))) {
    if (!wanted(title)) continue
    const controls = page.locator(`.g-section[id="${title}"] :is(button, a[href], input, textarea, select, [tabindex="0"]):not(:disabled)`)
    const count = await controls.count()
    for (let i = 0; i < count; i++) {
      const control = controls.nth(i)
      const box = await control.evaluate((el) => {
        el.scrollIntoView({ block: 'center' })
        const { x, y, width, height } = el.getBoundingClientRect()
        return { x, y, width, height }
      })
      if (box.width < 4 || box.height < 4) continue
      const clip = { x: Math.max(0, box.x - 8), y: Math.max(0, box.y - 8), width: box.width + 16, height: box.height + 16 }
      const name = `state-${fileOf(title)}-${String(i).padStart(2, '0')}`
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
      await page.screenshot({ path: `${out}/${name}-hover.png`, clip })
      await page.mouse.move(0, 0)
      await control.focus()
      await page.screenshot({ path: `${out}/${name}-focus.png`, clip })
      await control.evaluate((el) => (el as HTMLElement).blur())
    }
  }
  await page.close()

  /* Each floating component, open. */
  for (const overlay of OVERLAYS) {
    if (!wanted(overlay.component)) continue
    const page = await open(1120, 'en')
    await overlay.open(page)
    await page.waitForSelector(overlay.shown)
    await page.waitForTimeout(200)
    await page.screenshot({ path: `${out}/open-${fileOf(overlay.component)}-${fileOf(overlay.name)}.png` })
    await page.close()
  }

  await server.close()
  console.log(`${readdirSync(out).length} files in ${out}`)
}

async function compare(before: string, after: string) {
  const page = await browser.newPage()
  const problems: string[] = []
  /* When `after` holds some blocks only, the others are not looked at. */
  const only = JSON.parse(readFileSync(`${after}/only.json`, 'utf8')) as string[] | null
  const taken = readdirSync(after).filter((f) => f.endsWith('.png'))
  const names = only ? taken : readdirSync(before).filter((f) => f.endsWith('.png'))
  for (const name of taken) if (!existsSync(`${before}/${name}`)) problems.push(`${name}: only after`)
  for (const name of names) {
    if (!existsSync(`${after}/${name}`)) {
      problems.push(`${name}: only before`)
      continue
    }
    const [a, b] = [readFileSync(`${before}/${name}`), readFileSync(`${after}/${name}`)]
    if (a.equals(b)) continue
    const result = await page.evaluate(
      async ([x, y]) => {
        const load = async (data: string) => {
          const image = new Image()
          image.src = `data:image/png;base64,${data}`
          await image.decode()
          const canvas = new OffscreenCanvas(image.width, image.height)
          const context = canvas.getContext('2d')!
          context.drawImage(image, 0, 0)
          return context.getImageData(0, 0, image.width, image.height)
        }
        const [p, q] = [await load(x!), await load(y!)]
        if (p.width !== q.width || p.height !== q.height) return `${p.width}×${p.height} before, ${q.width}×${q.height} after`
        let pixels = 0
        let most = 0
        let [top, left, bottom, right] = [p.height, p.width, 0, 0]
        for (let i = 0; i < p.data.length; i += 4) {
          const d = Math.max(
            Math.abs(p.data[i]! - q.data[i]!),
            Math.abs(p.data[i + 1]! - q.data[i + 1]!),
            Math.abs(p.data[i + 2]! - q.data[i + 2]!),
            Math.abs(p.data[i + 3]! - q.data[i + 3]!),
          )
          if (!d) continue
          pixels++
          most = Math.max(most, d)
          const [px, py] = [(i / 4) % p.width, Math.floor(i / 4 / p.width)]
          top = Math.min(top, py)
          bottom = Math.max(bottom, py)
          left = Math.min(left, px)
          right = Math.max(right, px)
        }
        return pixels ? `${pixels} pixels differ, by ${most} of 255 at most, in x ${left}–${right}, y ${top}–${bottom} of ${p.width}×${p.height}` : ''
      },
      [a.toString('base64'), b.toString('base64')],
    )
    if (result) problems.push(`${name}: ${result}`)
  }
  const motion = (dir: string) => JSON.parse(readFileSync(`${dir}/motion.json`, 'utf8')) as string[]
  const [m, n] = [motion(before).filter((line) => !only || only.includes(line.slice(0, line.indexOf(':')))), motion(after)]
  if (m.length !== n.length) problems.push(`motion: ${m.length} elements before, ${n.length} after`)
  else m.forEach((line, i) => line === n[i] || problems.push(`motion: ${line}\n     now: ${n[i]}`))
  console.log(problems.length ? problems.join('\n') : `The same, pixel for pixel: ${names.length} pictures.`)
  process.exitCode = problems.length ? 1 : 0
}
