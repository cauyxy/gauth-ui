import { DropdownMenu as MenuPrimitive } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cn } from '../core/cn'

export type MenuContentProps = ComponentProps<typeof MenuPrimitive.Content>
export type MenuItemProps = ComponentProps<typeof MenuPrimitive.Item>
export type MenuSeparatorProps = ComponentProps<typeof MenuPrimitive.Separator>

/** A short list of actions that opens from a button. The arrow keys move, typing a letter jumps, Escape closes. */
export const Menu = MenuPrimitive.Root
export const MenuTrigger = MenuPrimitive.Trigger

export function MenuContent({ className, sideOffset = 6, align = 'start', collisionPadding = 16, ...props }: MenuContentProps) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        sideOffset={sideOffset}
        align={align}
        collisionPadding={collisionPadding}
        className={cn(
          'gx-menu group/menu z-(--gx-z-pop) max-h-(--radix-dropdown-menu-content-available-height) max-w-[min(20rem,calc(100vw-2*var(--gx-space-4)))] min-w-[220px] origin-(--radix-dropdown-menu-content-transform-origin) overflow-y-auto rounded-xl bg-white p-1.5 text-sm text-ink shadow-pop outline-none data-[state=open]:animate-pop-in data-[state=closed]:animate-pop-out',
          className,
        )}
        {...props}
      />
    </MenuPrimitive.Portal>
  )
}

/**
 * One action. `onSelect` runs on a click or on Enter, then the menu closes.
 * It is 34px for one line; a long label wraps and the row grows. Radix moves focus to the row under the pointer, and a
 * browser can count that as keyboard focus: the ring is for the arrow keys, so it is off while the pointer is on the menu.
 */
export function MenuItem({ className, ...props }: MenuItemProps) {
  return (
    <MenuPrimitive.Item
      className={cn(
        'gx-menu__item flex min-h-(--gx-h-md) cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 leading-heading font-control outline-0 select-none focus-visible:focus-ring focus-visible:outline-offset-1 group-hover/menu:focus-visible:outline-none data-[disabled]:pointer-events-none data-[disabled]:cursor-default data-[disabled]:text-muted data-[highlighted]:bg-surface',
        className,
      )}
      {...props}
    />
  )
}

export function MenuSeparator({ className, ...props }: MenuSeparatorProps) {
  return <MenuPrimitive.Separator className={cn('gx-menu__separator my-1.5 h-px bg-line', className)} {...props} />
}
