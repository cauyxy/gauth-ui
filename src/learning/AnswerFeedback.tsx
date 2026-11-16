'use client'

import { cva } from 'class-variance-authority'
import { useId, type ReactNode } from 'react'
import { cn } from '../core/cn'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'
import type { Props } from '../core/props'
import type { AnswerState } from './AnswerOption'

export type AnswerFeedbackProps = Props<'div', { state: AnswerState; aside?: ReactNode }>

/* The same grounds, fills and words as an answered AnswerOption. The mark on a fill is ink, never white. */
const feedback = cva('gx-answer-feedback flex animate-rise-in flex-col gap-3 rounded-2xl p-4 text-ink', {
  variants: {
    state: {
      right: 'gx-answer-feedback--right bg-good-soft',
      retry: 'gx-answer-feedback--retry bg-attempted-soft',
    },
  },
})
const mark = cva('gx-answer-feedback__mark grid size-[2.25rem] flex-none place-items-center rounded-full text-ink', {
  variants: { state: { right: 'bg-correct', retry: 'bg-attempted' } },
})
const word = cva('gx-answer-feedback__word min-w-0 flex-1 text-xl leading-heading font-title tracking-title', {
  variants: { state: { right: 'text-good', retry: 'text-attempted-ink' } },
})

/**
 * What a student sees after an answer: "Correct" or "Not yet" with its mark, then the reason or the step to try again.
 * The words come from the shared list. `aside` sits at the end of the first line: the XP the answer earned.
 */
export function AnswerFeedback({ state, aside, children, className, ...props }: AnswerFeedbackProps) {
  const { messages } = useLocale()
  const id = useId()
  return (
    <div role="note" aria-labelledby={id} {...props} className={cn(feedback({ state }), className)}>
      <div className="gx-answer-feedback__head flex items-center gap-2.5">
        <span className={mark({ state })}>
          <Icon name={state === 'right' ? 'check' : 'undo'} />
        </span>
        <span id={id} className={word({ state })}>
          {state === 'right' ? messages.correct : messages.notYet}
        </span>
        {aside ? <span className="gx-answer-feedback__aside flex flex-none items-center gap-2">{aside}</span> : null}
      </div>
      {children ? <div className="gx-answer-feedback__body text-base leading-body text-pretty">{children}</div> : null}
    </div>
  )
}
