import type { ComponentProps } from 'react'
import { cx } from '../core/cx'
import { Icon } from '../core/Icon'
import { useField } from './Field'

export type SelectSize = 'sm' | 'md' | 'xl'
export type SelectOption<T extends string> = { value: T; label: string }

/**
 * One choice from a list, with the browser's own menu. Inside a `Field` it takes its label, hint and error from the
 * Field; alone, `label` is its accessible name. `className` goes to the wrapper, every other prop to the `<select>`.
 */
export function Select<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
  label,
  className,
  ...props
}: Omit<ComponentProps<'select'>, 'size' | 'onChange' | 'value' | 'children' | 'multiple'> & {
  options: readonly SelectOption<T>[]
  value: T
  onChange: (value: T) => void
  size?: SelectSize
  label?: string
}) {
  const field = useField()
  return (
    <span className={cx('gx-select', `gx-select--${size}`, className)}>
      <select
        id={field?.id}
        aria-describedby={field?.describedBy}
        aria-invalid={field?.invalid || undefined}
        aria-label={label}
        {...props}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="gx-select__control"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Icon name="chevron-down" size={16} className="gx-select__icon" />
    </span>
  )
}
