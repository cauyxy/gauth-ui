import { cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../core/cn'
import { Icon } from '../core/Icon'
import { useField } from './Field'

export type SelectSize = 'sm' | 'md' | 'xl'
export type SelectOption<T extends string> = { value: T; label: string }

/* An error is an attempted outline on the attempted-soft ground, the look of "Not yet". The Field's error text says what is wrong. */
const control = cva(
  'gx-select__control peer block w-full cursor-pointer appearance-none bg-white font-control text-ellipsis text-ink shadow-edge-strong outline-0 transition-[background-color,box-shadow] duration-(--gx-dur-fast) ease-standard focus-visible:focus-ring focus-visible:outline-offset-1 disabled:cursor-default disabled:opacity-50 aria-invalid:bg-attempted-soft aria-invalid:shadow-invalid',
  {
    variants: {
      /* sm is for a dense filter row: as high as a small button or a ChipToggle. xl has 16px text, so a phone does not zoom in on focus. */
      size: {
        sm: 'h-(--gx-h-sm) rounded-lg ps-2.5 pe-[calc(var(--gx-space-3-5)*2)] text-sm',
        md: 'h-(--gx-h-md) rounded-lg ps-3 pe-8 text-sm',
        xl: 'h-(--gx-h-xl) rounded-2xl ps-4 pe-10 text-base',
      },
    },
  },
)
/* The chevron's strokes end where the text starts at the other side: 10, 12 and 16px from the edge. */
const icon = cva('gx-select__icon pointer-events-none absolute inset-y-0 my-auto peer-disabled:opacity-50', {
  variants: {
    size: {
      sm: 'end-[calc(var(--gx-space-2)-1px)]',
      md: 'end-[calc(var(--gx-space-2-5)-1px)]',
      xl: 'end-[calc(var(--gx-space-3-5)-1px)]',
    },
  },
})

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
    <span className={cn('gx-select relative block min-w-0', `gx-select--${size}`, className)}>
      <select
        id={field?.id}
        aria-describedby={field?.describedBy}
        aria-invalid={field?.invalid || undefined}
        aria-label={label}
        {...props}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className={control({ size })}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Icon name="chevron-down" size={16} className={icon({ size })} />
    </span>
  )
}
