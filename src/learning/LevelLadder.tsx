import { cx } from '../core/cx'
import { useLocale } from '../core/locale'
import { LEVELS, type Level } from '../core/messages'
import { LevelMark } from './LevelMark'

/** The levels a student earns, lowest first. Not started is not a rung. */
const RUNGS = LEVELS.slice(1)
const kebab = (level: Level) => level.replace('_', '-')

/**
 * The ladder with a student's place on it: the rungs up to their level are reached, and their own is the current one.
 * With `not_started` no rung is reached.
 */
export function LevelLadder({ level, className }: { level: Level; className?: string }) {
  const { messages } = useLocale()
  const at = RUNGS.indexOf(level)
  return (
    <ol className={cx('gx-level-ladder', className)}>
      {RUNGS.map((rung, i) => {
        const next = RUNGS[i + 1]
        return (
          <li
            key={rung}
            aria-current={i === at ? 'true' : undefined}
            data-reached={i <= at ? 'true' : undefined}
            className={`gx-level-ladder__rung gx-level-ladder__rung--${kebab(rung)}`}
          >
            <span className="gx-level-ladder__track">
              <span className={cx('gx-level-ladder__line', i <= at && `gx-level-ladder__line--${kebab(rung)}`)} />
              <span className="gx-level-ladder__spot">
                <LevelMark level={rung} size={i === at ? 14 : i < at ? 12 : 10} />
              </span>
              <span className={cx('gx-level-ladder__line', next && i < at && `gx-level-ladder__line--${kebab(next)}`)} />
            </span>
            {messages.levels[rung]}
          </li>
        )
      })}
    </ol>
  )
}
