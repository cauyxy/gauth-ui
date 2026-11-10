import { DropdownMenu as MenuPrimitive } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cx } from '../core/cx'

/** A short list of actions that opens from a button. The arrow keys move, typing a letter jumps, Escape closes. */
export const Menu = MenuPrimitive.Root
export const MenuTrigger = MenuPrimitive.Trigger

export function MenuContent({ className, sideOffset = 6, align = 'start', collisionPadding = 16, ...props }: ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        sideOffset={sideOffset}
        align={align}
        collisionPadding={collisionPadding}
        className={cx('gx-menu', className)}
        {...props}
      />
    </MenuPrimitive.Portal>
  )
}

/** One action. `onSelect` runs on a click or on Enter, then the menu closes. */
export function MenuItem({ className, ...props }: ComponentProps<typeof MenuPrimitive.Item>) {
  return <MenuPrimitive.Item className={cx('gx-menu__item', className)} {...props} />
}

export function MenuSeparator({ className, ...props }: ComponentProps<typeof MenuPrimitive.Separator>) {
  return <MenuPrimitive.Separator className={cx('gx-menu__separator', className)} {...props} />
}
