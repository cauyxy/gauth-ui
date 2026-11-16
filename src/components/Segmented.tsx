'use client'

import type { KeyboardEvent, ReactNode } from 'react'
import { cn } from '../core/cn'
import type { Props } from '../core/props'
import { useControllable } from '../core/useControllable'
import { segmentedOptionClass, segmentedTrackClass } from './Segmented.classes'

export type SegmentedOption<T extends string = string> = { value: T; label: ReactNode; title?: string; ariaLabel?: string }
export type SegmentedProps<T extends string = string> = Props<
  'span',
  {
    options: readonly SegmentedOption<T>[]
    value?: T
    defaultValue?: T
    onChange?: (value: T) => void
    label?: string
    /** Sends the value with a form. */
    name?: string
    fill?: boolean
  },
  'children'
>

/**
 * Two to five choices side by side, the picked one raised. `fill` stretches it to its container with equal options;
 * without it, it is as wide as its labels and wraps on a narrow screen.
 * Tab moves to the picked option; the arrow keys, Home and End move the pick, as in a radio group.
 * `value` is the pick the product keeps; `defaultValue` when the control keeps its own.
 */
export function Segmented<T extends string>({
  value,
  defaultValue,
  options,
  onChange,
  label,
  name,
  fill = false,
  className,
  onKeyDown,
  ...props
}: SegmentedProps<T>) {
  const [picked, pick] = useControllable<T | undefined, T>(value, defaultValue, onChange)
  const current = options.findIndex((o) => o.value === picked)
  const move = (event: KeyboardEvent<HTMLSpanElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    const last = options.length - 1
    const from = current < 0 ? 0 : current
    const to =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? from === last
          ? 0
          : from + 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? from === 0
            ? last
            : from - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : -1
    if (to < 0) return
    event.preventDefault()
    pick(options[to]!.value)
    event.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')[to]?.focus()
  }
  return (
    <span
      role="radiogroup"
      aria-label={label}
      {...props}
      onKeyDown={move}
      className={segmentedTrackClass(cn(fill ? 'gx-segmented--fill w-full' : 'gx-segmented--fit inline-flex w-fit flex-wrap', className))}
    >
      {options.map((o, i) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={picked === o.value}
          aria-label={o.ariaLabel}
          title={o.title}
          tabIndex={i === (current < 0 ? 0 : current) ? 0 : -1}
          onClick={() => pick(o.value)}
          className={segmentedOptionClass(false, fill ? 'flex-1 px-2' : undefined)}
        >
          {o.label}
        </button>
      ))}
      {name && picked !== undefined ? <input type="hidden" name={name} value={picked} /> : null}
    </span>
  )
}
