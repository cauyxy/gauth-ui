import { render, screen } from '@testing-library/react'
import { LocaleProvider } from '../core/locale'
import { StepProgress } from './StepProgress'

it('shows how far along the set is, as a bar and as words', () => {
  const { container } = render(<StepProgress done={2} total={6} label="Practice set" className="mine" />)
  expect(screen.getByRole('progressbar', { name: 'Practice set' })).toHaveAttribute('aria-valuenow', '33')
  expect(screen.getByText('2 of 6')).toBeInTheDocument()
  expect(container.firstElementChild).toHaveClass('gx-step-progress', 'gx-progress', 'mine')
})

it('is full at the end and empty before the first step', () => {
  const { rerender } = render(<StepProgress done={6} total={6} label="Practice set" />)
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  rerender(<StepProgress done={0} total={6} label="Practice set" />)
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  expect(screen.getByText('0 of 6')).toBeInTheDocument()
})

it('counts in Spanish', () => {
  render(
    <LocaleProvider locale="es">
      <StepProgress done={2} total={6} label="Práctica" />
    </LocaleProvider>,
  )
  expect(screen.getByText('2 de 6')).toBeInTheDocument()
})
