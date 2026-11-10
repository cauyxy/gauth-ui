import { useState } from 'react'
import { Icon, IconButton, ReplyActions, type ReplyVote } from '../../src'

const REPLY = 'Six students added the legs. The other 22 students answered 10.'

export function CopyAndVote() {
  const [vote, setVote] = useState<ReplyVote | null>('good')
  return (
    <div className="grid w-full max-w-[34rem] gap-4">
      <ReplyActions onCopy={() => void navigator.clipboard?.writeText(REPLY)} vote={vote} onVote={setVote}>
        <IconButton size="sm" label="Quote">
          <Icon name="quote" />
        </IconButton>
      </ReplyActions>
      <ReplyActions onCopy={() => void navigator.clipboard?.writeText(REPLY)} />
    </div>
  )
}
