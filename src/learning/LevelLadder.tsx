'use client'

import { cn } from '../core/cn'
import { useLocale } from '../core/locale'
import { LEVELS, type Level } from '../core/messages'
import type { Props } from '../core/props'
import { LevelMark } from './LevelMark'

export type LevelLadderProps = Props<'ol', { level: Level }, 'children'>

/** The levels a student earns, lowest first. Not started is not a rung. */
type Rung = Exclude<Level, 'not_started'>
const RUNGS = LEVELS.slice(1) as Rung[]

/*
 * The line into a reached rung takes that rung's fill, from its own `data-level`; a line into a rung not reached is the
 * track. The ladder starts at the first mark and ends at the last. Into Attempted, the first rung, there is no line.
 */
function Line({ into }: { into: Rung | null }) {
  return (
    <span
      data-level={into ?? undefined}
      className={cn(
        'gx-level-ladder__line h-[3px] flex-1 bg-track group-first/rung:first:invisible group-last/rung:last:invisible data-[level]:bg-level',
        into && `gx-level-ladder__line--${into}`,
      )}
    />
  )
}

/**
 * The ladder with a student's place on it: the rungs up to their level are reached, and their own is the current one.
 * With `not_started` no rung is reached.
 */
export function LevelLadder({ level, className, ...props }: LevelLadderProps) {
  const { messages } = useLocale()
  const at = RUNGS.indexOf(level as Rung)
  return (
    <ol {...props} className={cn('gx-level-ladder grid w-full max-w-[21.25rem] grid-cols-4', className)}>
      {RUNGS.map((rung, i) => {
        const next = RUNGS[i + 1]
        return (
          <li
            key={rung}
            aria-current={i === at ? 'true' : undefined}
            data-reached={i <= at ? 'true' : undefined}
            data-level={rung}
            className={cn(
              `gx-level-ladder__rung gx-level-ladder__rung--${rung}`,
              'group/rung flex flex-col items-center gap-1 text-center text-xs wrap-anywhere text-muted aria-[current]:font-control aria-[current]:text-ink',
            )}
          >
            <span className="gx-level-ladder__track flex h-[1.375rem] w-full items-center">
              <Line into={i <= at ? rung : null} />
              {/* A rung not reached yet keeps its shape and loses its color. The current one is larger, on its level's soft ground. */}
              <span className="gx-level-ladder__spot grid flex-none place-items-center rounded-full opacity-50 grayscale group-data-[reached]/rung:opacity-100 group-data-[reached]/rung:filter-none group-aria-[current]/rung:bg-level-soft group-aria-[current]/rung:p-1">
                <LevelMark level={rung} size={i === at ? 14 : i < at ? 12 : 10} />
              </span>
              <Line into={next && i < at ? next : null} />
            </span>
            {messages.levels[rung]}
          </li>
        )
      })}
    </ol>
  )
}
