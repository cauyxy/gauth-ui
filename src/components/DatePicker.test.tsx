import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { LocaleProvider } from '../core/locale'
import { Calendar, DatePicker } from './DatePicker'
import { Field } from './Field'

const day = (y: number, m: number, d: number) => new Date(y, m - 1, d)

function Picker(props: { initial?: Date | null; min?: Date; max?: Date; onChange?: (value: Date) => void }) {
  const [value, setValue] = useState<Date | null>(props.initial ?? null)
  return (
    <DatePicker
      label="Due"
      value={value}
      min={props.min}
      max={props.max}
      onChange={(next) => {
        setValue(next)
        props.onChange?.(next)
      }}
    />
  )
}

it('says the label and the day, and asks for a day before one is picked', () => {
  const { rerender } = render(<DatePicker label="Due" value={null} onChange={() => {}} className="mine" />)
  const button = screen.getByRole('button', { name: 'Due Pick a date' })
  expect(button).toHaveClass('gx-date-picker', 'gx-date-picker--md', 'mine')
  expect(button).toHaveAttribute('aria-haspopup', 'dialog')
  rerender(<DatePicker label="Due" value={day(2026, 10, 23)} onChange={() => {}} />)
  expect(screen.getByRole('button', { name: 'Due Fri, Oct 23' })).toBeInTheDocument()
})

it('opens on the picked day, picks a day with the keyboard, closes and gives focus back', async () => {
  const onChange = vi.fn<(value: Date) => void>()
  render(<Picker initial={day(2026, 10, 23)} onChange={onChange} />)
  await userEvent.click(screen.getByRole('button', { name: 'Due Fri, Oct 23' }))
  expect(screen.getByRole('grid', { name: 'October 2026' })).toBeInTheDocument()
  expect(screen.getByRole('gridcell', { selected: true })).toHaveTextContent('23')
  expect(screen.getByRole('button', { name: 'Friday, October 23, 2026' })).toHaveFocus()

  await userEvent.keyboard('{ArrowDown}{ArrowRight}')
  expect(screen.getByRole('button', { name: 'Saturday, October 31, 2026' })).toHaveFocus()
  await userEvent.keyboard('{ArrowRight}')
  expect(screen.getByRole('grid', { name: 'November 2026' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Sunday, November 1, 2026' })).toHaveFocus()
  await userEvent.keyboard('{End}{Enter}')

  expect(onChange).toHaveBeenLastCalledWith(day(2026, 11, 7))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Due Sat, Nov 7' })).toHaveFocus()
})

it('moves a month with Page Down and the arrows, and a year with Shift', async () => {
  render(<Picker initial={day(2026, 1, 31)} />)
  await userEvent.click(screen.getByRole('button', { name: /^Due/ }))
  await userEvent.keyboard('{PageDown}')
  expect(screen.getByRole('button', { name: 'Saturday, February 28, 2026' })).toHaveFocus()
  await userEvent.keyboard('{Shift>}{PageUp}{/Shift}')
  expect(screen.getByRole('grid', { name: 'February 2025' })).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Next month' }))
  expect(screen.getByRole('grid', { name: 'March 2025' })).toBeInTheDocument()
})

it('does not pick a day outside min and max', async () => {
  const onChange = vi.fn()
  render(<Picker initial={day(2026, 11, 10)} min={day(2026, 11, 9)} max={day(2026, 11, 20)} onChange={onChange} />)
  await userEvent.click(screen.getByRole('button', { name: /^Due/ }))
  expect(screen.getByRole('button', { name: 'Sunday, November 8, 2026' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Previous month' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Next month' })).toBeDisabled()
  await userEvent.keyboard('{ArrowUp}')
  expect(screen.getByRole('button', { name: 'Monday, November 9, 2026' })).toHaveFocus()
  await userEvent.click(screen.getByRole('button', { name: 'Sunday, November 8, 2026' }))
  expect(onChange).not.toHaveBeenCalled()
})

it('takes its label, hint and error from a Field', () => {
  render(
    <Field label="Due" error="Not yet. Pick a school day.">
      <DatePicker size="xl" value={day(2026, 11, 14)} onChange={() => {}} />
    </Field>,
  )
  const button = screen.getByRole('button', { name: 'Due Sat, Nov 14' })
  expect(button).toHaveClass('gx-date-picker--xl')
  expect(button).toHaveAttribute('aria-invalid', 'true')
  expect(button).toHaveAccessibleDescription('Not yet. Pick a school day.')
})

it('sends the day with a form, and does not open when disabled', async () => {
  const { container } = render(<DatePicker label="Due" name="due" disabled value={day(2026, 3, 5)} onChange={() => {}} />)
  expect(container.querySelector('input[name="due"]')).toHaveValue('2026-03-05')
  await userEvent.click(screen.getByRole('button', { name: /^Due/ }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

it('marks today, and speaks Spanish inside a Spanish provider', () => {
  render(
    <LocaleProvider locale="es">
      <Calendar value={null} onChange={() => {}} />
    </LocaleProvider>,
  )
  const today = new Date()
  expect(screen.getByRole('button', { name: new RegExp(`\\b${today.getDate()}\\b.*${today.getFullYear()}`) })).toHaveAttribute('aria-current', 'date')
  expect(screen.getByRole('button', { name: 'Mes anterior' })).toBeInTheDocument()
  expect(screen.getAllByRole('columnheader')).toHaveLength(7)
})
