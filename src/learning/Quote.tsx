import type { ReactNode } from 'react'
import { IconButton } from '../components/IconButton'
import { cn } from '../core/cn'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'

/**
 * Text quoted from a reply or a document, shown above what is being written: a bar, then the text, at most two lines.
 * With `onRemove` it ends with a button that takes the quote off.
 */
export function Quote({ children, onRemove, className }: { children: ReactNode; onRemove?: () => void; className?: string }) {
  const { messages } = useLocale()
  return (
    /* The bar is a shape at the start, as tall as the quote. The quote has no ground. */
    <blockquote
      className={cn(
        "gx-quote flex min-w-0 items-center gap-2.5 before:w-[3px] before:flex-none before:self-stretch before:rounded-full before:bg-rule before:content-['']",
        className,
      )}
    >
      {/* Two lines at most: the quote points at the text, it does not repeat it. */}
      <div className="gx-quote__text line-clamp-2 min-w-0 flex-1 text-sm leading-body wrap-anywhere whitespace-normal text-muted">{children}</div>
      {onRemove ? (
        <IconButton size="sm" label={messages.remove} onClick={onRemove}>
          <Icon name="close" />
        </IconButton>
      ) : null}
    </blockquote>
  )
}
