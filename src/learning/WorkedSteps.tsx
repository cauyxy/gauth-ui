import type { ReactNode } from 'react'
import { cn } from '../core/cn'
import type { Props } from '../core/props'

/** One line of work. `flag` marks it as the step that went wrong and says what happened ("Sign dropped here"). */
export type WorkedStep = { text: ReactNode; flag?: ReactNode }
export type WorkedStepsProps = Props<'ol', { steps: readonly WorkedStep[] }, 'children'>

/** A student's or a solution's steps, numbered. Plain text is in mono; a formula is a `Tex`. A flagged step is the one to look at again. */
export function WorkedSteps({ steps, className, ...props }: WorkedStepsProps) {
  return (
    <ol {...props} className={cn('gx-worked-steps flex flex-col gap-1.5 font-mono text-sm', className)}>
      {steps.map((step, i) => (
        /*
         * Every step keeps room for the bar, so the numbers line up when one step is flagged. The number stands on the
         * baseline of its step, also when the step is a formula in another face.
         * The step that went wrong: the bar is the shape signal, the flag says what happened.
         */
        <li
          key={i}
          data-flagged={step.flag ? 'true' : undefined}
          className="gx-worked-steps__step flex items-baseline gap-3 rounded-sm border-s-[3px] border-s-transparent px-2 py-0.5 data-[flagged]:border-s-attempted data-[flagged]:bg-attempted-soft data-[flagged]:py-1.5"
        >
          <span aria-hidden="true" className="gx-worked-steps__number min-w-[1rem] flex-none text-muted tabular-nums">
            {i + 1}
          </span>
          <span className="gx-worked-steps__text min-w-0 flex-1">
            {step.text}
            {step.flag ? <span className="gx-worked-steps__flag mt-0.5 block font-sans font-control text-attempted-ink">{step.flag}</span> : null}
          </span>
        </li>
      ))}
    </ol>
  )
}
