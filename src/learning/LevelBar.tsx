import { cva } from 'class-variance-authority'
import { cn } from '../core/cn'
import { useLocale } from '../core/locale'
import { LEVELS, type Level } from '../core/messages'

/** The order of the parts: Mastered first, Not started last. */
const ORDER = [...LEVELS].reverse()

const part = cva('gx-level-bar__part min-w-0 basis-0', {
  variants: {
    level: {
      mastered: 'gx-level-bar__part--mastered bg-mastered',
      proficient: 'gx-level-bar__part--proficient bg-proficient',
      familiar: 'gx-level-bar__part--familiar bg-familiar',
      attempted: 'gx-level-bar__part--attempted bg-attempted',
      not_started: 'gx-level-bar__part--not-started bg-track',
    },
  },
})

/**
 * How many are at each level, as one bar: a part for each level, as wide as its share. A level with none has no part.
 * `label` says what is counted ("Geometry · Period 3"); the accessible name adds each count to it.
 */
export function LevelBar({ counts, label, className }: { counts: Partial<Record<Level, number>>; label: string; className?: string }) {
  const { messages } = useLocale()
  const parts = ORDER.flatMap((level) => ((counts[level] ?? 0) > 0 ? [{ level, count: counts[level]! }] : []))
  /* Nothing counted yet: the empty track. With parts there is no ground, so the gaps between them stay clear. */
  return (
    <span
      role="img"
      aria-label={[label, ...parts.map((p) => messages.levelCount(messages.levels[p.level], p.count))].join(', ')}
      className={cn('gx-level-bar flex h-[8px] gap-0.5 overflow-hidden rounded-sm empty:bg-track', className)}
    >
      {parts.map((p) => (
        <span key={p.level} className={part({ level: p.level })} style={{ flexGrow: p.count }} />
      ))}
    </span>
  )
}
