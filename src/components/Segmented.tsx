import type { KeyboardEvent, ReactNode } from 'react'
import { cn } from '../core/cn'

/** The track and option classes, for a segmented control whose options are links. */
export const segmentedTrackClass = (className?: string) => cn('gx-segmented flex gap-0.5 rounded-xl bg-track p-1', className)
export const segmentedOptionClass = (on: boolean, className?: string) =>
  cn(
    'gx-segmented__option grid h-[1.75rem] min-w-0 place-items-center truncate rounded-lg px-3 text-sm font-control text-muted no-underline cursor-pointer outline-0 hover:text-ink focus-visible:focus-ring focus-visible:outline-offset-1 aria-checked:bg-white aria-checked:text-ink aria-checked:shadow-raise',
    on && 'gx-segmented__option--on bg-white text-ink shadow-raise',
    className,
  )

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
      className={segmentedTrackClass(cn(fill ? 'gx-segmented--fill w-full' : 'gx-segmented--fit inline-flex w-fit flex-wrap', className))}
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
          className={segmentedOptionClass(false, fill ? 'flex-1 px-2' : undefined)}
        >
          {o.label}
        </button>
      ))}
    </span>
  )
}
