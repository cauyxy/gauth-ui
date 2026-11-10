import { render, screen } from '@testing-library/react'
import { LocaleProvider } from '../core/locale'
import { LevelChip } from './LevelChip'

it('shows the name of its level with the level class and a mark', () => {
  render(<LevelChip level="proficient" className="mine" />)
  const chip = screen.getByText('Proficient')
  expect(chip).toHaveClass('gx-level-chip', 'gx-level-chip--proficient', 'mine')
  expect(chip.querySelector('.gx-level-mark--proficient')).toHaveAttribute('aria-hidden', 'true')
})

it('names not started, on its own class', () => {
  render(<LevelChip level="not_started" />)
  expect(screen.getByText('Not started')).toHaveClass('gx-level-chip--not-started')
})

it('speaks Spanish inside a Spanish page', () => {
  render(
    <LocaleProvider locale="es">
      <LevelChip level="proficient" />
      <LevelChip level="not_started" />
    </LocaleProvider>,
  )
  expect(screen.getByText('Competente')).toHaveClass('gx-level-chip--proficient')
  expect(screen.getByText('Sin empezar')).toBeInTheDocument()
})
