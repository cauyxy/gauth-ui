import { cn } from '../core/cn'
import type { Props } from '../core/props'

export type MeterProps = Props<'span', { value: number }, 'children'>

/** Thin progress bar: ink fill on a light track. `value` is 0 to 100. */
export function Meter({ value, className, ...props }: MeterProps) {
  return (
    <span {...props} className={cn('gx-meter block h-1 flex-none overflow-hidden rounded-full bg-track', className)}>
      <span className="gx-meter__fill block h-full rounded-full bg-ink" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </span>
  )
}
