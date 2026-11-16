'use client'

import { cva } from 'class-variance-authority'
import { Popover as PopoverPrimitive } from 'radix-ui'
import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { cn } from '../core/cn'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'
import type { Props } from '../core/props'
import { useControllable } from '../core/useControllable'
import { useField } from './Field'
import { IconButton } from './IconButton'
import { PopoverContent } from './Popover'

export type DatePickerSize = 'sm' | 'md' | 'xl'
export type CalendarProps = Props<
  'div',
  {
    value?: Date | null
    defaultValue?: Date | null
    onChange?: (value: Date) => void
    /** Marks the days from `from` to `to` as picked, for `DateRangePicker`. `value` is then the day the calendar opens on. */
    range?: { from: Date | null; to: Date | null }
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

/* A day is a local date at midnight: the time of a Date is never read. */
const dayOf = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
const addDays = (date: Date, n: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + n)
const sameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
/** The same day of another month, or that month's last day when it is shorter. */
function addMonths(date: Date, n: number) {
  const last = new Date(date.getFullYear(), date.getMonth() + n + 1, 0).getDate()
  return new Date(date.getFullYear(), date.getMonth() + n, Math.min(date.getDate(), last))
}
function clamp(date: Date, min?: Date, max?: Date) {
  if (min && date < dayOf(min)) return dayOf(min)
  if (max && date > dayOf(max)) return dayOf(max)
  return date
}
/** The weeks of a month, Sunday first as in the US, with null for the days of the months around it. */
function weeksOf(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const cells: (Date | null)[] = [...Array<null>(first.getDay()).fill(null)]
  for (let d = 1; d <= days; d++) cells.push(new Date(month.getFullYear(), month.getMonth(), d))
  while (cells.length % 7) cells.push(null)
  return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7))
}
/* 1 January 2023 was a Sunday: the seven days from it name the columns. */
const WEEK = Array.from({ length: 7 }, (_, i) => new Date(2023, 0, 1 + i))

/*
 * The picked day is ink with white text, the way a picked item is ink everywhere; today has the control outline, so
 * it has a shape and not only a color. In a range, its two ends are picked days and the days between are on `surface`.
 * The hover of each state is written for it, so it wins over the plain hover.
 */
const day =
  'gx-calendar__day grid size-(--gx-h-md) cursor-pointer place-items-center rounded-lg text-sm text-ink tabular-nums outline-0 transition-colors duration-(--gx-dur-fast) ease-standard enabled:hover:bg-surface focus-visible:focus-ring focus-visible:outline-offset-1 disabled:cursor-default disabled:opacity-50 aria-[current=date]:shadow-edge-strong group-data-[edge]:bg-ink group-data-[edge]:font-control group-data-[edge]:text-white group-data-[edge]:enabled:hover:bg-black group-data-[between]:bg-surface group-data-[between]:enabled:hover:bg-track'

/**
 * A month of days to pick one from. `DatePicker` shows it in a popover; alone, it sits on the page.
 * Tab reaches the picked day (or today); the arrow keys move a day or a week, Home and End go to the week's ends,
 * Page Up and Page Down move a month (with Shift, a year). Days before `min` or after `max` cannot be picked.
 * `value` is the day the product keeps, `null` for none; `defaultValue` when the calendar keeps its own.
 */
