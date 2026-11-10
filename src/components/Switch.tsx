import type { ComponentProps } from 'react'
import { cx } from '../core/cx'

/** 34×20 switch: ink when on, grey when off. `label` is its accessible name. */
export function Switch({
  checked,
  onChange,
  label,
  className,
  ...props
}: Omit<ComponentProps<'button'>, 'onChange' | 'onClick' | 'children'> & {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      {...props}
      onClick={() => onChange(!checked)}
      className={cx('gx-switch', className)}
    >
      <span className="gx-switch__thumb" />
    </button>
  )
}
