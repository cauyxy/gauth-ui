import type { ReactNode } from 'react'
import { cx } from '../core/cx'

/** Big number under a small caption. */
export function Stat({ value, label, sub, className }: { value: ReactNode; label: ReactNode; sub?: ReactNode; className?: string }) {
  return (
    <div className={cx('gx-stat', className)}>
      <span className="gx-stat__label">{label}</span>
      <span className="gx-stat__value">{value}</span>
      {sub ? <span className="gx-stat__sub">{sub}</span> : null}
    </div>
  )
}