export function Calendar({ value: kept, defaultValue = null, onChange, min, max, range, focusOnMount = false, className, ...props }: CalendarProps) {
  const { intl, messages } = useLocale()
  const [value, set] = useControllable<Date | null, Date>(kept, defaultValue, onChange)
  const [today] = useState(() => dayOf(new Date()))
  const [active, setActive] = useState(() => clamp(value ? dayOf(value) : today, min, max))
  /* After a key moves the active day, focus follows it, also into another month: the active day's ref takes it. */
  const moved = useRef(focusOnMount)
  const takeFocus = (button: HTMLButtonElement | null) => {
    if (!button || !moved.current) return
    moved.current = false
    button.focus()
  }

  const edge = (date: Date) => (range ? sameDay(date, range.from) || sameDay(date, range.to) : sameDay(date, value))
  const between = (date: Date) => !!range?.from && !!range.to && date > range.from && date < range.to
  const outside = (date: Date) => (min ? date < dayOf(min) : false) || (max ? date > dayOf(max) : false)
  const go = (date: Date, focus: boolean) => {
    moved.current = focus
    setActive(clamp(date, min, max))
  }
  const month = new Date(active.getFullYear(), active.getMonth(), 1)
  const canBack = !min || month > dayOf(min)
  const canForward = !max || new Date(active.getFullYear(), active.getMonth() + 1, 1) <= dayOf(max)

  const onKeyDown = (event: KeyboardEvent<HTMLTableElement>) => {
    const k = event.key
    const to =
      k === 'ArrowLeft'
        ? addDays(active, -1)
        : k === 'ArrowRight'
          ? addDays(active, 1)
          : k === 'ArrowUp'
            ? addDays(active, -7)
            : k === 'ArrowDown'
              ? addDays(active, 7)
              : k === 'Home'
                ? addDays(active, -active.getDay())
                : k === 'End'
                  ? addDays(active, 6 - active.getDay())
                  : k === 'PageUp'
                    ? addMonths(active, event.shiftKey ? -12 : -1)
                    : k === 'PageDown'
                      ? addMonths(active, event.shiftKey ? 12 : 1)
                      : null
    if (!to) return
    event.preventDefault()
    go(to, true)
  }

  const title = new Intl.DateTimeFormat(intl, { month: 'long', year: 'numeric' }).format(month)
  const long = new Intl.DateTimeFormat(intl, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const narrow = new Intl.DateTimeFormat(intl, { weekday: 'narrow' })
  const weekday = new Intl.DateTimeFormat(intl, { weekday: 'long' })

  return (
    <div {...props} className={cn('gx-calendar inline-flex flex-col gap-2', className)}>
      <div className="gx-calendar__head flex items-center justify-between gap-2">
        <IconButton label={messages.previousMonth} size="sm" disabled={!canBack} onClick={() => go(addMonths(active, -1), false)}>
          <Icon name="chevron-left" />
        </IconButton>
        <span className="gx-calendar__month text-sm font-title text-ink first-letter:uppercase" aria-live="polite">
          {title}
        </span>
        <IconButton label={messages.nextMonth} size="sm" disabled={!canForward} onClick={() => go(addMonths(active, 1), false)}>
          <Icon name="chevron-right" />
        </IconButton>
      </div>
      {/* A month is a grid of days, as in the WAI-ARIA date picker: one Tab stop, the arrow keys move. */}
      {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role */}
      <table role="grid" aria-label={title} onKeyDown={onKeyDown} className="gx-calendar__grid">
        <thead>
          <tr>
            {WEEK.map((d) => (
              <th key={d.getDay()} scope="col" abbr={weekday.format(d)} className="gx-calendar__weekday h-6 text-2xs font-control text-muted">
                {narrow.format(d)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeksOf(month).map((week, w) => (
            <tr key={w}>
              {week.map((date, i) =>
                date ? (
                  <td
                    key={i}
                    // oxlint-disable-next-line jsx-a11y/no-redundant-roles -- browsers give a td in a grid this role; testing tools and some readers do not
                    role="gridcell"
                    aria-selected={edge(date) || between(date)}
                    data-edge={edge(date) || undefined}
                    data-between={between(date) || undefined}
                    className="group p-0.5"
                  >
                    <button
                      type="button"
                      ref={sameDay(date, active) ? takeFocus : undefined}
                      tabIndex={sameDay(date, active) ? 0 : -1}
                      aria-label={long.format(date)}
                      aria-current={sameDay(date, today) ? 'date' : undefined}
                      disabled={outside(date)}
                      onClick={() => {
                        setActive(date)
                        set(date)
                      }}
                      className={day}
                    >
                      {date.getDate()}
                    </button>
                  </td>
                ) : (
                  // oxlint-disable-next-line jsx-a11y/control-has-associated-label -- an empty cell before the 1st or after the last day
                  <td key={i} className="p-0.5" />
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* The same box as Select: an error is an attempted outline on the attempted-soft ground, the look of "Not yet". */
export const datePickerTrigger = cva(
  'gx-date-picker__trigger flex w-full min-w-0 cursor-pointer items-center justify-between gap-2 bg-white text-start font-control text-ink shadow-edge-strong outline-0 transition-[background-color,box-shadow] duration-(--gx-dur-fast) ease-standard focus-visible:focus-ring focus-visible:outline-offset-1 disabled:cursor-default disabled:opacity-50 aria-invalid:bg-attempted-soft aria-invalid:shadow-invalid',
  {
    variants: {
      /* The icon's strokes end where the text starts at the other side, as Select's chevron does. */
      size: {
        sm: 'h-(--gx-h-sm) rounded-lg ps-2.5 pe-[calc(var(--gx-space-2)-1px)] text-sm',
        md: 'h-(--gx-h-md) rounded-lg ps-3 pe-[calc(var(--gx-space-2-5)-1px)] text-sm',
        xl: 'h-(--gx-h-xl) rounded-2xl ps-4 pe-[calc(var(--gx-space-3-5)-1px)] text-base',
      },
    },
  },
)

/**
 * One day, picked from a calendar that opens under the field. The field shows the day as the product writes it
 * ("Fri, Oct 23"), or `placeholder` before one is picked. Inside a `Field` it takes its label, hint and error from the
 * Field; alone, `label` is its accessible name. `value` is the day the product keeps, `null` for none; `defaultValue`
 * when the field keeps its own. `className`, every other prop (`disabled`) and `ref` go to the button.
 */
export function DatePicker({
  value: kept,
  defaultValue = null,
  onChange,
  min,
  max,
  size = 'md',
  label,
  placeholder,
  name,
  className,
  ...props
}: DatePickerProps) {
  const { messages, formatDay } = useLocale()
  const field = useField()
  const [value, set] = useControllable<Date | null, Date>(kept, defaultValue, onChange)
  const [open, setOpen] = useState(false)
  const ownId = useId()
  const id = props.id ?? field?.id ?? ownId
  const valueId = `${id}-value`
  const iso = value ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}` : ''

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger
        aria-label={field ? undefined : label}
        /* The name is the label and then the day, so a screen reader says both. */
        aria-labelledby={field ? `${field.labelId} ${valueId}` : label ? `${id} ${valueId}` : undefined}
        aria-describedby={field?.describedBy}
        aria-invalid={field?.invalid || undefined}
        {...props}
        id={id}
        className={cn('gx-date-picker', `gx-date-picker--${size}`, datePickerTrigger({ size }), className)}
      >
        <span id={valueId} className={cn('gx-date-picker__value truncate', !value && 'text-muted')}>
          {value ? formatDay(value) : (placeholder ?? messages.pickDate)}
        </span>
        <Icon name="calendar" size={16} className="gx-date-picker__icon shrink-0" />
      </PopoverPrimitive.Trigger>
      {name ? <input type="hidden" name={name} value={iso} disabled={props.disabled} /> : null}
      <PopoverContent arrow={false} align="start" sideOffset={6} className="w-auto p-3" onOpenAutoFocus={(event) => event.preventDefault()}>
        <Calendar
          value={value}
          min={min}
          max={max}
          focusOnMount
          onChange={(date) => {
            set(date)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </PopoverPrimitive.Root>
  )
}
