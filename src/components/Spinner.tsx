import { cn } from '../core/cn'
import { useLocale } from '../core/locale'

/**
 * A turning ring: one action is in progress. `size` is in pixels. `label` is its accessible name ("Loading" by default).
 * With reduced motion the ring stands still: three quarters of a ring still reads as "working".
 */
export function Spinner({ size = 18, label, className }: { size?: number; label?: string; className?: string }) {
  const { messages } = useLocale()
  return (
    <span
      role="status"
      aria-label={label ?? messages.loading}
      className={cn('gx-spinner block flex-none animate-spin rounded-full border-2 border-track border-t-ink', className)}
      style={{ width: size, height: size }}
    />
  )
}
