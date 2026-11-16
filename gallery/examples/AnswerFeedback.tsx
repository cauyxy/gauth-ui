import { AnswerFeedback, Chip, Icon } from '../../src'
import { RichText } from '../../src/math'

export function Correct() {
  return (
    <div className="w-full max-w-[34rem]">
      <AnswerFeedback
        state="right"
        aside={
          <Chip tone="violet" className="bg-white">
            <Icon name="xp" />
            +10 XP
          </Chip>
        }
      >
        <RichText text="The legs are 6 and 8, so $c^2 = 6^2 + 8^2 = 100$. The hypotenuse is $\sqrt{100}$, so $c = 10$." />
      </AnswerFeedback>
    </div>
  )
}

export function NotYet() {
  return (
    <div className="w-full max-w-[34rem]">
      <AnswerFeedback state="retry">
        <RichText text="You added the legs: $6 + 8 = 14$. Square each leg first, then add the squares." />
      </AnswerFeedback>
    </div>
  )
}
