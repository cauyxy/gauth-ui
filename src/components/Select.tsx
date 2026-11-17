'use client'

import { cva } from 'class-variance-authority'
import { cn } from '../core/cn'
import { Icon } from '../core/Icon'
import type { Props } from '../core/props'
import { fieldBox } from './Field.classes'
import { useField } from './Field'

export type SelectSize = 'sm' | 'md' | 'xl'
export type SelectOption<T extends string = string> = { value: T; label: string }
export type SelectProps<T extends string = string> = Props<
  'select',
  { options: readonly SelectOption<T>[]; value?: T; defaultValue?: T; onChange?: (value: T) => void; size?: SelectSize; label?: string },
  'children' | 'multiple'
>

const control = cva(
  ['gx-select__control peer block cursor-pointer appearance-none bg-white font-control text-ellipsis shadow-edge-strong disabled:cursor-default', fieldBox],
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
 * Field; alone, `label` is its accessible name. `value` is the choice the product keeps; `defaultValue` when the select
 * keeps its own. `className` goes to the wrapper, every other prop and `ref` to the `<select>`.
 */
export function Select<T extends string>({ options, onChange, size = 'md', label, className, ...props }: SelectProps<T>) {
  const field = useField(label, props.id)
  return (
    <span className={cn('gx-select relative block min-w-0', `gx-select--${size}`, className)}>
      <select {...field.props} {...props} onChange={onChange && ((event) => onChange(event.target.value as T))} className={control({ size })}>
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
