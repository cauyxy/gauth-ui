import { render, screen } from '@testing-library/react'
import { StudentCard, StudentCardTitle } from './StudentCard'

it('is a white card with the hairline when it has no meaning', () => {
  render(
    <StudentCard aria-label="Question 4" className="mine">
      A right triangle has legs 6 and 8.
    </StudentCard>,
  )
  const card = screen.getByRole('region', { name: 'Question 4' })
  expect(card).toHaveClass('gx-student-card', 'gx-student-card--plain', 'bg-white', 'shadow-edge', 'mine')
  expect(card).toHaveAttribute('data-ground', 'plain')
})

it('takes the soft ground of its tone, and then no hairline', () => {
  render(<StudentCard tone="violet" aria-label="Goal" />)
  const card = screen.getByRole('region', { name: 'Goal' })
  expect(card).toHaveClass('gx-student-card--violet', 'bg-violet-soft')
  expect(card).not.toHaveClass('bg-white', 'shadow-edge')
})

it('takes the soft ground of a level, which wins over a tone', () => {
  render(<StudentCard level="proficient" tone="pink" aria-label="Level" />)
  const card = screen.getByRole('region', { name: 'Level' })
  expect(card).toHaveClass('gx-student-card--proficient', 'bg-level-soft')
  expect(card).not.toHaveClass('bg-pink-soft')
  expect(card).toHaveAttribute('data-ground', 'proficient')
  expect(card).toHaveAttribute('data-level', 'proficient')
})

it('is on surface with an ink title when no level is reached yet', () => {
  render(<StudentCard level="not_started" aria-label="Level" />)
  const card = screen.getByRole('region', { name: 'Level' })
  expect(card).toHaveClass('gx-student-card--not-started', 'bg-surface')
  expect(card).not.toHaveAttribute('data-level')
})

it('has a title that a product can restyle', () => {
  render(
    <StudentCard tone="pink">
      <StudentCardTitle className="text-xl">Unit 4 finished</StudentCardTitle>
    </StudentCard>,
  )
  const title = screen.getByRole('heading', { level: 3, name: 'Unit 4 finished' })
  expect(title).toHaveClass('gx-student-card__title', 'text-xl')
  expect(title).not.toHaveClass('text-lg')
})
