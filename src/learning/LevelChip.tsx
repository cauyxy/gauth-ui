'use client'

import { cva } from 'class-variance-authority'
import { cn } from '../core/cn'
import { useLocale } from '../core/locale'
import type { Level } from '../core/messages'
import type { Props } from '../core/props'
import { LevelMark } from './LevelMark'

export type LevelChipProps = Props<'span', { level: Level }, 'children'>

const chip = cva('gx-level-chip inline-flex h-[1.5rem] flex-none items-center gap-1.5 rounded-md px-2 text-xs font-control whitespace-nowrap', {
  variants: {
    level: {
      mastered: 'gx-level-chip--mastered bg-good-soft text-mastered-ink',
      proficient: 'gx-level-chip--proficient bg-good-soft text-mastered-ink',
      familiar: 'gx-level-chip--familiar bg-familiar-soft text-familiar-ink',
      attempted: 'gx-level-chip--attempted bg-attempted-soft text-attempted-ink',
      not_started: 'gx-level-chip--not-started bg-surface text-muted',
    },
  },
})

/** A skill level as a chip: its mark and its name, in the level's ink on the level's soft ground. */
export function LevelChip({ level, className, ...props }: LevelChipProps) {
  const { messages } = useLocale()
  return (
    <span {...props} className={cn(chip({ level }), className)}>
      <LevelMark level={level} size={10} />
      {messages.levels[level]}
    </span>
  )
}
