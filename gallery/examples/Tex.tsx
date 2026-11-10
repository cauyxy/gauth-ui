import { useState } from 'react'
import { AnswerGroup, AnswerOption } from '../../src'
import { RichText, Tex } from '../../src/math'

const SLOPES = [
  { value: 'a', letter: 'A', tex: 'm = \\frac{2}{3}' },
  { value: 'b', letter: 'B', tex: 'm = -\\frac{3}{2}' },
  { value: 'c', letter: 'C', tex: 'm = \\dfrac{y_2 - y_1}{x_2 - x_1}' },
  { value: 'd', letter: 'D', tex: 'm = 6' },
] as const

/* A formula takes the size of the text around it. */
export function InText() {
  return (
    <div className="grid w-full max-w-[34rem] gap-4 leading-body">
      <div className="text-sm">
        <RichText text="Solve 2x + 10 = 28 for x: $2x + 10 = 28$, so $x = 9$." />
      </div>
      <div className="text-base">
        <RichText text="Solve 2x + 10 = 28 for x: $2x + 10 = 28$, so $x = 9$." />
      </div>
      <div className="text-lg">
        <RichText text="Solve 2x + 10 = 28 for x: $2x + 10 = 28$, so $x = 9$." />
      </div>
      <div className="text-2xl">
        <RichText text="Solve 2x + 10 = 28 for x: $2x + 10 = 28$, so $x = 9$." />
      </div>
      <div>
        <RichText text="The slope is $\frac{2}{3}$ and the line crosses the y-axis at $(0, -4)$. A second line with slope $-\frac{3}{2}$ is perpendicular to it, because $\frac{2}{3} \cdot \left(-\frac{3}{2}\right) = -1$." />
      </div>
    </div>
  )
}

/* A long formula scrolls in its own box. A formula that cannot be read shows its source. */
export function OnItsOwnLine() {
  return (
    <div className="grid w-full max-w-[34rem] gap-4">
      <Tex display tex="x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}" />
      <Tex display tex="\begin{aligned} 2x + 10 &= 28 \\ 2x &= 18 \\ x &= 9 \end{aligned}" />
      <Tex display tex="(a + b)^6 = a^6 + 6a^5b + 15a^4b^2 + 20a^3b^3 + 15a^2b^4 + 6ab^5 + b^6 \quad \text{and} \quad (a - b)^6 = a^6 - 6a^5b + 15a^4b^2 - 20a^3b^3" />
      <Tex tex="\frac{1" />
    </div>
  )
}

export function InAnswers() {
  const [pick, setPick] = useState<string | null>('a')
  return (
    <div className="w-full max-w-[34rem]">
      <AnswerGroup label="Slope of the line" value={pick} onChange={setPick}>
        {SLOPES.map((o) => (
          <AnswerOption key={o.value} value={o.value} letter={o.letter}>
            <Tex tex={o.tex} />
          </AnswerOption>
        ))}
      </AnswerGroup>
    </div>
  )
}
