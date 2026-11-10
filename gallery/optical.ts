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
 *   base   a formula in a line of words, a number beside its step: both stand on one baseline
 *   size   a formula in a line of words: its numbers are as tall as the numbers in the words
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
    const LABELS = '.gx-btn, .gx-chip, .gx-chip-toggle, .gx-follow-ups__item, .gx-segmented__option, .gx-tabs__tab, .gx-level-chip, .gx-menu__item, .gx-table__head .gx-table__cell'
    const ROUND = '.gx-answer-option__mark, .gx-stepper__mark, .gx-avatar'
    const MARKS: [mark: string, row: string][] = [
      ['.gx-checkbox__box', '.gx-checkbox'],
      ['.gx-level-mark', '.gx-level-chip'],
      ['.gx-generating__mark', '.gx-generating__step'],
      ['.gx-ai-status__mark', '.gx-ai-status'],
      ['.gx-answer-option__mark', '.gx-answer-option'],
      ['.gx-breadcrumbs__separator', '.gx-breadcrumbs__item'],
      ['svg', '.gx-btn'],
      ['svg', '.gx-chip-toggle'],
      [':scope > svg', '.gx-chip'],
    ]
    const ENDS = '.gx-btn, .gx-select, .gx-chip--removable'
    const ICON_BUTTONS = '.gx-icon-btn, .gx-chip__remove, .gx-composer__send'
    const TOLERANCE = 0.5

    const canvas = document.createElement('canvas').getContext('2d')!
    /** The ink of the first line of text in an element: the middles of its capitals and lowercase, its left and right. */
    const inkOf = (root: Element) => {
      /* A formula holds its MathML too, for screen readers: that copy is not drawn, so skip it. */
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
      let node = walker.nextNode()
      while (node && (!node.textContent!.trim() || node.parentElement!.closest('.katex-mathml'))) node = walker.nextNode()
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
        baseline,
        digit: (canvas.measureText('0').actualBoundingBoxAscent),
        capMiddle,
        exMiddle: /[a-z]/.test(text) ? baseline - ex.actualBoundingBoxAscent / 2 : capMiddle,
        left: rect.left - own.actualBoundingBoxLeft,
        right: rect.left + own.actualBoundingBoxRight,
        lines: range.getClientRects().length,
      }
    }
    /** The strokes of an icon, without the empty space of its box. */
    const strokesOf = (svg: Element) => {
      const shapes = [...svg.querySelectorAll('path, circle, rect, line, polyline, ellipse')].map((shape) => shape.getBoundingClientRect())
      if (!shapes.length) return svg.getBoundingClientRect()
      const grid = (svg as SVGSVGElement).viewBox.baseVal.width || 24
      const half = ((parseFloat(getComputedStyle(svg).strokeWidth) || 0) * (svg.getBoundingClientRect().width / grid)) / 2
      return {
        left: Math.min(...shapes.map((b) => b.left)) - half,
        right: Math.max(...shapes.map((b) => b.right)) + half,
        top: Math.min(...shapes.map((b) => b.top)) - half,
        bottom: Math.max(...shapes.map((b) => b.bottom)) + half,
      }
    }
    const name = (el: Element) => [...el.classList].filter((c) => c.startsWith('gx-')).join('.')
    const out: string[] = []
    const say = (kind: string, el: Element, text: string, what: string) => out.push(`${kind.padEnd(6)} ${name(el).padEnd(40).slice(0, 40)} ${text.padEnd(22).slice(0, 22)} ${what}`)
    const px = (n: number) => `${n > 0 ? '+' : ''}${n.toFixed(2)}px`
    /* A list that finds nothing checks nothing, so that is a failure too: a class name changed, or the gallery lost a case. */
    const all = (selector: string) => {
      const found = [...document.querySelectorAll<HTMLElement>(`.g-section :is(${selector})`)]
      if (!found.length) out.push(`none   nothing in the gallery matches ${selector}`)
      return found
    }

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
    /* Two things on one line: [the first, the second, the row that holds both]. */
    const LINES: [first: string, second: string, row: string][] = [
      ['.gx-worked-steps__number', '.gx-worked-steps__text', '.gx-worked-steps__step'],
    ]
    for (const [first, second, rowSelector] of LINES) {
      for (const row of all(rowSelector)) {
        const [a, b] = [row.querySelector(first), row.querySelector(second)].map((el) => el && inkOf(el))
        if (a && b && Math.abs(a.baseline - b.baseline) >= TOLERANCE) say('base', row, b.text, `${px(b.baseline - a.baseline)} under the baseline of "${a.text.slice(0, 12)}"`)
      }
    }
    /* A formula in a line of words. An empty inline box stands on the baseline, so one in the words and one in the formula show both. */
    const probeAt = (parent: Element, before: Node | null) => {
      const probe = document.createElement('span')
      probe.style.cssText = 'display:inline-block;width:0;height:0'
      parent.insertBefore(probe, before)
      const bottom = probe.getBoundingClientRect().bottom
      probe.remove()
      return bottom
    }
    let measured = 0
    for (const tex of all('.gx-tex:not(.gx-tex--display)')) {
      const holder = tex.parentElement!
      const katex = tex.querySelector('.katex')
      const base = tex.querySelector('.katex-html > .katex-base')
      if (tex.querySelector('.katex-error')) continue
      if (!katex || !base) {
        say('none', tex, tex.textContent ?? '', 'no drawn formula found in it: did KaTeX rename its classes?')
        continue
      }
      if (![...holder.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim())) continue
      measured++
      /* A probe before the formula can stay at the end of the line above when the line breaks there, so try both sides. */
      const math = probeAt(base, base.firstChild)
      const off = [probeAt(holder, tex), probeAt(holder, tex.nextSibling)].map((words) => math - words).sort((a, b) => Math.abs(a) - Math.abs(b))[0]!
      const label = (tex.querySelector('annotation')?.textContent ?? '').trim()
      if (Math.abs(off) >= TOLERANCE) say('base', holder, label, `${px(off)} under the baseline of the words`)
      const heightOf = (el: Element, family: string) => {
        canvas.font = `${getComputedStyle(el).fontSize} ${family}`
        return canvas.measureText('0').actualBoundingBoxAscent
      }
      const ratio = heightOf(katex, 'KaTeX_Main') / heightOf(holder, getComputedStyle(holder).fontFamily)
      if (Math.abs(ratio - 1) > 0.05) say('size', holder, label, `its numbers are ${(ratio * 100).toFixed(0)}% of the height of the numbers in the words`)
    }
    if (!measured) out.push('none   no formula in a line of words was measured')
    /* A button that is only an icon: the icon's box is in the middle of the button, both ways. */
    for (const el of all(ICON_BUTTONS)) {
      const svg = el.querySelector('svg')
      if (!svg) continue
      const [box, icon] = [el.getBoundingClientRect(), svg.getBoundingClientRect()]
      const right = icon.left + icon.width / 2 - (box.left + box.width / 2)
      const down = icon.top + icon.height / 2 - (box.top + box.height / 2)
      if (Math.abs(right) >= TOLERANCE || Math.abs(down) >= TOLERANCE) say('round', el, el.getAttribute('aria-label') ?? '', `the icon is ${px(right)} right and ${px(down)} down of the middle`)
    }
    for (const el of all(ENDS)) {
      const svg = el.querySelector(':scope > svg:last-child, :scope > .gx-select__icon, :scope > .gx-chip__remove svg')
      const ink = inkOf(el)
      if (!svg) continue
      const box = el.getBoundingClientRect()
      /* What the control starts with: an icon's strokes, or the text. */
      const lead = el.querySelector(':scope > svg:first-child')
      const start = lead && lead !== svg ? strokesOf(lead).left : ink?.left
      const before = start !== undefined ? start - box.left : parseFloat(getComputedStyle(el.querySelector('select') ?? el).paddingLeft)
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
