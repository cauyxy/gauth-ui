'use client'

import { renderToString } from 'katex'
import { useEffect, useMemo, useRef, useState } from 'react'
import { cx } from '../core/cx'
import type { Props } from '../core/props'
import { mergeRefs } from '../core/refs'

export type TexProps = Props<'span', { tex: string; display?: boolean }, 'children' | 'dangerouslySetInnerHTML'>

const cache = new Map<string, string>()

/** The HTML of a formula. Kept, so a formula that is drawn again costs nothing. */
export function toHtml(tex: string, display: boolean) {
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
export function Tex({ tex, display = false, className, ref, ...props }: TexProps) {
  const html = useMemo(() => toHtml(tex, display), [tex, display])
  const box = useRef<HTMLSpanElement>(null)
  const setBox = useMemo(() => mergeRefs(box, ref), [ref])
  const [scrolls, setScrolls] = useState(false)
  /* A display formula wider than its place scrolls in its own box. Then the keyboard must reach the box to scroll it. */
  useEffect(() => {
    const el = box.current
    if (!display || !el) return
    const measure = () => setScrolls(el.scrollWidth > el.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
    // oxlint-disable-next-line react/exhaustive-effect-dependencies -- another formula in the same box has another width, and the observer does not see that
  }, [display, html])
  return (
    <span
      // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a box that scrolls takes focus, so the arrow keys can scroll it
      tabIndex={display && scrolls ? 0 : undefined}
      {...props}
      ref={setBox}
      className={cx('gx-tex', display && 'gx-tex--display', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
