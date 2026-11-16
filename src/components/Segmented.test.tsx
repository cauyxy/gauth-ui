import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Segmented } from './Segmented'
import { segmentedOptionClass } from './Segmented.classes'

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

it('moves the pick with the arrow keys, and Tab reaches only the picked option', async () => {
  const onChange = vi.fn()
  render(<Segmented label="Form" value="a" options={options} onChange={onChange} />)
  expect(screen.getByRole('radio', { name: 'Form A' })).toHaveAttribute('tabindex', '0')
  expect(screen.getByRole('radio', { name: 'Form B' })).toHaveAttribute('tabindex', '-1')
  await userEvent.tab()
  expect(screen.getByRole('radio', { name: 'Form A' })).toHaveFocus()
  await userEvent.keyboard('{ArrowRight}')
  expect(onChange).toHaveBeenLastCalledWith('b')
  await userEvent.keyboard('{End}')
  expect(onChange).toHaveBeenLastCalledWith('b')
  await userEvent.keyboard('{ArrowLeft}')
  expect(onChange).toHaveBeenLastCalledWith('b')
})

it('moves focus with the pick', async () => {
  function Form() {
    const [value, setValue] = useState<'a' | 'b'>('a')
    return <Segmented label="Form" value={value} options={options} onChange={setValue} />
  }
  render(<Form />)
  await userEvent.tab()
  await userEvent.keyboard('{ArrowRight}')
  expect(screen.getByRole('radio', { name: 'Form B' })).toBeChecked()
  expect(screen.getByRole('radio', { name: 'Form B' })).toHaveFocus()
  await userEvent.keyboard('{ArrowRight}')
  expect(screen.getByRole('radio', { name: 'Form A' })).toHaveFocus()
  await userEvent.keyboard('{End}')
  expect(screen.getByRole('radio', { name: 'Form B' })).toHaveFocus()
})

it('stretches with fill', () => {
  render(<Segmented label="Form" value="a" options={options} onChange={() => {}} fill />)
  expect(screen.getByRole('radiogroup')).toHaveClass('gx-segmented--fill')
})

it('gives the option look as a class string, for links', () => {
  expect(segmentedOptionClass(true).split(' ')).toEqual(expect.arrayContaining(['gx-segmented__option', 'gx-segmented__option--on']))
  expect(segmentedOptionClass(false).split(' ')).toContain('gx-segmented__option')
  expect(segmentedOptionClass(false).split(' ')).not.toContain('gx-segmented__option--on')
})

it('keeps its own pick without `value`, and sends it with a form', async () => {
  const onChange = vi.fn()
  render(
    <form aria-label="Settings">
      <Segmented label="View" name="view" options={options} defaultValue={options[0]!.value} onChange={onChange} />
    </form>,
  )
  const form = screen.getByRole<HTMLFormElement>('form')
  const radios = screen.getAllByRole('radio')
  expect(radios[0]).toBeChecked()
  expect(new FormData(form).get('view')).toBe(options[0]!.value)
  await userEvent.click(radios[1]!)
  expect(radios[1]).toBeChecked()
  expect(new FormData(form).get('view')).toBe(options[1]!.value)
  expect(onChange).toHaveBeenLastCalledWith(options[1]!.value)
})

it('with nothing picked, Tab stops at the first option and the form gets nothing', () => {
  render(
    <form aria-label="Settings">
      <Segmented label="View" name="view" options={options} />
    </form>,
  )
  const radios = screen.getAllByRole('radio')
  expect(radios.map((r) => r.tabIndex)).toEqual([0, ...radios.slice(1).map(() => -1)])
  expect(new FormData(screen.getByRole<HTMLFormElement>('form')).has('view')).toBe(false)
})

it('runs the product’s onKeyDown first, which can stop the move', async () => {
  const onChange = vi.fn()
  render(<Segmented label="View" options={options} defaultValue={options[0]!.value} onChange={onChange} onKeyDown={(event) => event.preventDefault()} />)
  screen.getAllByRole('radio')[0]!.focus()
  await userEvent.keyboard('{ArrowRight}')
  expect(onChange).not.toHaveBeenCalled()
})
