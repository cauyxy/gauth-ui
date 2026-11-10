import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Segmented, segmentedOptionClass } from './Segmented'

const options = [
  { value: 'a', label: 'Form A' },
  { value: 'b', label: 'Form B' },
] as const

it('is a radio group with the picked option checked', () => {
  render(<Segmented label="Form" value="a" options={options} onChange={() => {}} />)
  expect(screen.getByRole('radiogroup', { name: 'Form' })).toHaveClass('gx-segmented', 'gx-segmented--fit')
  expect(screen.getByRole('radio', { name: 'Form A' })).toBeChecked()
  expect(screen.getByRole('radio', { name: 'Form B' })).not.toBeChecked()
})

it('reports the new value on a click and on the keyboard', async () => {
  const onChange = vi.fn()
  render(<Segmented label="Form" value="a" options={options} onChange={onChange} />)
  await userEvent.click(screen.getByRole('radio', { name: 'Form B' }))
  expect(onChange).toHaveBeenLastCalledWith('b')
  screen.getByRole('radio', { name: 'Form A' }).focus()
  await userEvent.keyboard(' ')
  expect(onChange).toHaveBeenLastCalledWith('a')
})

it('stretches with fill', () => {
  render(<Segmented label="Form" value="a" options={options} onChange={() => {}} fill />)
  expect(screen.getByRole('radiogroup')).toHaveClass('gx-segmented--fill')
})

it('gives the option look as a class string, for links', () => {
  expect(segmentedOptionClass(true)).toBe('gx-segmented__option gx-segmented__option--on')
  expect(segmentedOptionClass(false)).toBe('gx-segmented__option')
})
