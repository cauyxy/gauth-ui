import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { DateRangePicker, type DateRange } from './DateRangePicker'
import { Field } from './Field'

const day = (y: number, m: number, d: number) => new Date(y, m - 1, d)

function Range({ initial = null, onChange }: { initial?: DateRange | null; onChange?: (value: DateRange) => void }) {
  const [value, setValue] = useState<DateRange | null>(initial)
  return (
    <DateRangePicker
      label="Unit"
      value={value}
      onChange={(next) => {
        setValue(next)
        onChange?.(next)
      }}
      className="mine"
    />
  )
}

it('says the label and both days, and asks for dates before any are picked', () => {
  const { unmount } = render(<Range />)
  expect(screen.getByRole('button', { name: 'Unit Pick dates' })).toHaveClass('gx-date-range-picker', 'gx-date-range-picker--md', 'mine')
  unmount()
  render(<Range initial={{ from: day(2026, 11, 2), to: day(2026, 11, 13) }} />)
  expect(screen.getByRole('button', { name: 'Unit Mon, Nov 2 – Fri, Nov 13' })).toBeInTheDocument()
})

it('marks the days of the range, the ends and the days between', async () => {
  render(<Range initial={{ from: day(2026, 11, 2), to: day(2026, 11, 5) }} />)
  await userEvent.click(screen.getByRole('button', { name: /^Unit/ }))
  const picked = screen.getAllByRole('gridcell', { selected: true })
  expect(picked.map((c) => c.textContent)).toEqual(['2', '3', '4', '5'])
  expect(picked[0]).toHaveAttribute('data-edge')
  expect(picked[1]).toHaveAttribute('data-between')
  expect(screen.getByRole('button', { name: 'Monday, November 2, 2026' })).toHaveFocus()
})

it('picks the start, then the end, then closes; an end before the start swaps them', async () => {
  const onChange = vi.fn<(value: DateRange) => void>()
  render(<Range initial={{ from: day(2026, 11, 10), to: day(2026, 11, 12) }} onChange={onChange} />)
  await userEvent.click(screen.getByRole('button', { name: /^Unit/ }))
  await userEvent.click(screen.getByRole('button', { name: 'Monday, November 16, 2026' }))
  expect(onChange).not.toHaveBeenCalled()
  expect(screen.getAllByRole('gridcell', { selected: true }).map((c) => c.textContent)).toEqual(['16'])
  await userEvent.click(screen.getByRole('button', { name: 'Wednesday, November 4, 2026' }))
  expect(onChange).toHaveBeenLastCalledWith({ from: day(2026, 11, 4), to: day(2026, 11, 16) })
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Unit Wed, Nov 4 – Mon, Nov 16' })).toHaveFocus()
})

it('keeps the range it had when closed after one click', async () => {
  const onChange = vi.fn()
  render(<Range initial={{ from: day(2026, 11, 10), to: day(2026, 11, 12) }} onChange={onChange} />)
  await userEvent.click(screen.getByRole('button', { name: /^Unit/ }))
  await userEvent.click(screen.getByRole('button', { name: 'Monday, November 16, 2026' }))
  await userEvent.keyboard('{Escape}')
  expect(onChange).not.toHaveBeenCalled()
  expect(screen.getByRole('button', { name: 'Unit Tue, Nov 10 – Thu, Nov 12' })).toBeInTheDocument()
})

it('takes its label and error from a Field', () => {
  render(
    <Field label="Report covers" error="Not yet. Pick at most 4 weeks.">
      <DateRangePicker size="sm" value={{ from: day(2026, 9, 1), to: day(2026, 11, 1) }} onChange={() => {}} />
    </Field>,
  )
  const button = screen.getByRole('button', { name: 'Report covers Tue, Sep 1 – Sun, Nov 1' })
  expect(button).toHaveAttribute('aria-invalid', 'true')
  expect(button).toHaveClass('gx-date-range-picker--sm')
})

it('keeps its own range without `value`', async () => {
  const onChange = vi.fn()
  render(<DateRangePicker label="Days" defaultValue={{ from: day(2026, 10, 5), to: day(2026, 10, 9) }} onChange={onChange} />)
  const field = screen.getByRole('button', { name: /Days/ })
  expect(field).toHaveTextContent('Mon, Oct 5 – Fri, Oct 9')
  await userEvent.click(field)
  await userEvent.click(screen.getByRole('button', { name: /October 12, 2026/ }))
  await userEvent.click(screen.getByRole('button', { name: /October 16, 2026/ }))
  expect(field).toHaveTextContent('Mon, Oct 12 – Fri, Oct 16')
  expect(onChange).toHaveBeenCalledTimes(1)
})

it('sends the range with a form, both days joined by a slash', () => {
  const { container } = render(<DateRangePicker label="Unit" name="unit" defaultValue={{ from: day(2026, 11, 2), to: day(2026, 11, 13) }} />)
  expect(container.querySelector('input[name="unit"]')).toHaveValue('2026-11-02/2026-11-13')
})

it('sends nothing before a range is picked, and nothing when disabled', () => {
  const { container, rerender } = render(<DateRangePicker label="Unit" name="unit" />)
  expect(container.querySelector('input[name="unit"]')).toHaveValue('')
  rerender(<DateRangePicker label="Unit" name="unit" disabled />)
  expect(container.querySelector('input[name="unit"]')).toBeDisabled()
})
