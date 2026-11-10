import type { ReactNode } from 'react'
import { cn } from '../core/cn'

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
    <div className={cn('gx-empty-state flex flex-col items-center gap-1.5 px-6 py-8 text-center', className)}>
      {icon ? <span className="gx-empty-state__icon mb-1.5 grid place-items-center text-muted">{icon}</span> : null}
      <p className="gx-empty-state__title max-w-[20rem] text-base leading-heading font-title text-balance text-ink">{title}</p>
      {description ? <p className="gx-empty-state__description max-w-[20rem] text-sm leading-body text-pretty text-muted">{description}</p> : null}
      {action ? <div className="gx-empty-state__action mt-2.5">{action}</div> : null}
    </div>
  )
}
