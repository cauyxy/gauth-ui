'use client'

import { cva } from 'class-variance-authority'
import { cn } from '../core/cn'
import { Icon } from '../core/Icon'
import type { Props } from '../core/props'
import { fieldBox } from './Field.classes'
import { useField } from './Field'

export type InputSize = 'md' | 'xl'
export type InputVariant = 'outline' | 'search'
export type InputProps = Props<
  'input',
  { size?: InputSize; variant?: InputVariant; label?: string; value?: string; defaultValue?: string; onChange?: (value: string) => void }
>

const control = cva(['gx-input__control block appearance-none placeholder:text-muted', fieldBox], {
  variants: {
    /* xl has 16px text, so a phone does not zoom in on focus. */
    size: {
      md: 'h-(--gx-h-md) rounded-lg text-sm',
      xl: 'h-(--gx-h-xl) rounded-2xl text-base',
    },
    variant: {
      outline: 'bg-white shadow-edge-strong',
      search: 'bg-surface',
    },
  },
  compoundVariants: [
    { size: 'md', variant: 'outline', class: 'px-3' },
    { size: 'xl', variant: 'outline', class: 'px-4' },
    { size: 'md', variant: 'search', class: 'ps-8 pe-3' },
    { size: 'xl', variant: 'search', class: 'ps-10 pe-4' },
  ],
})
const icon = cva('gx-input__icon pointer-events-none absolute inset-y-0 my-auto text-muted', {
  variants: { size: { md: 'start-2.5', xl: 'start-3.5' } },
})

/**
 * One line of text. `search` has a grey ground and the search icon at its start. Inside a `Field` it takes its label,
 * hint and error from the Field; alone, `label` is its accessible name. `value` is the text the product keeps;
 * `defaultValue` when the field keeps its own. `className` goes to the wrapper, every other prop and `ref` to the `<input>`.
 */
export function Input({ size = 'md', variant = 'outline', label, onChange, className, ...props }: InputProps) {
  const field = useField(label, props.id)
  return (
    <span className={cn('gx-input relative block min-w-0', `gx-input--${size}`, `gx-input--${variant}`, className)}>
      {variant === 'search' ? <Icon name="search" size={size === 'xl' ? 18 : 16} className={icon({ size })} /> : null}
      <input {...field.props} {...props} onChange={onChange && ((event) => onChange(event.target.value))} className={control({ size, variant })} />
    </span>
  )
}
