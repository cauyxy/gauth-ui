import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'
import type { ReactNode } from 'react'
import { cn } from '../core/cn'

export type RadioOption<T extends string> = { value: T; label: ReactNode; description?: ReactNode; disabled?: boolean }

/**
 * One choice from a short list, each option on its own line with room for a second line. `label` is the group's
 * accessible name. It is one Tab stop: the arrow keys move the pick. `onChange` gets the new value.
 */
export function RadioGroup<T extends string>({
  value,
  options,
  onChange,
  label,
  orientation = 'vertical',
  disabled,
  name,
  className,
}: {
  value: T | null
  options: readonly RadioOption<T>[]
  onChange: (value: T) => void
  label: string
  orientation?: 'vertical' | 'horizontal'
  disabled?: boolean
  /** Sends the value with a form. */
  name?: string
  className?: string
}) {
  return (
    <RadioGroupPrimitive.Root
      value={value ?? ''}
      onValueChange={(next) => onChange(next as T)}
      aria-label={label}
      orientation={orientation}
      disabled={disabled}
      name={name}
      className={cn(
        'gx-radio-group flex',
        orientation === 'vertical' ? 'gx-radio-group--vertical flex-col gap-3' : 'gx-radio-group--horizontal flex-wrap gap-x-5 gap-y-3',
        className,
      )}
    >
      {options.map((o) => (
        <label
          key={o.value}
          className="gx-radio-group__option inline-flex min-w-0 cursor-pointer items-start gap-2.5 text-sm has-disabled:cursor-default has-disabled:opacity-50"
        >
          {/* The circle sits on the first line of the text, also when the text wraps. Picked is an ink circle with a white dot, the look of a checked box. */}
          <RadioGroupPrimitive.Item
            value={o.value}
            disabled={o.disabled}
            className="gx-radio-group__circle grid size-[18px] flex-none cursor-[inherit] place-items-center my-[calc((1lh-18px)/2)] rounded-full shadow-box outline-0 transition-[background-color,box-shadow] duration-(--gx-dur-fast) ease-standard focus-visible:focus-ring focus-visible:outline-offset-2 aria-checked:bg-ink aria-checked:shadow-none"
          >
            <RadioGroupPrimitive.Indicator className="gx-radio-group__dot size-[6px] rounded-full bg-white" />
          </RadioGroupPrimitive.Item>
          <span className="gx-radio-group__text flex min-w-0 flex-col gap-0.5">
            <span className="gx-radio-group__label">{o.label}</span>
            {o.description ? <span className="gx-radio-group__description text-xs text-pretty text-muted">{o.description}</span> : null}
          </span>
        </label>
      ))}
    </RadioGroupPrimitive.Root>
  )
}
