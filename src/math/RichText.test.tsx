import { render } from '@testing-library/react'
import { closedMath, RichText, unescapeDollars, wordsIn } from './RichText'

it('renders the TeX between dollar signs and leaves the words as text', () => {
  const { container } = render(<RichText text="The legs are 6 and 8, so $c^2 = 100$." className="mine" />)
  expect(container.firstChild).toHaveClass('gx-rich-text', 'mine')
  expect(container.querySelectorAll('.gx-tex')).toHaveLength(1)
  expect(container.firstChild).toHaveTextContent(/^The legs are 6 and 8, so .*\.$/)
})

it('reads an escaped dollar as money, not as a formula', () => {
  const { container } = render(<RichText text="A ticket costs \$13 and $x$ people go." />)
  expect(container.querySelectorAll('.gx-tex')).toHaveLength(1)
  expect(container).toHaveTextContent('A ticket costs $13 and')
  expect(unescapeDollars('\\$13')).toBe('$13')
})

it('shows words that someone put in TeX as plain words', () => {
  const { container } = render(<RichText text="$\text{Hypothesis} = \text{the lines meet}$" />)
  expect(container.querySelector('.gx-tex')).toBeNull()
  expect(container).toHaveTextContent('Hypothesis: the lines meet')
  expect(wordsIn('\\text{slope} = \\frac{1}{2}')).toBeNull()
})

it('holds back a formula that is still open in a streamed reply', () => {
  expect(closedMath('so $c^2 = 100$ and $c = 1')).toBe('so $c^2 = 100$ and ')
  expect(closedMath('so $c = 10$')).toBe('so $c = 10$')
})

it('draws the punctuation that touches a formula inside the formula, so no line breaks between them', () => {
  const { container } = render(<RichText text="The line crosses at ($0, -4$), so $b = -4$." />)
  const [first, second] = [...container.querySelectorAll('.gx-tex .katex-html')]
  expect(first!.textContent).toMatch(/^\(.*\),$/)
  expect(second!.textContent).toMatch(/\.$/)
  expect(first!.querySelector('.text')).toHaveTextContent('(')
  expect(container.firstChild).toHaveTextContent(/^The line crosses at .* so .*$/)
})

it('leaves words that were written in TeX free to wrap, with their punctuation', () => {
  const { container } = render(<RichText text="So ($\text{Hypothesis} = \text{the lines meet}$)." />)
  expect(container.querySelector('.gx-tex')).toBeNull()
  expect(container.firstChild).toHaveTextContent('So (Hypothesis: the lines meet).')
})

it('keeps the punctuation outside TeX that cannot be read', () => {
  const { container } = render(<RichText text="so $\frac{1$." />)
  expect(container.querySelector('.katex-error')).toHaveTextContent('\\frac{1')
  expect(container.querySelector('.katex-error')).not.toHaveTextContent('text')
  expect(container.firstChild).toHaveTextContent(/\.$/)
})
