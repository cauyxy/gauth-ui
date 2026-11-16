import { useState } from 'react'
import { DateRangePicker, Field, type DateRange } from '../../src'

/* A day relative to today, so the examples stay in the present. */
const inDays = (n: number) => {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
}

export function UnitWeeks() {
  const [weeks, setWeeks] = useState<DateRange | null>(() => ({ from: inDays(0), to: inDays(11) }))
  return (
    <div className="grid w-full max-w-[22rem] gap-4">
      <Field label="Unit 3 runs" hint="Practice for this unit opens on the first day.">
        <DateRangePicker value={weeks} onChange={setWeeks} min={inDays(-30)} />
      </Field>
    </div>
  )
}

export function Empty() {
  const [range, setRange] = useState<DateRange | null>(null)
  return (
    <div className="grid w-full max-w-[22rem] gap-4">
      <DateRangePicker label="Report covers" value={range} onChange={setRange} />
      <DateRangePicker size="sm" label="Report covers, disabled" value={range} onChange={setRange} disabled />
    </div>
  )
}
