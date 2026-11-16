import { Separator as SeparatorPrimitive } from 'radix-ui'
import { cn } from '../core/cn'
import type { Props } from '../core/props'

export type SeparatorProps = Props<typeof SeparatorPrimitive.Root, object, 'children' | 'asChild'>

/**
 * A 1px `line` between two groups of content: rows of a menu, parts of a panel, items of a toolbar. `vertical` stands
 * between items of a row and takes the row's height. It is decoration unless `decorative={false}`, when it is a separator for a screen reader.
 */
export function Separator({ orientation = 'horizontal', decorative = true, className, ...props }: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      {...props}
      orientation={orientation}
      decorative={decorative}
      className={cn(
        'gx-separator flex-none bg-line',
        orientation === 'horizontal' ? 'gx-separator--horizontal h-px w-full' : 'gx-separator--vertical w-px self-stretch',
        className,
      )}
    />
  )
}
