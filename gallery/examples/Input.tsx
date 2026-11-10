import { useState } from 'react'
import { Input } from '../../src'

export function States() {
  const [empty, setEmpty] = useState('')
  const [name, setName] = useState('Geometry · Period 3')
  const [code, setCode] = useState('GEO-P3')
  return (
    <>
      <Input label="Class name, empty" value={empty} onChange={setEmpty} placeholder="Geometry · Period 3" />
      <Input label="Class name, filled" value={name} onChange={setName} />
      <Input label="Class name, disabled" value="Algebra 1 · Period 1" disabled />
      <Input label="Class code, error" aria-invalid={code.length !== 8} value={code} onChange={setCode} />
    </>
  )
}

export function Large() {
  const [empty, setEmpty] = useState('')
  const [filled, setFilled] = useState('GEOMP3AB')
  const [code, setCode] = useState('GEO-P3')
  return (
    <>
      <Input size="xl" label="Class code, empty" value={empty} onChange={setEmpty} placeholder="8 letters" />
      <Input size="xl" label="Class code, filled" value={filled} onChange={setFilled} />
      <Input size="xl" label="Class code, disabled" value="GEOMP3AB" disabled />
      <Input size="xl" label="Class code, error" aria-invalid={code.length !== 8} value={code} onChange={setCode} />
    </>
  )
}

export function Search() {
  const [student, setStudent] = useState('')
  const [skill, setSkill] = useState('Maya')
  return (
    <>
      <Input variant="search" label="Find a student" value={student} onChange={setStudent} placeholder="Find a student" />
      <Input variant="search" label="Find a student, disabled" placeholder="Find a student" disabled />
      <Input variant="search" size="xl" label="Find a skill" value={skill} onChange={setSkill} placeholder="Find a skill" />
    </>
  )
}
