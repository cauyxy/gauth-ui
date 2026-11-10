import type { ReactNode } from 'react'
import { cx } from '../core/cx'

/** One line of work. `flag` marks it as the step that went wrong and says what happened ("Sign dropped here"). */
export type WorkedStep = { text: ReactNode; flag?: ReactNode }

/** A student's or a solution's steps, numbered, in mono. A flagged step is the one to look at again. */
export function WorkedSteps({ steps, className }: { steps: readonly WorkedStep[]; className?: string }) {
  return (
    <ol className={cx('gx-worked-steps', className)}>
      {steps.map((step, i) => (
        <li key={i} data-flagged={step.flag ? 'true' : undefined} className="gx-worked-steps__step">
          <span aria-hidden="true" className="gx-worked-steps__number">
            {i + 1}
          </span>
          <span className="gx-worked-steps__text">
            {step.text}
            {step.flag ? <span className="gx-worked-steps__flag">{step.flag}</span> : null}
          </span>
        </li>
      ))}
    </ol>
  )
}
