import { render, screen } from '@testing-library/react'
import { LocaleProvider } from '../core/locale'
import { LevelLadder } from './LevelLadder'

const names = () => screen.getAllByRole('listitem').map((rung) => rung.textContent)
const reached = () => screen.getAllByRole('listitem').map((rung) => rung.hasAttribute('data-reached'))

it('is a list of the four earned levels, lowest first, each with its mark', () => {
  render(<LevelLadder level="familiar" className="mine" />)
  expect(screen.getByRole('list')).toHaveClass('gx-level-ladder', 'mine')
  expect(names()).toEqual(['Attempted', 'Familiar', 'Proficient', 'Mastered'])
  for (const level of ['attempted', 'familiar', 'proficient', 'mastered'])
    expect(screen.getByRole('list').querySelector(`.gx-level-mark--${level}`)).toBeInTheDocument()
})

it("marks the student's level as current and the levels below it as reached", () => {
  render(<LevelLadder level="familiar" />)
  const rungs = screen.getAllByRole('listitem')
  expect(rungs[1]).toHaveAttribute('aria-current', 'true')
  expect(rungs.filter((rung) => rung.hasAttribute('aria-current'))).toHaveLength(1)
  expect(reached()).toEqual([true, true, false, false])
})

it('reaches every rung at Mastered and none at Not started', () => {
  const { rerender } = render(<LevelLadder level="mastered" />)
  expect(reached()).toEqual([true, true, true, true])
  expect(screen.getAllByRole('listitem')[3]).toHaveAttribute('aria-current', 'true')
  rerender(<LevelLadder level="not_started" />)
  expect(reached()).toEqual([false, false, false, false])
  expect(screen.getByRole('list').querySelector('[aria-current]')).not.toBeInTheDocument()
})

it('rings the rung the student was on before, and says so to a screen reader', () => {
  const { rerender } = render(<LevelLadder level="proficient" was="attempted" />)
  const was = () => screen.getAllByRole('listitem').map((rung) => rung.hasAttribute('data-was'))
  expect(was()).toEqual([true, false, false, false])
  expect(names()).toEqual(['Attempted (before)', 'Familiar', 'Proficient', 'Mastered'])
  expect(screen.getByText('(before)', { exact: false })).toHaveClass('gx-visually-hidden')
  rerender(<LevelLadder level="familiar" was="proficient" />)
  expect(was()).toEqual([false, false, true, false])
  rerender(<LevelLadder level="familiar" was="familiar" />)
  expect(was()).toEqual([false, false, false, false])
  rerender(<LevelLadder level="familiar" was="not_started" />)
  expect(was()).toEqual([false, false, false, false])
})

it('names the rungs in Spanish', () => {
  render(
    <LocaleProvider locale="es">
      <LevelLadder level="proficient" />
    </LocaleProvider>,
  )
  expect(names()).toEqual(['Intentado', 'Familiarizado', 'Competente', 'Dominado'])
  expect(screen.getByText('Competente')).toHaveAttribute('aria-current', 'true')
})
