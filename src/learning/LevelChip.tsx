import { cx } from '../core/cx'
import { useLocale } from '../core/locale'
import type { Level } from '../core/messages'
import { LevelMark } from './LevelMark'

/** A skill level as a chip: its mark and its name, in the level's ink on the level's soft ground. */
export function LevelChip({ level, className }: { level: Level; className?: string }) {
  const { messages } = useLocale()
  return (
    <span className={cx('gx-level-chip', `gx-level-chip--${level.replace('_', '-')}`, className)}>
      <LevelMark level={level} size={10} />
      {messages.levels[level]}
    </span>
  )
}
