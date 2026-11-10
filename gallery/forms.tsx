import { useState } from 'react'
import { Checkbox } from '../src/components/Checkbox'
import { Field } from '../src/components/Field'
import { Input } from '../src/components/Input'
import { Select } from '../src/components/Select'
import { Textarea } from '../src/components/Textarea'
import { Section } from './section'

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

const STANDARDS = [
  { code: 'A-REI.B.3', name: 'Solve linear equations' },
  { code: 'A-CED.A.1', name: 'Write equations' },
  { code: 'HSG.SRT.B.5', name: 'Use similarity to solve problems' },
] as const

const codeError = (code: string) => (code.length === 8 ? undefined : 'Not yet. A code has 8 letters.')

export default function Forms() {
  const [className, setClassName] = useState('Geometry · Period 3')
  const [code, setCode] = useState('GEO-P3')
  const [room, setRoom] = useState('')
  const [emptyMd, setEmptyMd] = useState('')
  const [emptyXl, setEmptyXl] = useState('')
  const [filledXl, setFilledXl] = useState('GEOMP3AB')
  const [badMd, setBadMd] = useState('GEO-P3')
  const [find, setFind] = useState('')
  const [findXl, setFindXl] = useState('Maya')
  const [note, setNote] = useState('Show your work on Q3.')
  const [noteEmpty, setNoteEmpty] = useState('')
  const [noteXl, setNoteXl] = useState('')
  const [feedback, setFeedback] = useState('')
  const [due, setDue] = useState<Due>('thu')
  const [period, setPeriod] = useState<Period>('p3')
  const [picked, setPicked] = useState<readonly string[]>(['A-REI.B.3'])
  const [row, setRow] = useState(false)

  return (
    <>
      <Section title="Field">
        <div className="g-col">
          <Field label="Class name" hint="Students see this name.">
            <Input value={className} onChange={setClassName} />
          </Field>
          <Field label="Room">
            <Input value={room} onChange={setRoom} placeholder="Room 214" />
          </Field>
          <Field label="Class code" hint="Ask your teacher for the code." error={codeError(code)}>
            <Input size="xl" value={code} onChange={setCode} placeholder="8 letters" />
          </Field>
          <Field label="Due" hint="Students see the day on their Today page.">
            <Select value={due} options={DUE} onChange={setDue} />
          </Field>
          <Field label="Note to students" error={note ? undefined : 'Add a note, or turn the note off.'}>
            <Textarea value={note} onChange={setNote} />
          </Field>
        </div>
      </Section>

      <Section title="Input">
        <div className="g-col">
          <div className="g-row">
            <Input label="Class name, empty" value={emptyMd} onChange={setEmptyMd} placeholder="Geometry · Period 3" />
            <Input label="Class name, filled" value={className} onChange={setClassName} />
            <Input label="Class name, disabled" value="Algebra 1 · Period 1" disabled />
            <Input label="Class code, error" aria-invalid={badMd.length !== 8} value={badMd} onChange={setBadMd} />
          </div>
          <div className="g-row">
            <Input size="xl" label="Class code, empty" value={emptyXl} onChange={setEmptyXl} placeholder="8 letters" />
            <Input size="xl" label="Class code, filled" value={filledXl} onChange={setFilledXl} />
            <Input size="xl" label="Class code, disabled" value="GEOMP3AB" disabled />
            <Input size="xl" label="Class code, error" aria-invalid={code.length !== 8} value={code} onChange={setCode} />
          </div>
          <div className="g-row">
            <Input variant="search" label="Find a student" value={find} onChange={setFind} placeholder="Find a student" />
            <Input variant="search" label="Find a student, disabled" placeholder="Find a student" disabled />
            <Input variant="search" size="xl" label="Find a skill" value={findXl} onChange={setFindXl} placeholder="Find a skill" />
          </div>
        </div>
      </Section>

      <Section title="Textarea">
        <div className="g-col">
          <Textarea label="Note to students, empty" value={noteEmpty} onChange={setNoteEmpty} placeholder="Show your work on Q3." />
          <Textarea label="Note to students, filled" value={note} onChange={setNote} />
          <Textarea label="Note to students, disabled" value="Due Thu. Calculators are OK." rows={2} disabled />
          <Textarea label="Feedback, error" aria-invalid={!feedback} value={feedback} onChange={setFeedback} placeholder="Name the step that went wrong." rows={2} />
          <Textarea size="xl" label="Explain your answer" value={noteXl} onChange={setNoteXl} placeholder="Explain how you found x." />
        </div>
      </Section>

      <Section title="Select">
        <div className="g-col">
          <div className="g-row" style={{ gap: 'var(--gx-space-2)' }}>
            <Select size="sm" label="Class" value={period} options={PERIODS} onChange={setPeriod} />
            <Select size="sm" label="Due" value={due} options={DUE} onChange={setDue} />
            <Select size="sm" label="Due, disabled" value={due} options={DUE} onChange={setDue} disabled />
          </div>
          <div className="g-row">
            <Select label="Due" value={due} options={DUE} onChange={setDue} />
            <Select label="Class" value={period} options={PERIODS} onChange={setPeriod} />
            <Select label="Due, disabled" value={due} options={DUE} onChange={setDue} disabled />
            <Select label="Due, error" aria-invalid value={due} options={DUE} onChange={setDue} />
          </div>
          <div className="g-row">
            <Select size="xl" label="Class" value={period} options={PERIODS} onChange={setPeriod} />
            <Select size="xl" label="Class, disabled" value={period} options={PERIODS} onChange={setPeriod} disabled />
          </div>
        </div>
      </Section>

      <Section title="Checkbox">
        <div className="g-col">
          {STANDARDS.map((s) => (
            <Checkbox
              key={s.code}
              checked={picked.includes(s.code)}
              onChange={(on) => setPicked(on ? [...picked, s.code] : picked.filter((c) => c !== s.code))}
            >
              {s.code} {s.name}
            </Checkbox>
          ))}
          <Checkbox checked onChange={() => {}} disabled>
            8.EE.C.7 Solve one-variable equations
          </Checkbox>
          <Checkbox checked={false} onChange={() => {}} disabled>
            F-IF.A.2 Use function notation
          </Checkbox>
          <div className="g-row">
            <Checkbox label="Select Maya Johnson" checked={row} onChange={setRow} />
            <span>Maya Johnson</span>
          </div>
        </div>
      </Section>
    </>
  )
}
