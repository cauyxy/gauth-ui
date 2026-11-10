import { renderToString } from 'katex'
import { useMemo } from 'react'
import { cx } from '../core/cx'

const cache = new Map<string, string>()

function toHtml(tex: string, display: boolean) {
  const key = `${display ? 'D' : 'I'}${tex}`
  let html = cache.get(key)
  if (html === undefined) {
    /* A formula that cannot be read shows its source in the attempted color, never in red, and never throws. */
    html = renderToString(tex, { displayMode: display, throwOnError: false, errorColor: 'var(--gx-color-attempted-ink)' })
    cache.set(key, html)
  }
  return html
}

/**
 * A formula, from TeX. Inline it sits on the baseline of the words around it, at their size; `display` sets it on its
 * own line, centered. A screen reader gets the formula as MathML.
 */
export function Tex({ tex, display = false, className }: { tex: string; display?: boolean; className?: string }) {
  const html = useMemo(() => toHtml(tex, display), [tex, display])
  return <span className={cx('gx-tex', display && 'gx-tex--display', className)} dangerouslySetInnerHTML={{ __html: html }} />
}
