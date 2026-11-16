'use client'

import { cva } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { cn } from '../core/cn'
import { useLocale } from '../core/locale'
import type { Props } from '../core/props'

export type MessageProps = Props<'div', { from: 'user' | 'ai'; children: ReactNode }>

/* Each direct child is one row: a run of text, a file card, a status line, the reply's actions. The font size is the page's. */
const message = cva('gx-message flex min-w-0 flex-col gap-2 leading-body wrap-anywhere text-ink', {
  variants: {
    from: {
      /* The bubble is as wide as its text and sits at the end side, in a block, a flex column or a grid. The lines a person made with Shift+Enter stay. */
      user: 'gx-message--user ms-auto w-fit max-w-[min(85%,36rem)] rounded-2xl bg-surface px-4 py-2.5 whitespace-pre-wrap',
      ai: 'gx-message--ai',
    },
  },
})

/**
 * One turn of a conversation with Gauth AI. `user` is what the person wrote, in a soft bubble at the end side; `ai` is
 * the reply, plain text across the column. The content is the product's. A screen reader hears who wrote it first.
 */
export function Message({ from, children, className, ...props }: MessageProps) {
  const { messages } = useLocale()
  return (
    <div {...props} className={cn(message({ from }), className)}>
      <span className="gx-visually-hidden">{from === 'user' ? messages.you : messages.gauthAi}</span>
      {children}
    </div>
  )
}
