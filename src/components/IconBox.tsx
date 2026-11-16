import { cva } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { cn } from '../core/cn'
import type { Props } from '../core/props'

export type IconBoxTone = 'neutral' | 'blue' | 'violet' | 'good' | 'warn' | 'pink'
export type IconBoxProps = Props<'span', { size?: number; tone?: IconBoxTone; children: ReactNode }>

/* Each tone is a text and ground pair that contrast.test.ts allows. */
const box = cva('gx-icon-box grid flex-none place-items-center rounded-lg', {
  variants: {
    tone: {
      neutral: 'gx-icon-box--neutral bg-surface text-ink',
      blue: 'gx-icon-box--blue bg-blue-soft text-blue',
      violet: 'gx-icon-box--violet bg-violet-soft text-violet',
      good: 'gx-icon-box--good bg-good-soft text-good',
      warn: 'gx-icon-box--warn bg-warn-soft text-warn',
      pink: 'gx-icon-box--pink bg-pink-soft text-pink',
    },
  },
})

/**
 * A line icon on a square. Neutral says what kind of thing a row is; a `tone` says what the icon means (XP is violet,
 * done is good, a celebration is pink), with the same meanings as a `Chip`. `size` is in pixels.
 */
export function IconBox({ size = 32, tone = 'neutral', className, style, children, ...props }: IconBoxProps) {
  return (
    <span {...props} className={cn(box({ tone }), className)} style={{ width: size, height: size, ...style }}>
      {children}
    </span>
  )
}
