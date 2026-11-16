'use client'

import { Popover as PopoverPrimitive } from 'radix-ui'
import { useId, useState } from 'react'
import { cn } from '../core/cn'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'
import type { Props } from '../core/props'
import { useControllable } from '../core/useControllable'
import { Calendar, datePickerTrigger, type DatePickerSize } from './DatePicker'
import { useField } from './Field'
import { PopoverContent } from './Popover'

export type DateRange = { from: Date; to: Date }
export type DateRangePickerProps = Props<
  'button',
  {
    value?: DateRange | null
    defaultValue?: DateRange | null
    onChange?: (value: DateRange) => void
    min?: Date
    max?: Date
    size?: DatePickerSize
    label?: string
    placeholder?: string
  },
  'children' | 'type'
>

/**
 * A first and a last day, picked one after the other from one calendar: a unit's weeks, the days a report covers.
 * The first click picks the start, the second the end (a day before the start becomes the start), then it closes and
 * `onChange` gets both. Closing after one click keeps the range it had. Inside a `Field` it takes its label, hint and
 * error from the Field; alone, `label` is its accessible name. `value` is the range the product keeps, `null` for none;
 * `defaultValue` when the field keeps its own. `className`, every other prop (`disabled`) and `ref` go to the button.
 */
export function DateRangePicker({
  value: kept,
  defaultValue = null,
  onChange,
  min,
  max,
  size = 'md',
  label,
  placeholder,
  className,
  ...props
}: DateRangePickerProps) {
  const { messages, formatDay } = useLocale()
  const field = useField()
  const [value, set] = useControllable<DateRange | null, DateRange>(kept, defaultValue, onChange)
  const [open, setOpen] = useState(false)
  /* The start picked so far, while the end is still to come. */
  const [start, setStart] = useState<Date | null>(null)
  const ownId = useId()
  const id = props.id ?? field?.id ?? ownId
  const valueId = `${id}-value`
  const shown = start ? { from: start, to: null } : (value ?? { from: null, to: null })

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        setStart(null)
      }}
    >
      <PopoverPrimitive.Trigger
        aria-label={field ? undefined : label}
        /* The name is the label and then the days, so a screen reader says both. */
        aria-labelledby={field ? `${field.labelId} ${valueId}` : label ? `${id} ${valueId}` : undefined}
        aria-describedby={field?.describedBy}
        aria-invalid={field?.invalid || undefined}
        {...props}
        id={id}
        className={cn('gx-date-range-picker', `gx-date-range-picker--${size}`, datePickerTrigger({ size }), className)}
      >
        <span id={valueId} className={cn('gx-date-range-picker__value truncate', !value && 'text-muted')}>
          {value ? `${formatDay(value.from)} – ${formatDay(value.to)}` : (placeholder ?? messages.pickDates)}
        </span>
        <Icon name="calendar" size={16} className="gx-date-range-picker__icon shrink-0" />
      </PopoverPrimitive.Trigger>
      <PopoverContent arrow={false} align="start" sideOffset={6} className="w-auto p-3" onOpenAutoFocus={(event) => event.preventDefault()}>
        <Calendar
          value={start ?? value?.from ?? null}
          range={shown}
          min={min}
          max={max}
          focusOnMount
          onChange={(day) => {
            if (!start) return setStart(day)
            set(day < start ? { from: day, to: start } : { from: start, to: day })
            setStart(null)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </PopoverPrimitive.Root>
  )
}
