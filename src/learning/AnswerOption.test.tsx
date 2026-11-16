import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { LocaleProvider } from '../core/locale'
import { AnswerGroup, AnswerOption, type AnswerState } from './AnswerOption'

const OPTIONS = [
  ['a', 'A', '10'],
  ['b', 'B', '14'],
  ['c', 'C', '48'],
] as const

/** A question that keeps its own pick, as a product page does. */
function Question({ start = null, states = {}, disabled }: { start?: string | null; states?: Record<string, AnswerState>; disabled?: boolean }) {
  const [value, setValue] = useState<string | null>(start)
  return (
    <AnswerGroup label="Length of the hypotenuse" value={value} onChange={setValue} disabled={disabled}>
      {OPTIONS.map(([id, letter, text]) => (
        <AnswerOption key={id} value={id} letter={letter} state={states[id]}>
          {text}
        </AnswerOption>
      ))}
    </AnswerGroup>
  )
}

const option = (name: RegExp) => screen.getByRole('radio', { name })

it('is a radio group of buttons with a letter and the content', () => {
  render(<Question start="b" />)
  expect(screen.getByRole('radiogroup', { name: 'Length of the hypotenuse' })).toHaveClass('gx-answer-group')
  expect(screen.getAllByRole('radio')).toHaveLength(3)
  expect(option(/A\s*10/)).not.toBeChecked()
  expect(option(/B\s*14/)).toBeChecked()
  expect(option(/B\s*14/)).toHaveAttribute('type', 'button')
  expect(option(/B\s*14/)).not.toHaveAttribute('data-state')
})

it('reports the new value on a click', async () => {
  const onChange = vi.fn()
  render(
    <AnswerGroup label="Length of the hypotenuse" value={null} onChange={onChange}>
      <AnswerOption value="a">10</AnswerOption>
      <AnswerOption value="b">14</AnswerOption>
    </AnswerGroup>,
  )
  await userEvent.click(screen.getByRole('radio', { name: '14' }))
  expect(onChange).toHaveBeenLastCalledWith('b')
})

it('is one Tab stop: the first option when none is picked, then the picked one', async () => {
  render(<Question />)
  expect(screen.getAllByRole('radio').map((o) => o.getAttribute('tabindex'))).toEqual(['0', '-1', '-1'])
  await userEvent.tab()
  expect(option(/A\s*10/)).toHaveFocus()
  await userEvent.click(option(/C\s*48/))
  expect(option(/C\s*48/)).toBeChecked()
  expect(screen.getAllByRole('radio').map((o) => o.getAttribute('tabindex'))).toEqual(['-1', '-1', '0'])
  await userEvent.tab()
  expect(document.body).toHaveFocus()
})

it('moves the pick and the focus with the arrow keys, Home and End', async () => {
  render(<Question start="a" />)
  await userEvent.tab()
  await userEvent.keyboard('{ArrowDown}')
  expect(option(/B\s*14/)).toBeChecked()
  expect(option(/B\s*14/)).toHaveFocus()
  expect(option(/B\s*14/)).toHaveAttribute('tabindex', '0')
  expect(option(/A\s*10/)).toHaveAttribute('tabindex', '-1')
  await userEvent.keyboard('{ArrowLeft}')
  expect(option(/A\s*10/)).toBeChecked()
  await userEvent.keyboard('{ArrowUp}')
  expect(option(/C\s*48/)).toBeChecked()
  await userEvent.keyboard('{ArrowRight}')
  expect(option(/A\s*10/)).toBeChecked()
  await userEvent.keyboard('{End}')
  expect(option(/C\s*48/)).toHaveFocus()
  await userEvent.keyboard('{Home}')
  expect(option(/A\s*10/)).toBeChecked()
})

it('says Correct on the right answer and Not yet on the other, never with a letter in place of the check', () => {
  render(<Question start="b" states={{ a: 'right', b: 'retry' }} disabled />)
  const right = option(/10\s*Correct/)
  expect(right).toHaveAttribute('data-state', 'right')
  expect(right.querySelector('svg')).toBeInTheDocument()
  expect(right).not.toHaveTextContent('A')
  const retry = option(/B\s*14\s*Not yet/)
  expect(retry).toHaveAttribute('data-state', 'retry')
  expect(retry).toBeChecked()
  expect(screen.queryByText(/wrong|incorrect/i)).not.toBeInTheDocument()
})

it('locks the pick when it is disabled', async () => {
  const onChange = vi.fn()
  render(
    <AnswerGroup label="Length of the hypotenuse" value="a" onChange={onChange} disabled>
      <AnswerOption value="a">10</AnswerOption>
      <AnswerOption value="b">14</AnswerOption>
    </AnswerGroup>,
  )
  await userEvent.click(screen.getByRole('radio', { name: '14' }))
  expect(onChange).not.toHaveBeenCalled()
  expect(screen.getByRole('radio', { name: '14' })).toBeDisabled()
})

it('says its words in Spanish', () => {
  render(
    <LocaleProvider locale="es">
      <Question start="b" states={{ a: 'right', b: 'retry' }} />
    </LocaleProvider>,
  )
  expect(option(/Correcto/)).toHaveAttribute('data-state', 'right')
  expect(option(/Todavía no/)).toHaveAttribute('data-state', 'retry')
})

it('keeps its own pick without `value`', async () => {
  const onChange = vi.fn()
  render(
    <AnswerGroup label="Answers" onChange={onChange}>
      <AnswerOption value="a">One</AnswerOption>
      <AnswerOption value="b">Two</AnswerOption>
    </AnswerGroup>,
  )
  const [one, two] = screen.getAllByRole('radio')
  expect(one).not.toBeChecked()
  await userEvent.click(two!)
  expect(two).toBeChecked()
  expect(onChange).toHaveBeenLastCalledWith('b')
})

it('with no pick, Tab stops at the first option, also when the options are inside a wrapper', () => {
  render(
    <AnswerGroup label="Answers" value={null} onChange={() => {}}>
      <div>
        <AnswerOption value="a">One</AnswerOption>
      </div>
      <div>
        <AnswerOption value="b">Two</AnswerOption>
      </div>
    </AnswerGroup>,
  )
  expect(screen.getAllByRole('radio').map((r) => r.tabIndex)).toEqual([0, -1])
})
