import { render, screen } from '@testing-library/react'
import { Stat } from './Stat'

it('shows the label, the value and the sub line when there is one', () => {
  const { container, rerender } = render(<Stat label="Active students" value="412" sub="of 480" />)
  expect(screen.getByText('Active students')).toHaveClass('gx-stat__label')
  expect(screen.getByText('412')).toHaveClass('gx-stat__value')
  expect(screen.getByText('of 480')).toHaveClass('gx-stat__sub')
  rerender(<Stat label="Active students" value="412" />)
  expect(container.querySelector('.gx-stat__sub')).not.toBeInTheDocument()
})
