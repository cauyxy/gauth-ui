import { cx } from '../core/cx'
import { useLocale } from '../core/locale'
import type { Level } from '../core/messages'

/**
 * The small mark of a skill level: its own shape in its own color. `size` is in pixels.
 * It is decoration beside the level's name; `label` makes it an image that says the name, for a mark that stands alone.
 */
export function LevelMark({ level, size = 14, label = false, className }: { level: Level; size?: number; label?: boolean; className?: string }) {
  const { messages } = useLocale()
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label ? messages.levels[level] : undefined}
      aria-hidden={label ? undefined : 'true'}
      className={cx('gx-level-mark', `gx-level-mark--${level.replace('_', '-')}`, className)}
      style={{ width: size, height: size }}
    />
  )
}
