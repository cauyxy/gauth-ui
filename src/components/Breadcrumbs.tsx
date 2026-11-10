import { Children, isValidElement, type ReactNode } from 'react'
import { cn } from '../core/cn'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'

/**
 * Where a page sits. Each child is one level. A level above is a link; the page itself is plain text, and it is last.
 * Leave the page out when a title under the trail already names it.
 */
export function Breadcrumbs({ children, className }: { children: ReactNode; className?: string }) {
  const { messages } = useLocale()
  const items = Children.toArray(children)
  return (
    <nav aria-label={messages.breadcrumb} className={cn('gx-breadcrumbs', className)}>
      <ol className="gx-breadcrumbs__list flex flex-wrap items-center gap-1 text-xs text-muted">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li
              key={i}
              aria-current={last && !isValidElement(item) ? 'page' : undefined}
              className="gx-breadcrumbs__item inline-flex min-w-0 items-center gap-1 aria-[current=page]:text-ink [&_a]:rounded-sm [&_a]:text-inherit [&_a]:no-underline [&_a]:outline-0 [&_a]:hover:text-ink [&_a]:focus-visible:focus-ring [&_a]:focus-visible:outline-offset-2"
            >
              {item}
              {last ? null : <Icon name="chevron-right" size={14} className="gx-breadcrumbs__separator flex-none text-faint" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
