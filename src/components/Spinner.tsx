import { cx } from '../core/cx'
import { useLocale } from '../core/locale'

/** A turning ring: one action is in progress. `size` is in pixels. `label` is its accessible name ("Loading" by default). */
export function Spinner({ size = 18, label, className }: { size?: number; label?: string; className?: string }) {
  const { messages } = useLocale()
  return <span role="status" aria-label={label ?? messages.loading} className={cx('gx-spinner', className)} style={{ width: size, height: size }} />
}
