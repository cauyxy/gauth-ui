'use client'

import { useEffect, useRef, useState } from 'react'
import { IconButton } from '../components/IconButton'
import { cn } from '../core/cn'
import { Icon } from '../core/Icon'
import { useLocale } from '../core/locale'
import type { Props } from '../core/props'

export type ReplyVote = 'good' | 'bad'
export type ReplyActionsProps = Props<'div', { onCopy: () => void; vote?: ReplyVote | null; onVote?: (vote: ReplyVote | null) => void }>

/** How long the copy button says "Copied". */
const COPIED_MS = 2000

/**
 * The row under a reply from Gauth AI: the two votes (with `onVote`), copy, then the product's own actions as children
 * (`IconButton` `ghost` `sm`). A vote is a toggle: the page keeps `vote`, and pressing the pressed one gives `null`.
 * Copy calls `onCopy` and shows a check for a moment; the page writes to the clipboard.
 */
export function ReplyActions({ onCopy, vote = null, onVote, children, className, ...props }: ReplyActionsProps) {
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
    /*
     * The row starts flush with the text above it. A small icon button holds its icon 7px in and the icon's strokes start
     * about half a pixel further, so the row moves 8px toward the start: the first icon's strokes are then on the text edge.
     */
    <div {...props} className={cn('gx-reply-actions -ms-2 flex flex-wrap items-center gap-0.5', className)}>
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
