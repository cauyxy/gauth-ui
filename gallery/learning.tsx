import { useState } from 'react'
import { LEVELS } from '../src/core/messages'
import { AnswerGroup, AnswerOption } from '../src/learning/AnswerOption'
import { LevelBar } from '../src/learning/LevelBar'
import { LevelChip } from '../src/learning/LevelChip'
import { LevelLadder } from '../src/learning/LevelLadder'
import { LevelMark } from '../src/learning/LevelMark'
import { Reveal } from '../src/learning/Reveal'
import { StepProgress } from '../src/learning/StepProgress'
import { WorkedSteps } from '../src/learning/WorkedSteps'
import { RichText } from '../src/math/RichText'
import { Tex } from '../src/math/Tex'
import { Section } from './section'

/* One question for the whole page: a right triangle with legs 6 and 8. What is the length of the hypotenuse? */
const QUESTION = 'Length of the hypotenuse'
const OPTIONS = [
  { value: 'a', letter: 'A', text: 'c = 10' },
  { value: 'b', letter: 'B', text: 'c = 14' },
  { value: 'c', letter: 'C', text: 'c = \\sqrt{28}' },
  { value: 'd', letter: 'D', text: 'c = 100' },
] as const

export default function Learning() {
  const [pick, setPick] = useState<string | null>(null)
  return (
    <>
      <Section title="LevelMark">
        <div className="g-row">
          {LEVELS.toReversed().map((level) => (
            <LevelMark key={level} level={level} label />
          ))}
          <LevelMark level="mastered" size={20} label />
        </div>
      </Section>

      <Section title="LevelChip">
        <div className="g-row">
          {LEVELS.toReversed().map((level) => (
            <LevelChip key={level} level={level} />
          ))}
        </div>
      </Section>

      <Section title="LevelLadder">
        <div className="g-col">
          <LevelLadder level="familiar" />
          <LevelLadder level="mastered" />
        </div>
      </Section>

      <Section title="LevelBar">
        <div className="g-col">
          <LevelBar label="Geometry · Period 3" counts={{ mastered: 9, proficient: 7, familiar: 6, attempted: 4, not_started: 2 }} />
          <LevelBar label="Geometry · Period 5" counts={{}} />
        </div>
      </Section>

      <Section title="AnswerOption">
        <div className="g-col">
          <AnswerGroup label={QUESTION} value={pick} onChange={setPick}>
            {OPTIONS.map((o) => (
              <AnswerOption key={o.value} value={o.value} letter={o.letter}>
                <Tex tex={o.text} />
              </AnswerOption>
            ))}
          </AnswerGroup>
          <AnswerGroup label={QUESTION} value="a" onChange={() => {}} disabled>
            {OPTIONS.map((o) => (
              <AnswerOption key={o.value} value={o.value} letter={o.letter} state={o.value === 'a' ? 'right' : undefined}>
                <Tex tex={o.text} />
              </AnswerOption>
            ))}
          </AnswerGroup>
          <AnswerGroup label={QUESTION} value="b" onChange={() => {}} disabled>
            {OPTIONS.map((o) => (
              <AnswerOption key={o.value} value={o.value} letter={o.letter} state={o.value === 'b' ? 'retry' : undefined}>
                <Tex tex={o.text} />
              </AnswerOption>
            ))}
          </AnswerGroup>
        </div>
      </Section>

      <Section title="Reveal">
        <div className="g-col">
          <Reveal kind="hint">Which side is across from the right angle? The Pythagorean theorem gives its square.</Reveal>
          <Reveal kind="why">
            <RichText text="The legs are 6 and 8, so $c^2 = 6^2 + 8^2 = 100$. The hypotenuse is $\sqrt{100}$, so $c = 10$." />
          </Reveal>
        </div>
      </Section>

      <Section title="WorkedSteps">
        <div className="g-col">
          <WorkedSteps
            steps={[
              { text: <Tex tex="a^2 + b^2 = c^2" /> },
              { text: <Tex tex="6^2 + 8^2 = c^2" /> },
              { text: <Tex tex="12 + 16 = c^2" />, flag: <RichText text="$6^2$ is $6 \times 6$, not $6 \times 2$" /> },
              { text: <Tex tex="c = \sqrt{28}" /> },
            ]}
          />
        </div>
      </Section>

      <Section title="StepProgress">
        <div className="g-col">
          <StepProgress done={2} total={6} label="Right triangles practice set" />
        </div>
      </Section>
    </>
  )
}
