import type { ComponentProps } from 'react'
import { cx } from '../core/cx'
import { Icon } from '../core/Icon'
import { useField } from './Field'

export type InputSize = 'md' | 'xl'
export type InputVariant = 'outline' | 'search'

/**
 * One line of text. `search` has a grey ground and the search icon at its start. Inside a `Field` it takes its label,
 * hint and error from the Field; alone, `label` is its accessible name. `className` goes to the wrapper, every other prop to the `<input>`.
 */
export function Input({
  size = 'md',
  variant = 'outline',
  label,
  onChange,
  className,
  ...props
}: Omit<ComponentProps<'input'>, 'size' | 'onChange' | 'value'> & {
  size?: InputSize
  variant?: InputVariant
  label?: string
  value?: string
  onChange?: (value: string) => void
}) {
  const field = useField()
  return (
    <span className={cx('gx-input', `gx-input--${size}`, `gx-input--${variant}`, className)}>
      {variant === 'search' ? <Icon name="search" size={size === 'xl' ? 18 : 16} className="gx-input__icon" /> : null}
      <input
        id={field?.id}
        aria-describedby={field?.describedBy}
        aria-invalid={field?.invalid || undefined}
        aria-label={label}
        {...props}
        onChange={onChange && ((event) => onChange(event.target.value))}
        className="gx-input__control"
      />
    </span>
  )
}
