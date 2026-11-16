import { useState } from 'react'
import { Textarea } from '../../src'

export function States() {
  const [empty, setEmpty] = useState('')
  const [note, setNote] = useState('Show your work on Q3.')
  const [feedback, setFeedback] = useState('')
  const [answer, setAnswer] = useState('')
  return (
    <div className="grid w-full max-w-[34rem] gap-4">
      <Textarea label="Note to students, empty" value={empty} onChange={setEmpty} placeholder="Show your work on Q3." />
      <Textarea label="Note to students, filled" value={note} onChange={setNote} />
      <Textarea label="Note to students, disabled" value="Due Thu. Calculators are OK." rows={2} disabled />
      <Textarea
        label="Feedback, error"
        aria-invalid={!feedback}
        value={feedback}
        onChange={setFeedback}
        placeholder="Name the step that went wrong."
        rows={2}
      />
      <Textarea size="xl" label="Explain your answer" value={answer} onChange={setAnswer} placeholder="Explain how you found x." />
    </div>
  )
}
