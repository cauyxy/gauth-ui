import { cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../core/cn'
import type { Level } from '../core/messages'

/** What a card is about, when that has a color: `violet` is a goal, XP or a streak, `good` is done or right, `pink` is a celebration. */
export type StudentCardTone = 'plain' | 'violet' | 'good' | 'pink'
export type StudentCardProps = ComponentProps<'section'> & { tone?: StudentCardTone; level?: Level }
export type StudentCardTitleProps = ComponentProps<'h3'>

/*
 * A plain card is white with the hairline. A card with a meaning has that meaning's soft ground and no hairline: one of
 * the two, never both. A reached level is the level's soft ground, from its `data-level`. Not started is no level a
 * student reached: its card is on `surface` with an ink title.
 */
const card = cva('gx-student-card group/student-card rounded-3xl p-5 text-ink', {
  variants: {
    ground: {
      plain: 'bg-white shadow-edge',
      violet: 'bg-violet-soft',
      good: 'bg-good-soft',
      pink: 'bg-pink-soft',
      level: 'bg-level-soft',
      not_started: 'bg-surface',
    },
  },
})

/* The title takes the text color that its card's ground allows (contrast.test.ts). On a plain card it is ink. */
const title = cn(
  'gx-student-card__title text-lg leading-heading font-title tracking-title text-balance',
  'group-data-[ground=violet]/student-card:text-violet-deep group-data-[ground=good]/student-card:text-good group-data-[ground=pink]/student-card:text-pink',
  'group-data-[level]/student-card:text-level-ink',
)

/**
 * The card of a student page: 24px corners and 20px of padding. Plain, it is white with the hairline. With a `tone`,
 * or with the `level` a student reached, the whole card takes that meaning's soft ground.
 */
export function StudentCard({ tone = 'plain', level, className, ...props }: StudentCardProps) {
  const ground = level ?? tone
  const reached = level && level !== 'not_started' ? level : undefined
  return (
    <section
      data-ground={ground}
      data-level={reached}
      className={cn(
        card({ ground: reached ? 'level' : ground === 'not_started' ? 'not_started' : tone }),
        `gx-student-card--${ground.replace('_', '-')}`,
        className,
      )}
      {...props}
    />
  )
}

/** The title of a StudentCard, in the color of its card's meaning. */
export function StudentCardTitle({ className, children, ...props }: StudentCardTitleProps) {
  return (
    <h3 className={cn(title, className)} {...props}>
      {children}
    </h3>
  )
}
