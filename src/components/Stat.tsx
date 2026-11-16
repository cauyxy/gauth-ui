import type { ReactNode } from 'react'
import { cn } from '../core/cn'
import type { Props } from '../core/props'

export type StatProps = Props<'div', { value: ReactNode; label: ReactNode; sub?: ReactNode }, 'children'>

/** Big number under a small caption. */
export function Stat({ value, label, sub, className, ...props }: StatProps) {
  return (
    <div {...props} className={cn('gx-stat flex flex-col gap-1.5', className)}>
      <span className="gx-stat__label text-sm text-muted">{label}</span>
      <span className="gx-stat__value text-3xl leading-figure font-strong tracking-display tabular-nums">{value}</span>
      {sub ? <span className="gx-stat__sub text-xs text-muted">{sub}</span> : null}
    </div>
  )
}
