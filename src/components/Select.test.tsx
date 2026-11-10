import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Select } from './Select'

const options = [
  { value: 'thu', label: 'Thu, Nov 12' },
  { value: 'fri', label: 'Fri, Nov 13' },
] as const

it('is a named, medium select with the picked option selected', () => {
  const { container } = render(<Select label="Due" value="fri" options={options} onChange={() => {}} className="mine" />)
  const select = screen.getByRole('combobox', { name: 'Due' })
  expect(select.parentElement).toHaveClass('gx-select', 'gx-select--md', 'mine')
  expect(select).toHaveValue('fri')
  expect(screen.getAllByRole('option')).toHaveLength(2)
  expect(screen.getByRole<HTMLOptionElement>('option', { name: 'Fri, Nov 13' }).selected).toBe(true)
  expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
})

it('reports the new value, not the event', async () => {
  const onChange = vi.fn<(value: 'thu' | 'fri') => void>()
  render(<Select label="Due" value="thu" options={options} onChange={onChange} />)
  await userEvent.tab()
  expect(screen.getByRole('combobox', { name: 'Due' })).toHaveFocus()
  await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Due' }), 'Fri, Nov 13')
  expect(onChange).toHaveBeenLastCalledWith('fri')
})

it('takes a size and passes native props to the select', () => {
  render(<Select label="Due" size="xl" name="due" value="thu" options={options} onChange={() => {}} />)
  const select = screen.getByRole('combobox', { name: 'Due' })
  expect(select.parentElement).toHaveClass('gx-select--xl')
  expect(select).toHaveAttribute('name', 'due')
  expect(select).not.toHaveAttribute('size')
})

it('has a small size for a filter row', () => {
  render(<Select label="Class" size="sm" value="thu" options={options} onChange={() => {}} />)
  const select = screen.getByRole('combobox', { name: 'Class' })
  expect(select.parentElement).toHaveClass('gx-select--sm')
  expect(select.parentElement).not.toHaveClass('gx-select--md')
  expect(select).not.toHaveAttribute('size')
})

it('does not change when disabled', async () => {
  const onChange = vi.fn()
  render(<Select label="Due" disabled value="thu" options={options} onChange={onChange} />)
  const select = screen.getByRole('combobox', { name: 'Due' })
  expect(select).toBeDisabled()
  await userEvent.selectOptions(select, 'fri')
  expect(onChange).not.toHaveBeenCalled()
})
