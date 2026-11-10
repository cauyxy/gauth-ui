import { render } from '@testing-library/react'
import { Tex } from './Tex'

it('renders a formula with MathML for a screen reader', () => {
  const { container } = render(<Tex tex="c^2 = 100" className="mine" />)
  const root = container.firstChild as HTMLElement
  expect(root).toHaveClass('gx-tex', 'mine')
  expect(root).not.toHaveClass('gx-tex--display')
  expect(root.querySelector('.katex-html')).toHaveAttribute('aria-hidden', 'true')
  expect(root.querySelector('math')).toHaveTextContent('c2=100')
})

it('sets a display formula on its own line', () => {
  const { container } = render(<Tex tex="\frac{a}{b}" display />)
  expect(container.firstChild).toHaveClass('gx-tex--display')
  expect(container.querySelector('.katex-display')).toBeInTheDocument()
})

it('shows TeX it cannot read in the attempted color and does not throw', () => {
  const { container } = render(<Tex tex="\frac{1" />)
  const error = container.querySelector('.katex-error') as HTMLElement
  expect(error).toHaveTextContent('\\frac{1')
  expect(error.getAttribute('style')).toContain('var(--gx-color-attempted-ink)')
})
