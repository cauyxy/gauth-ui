import { render, screen } from '@testing-library/react'
import { Kbd } from './Kbd'

it('is a kbd element with its key', () => {
  render(
    <p>
      Press <Kbd className="mine">Enter</Kbd> to send
    </p>,
  )
  const key = screen.getByText('Enter')
  expect(key.tagName).toBe('KBD')
  expect(key).toHaveClass('gx-kbd', 'mine')
})
