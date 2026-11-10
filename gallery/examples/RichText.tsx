import { RichText } from '../../src/math'

/* A dollar sign that is money is written \$. */
export function WordsAndFormulas() {
  return (
    <div className="grid w-full max-w-[34rem] gap-4 leading-body">
      <div className="text-lg">
        <RichText text="A right triangle has legs $6$ and $8$. Use $a^2 + b^2 = c^2$ to find the hypotenuse $c$." />
      </div>
      <div className="max-w-[20rem] text-lg">
        <RichText text="Expand the square: $(a + b)^2 = a^2 + 2ab + b^2 = a^2 + b^2 + 2ab = (b + a)^2$." />
      </div>
      <div>
        <RichText text="A ticket costs \$13. For $n$ tickets the total is $13n$ dollars." />
      </div>
    </div>
  )
}
