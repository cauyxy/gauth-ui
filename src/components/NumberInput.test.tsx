import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Field } from './Field'
import { NumberInput } from './NumberInput'

function Count({ initial = 10, onChange }: { initial?: number | null; onChange?: (value: number | null) => void }) {
  const [value, setValue] = useState<number | null>(initial)
  return (
    <NumberInput
      label="Questions"
      min={1}
      max={12}
      value={value}
      onChange={(next) => {
        setValue(next)
        onChange?.(next)
      }}
      className="mine"
    />
  )
}

it('is a named number field between a minus and a plus', () => {
  render(<Count />)
  const input = screen.getByRole('spinbutton', { name: 'Questions' })
  expect(input).toHaveValue(10)
  expect(input.parentElement).toHaveClass('gx-number-input', 'gx-number-input--md', 'mine')
  expect(screen.getByRole('button', { name: 'Decrease' })).not.toHaveAttribute('tabindex', '0')
})

it('steps with the buttons and stops at max', async () => {
  const onChange = vi.fn<(value: number | null) => void>()
  render(<Count initial={11} onChange={onChange} />)
  await userEvent.click(screen.getByRole('button', { name: 'Increase' }))
  expect(onChange).toHaveBeenLastCalledWith(12)
  expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled()
  await userEvent.click(screen.getByRole('button', { name: 'Decrease' }))
  expect(onChange).toHaveBeenLastCalledWith(11)
})

it('is null while empty, and comes back into range when it loses focus', async () => {
  const onChange = vi.fn<(value: number | null) => void>()
  render(<Count onChange={onChange} />)
  const input = screen.getByRole('spinbutton', { name: 'Questions' })
  await userEvent.clear(input)
  expect(onChange).toHaveBeenLastCalledWith(null)
  await userEvent.type(input, '40')
  expect(onChange).toHaveBeenLastCalledWith(40)
  await userEvent.tab()
  expect(onChange).toHaveBeenLastCalledWith(12)
  expect(input).toHaveValue(12)
})

it('takes its label and error from a Field', () => {
  render(
    <Field label="Score out of" error="Not yet. Give a number from 1 to 100.">
      <NumberInput size="xl" value={0} onChange={() => {}} />
    </Field>,
  )
  const input = screen.getByRole('spinbutton', { name: 'Score out of' })
  expect(input).toHaveAttribute('aria-invalid', 'true')
  expect(input).toHaveAccessibleDescription('Not yet. Give a number from 1 to 100.')
  expect(input.parentElement).toHaveClass('gx-number-input--xl')
})

it('keeps its own number without `value`', async () => {
  const onChange = vi.fn()
  render(<NumberInput label="Questions" name="count" defaultValue={3} min={0} max={5} onChange={onChange} />)
  const field = screen.getByRole('spinbutton', { name: 'Questions' })
  expect(field).toHaveValue(3)
  await userEvent.click(screen.getByRole('button', { name: 'Increase' }))
  expect(field).toHaveValue(4)
  expect(onChange).toHaveBeenLastCalledWith(4)
  expect(field).toHaveAttribute('name', 'count')
})
