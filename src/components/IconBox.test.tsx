import { render, screen } from '@testing-library/react'
import { IconBox } from './IconBox'

it('holds its icon in a square of the asked size', () => {
  render(
    <IconBox size={36}>
      <svg aria-label="Print" />
    </IconBox>,
  )
  const box = screen.getByLabelText('Print').parentElement
  expect(box).toHaveClass('gx-icon-box')
  expect(box).toHaveStyle({ width: '36px', height: '36px' })
})

it('is neutral, or takes the ground and the color of its tone', () => {
  const { container, rerender } = render(<IconBox>x</IconBox>)
  expect(container.firstChild).toHaveClass('gx-icon-box--neutral', 'bg-surface', 'text-ink')
  rerender(<IconBox tone="violet">x</IconBox>)
  expect(container.firstChild).toHaveClass('gx-icon-box--violet', 'bg-violet-soft', 'text-violet')
  expect(container.firstChild).not.toHaveClass('bg-surface')
})

it('lets a product put it on white, for a card that has the tone’s ground already', () => {
  const { container } = render(
    <IconBox tone="pink" className="bg-white">
      x
    </IconBox>,
  )
  expect(container.firstChild).toHaveClass('bg-white', 'text-pink')
  expect(container.firstChild).not.toHaveClass('bg-pink-soft')
})
