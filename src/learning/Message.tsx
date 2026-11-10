import type { ReactNode } from 'react'
import { cx } from '../core/cx'
import { useLocale } from '../core/locale'

/**
 * One turn of a conversation with Gauth AI. `user` is what the person wrote, in a soft bubble at the end side; `ai` is
 * the reply, plain text across the column. The content is the product's. A screen reader hears who wrote it first.
 */
export function Message({ from, children, className }: { from: 'user' | 'ai'; children: ReactNode; className?: string }) {
  const { messages } = useLocale()
  return (
    <div className={cx('gx-message', `gx-message--${from}`, className)}>
      <span className="gx-visually-hidden">{from === 'user' ? messages.you : messages.gauthAi}</span>
      {children}
    </div>
  )
}
