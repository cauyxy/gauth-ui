import { Popover as PopoverPrimitive } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cx } from '../core/cx'

/** A panel that floats next to what opened it, flips to stay on screen, and closes on Escape or a click outside. */
export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger
export const PopoverAnchor = PopoverPrimitive.Anchor

export function PopoverContent({
  className,
  sideOffset = 10,
  collisionPadding = 16,
  arrow = true,
  children,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Content> & { arrow?: boolean }) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cx('gx-popover', className)}
        {...props}
      >
        {children}
        {arrow ? <PopoverPrimitive.Arrow width={18} height={9} className="gx-popover__arrow" /> : null}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}
