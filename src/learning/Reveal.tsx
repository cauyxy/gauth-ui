import { useId, type ReactNode } from 'react'
import { cx } from '../core/cx'
import { useLocale } from '../core/locale'

/**
 * Help that arrives under a question. A `hint` is one step of help before the answer; `why` is the reason, shown after
 * the student answers. The title comes from the shared words; the content is the product's.
 */
export function Reveal({ kind, children, className }: { kind: 'hint' | 'why'; children: ReactNode; className?: string }) {
  const { messages } = useLocale()
  const title = useId()
  return (
    <div role="note" aria-labelledby={title} className={cx('gx-reveal', `gx-reveal--${kind}`, className)}>
      <span id={title} className="gx-reveal__title">
        {messages[kind]}
      </span>
      <div className="gx-reveal__body">{children}</div>
    </div>
  )
}
