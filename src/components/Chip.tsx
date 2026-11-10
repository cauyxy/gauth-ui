import type { ComponentProps } from 'react'
import { cx } from '../core/cx'

export type ChipTone = 'neutral' | 'blue' | 'violet' | 'good' | 'warn' | 'pink' | 'ink'

/** Small rounded label: standard codes, skill names, statuses. */
export function Chip({ tone = 'neutral', className, ...props }: ComponentProps<'span'> & { tone?: ChipTone }) {
  return <span className={cx('gx-chip', `gx-chip--${tone}`, className)} {...props} />
}
