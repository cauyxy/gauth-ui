import type { ReactNode } from 'react'
import { cn } from '../core/cn'

/** A line icon on a neutral square, for staff pages. `size` is in pixels. */
export function IconBox({ size = 32, className, children }: { size?: number; className?: string; children: ReactNode }) {
  return (
    <span className={cn('gx-icon-box grid flex-none place-items-center rounded-lg bg-surface text-ink', className)} style={{ width: size, height: size }}>
      {children}
    </span>
  )
}
