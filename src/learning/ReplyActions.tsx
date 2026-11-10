import { useEffect, useRef, useState, type ReactNode } from 'react'
import { IconButton } from '../components/IconButton'
import { cx } from '../core/cx'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'

export type ReplyVote = 'good' | 'bad'

/** How long the copy button says "Copied". */
const COPIED_MS = 2000

/**
 * The row under a reply from Gauth AI: the two votes (with `onVote`), copy, then the product's own actions as children
 * (`IconButton` `ghost` `sm`). A vote is a toggle: the page keeps `vote`, and pressing the pressed one gives `null`.
 * Copy calls `onCopy` and shows a check for a moment; the page writes to the clipboard.
 */
export function ReplyActions({
  onCopy,
  vote = null,
  onVote,
  children,
  className,
}: {
  onCopy: () => void
  vote?: ReplyVote | null
  onVote?: (vote: ReplyVote | null) => void
  children?: ReactNode
  className?: string
}) {
  const { messages } = useLocale()
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = () => {
    onCopy()
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), COPIED_MS)
  }
  const toggle = (next: ReplyVote) => onVote?.(vote === next ? null : next)

  return (
    <div className={cx('gx-reply-actions', className)}>
      {onVote ? (
        <>
          <IconButton size="sm" label={messages.goodReply} pressed={vote === 'good'} onClick={() => toggle('good')}>
            <Icon name="thumbs-up" />
          </IconButton>
          <IconButton size="sm" label={messages.badReply} pressed={vote === 'bad'} onClick={() => toggle('bad')}>
            <Icon name="thumbs-down" />
          </IconButton>
        </>
      ) : null}
      <IconButton size="sm" label={copied ? messages.copied : messages.copy} onClick={copy}>
        <Icon name={copied ? 'check' : 'copy'} />
      </IconButton>
      {children}
    </div>
  )
}
