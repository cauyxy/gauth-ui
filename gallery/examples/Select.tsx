import { useState } from 'react'
import { Select } from '../../src'

const DUE = [
  { value: 'thu', label: 'Thu, Nov 12' },
  { value: 'fri', label: 'Fri, Nov 13' },
  { value: 'mon', label: 'Mon, Nov 16' },
] as const
type Due = (typeof DUE)[number]['value']

const PERIODS = [
  { value: 'p1', label: 'Algebra 1 · Period 1' },
  { value: 'p3', label: 'Geometry · Period 3' },
  { value: 'p5', label: 'Geometry · Period 5' },
] as const
type Period = (typeof PERIODS)[number]['value']

export function Small() {
  const [period, setPeriod] = useState<Period>('p3')
  const [due, setDue] = useState<Due>('thu')
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select size="sm" label="Class" value={period} options={PERIODS} onChange={setPeriod} />
      <Select size="sm" label="Due" value={due} options={DUE} onChange={setDue} />
      <Select size="sm" label="Due, disabled" value={due} options={DUE} onChange={setDue} disabled />
    </div>
  )
}

export function States() {
  const [period, setPeriod] = useState<Period>('p3')
  const [due, setDue] = useState<Due>('thu')
  return (
    <>
      <Select label="Due" value={due} options={DUE} onChange={setDue} />
      <Select label="Class" value={period} options={PERIODS} onChange={setPeriod} />
      <Select label="Due, disabled" value={due} options={DUE} onChange={setDue} disabled />
      <Select label="Due, error" aria-invalid value={due} options={DUE} onChange={setDue} />
    </>
  )
}

export function Large() {
  const [period, setPeriod] = useState<Period>('p3')
  return (
    <>
      <Select size="xl" label="Class" value={period} options={PERIODS} onChange={setPeriod} />
      <Select size="xl" label="Class, disabled" value={period} options={PERIODS} onChange={setPeriod} disabled />
    </>
  )
}
