'use client'

import { useState } from 'react'
import { useLocale } from '../core/locale'
import type { Props } from '../core/props'
import { useControllable } from '../core/useControllable'
import { CalendarGrid, DateField, isoOf } from './DatePicker.parts'

export type DatePickerSize = 'sm' | 'md' | 'xl'
export type CalendarProps = Props<
  'div',
  {
    value?: Date | null
    defaultValue?: Date | null
    onChange?: (value: Date) => void
    min?: Date
    max?: Date
    /** Puts focus on the picked day when the calendar appears. */
    focusOnMount?: boolean
  },
  'children'
>
export type DatePickerProps = Props<
  'button',
  {
    value?: Date | null
    defaultValue?: Date | null
    onChange?: (value: Date) => void
    min?: Date
    max?: Date
    size?: DatePickerSize
    label?: string
    placeholder?: string
    /** Sends the day as YYYY-MM-DD with a form. */
    name?: string
  },
  'children' | 'type'
>

/**
 * A month of days to pick one from. `DatePicker` shows it in a popover; alone, it sits on the page.
 * Tab reaches the picked day (or today); the arrow keys move a day or a week, Home and End go to the week's ends,
 * Page Up and Page Down move a month (with Shift, a year). Days before `min` or after `max` cannot be picked.
 * `value` is the day the product keeps, `null` for none; `defaultValue` when the calendar keeps its own.
 */
export function Calendar(props: CalendarProps) {
  return <CalendarGrid {...props} />
}

/**
 * One day, picked from a calendar that opens under the field. The field shows the day as the product writes it
 * ("Fri, Oct 23"), or `placeholder` before one is picked. Inside a `Field` it takes its label, hint and error from the
 * Field; alone, `label` is its accessible name. `value` is the day the product keeps, `null` for none; `defaultValue`
 * when the field keeps its own. `className`, every other prop (`disabled`) and `ref` go to the button.
 */
export function DatePicker({ value: kept, defaultValue = null, onChange, min, max, size = 'md', placeholder, ...props }: DatePickerProps) {
  const { messages, formatDay } = useLocale()
  const [value, set] = useControllable<Date | null, Date>(kept, defaultValue, onChange)
  const [open, setOpen] = useState(false)
  return (
    <DateField
      root="gx-date-picker"
      size={size}
      text={value && formatDay(value)}
      placeholder={placeholder ?? messages.pickDate}
      formValue={value ? isoOf(value) : ''}
      open={open}
      onOpenChange={setOpen}
      {...props}
    >
      <CalendarGrid
        value={value}
        min={min}
        max={max}
        focusOnMount
        onChange={(date) => {
          set(date)
          setOpen(false)
        }}
      />
    </DateField>
  )
}
