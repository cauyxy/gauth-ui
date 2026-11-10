import { render, screen } from '@testing-library/react'
import { Callout, type CalloutTone } from './Callout'

it('is a neutral note by default', () => {
  render(<Callout className="mine">Scores update after each practice set.</Callout>)
  const note = screen.getByRole('note')
  expect(note).toHaveClass('gx-callout', 'gx-callout--neutral', 'mine')
  expect(note).toHaveTextContent('Scores update after each practice set.')
  expect(note.querySelector('.gx-callout__title')).toBeNull()
})

it.each<CalloutTone>(['neutral', 'ai', 'good', 'warn'])('takes the %s tone', (tone) => {
  render(<Callout tone={tone}>2 students have no graded answers yet.</Callout>)
  expect(screen.getByRole('note')).toHaveClass(`gx-callout--${tone}`)
})

it('shows its title before the text', () => {
  render(
    <Callout tone="ai" title="Only you see this">
      The answer key and the worked solution.
    </Callout>,
  )
  expect(screen.getByText('Only you see this')).toHaveClass('gx-callout__title')
  expect(screen.getByRole('note')).toHaveTextContent('Only you see thisThe answer key and the worked solution.')
})
