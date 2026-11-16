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

describe('a display formula wider than its place', () => {
  const widths = (scroll: number, client: number) => {
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(scroll)
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(client)
  }
  afterEach(() => vi.restoreAllMocks())

  it('takes focus, so the keyboard can scroll it', () => {
    widths(900, 320)
    const { container } = render(<Tex tex="a + b + c" display />)
    expect(container.firstChild).toHaveAttribute('tabindex', '0')
  })

  it('is no Tab stop when it fits, and never inline', () => {
    widths(300, 320)
    expect(render(<Tex tex="a + b" display />).container.firstChild).not.toHaveAttribute('tabindex')
    widths(900, 320)
    expect(render(<Tex tex="a + b" />).container.firstChild).not.toHaveAttribute('tabindex')
  })
})
