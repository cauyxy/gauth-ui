import type { ReactNode } from 'react'
import { cx } from '../core/cx'

/** A line icon on a neutral square, for staff pages. `size` is in pixels. */
export function IconBox({ size = 32, className, children }: { size?: number; className?: string; children: ReactNode }) {
  return (
    <span className={cx('gx-icon-box', className)} style={{ width: size, height: size }}>
      {children}
    </span>
  )
}
