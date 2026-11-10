import type { ComponentProps, ReactNode } from 'react'
import { cx } from '../core/cx'

/** White card with the hairline edge used across staff pages. */
export function Panel({ className, ...props }: ComponentProps<'section'>) {
  return <section className={cx('gx-panel', className)} {...props} />
}

/** The title bar of a Panel, with its actions on the right. */
export function PanelHeader({ title, children, className }: { title: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <div className={cx('gx-panel__header', className)}>
      <h2 className="gx-panel__title">{title}</h2>
      {children ? <span className="gx-panel__actions">{children}</span> : null}
    </div>
  )
}
