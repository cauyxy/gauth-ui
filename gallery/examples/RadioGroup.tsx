import { useState } from 'react'
import { RadioGroup } from '../../src'

const WHEN = [
  { value: 'now', label: 'Send now', description: 'Students see it on their Today page at once.' },
  { value: 'later', label: 'Schedule', description: 'Students see it on the day you pick.' },
  { value: 'draft', label: 'Save as draft', description: 'Only you see it.' },
] as const

const GRADE = [
  { value: '6', label: 'Grade 6' },
  { value: '7', label: 'Grade 7' },
  { value: '8', label: 'Grade 8' },
  { value: 'hs', label: 'High school', disabled: true },
] as const

export function WithDescriptions() {
  const [when, setWhen] = useState<(typeof WHEN)[number]['value']>('now')
  return <RadioGroup label="When students get it" value={when} options={WHEN} onChange={setWhen} />
}

export function InARow() {
  const [grade, setGrade] = useState<(typeof GRADE)[number]['value'] | null>(null)
  return <RadioGroup label="Grade" orientation="horizontal" value={grade} options={GRADE} onChange={setGrade} />
}
