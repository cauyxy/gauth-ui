'use client'

import { cva } from 'class-variance-authority'
import { useId, type ReactNode } from 'react'
import { cn } from '../core/cn'
import { useLocale } from '../core/locale'
import type { Props } from '../core/props'

export type RevealProps = Props<'div', { kind: 'hint' | 'why'; children: ReactNode }>

const reveal = cva('gx-reveal flex animate-rise-in flex-col gap-1.5 rounded-2xl px-4 py-3.5 text-base text-ink', {
  variants: {
    kind: {
      hint: 'gx-reveal--hint bg-surface',
      why: 'gx-reveal--why bg-good-soft',
    },
  },
})
const title = cva('gx-reveal__title text-sm font-title', {
  variants: {
    kind: {
      hint: 'text-muted',
      why: 'text-good',
    },
  },
})

/**
 * Help that arrives under a question. A `hint` is one step of help before the answer; `why` is the reason, shown after
 * the student answers. The title comes from the shared words; the content is the product's.
 */
export function Reveal({ kind, children, className, ...props }: RevealProps) {
  const { messages } = useLocale()
  const id = useId()
  return (
    <div role="note" aria-labelledby={id} {...props} className={cn(reveal({ kind }), className)}>
      <span id={id} className={title({ kind })}>
        {messages[kind]}
      </span>
      <div className="gx-reveal__body leading-body text-pretty">{children}</div>
    </div>
  )
}
