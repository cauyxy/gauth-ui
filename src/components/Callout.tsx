import type { ReactNode } from 'react'
import { cx } from '../core/cx'

export type CalloutTone = 'neutral' | 'ai' | 'good' | 'warn'

/** A note set apart from the text around it. The tone says what kind of note it is; the words still say it in full. */
export function Callout({ tone = 'neutral', title, children, className }: { tone?: CalloutTone; title?: string; children: ReactNode; className?: string }) {
  return (
    <div role="note" className={cx('gx-callout', `gx-callout--${tone}`, className)}>
      {title ? <p className="gx-callout__title">{title}</p> : null}
      {children}
    </div>
  )
}
