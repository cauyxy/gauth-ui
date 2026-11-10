import type { ReactNode } from 'react'
import { cx } from '../core/cx'
import { useLocale } from '../core/locale'

/**
 * A bar for how far along something is. `value` is 0 to 100; leave it out when the end is not known, and a segment
 * sweeps across. `label` is its accessible name. `children` sit after the bar ("2 of 6", "Building").
 */
export function Progress({
  value,
  label,
  children,
  className,
}: {
  value?: number
  label?: string
  children?: ReactNode
  className?: string
}) {
  const { messages } = useLocale()
  const known = value !== undefined
  const width = known ? Math.min(100, Math.max(0, value)) : undefined
  return (
    <span className={cx('gx-progress', className)}>
      <span
        role="progressbar"
        aria-label={label ?? messages.loading}
        aria-valuemin={known ? 0 : undefined}
        aria-valuemax={known ? 100 : undefined}
        aria-valuenow={width}
        className="gx-progress__bar"
      >
        <span className={cx('gx-progress__fill', !known && 'gx-progress__fill--sweep')} style={known ? { width: `${width}%` } : undefined} />
      </span>
      {children ? <span className="gx-progress__text">{children}</span> : null}
    </span>
  )
}
