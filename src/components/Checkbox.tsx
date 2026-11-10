import type { ReactNode } from 'react'
import { cx } from '../core/cx'
import { Icon } from '../core/Icon'

/**
 * A yes or no for one item of a list. `children` are its visible text; with none, `label` is its accessible name.
 * The native checkbox stays in the page under an 18px box, so the keyboard and a form work as usual.
 */
export function Checkbox({
  checked,
  onChange,
  label,
  children,
  disabled,
  className,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  children?: ReactNode
  disabled?: boolean
  className?: string
}) {
  const Root = children ? 'label' : 'span'
  return (
    <Root className={cx('gx-checkbox', className)}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-label={label}
        onChange={(event) => onChange(event.target.checked)}
        className="gx-checkbox__input"
      />
      <span className="gx-checkbox__box">
        <Icon name="check" size={14} strokeWidth={2.6} />
      </span>
      {children ? <span className="gx-checkbox__text">{children}</span> : null}
    </Root>
  )
}
