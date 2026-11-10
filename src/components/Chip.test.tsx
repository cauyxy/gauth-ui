import { render, screen } from '@testing-library/react'
import { Chip } from './Chip'

it('is neutral by default and passes span props through', () => {
  render(<Chip title="Solve linear equations">A-REI.B.3</Chip>)
  const chip = screen.getByText('A-REI.B.3')
  expect(chip).toHaveClass('gx-chip', 'gx-chip--neutral')
  expect(chip).toHaveAttribute('title', 'Solve linear equations')
})

it('takes a tone', () => {
  render(<Chip tone="blue">G-CO.A.1</Chip>)
  expect(screen.getByText('G-CO.A.1')).toHaveClass('gx-chip--blue')
})
