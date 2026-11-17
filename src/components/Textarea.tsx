'use client'

import { cva } from 'class-variance-authority'
import { cn } from '../core/cn'
import type { Props } from '../core/props'
import { fieldBox } from './Field.classes'
import { useField } from './Field'

export type TextareaSize = 'md' | 'xl'
export type TextareaProps = Props<
  'textarea',
  { size?: TextareaSize; label?: string; value?: string; defaultValue?: string; onChange?: (value: string) => void }
>

const textarea = cva(['gx-textarea block min-w-0 resize-y appearance-none bg-white shadow-edge-strong placeholder:text-muted disabled:resize-none', fieldBox], {
  variants: {
    /* xl has 16px text, so a phone does not zoom in on focus. The line height comes after the type size: `cn` drops one that comes before it. */
    size: {
      md: 'gx-textarea--md min-h-(--gx-h-md) rounded-lg px-3 py-2 text-sm leading-body',
      xl: 'gx-textarea--xl min-h-(--gx-h-xl) rounded-2xl px-4 py-2.5 text-base leading-body',
    },
  },
})

/** Several lines of text, in the same box as `Input`. It grows downward only. Inside a `Field` it takes its label, hint and error from the Field; alone, `label` is its accessible name. */
export function Textarea({ size = 'md', rows = 3, label, onChange, className, ...props }: TextareaProps) {
  const field = useField(label, props.id)
  return (
    <textarea
      {...field.props}
      rows={rows}
      {...props}
      onChange={onChange && ((event) => onChange(event.target.value))}
      className={cn(textarea({ size }), className)}
    />
  )
}
