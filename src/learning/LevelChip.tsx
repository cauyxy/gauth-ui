'use client'

import { cn } from '../core/cn'
import { useLocale } from '../core/locale'
import type { Level } from '../core/messages'
import type { Props } from '../core/props'
import { LevelMark } from './LevelMark'

export type LevelChipProps = Props<'span', { level: Level }, 'children'>

/** A skill level as a chip: its mark and its name, in the level's ink on the level's soft ground. */
export function LevelChip({ level, className, ...props }: LevelChipProps) {
  const { messages } = useLocale()
  return (
    <span
      {...props}
      data-level={level}
      className={cn(
        'gx-level-chip inline-flex h-[1.5rem] flex-none items-center gap-1.5 rounded-md bg-level-soft px-2 text-xs font-control whitespace-nowrap text-level-ink',
        `gx-level-chip--${level.replace('_', '-')}`,
        className,
      )}
    >
      <LevelMark level={level} size={10} />
      {messages.levels[level]}
    </span>
  )
}
