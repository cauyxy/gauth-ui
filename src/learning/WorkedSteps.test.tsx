import { render, screen, within } from '@testing-library/react'
import { WorkedSteps } from './WorkedSteps'

const steps = [{ text: 'a² + b² = c²' }, { text: '6 + 8 = c²', flag: 'The legs were not squared here' }, { text: 'c = 14' }]

it('is an ordered list of the steps, numbered', () => {
  render(<WorkedSteps steps={steps} className="mine" />)
  expect(screen.getByRole('list')).toHaveClass('gx-worked-steps', 'mine')
  const items = screen.getAllByRole('listitem')
  expect(items).toHaveLength(3)
  expect(items[0]).toHaveTextContent('1a² + b² = c²')
  expect(items[2]).toHaveTextContent('3c = 14')
})

it('flags the step that went wrong with the words it is given', () => {
  render(<WorkedSteps steps={steps} />)
  const items = screen.getAllByRole('listitem')
  expect(items[1]).toHaveAttribute('data-flagged', 'true')
  expect(within(items[1]!).getByText('The legs were not squared here')).toHaveClass('gx-worked-steps__flag')
  expect(items[0]).not.toHaveAttribute('data-flagged')
  expect(items[2]).not.toHaveAttribute('data-flagged')
})

it('takes content that is not text', () => {
  render(<WorkedSteps steps={[{ text: <var>x</var>, flag: <em>Sign dropped here</em> }]} />)
  expect(screen.getByText('Sign dropped here').closest('li')).toHaveAttribute('data-flagged', 'true')
})
