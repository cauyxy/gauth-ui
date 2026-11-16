import { cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../core/cn'
import type { Level } from '../core/messages'

/** What a card is about, when that has a color: `violet` is a goal, XP or a streak, `good` is done or right, `pink` is a celebration. */
export type StudentCardTone = 'plain' | 'violet' | 'good' | 'pink'

/* A plain card is white with the hairline. A card with a meaning has that meaning's soft ground and no hairline: one of the two, never both. */
const card = cva('gx-student-card group/student-card rounded-3xl p-5 text-ink', {
  variants: {
    ground: {
      plain: 'gx-student-card--plain bg-white shadow-edge',
      violet: 'gx-student-card--violet bg-violet-soft',
      good: 'gx-student-card--good bg-good-soft',
      pink: 'gx-student-card--pink bg-pink-soft',
      mastered: 'gx-student-card--mastered bg-good-soft',
      proficient: 'gx-student-card--proficient bg-good-soft',
      familiar: 'gx-student-card--familiar bg-familiar-soft',
      attempted: 'gx-student-card--attempted bg-attempted-soft',
      not_started: 'gx-student-card--not-started bg-surface',
    },
  },
})

/* The title takes the text color that its card's ground allows (contrast.test.ts). On a plain card it is ink. */
const title = cn(
  'gx-student-card__title text-lg leading-heading font-title tracking-title text-balance',
  'group-data-[ground=violet]/student-card:text-violet-deep group-data-[ground=good]/student-card:text-good group-data-[ground=pink]/student-card:text-pink',
  'group-data-[ground=mastered]/student-card:text-mastered-ink group-data-[ground=proficient]/student-card:text-mastered-ink',
  'group-data-[ground=familiar]/student-card:text-familiar-ink group-data-[ground=attempted]/student-card:text-attempted-ink',
)

/**
 * The card of a student page: 24px corners and 20px of padding. Plain, it is white with the hairline. With a `tone`,
 * or with the `level` a student reached, the whole card takes that meaning's soft ground.
 */
export function StudentCard({ tone = 'plain', level, className, ...props }: ComponentProps<'section'> & { tone?: StudentCardTone; level?: Level }) {
  const ground = level ?? tone
  return <section data-ground={ground} className={cn(card({ ground }), className)} {...props} />
}

/** The title of a StudentCard, in the color of its card's meaning. */
export function StudentCardTitle({ className, children, ...props }: ComponentProps<'h3'>) {
  return (
    <h3 className={cn(title, className)} {...props}>
      {children}
    </h3>
  )
}
