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
