import type { ComponentProps } from 'react'
import { cx } from '../core/cx'

/**
 * A chip to press: a filter, a skill to pick. On, it stays white and gets the ink ring.
 * A set of them goes in the product's own `role="group"` with a name.
 */
export function ChipToggle({
  pressed,
  onChange,
  size = 'sm',
  className,
  ...props
}: Omit<ComponentProps<'button'>, 'onChange' | 'onClick' | 'aria-pressed'> & {
  pressed: boolean
  onChange: (pressed: boolean) => void
  size?: 'sm' | 'md'
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      {...props}
      onClick={() => onChange(!pressed)}
      className={cx('gx-chip-toggle', `gx-chip-toggle--${size}`, className)}
    />
  )
}
