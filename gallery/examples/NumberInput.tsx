import { useState } from 'react'
import { Field, NumberInput } from '../../src'

export function InAForm() {
  const [count, setCount] = useState<number | null>(10)
  const [points, setPoints] = useState<number | null>(0)
  return (
    <div className="grid w-full max-w-[16rem] gap-4">
      <Field label="Questions" hint="From 1 to 30.">
        <NumberInput min={1} max={30} value={count} onChange={setCount} />
      </Field>
      <Field label="Points for each" error={points ? undefined : 'Not yet. A question is worth at least 1 point.'}>
        <NumberInput min={0} max={10} value={points} onChange={setPoints} />
      </Field>
    </div>
  )
}

export function Large() {
  const [minutes, setMinutes] = useState<number | null>(15)
  return (
    <div className="grid w-full max-w-[16rem] gap-4">
      <NumberInput size="xl" label="Minutes" min={5} max={60} step={5} value={minutes} onChange={setMinutes} />
      <NumberInput size="xl" label="Minutes, disabled" value={minutes} onChange={setMinutes} disabled />
    </div>
  )
}
