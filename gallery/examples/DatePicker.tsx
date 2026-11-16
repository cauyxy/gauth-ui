import { useState } from 'react'
import { Calendar, DatePicker, Field } from '../../src'

/* A day relative to today, so the examples stay in the present. */
const inDays = (n: number) => {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
}

export function DueDate() {
  const [due, setDue] = useState<Date | null>(() => inDays(3))
  return (
    <div className="grid w-full max-w-[20rem] gap-4">
      <Field label="Due" hint="Students see the day on their Today page.">
        <DatePicker value={due} onChange={setDue} min={inDays(0)} />
      </Field>
    </div>
  )
}

export function States() {
  const [start, setStart] = useState<Date | null>(null)
  const [due, setDue] = useState<Date | null>(() => inDays(-2))
  return (
    <div className="grid w-full max-w-[20rem] gap-4">
      <DatePicker label="Starts" value={start} onChange={setStart} />
      <DatePicker label="Starts, disabled" value={start} onChange={setStart} disabled />
      <Field label="Due" error="Not yet. Pick a day after today.">
        <DatePicker value={due} onChange={setDue} />
      </Field>
    </div>
  )
}

export function Sizes() {
  const [due, setDue] = useState<Date | null>(() => inDays(1))
  return (
    <div className="grid w-full max-w-[20rem] gap-4">
      <DatePicker size="sm" label="Due" value={due} onChange={setDue} />
      <DatePicker label="Due" value={due} onChange={setDue} />
      <DatePicker size="xl" label="Due" value={due} onChange={setDue} />
    </div>
  )
}

export function AlwaysOpen() {
  const [day, setDay] = useState<Date | null>(() => inDays(0))
  return <Calendar value={day} onChange={setDay} />
}
