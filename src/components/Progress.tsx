import type { ReactNode } from 'react'
import { cn } from '../core/cn'
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
    <span className={cn('gx-progress flex min-w-0 items-center gap-3.5', className)}>
      <span
        role="progressbar"
        aria-label={label ?? messages.loading}
        aria-valuemin={known ? 0 : undefined}
        aria-valuemax={known ? 100 : undefined}
        aria-valuenow={width}
        className="gx-progress__bar relative block h-[6px] flex-1 overflow-hidden rounded-full bg-track"
      >
        {/* The end is not known: a segment sweeps. With reduced motion it rests in the middle of the bar. */}
        <span
          className={cn(
            'gx-progress__fill block h-full rounded-[inherit] bg-ink transition-[width] duration-(--gx-dur-base) ease-standard',
            !known && 'gx-progress__fill--sweep absolute top-0 bottom-0 left-[33%] w-[33%] animate-sweep',
          )}
          style={known ? { width: `${width}%` } : undefined}
        />
      </span>
      {children ? <span className="gx-progress__text flex-none text-sm font-control whitespace-nowrap text-muted">{children}</span> : null}
    </span>
  )
}
