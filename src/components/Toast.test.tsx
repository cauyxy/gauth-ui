import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LocaleProvider } from '../core/locale'
import { toast, Toaster } from './Toast'

/* jsdom has no pointer capture; Radix's swipe-to-dismiss asks for it when a pointer is released on a toast. */
beforeAll(() => {
  Element.prototype.hasPointerCapture ??= () => false
  Element.prototype.releasePointerCapture ??= () => {}
})

/* Radix also copies a new toast's text into a hidden live region for a moment, so every query stays inside the toast list. */
const list = (name = 'Notifications') => within(screen.getByRole('region', { name }))

it('shows a toast from anywhere and removes it on dismiss', async () => {
  render(<Toaster />)
  expect(list().queryByRole('listitem')).not.toBeInTheDocument()
  act(() => toast('Link copied'))
  const item = list().getByRole('listitem')
  expect(item).toHaveClass('gx-toast', 'gx-toast--neutral')
  expect(item).toHaveTextContent('Link copied')
  await userEvent.click(list().getByRole('button', { name: 'Dismiss' }))
  expect(list().queryByText('Link copied')).not.toBeInTheDocument()
})

it('gives each tone a mark, so color is not the only signal', async () => {
  render(<Toaster />)
  act(() => {
    toast('Draft saved')
    toast('Published to Period 3', { tone: 'good' })
    toast('Not saved. Try again.', { tone: 'warn' })
  })
  const mark = (text: string) => list().getByText(text).closest('.gx-toast')!.querySelector('.gx-toast__mark')
  expect(mark('Draft saved')).toBeNull()
  expect(mark('Published to Period 3')!.tagName).toBe('svg')
  expect(mark('Not saved. Try again.')!.tagName).toBe('SPAN')
  expect(list().getByText('Not saved. Try again.').closest('.gx-toast')).toHaveClass('gx-toast--warn')
  for (const button of list().getAllByRole('button', { name: 'Dismiss' })) await userEvent.click(button)
  expect(list().queryByRole('listitem')).not.toBeInTheDocument()
})

it('leaves by itself after 4 seconds', () => {
  vi.useFakeTimers()
  try {
    render(<Toaster />)
    act(() => toast('Reminder sent to 4 students'))
    act(() => void vi.advanceTimersByTime(3900))
    expect(list().getByText('Reminder sent to 4 students')).toBeInTheDocument()
    act(() => void vi.advanceTimersByTime(200))
    expect(list().queryByText('Reminder sent to 4 students')).not.toBeInTheDocument()
  } finally {
    vi.useRealTimers()
  }
})

it('shows a description as a second line under the message', async () => {
  render(<Toaster />)
  act(() => toast('Assigned', { tone: 'good', description: 'Exit ticket · Geometry · Period 3' }))
  const item = list().getByRole('listitem')
  const description = list().getByText('Exit ticket · Geometry · Period 3')
  expect(description).toHaveClass('gx-toast__description')
  expect(description.previousElementSibling).toHaveTextContent('Assigned')
  expect(item.querySelector('.gx-toast__text')).toContainElement(description)
  expect(list().queryByRole('button', { name: 'Undo' })).not.toBeInTheDocument()
  await userEvent.click(list().getByRole('button', { name: 'Dismiss' }))
  expect(list().queryByRole('listitem')).not.toBeInTheDocument()
})

it('runs its action and closes', async () => {
  const onClick = vi.fn()
  render(<Toaster />)
  act(() => toast('Removed Geometry · Period 3', { action: { label: 'Undo', onClick } }))
  const item = list().getByRole('listitem')
  const action = list().getByRole('button', { name: 'Undo' })
  expect(action).toHaveClass('gx-toast__action')
  expect(action.compareDocumentPosition(list().getByRole('button', { name: 'Dismiss' })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  expect(item.querySelector('.gx-toast__description')).toBeNull()
  await userEvent.click(action)
  expect(onClick).toHaveBeenCalledOnce()
  expect(list().queryByRole('listitem')).not.toBeInTheDocument()
})

it('stays for 8 seconds when it has an action', () => {
  vi.useFakeTimers()
  try {
    render(<Toaster />)
    act(() => toast('Removed Geometry · Period 3', { action: { label: 'Undo', onClick: () => {} } }))
    act(() => void vi.advanceTimersByTime(7900))
    expect(list().getByText('Removed Geometry · Period 3')).toBeInTheDocument()
    act(() => void vi.advanceTimersByTime(200))
    expect(list().queryByText('Removed Geometry · Period 3')).not.toBeInTheDocument()
  } finally {
    vi.useRealTimers()
  }
})

it('names the list and the dismiss button in the language of the page', async () => {
  render(
    <LocaleProvider locale="es">
      <Toaster />
    </LocaleProvider>,
  )
  act(() => toast('Publicado en Period 3', { tone: 'good' }))
  await userEvent.click(list('Notificaciones').getByRole('button', { name: 'Descartar' }))
  expect(list('Notificaciones').queryByText('Publicado en Period 3')).not.toBeInTheDocument()
})
