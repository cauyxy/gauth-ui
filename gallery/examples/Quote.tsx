import { useState } from 'react'
import { Quote } from '../../src'
import { RichText } from '../../src/math'

export function PlainAndRemovable() {
  const [quoted, setQuoted] = useState(true)
  return (
    <div className="grid w-full max-w-[34rem] gap-4">
      <Quote>
        <RichText text="Six students added the legs: for legs 6 and 8 they wrote $c = 6 + 8 = 14$." />
      </Quote>
      {quoted ? (
        <Quote onRemove={() => setQuoted(false)}>
          <RichText text="Six students added the legs: for legs 6 and 8 they wrote $c = 6 + 8 = 14$. The theorem squares the legs first: $c = \sqrt{6^2 + 8^2} = 10$. The other 22 students answered 10." />
        </Quote>
      ) : null}
    </div>
  )
}
