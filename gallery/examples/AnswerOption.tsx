import { useState } from 'react'
import { AnswerGroup, AnswerOption } from '../../src'
import { Tex } from '../../src/math'

/* A right triangle has legs 6 and 8. What is the length of the hypotenuse? */
const OPTIONS = [
  { value: 'a', letter: 'A', tex: 'c = 10' },
  { value: 'b', letter: 'B', tex: 'c = 14' },
  { value: 'c', letter: 'C', tex: 'c = \\sqrt{28}' },
  { value: 'd', letter: 'D', tex: 'c = 100' },
] as const

export function Pick() {
  const [pick, setPick] = useState<string | null>(null)
  return (
    <div className="w-full max-w-[34rem]">
      <AnswerGroup label="Length of the hypotenuse" value={pick} onChange={setPick}>
        {OPTIONS.map((o) => (
          <AnswerOption key={o.value} value={o.value} letter={o.letter}>
            <Tex tex={o.tex} />
          </AnswerOption>
        ))}
      </AnswerGroup>
    </div>
  )
}

export function Right() {
  return (
    <div className="w-full max-w-[34rem]">
      <AnswerGroup label="Length of the hypotenuse" value="a" onChange={() => {}} disabled>
        {OPTIONS.map((o) => (
          <AnswerOption key={o.value} value={o.value} letter={o.letter} state={o.value === 'a' ? 'right' : undefined}>
            <Tex tex={o.tex} />
          </AnswerOption>
        ))}
      </AnswerGroup>
    </div>
  )
}

export function NotYet() {
  return (
    <div className="w-full max-w-[34rem]">
      <AnswerGroup label="Length of the hypotenuse" value="b" onChange={() => {}} disabled>
        {OPTIONS.map((o) => (
          <AnswerOption key={o.value} value={o.value} letter={o.letter} state={o.value === 'b' ? 'retry' : undefined}>
            <Tex tex={o.tex} />
          </AnswerOption>
        ))}
      </AnswerGroup>
    </div>
  )
}
