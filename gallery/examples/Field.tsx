import { useState } from 'react'
import { Field, Input, Select, Textarea } from '../../src'

const DUE = [
  { value: 'thu', label: 'Thu, Nov 12' },
  { value: 'fri', label: 'Fri, Nov 13' },
  { value: 'mon', label: 'Mon, Nov 16' },
] as const

export function AssignForm() {
  const [name, setName] = useState('Geometry · Period 3')
  const [room, setRoom] = useState('')
  const [code, setCode] = useState('GEO-P3')
  const [due, setDue] = useState<(typeof DUE)[number]['value']>('thu')
  const [note, setNote] = useState('Show your work on Q3.')
  return (
    <div className="grid w-full max-w-[34rem] gap-4">
      <Field label="Class name" hint="Students see this name.">
        <Input value={name} onChange={setName} />
      </Field>
      <Field label="Room">
        <Input value={room} onChange={setRoom} placeholder="Room 214" />
      </Field>
      <Field label="Class code" hint="Ask your teacher for the code." error={code.length === 8 ? undefined : 'Not yet. A code has 8 letters.'}>
        <Input size="xl" value={code} onChange={setCode} placeholder="8 letters" />
      </Field>
      <Field label="Due" hint="Students see the day on their Today page.">
        <Select value={due} options={DUE} onChange={setDue} />
      </Field>
      <Field label="Note to students" error={note ? undefined : 'Add a note, or turn the note off.'}>
        <Textarea value={note} onChange={setNote} />
      </Field>
    </div>
  )
}
