import { cx } from '../core/cx'

/** Thin progress bar: ink fill on a light track. `value` is 0 to 100. */
export function Meter({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cx('gx-meter', className)}>
      <span className="gx-meter__fill" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </span>
  )
}
