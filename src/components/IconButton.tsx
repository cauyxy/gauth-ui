import type { ComponentProps } from 'react'
import { cx } from '../core/cx'

export type IconButtonVariant = 'ghost' | 'soft' | 'outline' | 'ink'
export type IconButtonSize = 'sm' | 'md' | 'lg' | 'xl'

/**
 * A button that shows only an icon. `label` is its name for a screen reader, so it is required.
 * `pressed` makes it a toggle (bold in a toolbar, a vote under a reply): leave it out for a plain action.
 */
export function IconButton({
  label,
  variant = 'ghost',
  size = 'md',
  pressed,
  type = 'button',
  className,
  ...props
}: Omit<ComponentProps<'button'>, 'aria-label' | 'aria-pressed'> & {
  label: string
  variant?: IconButtonVariant
  size?: IconButtonSize
  pressed?: boolean
}) {
  return <button type={type} aria-label={label} aria-pressed={pressed} className={cx('gx-icon-btn', `gx-icon-btn--${variant}`, `gx-icon-btn--${size}`, className)} {...props} />
}
