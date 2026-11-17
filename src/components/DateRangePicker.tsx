'use client'

import { useState } from 'react'
import { useLocale } from '../core/locale'
import type { Props } from '../core/props'
import { useControllable } from '../core/useControllable'
import type { DatePickerSize } from './DatePicker'
import { CalendarGrid, DateField, isoOf } from './DatePicker.parts'

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
    /** Sends the range as YYYY-MM-DD/YYYY-MM-DD with a form. */
    name?: string
  },
  'children' | 'type'
>

/**
 * A first and a last day, picked one after the other from one calendar: a unit's weeks, the days a report covers.
 * The first click picks the start, the second the end (a day before the start becomes the start), then it closes and
 * `onChange` gets both. Closing after one click keeps the range it had. Inside a `Field` it takes its label, hint and
 * error from the Field; alone, `label` is its accessible name. `value` is the range the product keeps, `null` for none;
 * `defaultValue` when the field keeps its own. With `name` a form gets the range as `2026-11-02/2026-11-13`: both days as
 * YYYY-MM-DD, joined by a slash (an ISO 8601 interval). `className`, every other prop (`disabled`) and `ref` go to the button.
 */
export function DateRangePicker({ value: kept, defaultValue = null, onChange, min, max, size = 'md', placeholder, ...props }: DateRangePickerProps) {
  const { messages, formatDay } = useLocale()
  const [value, set] = useControllable<DateRange | null, DateRange>(kept, defaultValue, onChange)
  const [open, setOpen] = useState(false)
  /* The start picked so far, while the end is still to come. */
  const [start, setStart] = useState<Date | null>(null)
  const shown = start ? { from: start, to: null } : (value ?? { from: null, to: null })
  return (
    <DateField
      root="gx-date-range-picker"
      size={size}
      text={value && `${formatDay(value.from)} – ${formatDay(value.to)}`}
      placeholder={placeholder ?? messages.pickDates}
      formValue={value ? `${isoOf(value.from)}/${isoOf(value.to)}` : ''}
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        setStart(null)
      }}
      {...props}
    >
      <CalendarGrid
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
    </DateField>
  )
}
