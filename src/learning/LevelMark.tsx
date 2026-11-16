import { cva } from 'class-variance-authority'
import { cn } from '../core/cn'
import { useLocale } from '../core/locale'
import type { Level } from '../core/messages'

/* One shape for each level, so a level never relies on its color: a full disc, three quarters, a half, a ring, a dash. */
const mark = cva('gx-level-mark inline-block flex-none rounded-full align-middle', {
  variants: {
    level: {
      mastered: 'gx-level-mark--mastered bg-mastered',
      proficient: 'gx-level-mark--proficient bg-[conic-gradient(var(--gx-color-proficient)_0_75%,var(--gx-color-track)_0)]',
      familiar: 'gx-level-mark--familiar bg-[conic-gradient(var(--gx-color-familiar)_0_50%,var(--gx-color-track)_0)]',
      attempted: 'gx-level-mark--attempted border-2 border-attempted',
      not_started:
        'gx-level-mark--not-started rounded-none bg-[linear-gradient(var(--gx-color-ring),var(--gx-color-ring))] bg-size-[84%_2px] bg-center bg-no-repeat',
    },
  },
})

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
      className={cn(mark({ level }), className)}
      style={{ width: size, height: size }}
    />
  )
}
