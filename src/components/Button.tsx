import { Slot } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cx } from '../core/cx'

export type ButtonVariant = 'ink' | 'soft' | 'outline' | 'ghost' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

/** The button look as a class string, for a link or another element that must look like a button. */
export const buttonClass = ({ variant = 'ink', size = 'md' }: { variant?: ButtonVariant; size?: ButtonSize } = {}, className?: string) =>
  cx('gx-btn', `gx-btn--${variant}`, `gx-btn--${size}`, className)

/** The one way to act on a row, card or page. `asChild` puts the look on the child element (a link). */
export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ComponentProps<'button'> & { variant?: ButtonVariant; size?: ButtonSize; asChild?: boolean }) {
  const classes = buttonClass({ variant, size }, className)
  if (asChild) return <Slot.Root className={classes} {...props} />
  return <button type="button" className={classes} {...props} />
}
