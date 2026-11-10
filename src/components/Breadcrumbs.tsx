import { Children, isValidElement, type ReactNode } from 'react'
import { cx } from '../core/cx'
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
    <nav aria-label={messages.breadcrumb} className={cx('gx-breadcrumbs', className)}>
      <ol className="gx-breadcrumbs__list">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={i} aria-current={last && !isValidElement(item) ? 'page' : undefined} className="gx-breadcrumbs__item">
              {item}
              {last ? null : <Icon name="chevron-right" size={14} className="gx-breadcrumbs__separator" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
