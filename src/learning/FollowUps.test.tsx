import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LocaleProvider } from '../core/locale'
import { FollowUps } from './FollowUps'

const ITEMS = ['Which students added the legs?', 'Make five practice problems on HSG.SRT.C.8', 'Show a worked example'] as const

it('is a named group with one button for each question', () => {
  render(<FollowUps items={ITEMS} onPick={() => {}} className="mine" />)
  const group = screen.getByRole('group', { name: 'Follow-up questions' })
  expect(group).toHaveClass('gx-follow-ups', 'mine')
  const buttons = within(group).getAllByRole('button')
  expect(buttons.map((b) => b.textContent)).toEqual([...ITEMS])
  for (const b of buttons) expect(b).toHaveAttribute('type', 'button')
})

it('gives the picked question to onPick', async () => {
  const onPick = vi.fn()
  render(<FollowUps items={ITEMS} onPick={onPick} />)
  await userEvent.click(screen.getByRole('button', { name: 'Show a worked example' }))
  expect(onPick).toHaveBeenCalledExactlyOnceWith('Show a worked example')
})

it('is one Tab stop for each question and takes Enter', async () => {
  const onPick = vi.fn()
  render(<FollowUps items={ITEMS} onPick={onPick} />)
  await userEvent.tab()
  await userEvent.tab()
  expect(screen.getByRole('button', { name: ITEMS[1] })).toHaveFocus()
  await userEvent.keyboard('{Enter}')
  expect(onPick).toHaveBeenLastCalledWith(ITEMS[1])
})

it('shows nothing when there are no questions', () => {
  const { container } = render(<FollowUps items={[]} onPick={() => {}} />)
  expect(container).toBeEmptyDOMElement()
})

it('names the group in the page\'s language', () => {
  render(
    <LocaleProvider locale="es">
      <FollowUps items={['¿Quiénes sumaron los catetos?']} onPick={() => {}} />
    </LocaleProvider>,
  )
  const group = screen.getByRole('group', { name: 'Preguntas de seguimiento' })
  expect(within(group).getByRole('button', { name: '¿Quiénes sumaron los catetos?' })).toBeInTheDocument()
})
