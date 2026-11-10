import type { ReactNode } from 'react'
import { IconButton } from '../components/IconButton'
import { cx } from '../core/cx'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'

/**
 * Text quoted from a reply or a document, shown above what is being written: a bar, then the text, at most two lines.
 * With `onRemove` it ends with a button that takes the quote off.
 */
export function Quote({ children, onRemove, className }: { children: ReactNode; onRemove?: () => void; className?: string }) {
  const { messages } = useLocale()
  return (
    <blockquote className={cx('gx-quote', className)}>
      <div className="gx-quote__text">{children}</div>
      {onRemove ? (
        <IconButton size="sm" label={messages.remove} onClick={onRemove}>
          <Icon name="close" />
        </IconButton>
      ) : null}
    </blockquote>
  )
}
