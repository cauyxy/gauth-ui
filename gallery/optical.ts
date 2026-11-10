/*
 * Measures optical alignment in the gallery. A box can be exact and the eye still sees it off, because a font's line
 * box is not centered on its letters and an icon has empty space around its strokes.
 *
 *   node gallery/optical.ts
 *
 * It measures ink, not boxes, at desktop and phone width, and prints what is off:
 *   label  a one-line label in its control: the control's middle lies between the middle of the capitals and the
 *          middle of the lowercase letters
 *   round  a letter or number in a round mark: the capitals' middle is the mark's middle, both ways
 *   mark   a mark beside text: its middle is on the first line of the text, also when the text wraps
 *   end    a control that ends with an icon: the space after the icon's strokes is the space before the text
 */
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
import { createServer } from 'vite'

const server = await createServer({
  configFile: false,
  root: fileURLToPath(new URL('.', import.meta.url)),
  logLevel: 'error',
  plugins: [react()],
  server: { port: 5182, strictPort: true },
})
await server.listen()
const browser = await chromium.launch({ channel: 'chrome' })
const lines = new Set<string>()

for (const width of [1120, 375]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 2 })
  await page.goto('http://localhost:5182/')
  await page.waitForSelector('.g-section')
  await page.evaluate(() => document.fonts.ready)
  const found = await page.evaluate(() => {
    const LABELS = '.gx-btn, .gx-chip, .gx-segmented__option, .gx-tabs__tab, .gx-level-chip, .gx-menu__item, .gx-table__head .gx-table__cell'
    const ROUND = '.gx-answer-option__mark, .gx-stepper__mark, .gx-avatar'
    const MARKS: [mark: string, row: string][] = [
      ['.gx-checkbox__box', '.gx-checkbox'],
      ['.gx-level-mark', '.gx-level-chip'],
      ['.gx-generating__mark', '.gx-generating__step'],
      ['.gx-answer-option__mark', '.gx-answer-option'],
      ['.gx-breadcrumbs__separator', '.gx-breadcrumbs__item'],
      ['svg', '.gx-btn'],
    ]
    const ENDS = '.gx-btn, .gx-select'
    const TOLERANCE = 0.5

    const canvas = document.createElement('canvas').getContext('2d')!
    /** The ink of the first line of text in an element: the middles of its capitals and lowercase, its left and right. */
    const inkOf = (root: Element) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
      let node = walker.nextNode()
      while (node && !node.textContent!.trim()) node = walker.nextNode()
      if (!node) return null
      const el = node.parentElement!
      const range = document.createRange()
      range.selectNodeContents(node)
      const rect = range.getClientRects()[0]
      if (!rect?.width) return null
      const s = getComputedStyle(el)
      canvas.font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`
      const cap = canvas.measureText('H')
      const ex = canvas.measureText('x')
      const text = node.textContent!.trim()
      const own = canvas.measureText(text)
      const baseline = rect.top + (rect.height - (cap.fontBoundingBoxAscent + cap.fontBoundingBoxDescent)) / 2 + cap.fontBoundingBoxAscent
      const capMiddle = baseline - cap.actualBoundingBoxAscent / 2
      return {
        text,
        capMiddle,
        exMiddle: /[a-z]/.test(text) ? baseline - ex.actualBoundingBoxAscent / 2 : capMiddle,
        left: rect.left - own.actualBoundingBoxLeft,
        right: rect.left + own.actualBoundingBoxRight,
        lines: range.getClientRects().length,
      }
    }
    /** The strokes of an icon, without the empty space of its box. */
    const strokesOf = (svg: Element) => {
      const shape = svg.querySelector('path, circle, rect')
      if (!shape) return svg.getBoundingClientRect()
      const box = shape.getBoundingClientRect()
      const half = (parseFloat(getComputedStyle(shape).strokeWidth) || 0) * (svg.getBoundingClientRect().width / 20) * 0.5
      return { left: box.left - half, right: box.right + half, top: box.top - half, bottom: box.bottom + half }
    }
    const name = (el: Element) => [...el.classList].filter((c) => c.startsWith('gx-')).join('.')
    const out: string[] = []
    const say = (kind: string, el: Element, text: string, what: string) => out.push(`${kind.padEnd(6)} ${name(el).padEnd(40).slice(0, 40)} ${text.padEnd(22).slice(0, 22)} ${what}`)
    const px = (n: number) => `${n > 0 ? '+' : ''}${n.toFixed(2)}px`
    const all = (selector: string) => [...document.querySelectorAll<HTMLElement>(`.g-section :is(${selector})`)]

    for (const el of all(LABELS)) {
      const ink = inkOf(el)
      const box = el.getBoundingClientRect()
      if (!ink || ink.lines > 1) continue
      const middle = box.top + box.height / 2
      if (middle < ink.capMiddle - TOLERANCE) say('label', el, ink.text, `sits low: capitals ${px(ink.capMiddle - middle)} under the middle`)
      if (middle > ink.exMiddle + TOLERANCE) say('label', el, ink.text, `sits high: lowercase ${px(ink.exMiddle - middle)} over the middle`)
    }
    for (const el of all(ROUND)) {
      const ink = inkOf(el)
      const box = el.getBoundingClientRect()
      if (!ink) continue
      const down = ink.capMiddle - (box.top + box.height / 2)
      const right = (ink.left + ink.right) / 2 - (box.left + box.width / 2)
      if (Math.abs(down) >= TOLERANCE) say('round', el, ink.text, `${px(down)} down`)
      if (Math.abs(right) >= TOLERANCE) say('round', el, ink.text, `${px(right)} right`)
    }
    for (const [markSelector, rowSelector] of MARKS) {
      for (const row of all(rowSelector)) {
        const mark = row.querySelector(markSelector)
        const ink = inkOf(row.querySelector('[class*="__text"], [class*="__content"]') ?? row)
        if (!mark || !ink) continue
        const box = mark.tagName === 'svg' ? strokesOf(mark) : mark.getBoundingClientRect()
        const middle = (box.top + box.bottom) / 2
        if (middle < ink.capMiddle - TOLERANCE || middle > ink.exMiddle + TOLERANCE)
          say('mark', row, ink.text, `${px(middle - (ink.capMiddle + ink.exMiddle) / 2)} from the first line${ink.lines > 1 ? ` of ${ink.lines}` : ''}`)
      }
    }
    for (const el of all(ENDS)) {
      const svg = el.querySelector(':scope > svg:last-child, :scope > .gx-select__icon')
      const ink = inkOf(el)
      if (!svg) continue
      const box = el.getBoundingClientRect()
      const before = ink ? ink.left - box.left : parseFloat(getComputedStyle(el.querySelector('select') ?? el).paddingLeft)
      const after = box.right - strokesOf(svg).right
      if (Math.abs(after - before) >= 1) say('end', el, ink?.text ?? '', `${before.toFixed(1)}px before the text, ${after.toFixed(1)}px after the icon`)
    }
    return out
  })
  for (const line of found) lines.add(line)
  await page.close()
}

await browser.close()
await server.close()
console.log([...lines].sort().join('\n') || 'Every label, mark and icon is where the eye expects it.')
process.exit(lines.size ? 1 : 0)
