import type { ReactNode } from 'react'
import { Spinner } from '../components/Spinner'
import { cn } from '../core/cn'

/**
 * One line that says what Gauth AI is doing ("Reading 28 answers") or what it did ("Read 28 answers in Period 3").
 * The words are the product's. While it works the line has a spinner and is a `status`; when done it is a quiet line.
 */
export function AiStatus({ state, children, className }: { state: 'working' | 'done'; children: ReactNode; className?: string }) {
  const working = state === 'working'
  return (
    <div role={working ? 'status' : undefined} data-state={state} className={cn('gx-ai-status flex min-w-0 items-start gap-2 text-sm text-muted data-[state=working]:text-ink-soft', className)}>
      {/* The spinner sits on the first line of the text, also when the text wraps. */}
      {working ? (
        <span aria-hidden="true" className="gx-ai-status__mark my-[calc((1lh_-_14px)/2)] flex-none">
          <Spinner size={14} />
        </span>
      ) : null}
      <span className="gx-ai-status__text min-w-0">{children}</span>
    </div>
  )
}
