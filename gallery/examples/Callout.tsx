import { Callout } from '../../src'

export function Tones() {
  return (
    <div className="grid w-full max-w-[34rem] gap-4">
      <Callout>Scores update after each practice set.</Callout>
      <Callout tone="warn">2 students have no graded answers yet.</Callout>
      <Callout tone="good">You moved to Familiar on this skill.</Callout>
      <Callout tone="ai">Only you see this: the answer key and worked solution.</Callout>
      <Callout tone="ai" title="Made by Gauth AI">
        6 problems on HSG.SRT.B.5, checked against the answer key.
      </Callout>
    </div>
  )
}
