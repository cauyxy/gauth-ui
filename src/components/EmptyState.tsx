import type { ReactNode } from 'react'
import { cx } from '../core/cx'

/** What a list, a page or a panel shows when it has nothing yet: what is true now, then one action. */
export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: {
  title: string
  description?: ReactNode
  action?: ReactNode
  icon?: ReactNode
  className?: string
}) {
  return (
    <div className={cx('gx-empty-state', className)}>
      {icon ? <span className="gx-empty-state__icon">{icon}</span> : null}
      <p className="gx-empty-state__title">{title}</p>
      {description ? <p className="gx-empty-state__description">{description}</p> : null}
      {action ? <div className="gx-empty-state__action">{action}</div> : null}
    </div>
  )
}
