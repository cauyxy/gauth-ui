import { useState } from 'react'
import { AnswerGroup, AnswerOption } from '../src/learning/AnswerOption'
import { RichText } from '../src/math/RichText'
import { Tex } from '../src/math/Tex'
import { Section } from './section'

const SIZES = ['sm', 'base', 'lg', '2xl'] as const
const SLOPES = [
  { value: 'a', letter: 'A', tex: 'm = \\frac{2}{3}' },
  { value: 'b', letter: 'B', tex: 'm = -\\frac{3}{2}' },
  { value: 'c', letter: 'C', tex: 'm = \\dfrac{y_2 - y_1}{x_2 - x_1}' },
  { value: 'd', letter: 'D', tex: 'm = 6' },
] as const

export default function Formulas() {
  const [pick, setPick] = useState<string | null>('a')
  return (
    <>
      <Section title="Tex">
        <div className="g-col">
          {SIZES.map((size) => (
            <div key={size} className="g-math-line" style={{ fontSize: `var(--gx-text-${size})` }}>
              <RichText text="Solve 2x + 10 = 28 for x: $2x + 10 = 28$, so $x = 9$." />
            </div>
          ))}
          <div className="g-math-line">
            <RichText text="The slope is $\frac{2}{3}$ and the line crosses the y-axis at $(0, -4)$. A second line with slope $-\frac{3}{2}$ is perpendicular to it, because $\frac{2}{3} \cdot \left(-\frac{3}{2}\right) = -1$." />
          </div>
          <Tex display tex="x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}" />
          <Tex
            display
            tex="\begin{aligned} 2x + 10 &= 28 \\ 2x &= 18 \\ x &= 9 \end{aligned}"
          />
          <Tex display tex="(a + b)^6 = a^6 + 6a^5b + 15a^4b^2 + 20a^3b^3 + 15a^2b^4 + 6ab^5 + b^6 \quad \text{and} \quad (a - b)^6 = a^6 - 6a^5b + 15a^4b^2 - 20a^3b^3" />
          <Tex tex="\frac{1" />
        </div>
      </Section>
      <Section title="RichText">
        <div className="g-col">
          <div className="g-math-line" style={{ fontSize: 'var(--gx-text-lg)' }}>
            <RichText text="A right triangle has legs $6$ and $8$. Use $a^2 + b^2 = c^2$ to find the hypotenuse $c$." />
          </div>
          <div className="g-math-line" style={{ fontSize: 'var(--gx-text-lg)', maxWidth: '20rem' }}>
            <RichText text="Expand the square: $(a + b)^2 = a^2 + 2ab + b^2 = a^2 + b^2 + 2ab = (b + a)^2$." />
          </div>
          <div className="g-math-line">
            <RichText text="A ticket costs \$13. For $n$ tickets the total is $13n$ dollars." />
          </div>
        </div>
      </Section>
      <Section title="Tex in answers">
        <div className="g-col">
          <AnswerGroup label="Slope of the line" value={pick} onChange={setPick}>
            {SLOPES.map((o) => (
              <AnswerOption key={o.value} value={o.value} letter={o.letter}>
                <Tex tex={o.tex} />
              </AnswerOption>
            ))}
          </AnswerGroup>
        </div>
      </Section>
    </>
  )
}
