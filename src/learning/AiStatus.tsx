import type { ReactNode } from 'react'
import { Spinner } from '../components/Spinner'
import { cx } from '../core/cx'

/**
 * One line that says what Gauth AI is doing ("Reading 28 answers") or what it did ("Read 28 answers in Period 3").
 * The words are the product's. While it works the line has a spinner and is a `status`; when done it is a quiet line.
 */
export function AiStatus({ state, children, className }: { state: 'working' | 'done'; children: ReactNode; className?: string }) {
  const working = state === 'working'
  return (
    <div role={working ? 'status' : undefined} data-state={state} className={cx('gx-ai-status', className)}>
      {working ? (
        <span aria-hidden="true" className="gx-ai-status__mark">
          <Spinner size={14} />
        </span>
      ) : null}
      <span className="gx-ai-status__text">{children}</span>
    </div>
  )
}
