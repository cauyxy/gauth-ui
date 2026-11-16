'use client'

import { cn } from '../core/cn'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'
import type { Props } from '../core/props'

export type StepperProps = Props<'ol', { steps: readonly string[]; current: number }, 'children'>

/** The steps of a flow, in order, with where the person is. `current` is the index of the current step, from 0. */
export function Stepper({ steps, current, className, ...props }: StepperProps) {
  const { messages } = useLocale()
  return (
    <ol {...props} className={cn('gx-stepper flex', className)}>
      {steps.map((name, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'upcoming'
        return (
          <li
            key={i}
            data-state={state}
            aria-current={state === 'current' ? 'step' : undefined}
            /* Equal columns: a mark with its name under it, so four steps fit on a phone. `after` is the line from this mark to the next one: ink once this step is done. */
            className="gx-stepper__step group relative flex min-w-0 flex-1 flex-col items-center gap-1.5 px-1 text-center text-xs font-control text-muted not-last:after:absolute not-last:after:top-[15px] not-last:after:left-[calc(50%+16px+var(--gx-space-2-5))] not-last:after:h-[2px] not-last:after:w-[calc(100%-32px-var(--gx-space-2-5)*2)] not-last:after:rounded-full not-last:after:bg-rule not-last:after:content-[''] data-[state=current]:text-ink not-last:data-[state=done]:after:bg-ink"
          >
            <span
              role="img"
              aria-label={messages.step(i + 1, state)}
              className="gx-stepper__mark grid size-[32px] flex-none place-items-center rounded-full bg-white text-sm shadow-edge-strong group-data-[state=current]:shadow-outline group-data-[state=done]:bg-track group-data-[state=done]:text-ink group-data-[state=done]:shadow-none"
            >
              {state === 'done' ? <Icon name="check" size={16} /> : i + 1}
            </span>
            <span className="gx-stepper__name max-w-full wrap-anywhere">{name}</span>
          </li>
        )
      })}
    </ol>
  )
}
