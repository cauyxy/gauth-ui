import type { ReactNode } from 'react'
import { cx } from '../core/cx'

/** The top of a staff page: where it sits, its name, and its actions at the end of the row. */
export function PageTitle({
  title,
  crumbs,
  children,
  className,
}: {
  title: string
  crumbs?: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={cx('gx-page-title', className)}>
      <div className="gx-page-title__main">
        {crumbs}
        <h1 className="gx-page-title__heading">{title}</h1>
      </div>
      {children ? <div className="gx-page-title__actions">{children}</div> : null}
    </div>
  )
}
