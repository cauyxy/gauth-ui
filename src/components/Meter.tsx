import { cn } from '../core/cn'

/** Thin progress bar: ink fill on a light track. `value` is 0 to 100. */
export function Meter({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn('gx-meter block h-1 flex-none overflow-hidden rounded-full bg-track', className)}>
      <span className="gx-meter__fill block h-full rounded-full bg-ink" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </span>
  )
}
