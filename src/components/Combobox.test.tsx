import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Combobox } from './Combobox'
import { Field } from './Field'

const students = [
  { value: 'maya', label: 'Maya Johnson', description: 'Period 3' },
  { value: 'liam', label: 'Liam Chen', description: 'Period 3' },
  { value: 'ava', label: 'Ava Martinez', description: 'Period 5' },
] as const
type Student = (typeof students)[number]['value']

function Pick({ onChange }: { onChange?: (value: Student) => void }) {
  const [value, setValue] = useState<Student | null>('maya')
  return (
    <Combobox
      label="Student"
      options={students}
      value={value}
      onChange={(next) => {
        setValue(next)
        onChange?.(next)
      }}
      className="mine"
    />
  )
}

it('is a named combobox that shows the picked label', () => {
  render(<Pick />)
  const input = screen.getByRole('combobox', { name: 'Student' })
  expect(input).toHaveValue('Maya Johnson')
  expect(input).toHaveAttribute('aria-expanded', 'false')
  expect(input.parentElement).toHaveClass('gx-combobox', 'gx-combobox--md', 'mine')
})

it('filters as the person types, moves with the arrows and picks with Enter', async () => {
  const onChange = vi.fn<(value: Student) => void>()
  render(<Pick onChange={onChange} />)
  const input = screen.getByRole('combobox', { name: 'Student' })
  await userEvent.click(input)
  expect(screen.getAllByRole('option')).toHaveLength(3)
  expect(screen.getByRole('option', { name: /Maya Johnson/ })).toHaveAttribute('aria-selected', 'true')
  await userEvent.clear(input)
  await userEvent.type(input, 'period 3')
  expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Maya JohnsonPeriod 3', 'Liam ChenPeriod 3'])
  await userEvent.keyboard('{ArrowDown}')
  expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: /Liam/ }).id)
  await userEvent.keyboard('{Enter}')
  expect(onChange).toHaveBeenLastCalledWith('liam')
  expect(input).toHaveValue('Liam Chen')
  expect(input).toHaveAttribute('aria-expanded', 'false')
  expect(input).toHaveFocus()
})

it('says when nothing matches, and goes back to the picked label on Escape', async () => {
  render(<Pick />)
  const input = screen.getByRole('combobox', { name: 'Student' })
  await userEvent.click(input)
  await userEvent.clear(input)
  await userEvent.type(input, 'zzz')
  expect(screen.getByText('No matches')).toBeInTheDocument()
  await userEvent.keyboard('{Escape}')
  expect(input).toHaveValue('Maya Johnson')
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
})

it('picks with a click', async () => {
  const onChange = vi.fn<(value: Student) => void>()
  render(<Pick onChange={onChange} />)
  await userEvent.click(screen.getByRole('combobox', { name: 'Student' }))
  await userEvent.click(screen.getByRole('option', { name: /Ava Martinez/ }))
  expect(onChange).toHaveBeenLastCalledWith('ava')
  expect(screen.getByRole('combobox')).toHaveValue('Ava Martinez')
})

it('takes its label and error from a Field', () => {
  render(
    <Field label="Student" error="Not yet. Pick a student.">
      <Combobox size="xl" options={students} value={null} onChange={() => {}} placeholder="Type a name" />
    </Field>,
  )
  const input = screen.getByRole('combobox', { name: 'Student' })
  expect(input).toHaveAttribute('aria-invalid', 'true')
  expect(input).toHaveAttribute('placeholder', 'Type a name')
  expect(input.parentElement).toHaveClass('gx-combobox--xl')
})
