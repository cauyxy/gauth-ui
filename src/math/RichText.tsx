'use client'

import { Fragment } from 'react'
import { cx } from '../core/cx'
import type { Props } from '../core/props'
import { Tex, toHtml } from './Tex'
import { MATH_PART, unescapeDollars, wordsIn } from './text'

export type RichTextProps = Props<'span', { text: string }, 'children'>

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
export function RichText({ text, className, ...props }: RichTextProps) {
  const parts = text.split(MATH_PART)
  const isMath = (p: string | undefined) => p !== undefined && p.startsWith('$') && p.endsWith('$') && p.length > 1
  /* A formula that is only words is shown as words: it keeps no punctuation and wraps as text does. */
  const isFormula = (p: string | undefined) => isMath(p) && wordsIn(p!.slice(1, -1)) === null
  return (
    <span {...props} className={cx('gx-rich-text', className)}>
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
