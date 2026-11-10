import { render } from '@testing-library/react'
import { Dot } from './Dot'

it('is 6px by default and takes a size and a token color', () => {
  const { container, rerender } = render(<Dot />)
  expect(container.firstChild).toHaveClass('gx-dot')
  expect(container.firstChild).toHaveStyle({ width: '6px', height: '6px' })
  rerender(<Dot size={8} color="var(--gx-color-good)" />)
  expect(container.firstChild).toHaveStyle({ width: '8px' })
  expect((container.firstChild as HTMLElement).getAttribute('style')).toContain('var(--gx-color-good)')
})
