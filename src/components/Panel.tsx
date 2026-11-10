import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../core/cn'

/** White card with the hairline edge used across staff pages. */
export function Panel({ className, ...props }: ComponentProps<'section'>) {
  return <section className={cn('gx-panel flex flex-col rounded-2xl bg-white shadow-edge', className)} {...props} />
}

/** The title bar of a Panel, with its actions on the right. */
export function PanelHeader({ title, children, className }: { title: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <div className={cn('gx-panel__header flex min-h-[64px] flex-wrap items-center justify-between gap-3 px-5 py-4', className)}>
      <h2 className="gx-panel__title text-lg leading-heading font-title tracking-title text-balance text-ink">{title}</h2>
      {children ? <span className="gx-panel__actions flex items-center gap-2">{children}</span> : null}
    </div>
  )
}
