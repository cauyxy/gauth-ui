'use client'

import { cn } from '../core/cn'
import { useLocale } from '../core/locale'
import type { Props } from '../core/props'

export type SpinnerProps = Props<'span', { size?: number; label?: string }, 'children'>

/**
 * A turning ring: one action is in progress. `size` is in pixels. `label` is its accessible name ("Loading" by default).
 * With reduced motion the ring stands still: three quarters of a ring still reads as "working".
 */
export function Spinner({ size = 18, label, className, style, ...props }: SpinnerProps) {
  const { messages } = useLocale()
  return (
    <span
      role="status"
      aria-label={label ?? messages.loading}
      {...props}
      className={cn('gx-spinner block flex-none animate-spin rounded-full border-2 border-track border-t-ink', className)}
      style={{ width: size, height: size, ...style }}
    />
  )
}
