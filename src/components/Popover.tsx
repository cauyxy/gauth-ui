import { Popover as PopoverPrimitive } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cn } from '../core/cn'

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
        className={cn(
          'gx-popover z-(--gx-z-pop) max-h-(--radix-popover-content-available-height) w-[min(420px,calc(100vw-32px))] origin-(--radix-popover-content-transform-origin) overflow-y-auto rounded-3xl bg-white p-5 shadow-pop outline-none data-[state=open]:animate-pop-in data-[state=closed]:animate-pop-out',
          className,
        )}
        {...props}
      >
        {children}
        {arrow ? <PopoverPrimitive.Arrow width={18} height={9} className="gx-popover__arrow fill-white [filter:drop-shadow(0_1px_0_var(--gx-color-edge))]" /> : null}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}
