import { cn } from '../core/cn'
import type { Props } from '../core/props'

export type DotProps = Props<'span', { color?: string; size?: number }, 'children'>

/** A small round mark. `color` is a token (`var(--gx-color-good)`); `size` is in pixels. */
export function Dot({ color, size = 6, className, style, ...props }: DotProps) {
  return (
    <span
      {...props}
      className={cn('gx-dot block flex-none rounded-full bg-ring', className)}
      style={{ width: size, height: size, background: color, ...style }}
    />
  )
}
