import { useState } from 'react'
import { FollowUps } from '../../src'

const NEXT = [
  'Which six students added the legs?',
  'Make five practice problems on HSG.SRT.C.8',
  'Group the class for Thursday by who needs to square the legs and who is ready for word problems',
]

export function NextQuestions() {
  const [picked, setPicked] = useState(NEXT[0]!)
  return (
    <div className="grid w-full max-w-[34rem] gap-4">
      <FollowUps items={NEXT} onPick={setPicked} />
      <span className="text-muted">{picked}</span>
    </div>
  )
}
