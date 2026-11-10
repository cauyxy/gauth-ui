import { render, screen } from '@testing-library/react'
import { Progress } from './Progress'

it('reports its value and keeps it between 0 and 100', () => {
  const { rerender, container } = render(<Progress value={40} label="Practice set" />)
  const bar = screen.getByRole('progressbar', { name: 'Practice set' })
  expect(bar).toHaveAttribute('aria-valuenow', '40')
  expect(container.querySelector('.gx-progress__fill')).toHaveStyle({ width: '40%' })
  rerender(<Progress value={140} label="Practice set" />)
  expect(bar).toHaveAttribute('aria-valuenow', '100')
})

it('has no value when the end is not known, and shows its text', () => {
  const { container } = render(<Progress label="Building your set">Building</Progress>)
  expect(screen.getByRole('progressbar', { name: 'Building your set' })).not.toHaveAttribute('aria-valuenow')
  expect(container.querySelector('.gx-progress__fill--sweep')).toBeInTheDocument()
  expect(screen.getByText('Building')).toHaveClass('gx-progress__text')
})
