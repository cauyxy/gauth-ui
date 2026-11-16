// @vitest-environment node
/* Text must reach 4.5:1 on its ground. These are the pairs the design rules allow; a token change that breaks one fails here. */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parse } from '../scripts/tokens.ts'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const colors = Object.fromEntries(
  parse(readFileSync(`${ROOT}src/styles/tokens.css`, 'utf8'))
    .filter((t) => t.name.startsWith('color-'))
    .map((t) => [t.name.slice('color-'.length), t.value]),
)

/** A token as [r, g, b], painted over white when it has an alpha. */
function rgb(name: string): [number, number, number] {
  const value = colors[name]
  if (!value) throw new Error(`no color token ${name}`)
  const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)?.[1]
  if (hex) {
    const full = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex
    return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as [number, number, number]
  }
  const parts = value.match(/^rgb\((\d+) (\d+) (\d+)(?: \/ ([\d.]+))?\)$/)
  if (!parts) throw new Error(`cannot read ${name}: ${value}`)
  const alpha = parts[4] ? Number(parts[4]) : 1
  return [1, 2, 3].map((i) => Math.round(Number(parts[i]) * alpha + 255 * (1 - alpha))) as [number, number, number]
}

const luminance = (color: [number, number, number]) => {
  const [r, g, b] = color.map((v) => (v / 255 <= 0.03928 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4)) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (text: string, ground: string) => {
  const [a, b] = [luminance(rgb(text)), luminance(rgb(ground))]
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

const GROUNDS = ['white', 'canvas', 'surface']
const PAIRS: [text: string, ground: string][] = [
  ...['ink', 'ink-soft', 'muted'].flatMap((text) => GROUNDS.map((ground) => [text, ground] as [string, string])),
  ...['blue', 'violet', 'violet-deep', 'good', 'warn', 'pink'].map((text) => [text, 'white'] as [string, string]),
  ['blue', 'blue-soft'],
  ['violet', 'violet-soft'],
  ['violet-deep', 'violet-soft'],
  ['good', 'good-soft'],
  ['warn', 'warn-soft'],
  ['pink', 'pink-soft'],
  ['white', 'ink'],
  /* Mastered and Proficient share one text color and the ground of done and right. */
  ['mastered-ink', 'good-soft'],
  ['familiar-ink', 'familiar-soft'],
  ['attempted-ink', 'attempted-soft'],
  ['attempted-ink', 'white'],
  ['muted', 'surface'],
  /* A level's fill carries ink text (a letter, a mark), never white: white on these fills is near 2:1. */
  ['ink', 'attempted'],
  ['ink', 'familiar'],
  ['ink', 'proficient'],
  ['ink', 'correct'],
  ['white', 'mastered-ink'],
  /* A StudentCard or an AnswerFeedback with a meaning: its other text stays ink on the soft ground. */
  ...['violet-soft', 'good-soft', 'pink-soft', 'familiar-soft', 'attempted-soft'].map((ground) => ['ink', ground] as [string, string]),
]

it.each(PAIRS)('%s on %s is at least 4.5:1', (text, ground) => {
  expect(contrast(text, ground)).toBeGreaterThanOrEqual(4.5)
})

/* These are too light for text. The design rules say so; this keeps the reason next to the numbers. */
it.each(['faint', 'good-mid', 'correct', 'ring'])('%s is not a text color', (name) => {
  expect(contrast(name, 'white')).toBeLessThan(4.5)
})
