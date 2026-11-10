import { render, screen } from '@testing-library/react'
import { Field, useField } from './Field'
import { Input } from './Input'
import { Select } from './Select'
import { Textarea } from './Textarea'

it('names the control with its label and describes it with the hint', () => {
  render(
    <Field label="Class name" hint="Students see this name." className="mine">
      <Input value="Geometry · Period 3" onChange={() => {}} />
    </Field>,
  )
  const input = screen.getByRole('textbox', { name: 'Class name' })
  expect(input).toHaveAccessibleDescription('Students see this name.')
  expect(input).not.toHaveAttribute('aria-invalid')
  expect(screen.getByText('Students see this name.')).toHaveClass('gx-field__hint')
  expect(screen.getByText('Class name').closest('.gx-field')).toHaveClass('mine')
})

it('shows an error in place of the hint and marks the control invalid', () => {
  render(
    <Field label="Class code" hint="8 letters" error="Not yet. A code has 8 letters.">
      <Input value="GEO-P3" onChange={() => {}} />
    </Field>,
  )
  const input = screen.getByRole('textbox', { name: 'Class code' })
  expect(input).toBeInvalid()
  expect(input).toHaveAccessibleDescription('Not yet. A code has 8 letters.')
  expect(screen.getByText('Not yet. A code has 8 letters.')).toHaveClass('gx-field__error')
  expect(screen.queryByText('8 letters')).not.toBeInTheDocument()
})

it('has no description when there is no hint and no error', () => {
  render(
    <Field label="Class name">
      <Input />
    </Field>,
  )
  expect(screen.getByRole('textbox', { name: 'Class name' })).not.toHaveAttribute('aria-describedby')
})

it('wires a Textarea and a Select the same way', () => {
  render(
    <>
      <Field label="Note to students" error="Add a note.">
        <Textarea value="" onChange={() => {}} />
      </Field>
      <Field label="Due" hint="Students see the day.">
        <Select value="thu" options={[{ value: 'thu', label: 'Thu, Nov 12' }]} onChange={() => {}} />
      </Field>
    </>,
  )
  const note = screen.getByRole('textbox', { name: 'Note to students' })
  expect(note).toBeInvalid()
  expect(note).toHaveAccessibleDescription('Add a note.')
  expect(screen.getByRole('combobox', { name: 'Due' })).toHaveAccessibleDescription('Students see the day.')
})

it('gives each field its own id, and nothing outside a Field', () => {
  const seen: (string | undefined)[] = []
  const Probe = () => {
    seen.push(useField()?.id)
    return null
  }
  render(
    <>
      <Probe />
      <Field label="First name">
        <Probe />
      </Field>
      <Field label="Last name">
        <Probe />
      </Field>
    </>,
  )
  expect(seen[0]).toBeUndefined()
  expect(seen[1]).toBeTruthy()
  expect(seen[2]).toBeTruthy()
  expect(seen[1]).not.toBe(seen[2])
})
