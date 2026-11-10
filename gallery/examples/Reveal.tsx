import { Reveal } from '../../src'
import { RichText } from '../../src/math'

export function HintAndWhy() {
  return (
    <div className="grid w-full max-w-[34rem] gap-4">
      <Reveal kind="hint">Which side is across from the right angle? The Pythagorean theorem gives its square.</Reveal>
      <Reveal kind="why">
        <RichText text="The legs are 6 and 8, so $c^2 = 6^2 + 8^2 = 100$. The hypotenuse is $\sqrt{100}$, so $c = 10$." />
      </Reveal>
    </div>
  )
}
