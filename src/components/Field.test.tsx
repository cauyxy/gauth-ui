import { render, screen } from '@testing-library/react'
import { Field, useField, type FieldControl } from './Field'
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

it('names a control by the Field, not by its own label', () => {
  render(
    <Field label="Class name">
      <Input label="Name" />
    </Field>,
  )
  expect(screen.getByRole('textbox', { name: 'Class name' })).not.toHaveAttribute('aria-label')
})

it('gives each field its own id; outside a Field the label names the control', () => {
  const seen: FieldControl[] = []
  const Probe = ({ label }: { label?: string }) => {
    seen.push(useField(label))
    return null
  }
  render(
    <>
      <Probe label="Search" />
      <Field label="First name">
        <Probe label="Not used" />
      </Field>
      <Field label="Last name">
        <Probe />
      </Field>
    </>,
  )
  const [alone, first, last] = seen as [FieldControl, FieldControl, FieldControl]
  expect(alone.props['aria-label']).toBe('Search')
  expect(alone.labelId).toBe(alone.props.id)
  expect(first.props['aria-label']).toBeUndefined()
  expect(first.labelId).not.toBe(first.props.id)
  expect(first.props.id).not.toBe(last.props.id)
})
