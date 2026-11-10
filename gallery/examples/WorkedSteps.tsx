import { WorkedSteps } from '../../src'
import { RichText, Tex } from '../../src/math'

export function WithAFlag() {
  return (
    <div className="w-full max-w-[34rem]">
      <WorkedSteps
        steps={[
          { text: <Tex tex="a^2 + b^2 = c^2" /> },
          { text: <Tex tex="6^2 + 8^2 = c^2" /> },
          { text: <Tex tex="12 + 16 = c^2" />, flag: <RichText text="$6^2$ is $6 \times 6$, not $6 \times 2$" /> },
          { text: <Tex tex="c = \sqrt{28}" /> },
        ]}
      />
    </div>
  )
}
