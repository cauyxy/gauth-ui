import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { IconButton } from '../components/IconButton'
import { Icon } from '../core/Icon'
import { LocaleProvider } from '../core/locale'
import { ReplyActions, type ReplyVote } from './ReplyActions'

/** A page that keeps the vote. */
function Page({ onVote }: { onVote: (vote: ReplyVote | null) => void }) {
  const [vote, setVote] = useState<ReplyVote | null>(null)
  return (
    <ReplyActions
      onCopy={() => {}}
      vote={vote}
      onVote={(next) => {
        onVote(next)
        setVote(next)
      }}
    />
  )
}

const button = (name: string) => screen.getByRole('button', { name })

it("is thumbs up, thumbs down, copy, then the product's actions, all small ghost icon buttons", () => {
  const { container } = render(
    <ReplyActions onCopy={() => {}} onVote={() => {}} className="mine">
      <IconButton size="sm" label="Quote">
        <Icon name="quote" />
      </IconButton>
    </ReplyActions>,
  )
  expect(container.firstElementChild).toHaveClass('gx-reply-actions', 'mine')
  const buttons = within(container.firstElementChild as HTMLElement).getAllByRole('button')
  expect(buttons.map((b) => b.getAttribute('aria-label'))).toEqual(['Good reply', 'Bad reply', 'Copy', 'Quote'])
  for (const b of buttons) expect(b).toHaveClass('gx-icon-btn--ghost', 'gx-icon-btn--sm')
})

it('has no votes without onVote', () => {
  render(<ReplyActions onCopy={() => {}} />)
  expect(screen.getAllByRole('button').map((b) => b.getAttribute('aria-label'))).toEqual(['Copy'])
  expect(button('Copy')).not.toHaveAttribute('aria-pressed')
})

it('makes each thumb a toggle: the other one replaces it, the pressed one clears it', async () => {
  const onVote = vi.fn()
  render(<Page onVote={onVote} />)
  expect(button('Good reply')).toHaveAttribute('aria-pressed', 'false')
  await userEvent.click(button('Good reply'))
  expect(onVote).toHaveBeenLastCalledWith('good')
  expect(button('Good reply')).toHaveAttribute('aria-pressed', 'true')
  await userEvent.click(button('Bad reply'))
  expect(onVote).toHaveBeenLastCalledWith('bad')
  expect(button('Good reply')).toHaveAttribute('aria-pressed', 'false')
  expect(button('Bad reply')).toHaveAttribute('aria-pressed', 'true')
  await userEvent.click(button('Bad reply'))
  expect(onVote).toHaveBeenLastCalledWith(null)
  expect(button('Bad reply')).toHaveAttribute('aria-pressed', 'false')
})

describe('copy', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('calls onCopy and says Copied with a check for two seconds', () => {
    const onCopy = vi.fn()
    render(<ReplyActions onCopy={onCopy} />)
    const copy = button('Copy')
    const drawing = copy.innerHTML
    fireEvent.click(copy)
    expect(onCopy).toHaveBeenCalledOnce()
    expect(copy).toHaveAccessibleName('Copied')
    expect(copy.innerHTML).not.toBe(drawing)
    act(() => void vi.advanceTimersByTime(1999))
    expect(copy).toHaveAccessibleName('Copied')
    act(() => void vi.advanceTimersByTime(1))
    expect(copy).toHaveAccessibleName('Copy')
    expect(copy.innerHTML).toBe(drawing)
  })

  it('counts the two seconds from the last click', () => {
    const onCopy = vi.fn()
    render(<ReplyActions onCopy={onCopy} />)
    fireEvent.click(button('Copy'))
    act(() => void vi.advanceTimersByTime(1500))
    fireEvent.click(button('Copied'))
    expect(onCopy).toHaveBeenCalledTimes(2)
    act(() => void vi.advanceTimersByTime(1500))
    expect(button('Copied')).toBeInTheDocument()
    act(() => void vi.advanceTimersByTime(500))
    expect(button('Copy')).toBeInTheDocument()
  })
})

it("speaks the page's language", () => {
  render(
    <LocaleProvider locale="es">
      <ReplyActions onCopy={() => {}} onVote={() => {}} vote="good" />
    </LocaleProvider>,
  )
  expect(screen.getByRole('button', { name: 'Buena respuesta', pressed: true })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Mala respuesta', pressed: false })).toBeInTheDocument()
  fireEvent.click(button('Copiar'))
  expect(button('Copiado')).toBeInTheDocument()
})
