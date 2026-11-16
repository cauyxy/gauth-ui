import { render, screen } from '@testing-library/react'
import { LocaleProvider } from '../core/locale'
import { AnswerFeedback } from './AnswerFeedback'

it('says "Correct" on the good ground, with the reason and what was earned', () => {
  render(
    <AnswerFeedback state="right" aside="+10 XP" className="mine">
      The hypotenuse is 10.
    </AnswerFeedback>,
  )
  const note = screen.getByRole('note', { name: 'Correct' })
  expect(note).toHaveClass('gx-answer-feedback', 'gx-answer-feedback--right', 'bg-good-soft', 'mine')
  expect(note).toHaveTextContent('The hypotenuse is 10.')
  expect(note.querySelector('.gx-answer-feedback__aside')).toHaveTextContent('+10 XP')
  /* The check is ink on the fill, never white. */
  expect(note.querySelector('.gx-answer-feedback__mark')).toHaveClass('bg-correct', 'text-ink')
})

it('says "Not yet" in the attempted color, never red and never "Wrong"', () => {
  render(<AnswerFeedback state="retry">You added the legs. Square each one first.</AnswerFeedback>)
  const note = screen.getByRole('note', { name: 'Not yet' })
  expect(note).toHaveClass('gx-answer-feedback--retry', 'bg-attempted-soft')
  expect(note.querySelector('.gx-answer-feedback__word')).toHaveClass('text-attempted-ink')
  expect(note.querySelector('.gx-answer-feedback__mark')).toHaveClass('bg-attempted', 'text-ink')
})

it('is only its first line when it has nothing more to say', () => {
  const { container } = render(<AnswerFeedback state="right" />)
  expect(container.querySelector('.gx-answer-feedback__body')).toBeNull()
  expect(container.querySelector('.gx-answer-feedback__aside')).toBeNull()
})

it('takes its words from the language of the page', () => {
  render(
    <LocaleProvider locale="es">
      <AnswerFeedback state="right" />
      <AnswerFeedback state="retry" />
    </LocaleProvider>,
  )
  expect(screen.getByRole('note', { name: 'Correcto' })).toBeInTheDocument()
  expect(screen.getByRole('note', { name: 'Todavía no' })).toBeInTheDocument()
})
