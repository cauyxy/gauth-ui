import { cx } from '../core/cx'
import { useLocale } from '../core/locale'
import { LEVELS, type Level } from '../core/messages'

/** The order of the parts: Mastered first, Not started last. */
const ORDER = [...LEVELS].reverse()

/**
 * How many are at each level, as one bar: a part for each level, as wide as its share. A level with none has no part.
 * `label` says what is counted ("Geometry · Period 3"); the accessible name adds each count to it.
 */
export function LevelBar({ counts, label, className }: { counts: Partial<Record<Level, number>>; label: string; className?: string }) {
  const { messages } = useLocale()
  const parts = ORDER.flatMap((level) => ((counts[level] ?? 0) > 0 ? [{ level, count: counts[level]! }] : []))
  return (
    <span
      role="img"
      aria-label={[label, ...parts.map((p) => messages.levelCount(messages.levels[p.level], p.count))].join(', ')}
      className={cx('gx-level-bar', className)}
    >
      {parts.map((p) => (
        <span key={p.level} className={`gx-level-bar__part gx-level-bar__part--${p.level.replace('_', '-')}`} style={{ flexGrow: p.count }} />
      ))}
    </span>
  )
}
