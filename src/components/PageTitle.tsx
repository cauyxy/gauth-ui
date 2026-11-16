import type { ReactNode } from 'react'
import { cn } from '../core/cn'
import type { Props } from '../core/props'

export type PageTitleProps = Props<'div', { title: string; crumbs?: ReactNode }>

/** The top of a staff page: where it sits, its name, and its actions at the end of the row. */
export function PageTitle({ title, crumbs, children, className, ...props }: PageTitleProps) {
  return (
    <div {...props} className={cn('gx-page-title flex flex-wrap items-end justify-between gap-3', className)}>
      <div className="gx-page-title__main grid min-w-0 gap-1">
        {crumbs}
        <h1 className="gx-page-title__heading text-2xl leading-title font-strong tracking-display text-balance text-ink">{title}</h1>
      </div>
      {children ? <div className="gx-page-title__actions flex flex-wrap items-center gap-2">{children}</div> : null}
    </div>
  )
}
