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

it('keeps the punctuation that touches a formula on its line', () => {
  const { container } = render(<RichText text="The line crosses at ($0, -4$), so $b = -4$." />)
  const kept = [...container.querySelectorAll('.gx-rich-text__keep')]
  expect(kept).toHaveLength(2)
  expect(kept[0]!.textContent).toMatch(/^\(.*\),$/)
  expect(kept[1]!.textContent).toMatch(/\.$/)
  expect(container.firstChild).toHaveTextContent(/^The line crosses at \(.*\), so .*\.$/)
})
