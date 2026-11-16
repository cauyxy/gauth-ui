/* What the math entry does with a string before it draws it. No React here, so a server component can call these. */

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
export const MATH_PART = /((?<!\\)\$(?:\\.|[^$\\])+\$)/g

/** Plain words with the escaped dollars of money amounts read as "$". */
export const unescapeDollars = (text: string) => text.replace(/\\\$/g, '$')

/** A string as far as it is written, without a formula still open (its `$` not yet closed): for streamed replies. */
export function closedMath(text: string) {
  const open = [...text.matchAll(/(?<!\\)\$/g)]
  return open.length % 2 ? text.slice(0, open.at(-1)!.index) : text
}
