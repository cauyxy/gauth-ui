import type { KeyboardEvent, ReactNode } from 'react'
import { cx } from '../core/cx'

/** The track and option classes, for a segmented control whose options are links. */
export const segmentedTrackClass = (className?: string) => cx('gx-segmented', className)
export const segmentedOptionClass = (on: boolean, className?: string) =>
  cx('gx-segmented__option', on && 'gx-segmented__option--on', className)

export type SegmentedOption<T extends string> = { value: T; label: ReactNode; title?: string; ariaLabel?: string }

/**
 * Two to five choices side by side, the picked one raised. `fill` stretches it to its container with equal options;
 * without it, it is as wide as its labels and wraps on a narrow screen.
 * Tab moves to the picked option; the arrow keys, Home and End move the pick, as in a radio group.
 */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
  title,
  fill = false,
  className,
}: {
  value: T
  options: readonly SegmentedOption<T>[]
  onChange: (value: T) => void
  label?: string
  title?: string
  fill?: boolean
  className?: string
}) {
  const current = options.findIndex((o) => o.value === value)
  const onKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    const last = options.length - 1
    const from = current < 0 ? 0 : current
    const to =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? from === last ? 0 : from + 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? from === 0 ? last : from - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : -1
    if (to < 0) return
    event.preventDefault()
    onChange(options[to]!.value)
    event.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')[to]?.focus()
  }
  return (
    <span
      role="radiogroup"
      aria-label={label}
      title={title}
      onKeyDown={onKeyDown}
      className={segmentedTrackClass(cx(fill ? 'gx-segmented--fill' : 'gx-segmented--fit', className))}
    >
      {options.map((o, i) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          aria-label={o.ariaLabel}
          title={o.title}
          tabIndex={i === (current < 0 ? 0 : current) ? 0 : -1}
          onClick={() => onChange(o.value)}
          className="gx-segmented__option"
        >
          {o.label}
        </button>
      ))}
    </span>
  )
}
