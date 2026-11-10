import { AiStatus } from '../../src'

/* The dot stays with the word before it. */
export function WorkingAndDone() {
  return (
    <div className="grid w-full max-w-[34rem] gap-4">
      <AiStatus state="working">Reading 28 answers in Geometry{' '}· Period 3</AiStatus>
      <AiStatus state="done">Read 28 answers in Geometry{' '}· Period 3</AiStatus>
    </div>
  )
}
