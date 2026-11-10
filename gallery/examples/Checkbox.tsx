import { useState } from 'react'
import { Checkbox } from '../../src'

const STANDARDS = [
  { code: 'A-REI.B.3', name: 'Solve linear equations' },
  { code: 'A-CED.A.1', name: 'Write equations' },
  { code: 'HSG.SRT.B.5', name: 'Use similarity to solve problems' },
] as const

export function List() {
  const [picked, setPicked] = useState<readonly string[]>(['A-REI.B.3'])
  return (
    <div className="grid w-full max-w-[34rem] gap-4">
      {STANDARDS.map((s) => (
        <Checkbox key={s.code} checked={picked.includes(s.code)} onChange={(on) => setPicked(on ? [...picked, s.code] : picked.filter((c) => c !== s.code))}>
          {s.code} {s.name}
        </Checkbox>
      ))}
      <Checkbox checked onChange={() => {}} disabled>
        8.EE.C.7 Solve one-variable equations
      </Checkbox>
      <Checkbox checked={false} onChange={() => {}} disabled>
        F-IF.A.2 Use function notation
      </Checkbox>
    </div>
  )
}

export function InARow() {
  const [picked, setPicked] = useState(false)
  return (
    <>
      <Checkbox label="Select Maya Johnson" checked={picked} onChange={setPicked} />
      <span>Maya Johnson</span>
    </>
  )
}
