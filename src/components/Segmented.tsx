import type { ReactNode } from 'react'
import { cx } from '../core/cx'

/** The track and option classes, for a segmented control whose options are links. */
export const segmentedTrackClass = (className?: string) => cx('gx-segmented', className)
export const segmentedOptionClass = (on: boolean, className?: string) =>
  cx('gx-segmented__option', on && 'gx-segmented__option--on', className)

export type SegmentedOption<T extends string> = { value: T; label: ReactNode; title?: string; ariaLabel?: string }

/**
 * Two to five choices side by side, the picked one raised. `fill` stretches it to its container with equal options;
 * without it, it is as wide as its labels and wraps on a narrow screen.
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
  return (
    <span
      role="radiogroup"
      aria-label={label}
      title={title}
      className={segmentedTrackClass(cx(fill ? 'gx-segmented--fill' : 'gx-segmented--fit', className))}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          aria-label={o.ariaLabel}
          title={o.title}
          onClick={() => onChange(o.value)}
          className="gx-segmented__option"
        >
          {o.label}
        </button>
      ))}
    </span>
  )
}
