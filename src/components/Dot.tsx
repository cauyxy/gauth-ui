import { cx } from '../core/cx'

/** A small round mark. `color` is a token (`var(--gx-color-good)`); `size` is in pixels. */
export function Dot({ color, size = 6, className }: { color?: string; size?: number; className?: string }) {
  return <span className={cx('gx-dot', className)} style={{ width: size, height: size, background: color }} />
}
