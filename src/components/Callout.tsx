import { cva } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { cn } from '../core/cn'

export type CalloutTone = 'neutral' | 'ai' | 'good' | 'warn'

/* A soft ground and no outline. Each text color is a pair that contrast.test.ts allows on its ground. */
const callout = cva('gx-callout rounded-xl px-4 py-3 text-sm leading-body text-pretty', {
  variants: {
    tone: {
      neutral: 'gx-callout--neutral bg-surface text-ink',
      ai: 'gx-callout--ai bg-violet-soft text-violet-deep',
      good: 'gx-callout--good bg-good-soft text-good',
      warn: 'gx-callout--warn bg-warn-soft text-warn',
    },
  },
})

/** A note set apart from the text around it. The tone says what kind of note it is; the words still say it in full. */
export function Callout({ tone = 'neutral', title, children, className }: { tone?: CalloutTone; title?: string; children: ReactNode; className?: string }) {
  return (
    <div role="note" className={cn(callout({ tone }), className)}>
      {title ? <p className="gx-callout__title mb-0.5 font-control">{title}</p> : null}
      {children}
    </div>
  )
}
