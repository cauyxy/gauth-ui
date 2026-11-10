import type { ComponentProps } from 'react'
import { cx } from '../core/cx'
import { useField } from './Field'

export type TextareaSize = 'md' | 'xl'

/** Several lines of text, in the same box as `Input`. It grows downward only. Inside a `Field` it takes its label, hint and error from the Field; alone, `label` is its accessible name. */
export function Textarea({
  size = 'md',
  rows = 3,
  label,
  onChange,
  className,
  ...props
}: Omit<ComponentProps<'textarea'>, 'onChange' | 'value'> & {
  size?: TextareaSize
  label?: string
  value?: string
  onChange?: (value: string) => void
}) {
  const field = useField()
  return (
    <textarea
      id={field?.id}
      aria-describedby={field?.describedBy}
      aria-invalid={field?.invalid || undefined}
      aria-label={label}
      rows={rows}
      {...props}
      onChange={onChange && ((event) => onChange(event.target.value))}
      className={cx('gx-textarea', `gx-textarea--${size}`, className)}
    />
  )
}
