import { Fragment } from 'react'
import { cx } from '../core/cx'
import { Tex, toHtml } from './Tex'

const SPACING = /\\(?:qquad|quad|[,;:! ])|\\\\|&/g

/**
 * Words someone put in TeX ("\text{Hypothesis} = \text{the lines meet}"), as the plain text they are, or null when
 * the TeX holds real math. Set in TeX, words come out in serif type and do not wrap.
 */
export function wordsIn(tex: string) {
  if (!tex.includes('\\text{')) return null
  const rest = tex.replace(/\\text\{[^{}]*\}/g, '').replace(SPACING, ' ')
  if (/[^\s=:,.;]/.test(rest)) return null
  return tex
    .replace(/\\text\{([^{}]*)\}/g, '$1')
    .replace(SPACING, ' ')
    .replace(/\s*=\s*/g, ': ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Inline TeX between $...$. A money amount is an escaped dollar ("$\$13$", or "\$13" in plain words), so `\$` never
 * opens or closes a formula.
 */
export const MATH = /(?<!\\)\$((?:\\.|[^$\\])+)\$/g
const MATH_PART = /((?<!\\)\$(?:\\.|[^$\\])+\$)/g

/** Plain words with the escaped dollars of money amounts read as "$". */
export const unescapeDollars = (text: string) => text.replace(/\\\$/g, '$')

/** A string as far as it is written, without a formula still open (its `$` not yet closed): for streamed replies. */
export function closedMath(text: string) {
  const open = [...text.matchAll(/(?<!\\)\$/g)]
  return open.length % 2 ? text.slice(0, open.at(-1)!.index) : text
}

/* Punctuation that belongs to a formula: "(" before it, "," or "." after it. A line must not break between them. */
const OPENS = /[([]+$/
const CLOSES = /^[,.;:!?)\]]+/

/**
 * A formula with the punctuation that touches it. The punctuation goes into the formula as text, so it stays on the
 * line of the formula's last part, and the formula can still break after an "=" or a "+" when it is long.
 */
function Kept({ tex, before, after }: { tex: string; before: string; after: string }) {
  const joined = `${before && `\\text{${before}}`}${tex}${after && `\\text{${after}}`}`
  /* TeX that cannot be read stays as it was written, with the punctuation outside it. */
  if (toHtml(joined, false).includes('katex-error')) {
    return (
      <>
        {before}
        <Tex tex={tex} />
        {after}
      </>
    )
  }
  return <Tex tex={joined} />
}

/**
 * Plain text with inline TeX between $...$: the format of a stem, a choice and an explanation.
 * A formula keeps the punctuation that touches it, so a line never starts with the comma after a formula.
 */
export function RichText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(MATH_PART)
  const isMath = (p: string | undefined) => p !== undefined && p.startsWith('$') && p.endsWith('$') && p.length > 1
  /* A formula that is only words is shown as words: it keeps no punctuation and wraps as text does. */
  const isFormula = (p: string | undefined) => isMath(p) && wordsIn(p!.slice(1, -1)) === null
  return (
    <span className={cx('gx-rich-text', className)}>
      {parts.map((p, i) => {
        if (!isMath(p)) {
          /* The punctuation that touches a formula is drawn with the formula, not here. */
          const words = p.replace(isFormula(parts[i - 1]) ? CLOSES : /^$/, '').replace(isFormula(parts[i + 1]) ? OPENS : /^$/, '')
          return <Fragment key={i}>{unescapeDollars(words)}</Fragment>
        }
        const tex = p.slice(1, -1)
        if (!isFormula(p)) return <Fragment key={i}>{wordsIn(tex)}</Fragment>
        const before = parts[i - 1]?.match(OPENS)?.[0] ?? ''
        const after = parts[i + 1]?.match(CLOSES)?.[0] ?? ''
        return before || after ? <Kept key={i} tex={tex} before={before} after={after} /> : <Tex key={i} tex={tex} />
      })}
    </span>
  )
}
