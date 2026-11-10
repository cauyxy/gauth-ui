import { cn } from '../core/cn'

/** A small round mark. `color` is a token (`var(--gx-color-good)`); `size` is in pixels. */
export function Dot({ color, size = 6, className }: { color?: string; size?: number; className?: string }) {
  return <span className={cn('gx-dot block flex-none rounded-full bg-ring', className)} style={{ width: size, height: size, background: color }} />
}
