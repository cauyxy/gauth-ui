import { useState } from 'react'
import { Combobox, Field } from '../../src'

const STUDENTS = [
  { value: 'maya', label: 'Maya Johnson', description: 'Geometry · Period 3' },
  { value: 'liam', label: 'Liam Chen', description: 'Geometry · Period 3' },
  { value: 'ava', label: 'Ava Martinez', description: 'Geometry · Period 5' },
  { value: 'noah', label: 'Noah Williams', description: 'Algebra 1 · Period 1' },
  { value: 'emma', label: 'Emma Brown', description: 'Algebra 1 · Period 1' },
  { value: 'lucas', label: 'Lucas Garcia', description: 'Geometry · Period 5' },
] as const

const STANDARDS = [
  { value: 'A-REI.B.3', label: 'A-REI.B.3', description: 'Solve linear equations' },
  { value: 'A-CED.A.1', label: 'A-CED.A.1', description: 'Write equations' },
  { value: 'HSG.SRT.B.5', label: 'HSG.SRT.B.5', description: 'Use similarity to solve problems' },
  { value: '8.EE.C.7', label: '8.EE.C.7', description: 'Solve one-variable equations' },
] as const

export function FindAStudent() {
  const [student, setStudent] = useState<(typeof STUDENTS)[number]['value'] | null>(null)
  return (
    <div className="grid w-full max-w-[22rem] gap-4">
      <Field label="Student" hint="Type a name or a class.">
        <Combobox options={STUDENTS} value={student} onChange={setStudent} placeholder="Type a name" />
      </Field>
    </div>
  )
}

export function Standard() {
  const [code, setCode] = useState<(typeof STANDARDS)[number]['value'] | null>('A-REI.B.3')
  return (
    <div className="grid w-full max-w-[22rem] gap-4">
      <Combobox size="xl" label="Standard" options={STANDARDS} value={code} onChange={setCode} />
      <Combobox label="Standard, disabled" options={STANDARDS} value={code} onChange={setCode} disabled />
    </div>
  )
}
