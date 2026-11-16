import { render, screen } from '@testing-library/react'
import { Separator } from './Separator'

it('is decoration by default, a horizontal line', () => {
  const { container } = render(<Separator className="mine" />)
  const line = container.firstElementChild!
  expect(line).toHaveClass('gx-separator', 'gx-separator--horizontal', 'mine')
  expect(line).toHaveAttribute('role', 'none')
})

it('is a vertical separator a screen reader hears when it is not decoration', () => {
  render(<Separator orientation="vertical" decorative={false} />)
  const line = screen.getByRole('separator')
  expect(line).toHaveClass('gx-separator--vertical')
  expect(line).toHaveAttribute('aria-orientation', 'vertical')
})
